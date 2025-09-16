"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, Plus, Search, SquarePen, Trash, Loader2 } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/utils/permissions";
import { useSession } from "next-auth/react";
import api from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import CreateFindingForm from "./CreateForm";


const statusOptions = [
    { value: "all", label: "All" },
    { value: "Completed", label: "Completed" },
    { value: "Rejected", label: "Rejected" },
    { value: "Open", label: "Open" },
];

export interface Evidence {
    id: number;
    description: string | null;
    file: string;
    uploaded_at: string;
}

export interface ScanFinding {
    id: number;
    scan: number;
    title: string;
    description: string;
    steps_to_reproduce: string;
    impact: string;
    severity: "critical" | "high" | "medium" | "low";
    status: "open" | "closed";
    evidences: Evidence[];
    created_at: string;
    updated_at: string;
}

const deleteFinding = async (id: number) => {
    await api.delete(`/scan/findings/${id}/`);
};

const fetchFindings = async (scanId: string) => {
    const res = await api.get(`/scan/findings/?scan=${scanId}`);
    return res.data || [];
};

const FindingsList = ({ findings, scanId }: { findings: ScanFinding[], scanId: string }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editFinding, setEditFinding] = useState<ScanFinding | null>(null);
    const { data: session } = useSession();
    const [isExporting, setIsExporting] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: deleteFinding,
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            // Optionally: show error message
            console.error(error);
        }
    });

    const { isLoading, refetch, isFetching } = useQuery({
        queryKey: ['scan-findings', scanId],
        queryFn: () => fetchFindings(scanId),
        initialData: { results: findings } // Use the passed findings as initial data
    });


    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = findings;
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => row.title.toLowerCase().includes(lower));
        }
        if (status !== "all") {
            data = data.filter((row) => row.status === status);
        }
        return data;
    }, [search, status, findings]);

    // CSV helper
    function csvEscape(value: unknown) {
        if (value === null || value === undefined) return "";
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
    }

    function handleExportCsv() {
        try {
            setIsExporting(true);
            if (!filteredData?.length) return;
            const headers = [
                "ID",
                "Title",
                "Severity",
                "Status",
                "Evidences Count",
                "Created At"
            ];
            const rows = filteredData.map(r => [
                r.id,
                r.title,
                r.severity,
                r.status,
                r.evidences?.length || 0,
                new Date(r.created_at).toISOString()
            ].map(csvEscape).join(','));
            const csv = [headers.map(csvEscape).join(','), ...rows].join('\r\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const now = new Date();
            a.href = url;
            a.download = `findings_${scanId}_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } finally {
            setIsExporting(false);
        }
    }

    const columns = [
        {
            key: "id",
            header: "ID",
            render: (row: ScanFinding) => (
                <p>
                    #{row.id}
                </p>
            ),
        },
        {
            key: "title",
            header: "Title",
            render: (row: ScanFinding) => (
                <p>
                    {row.title.split(" ").slice(0, 7).join(" ")}
                    {row.title.split(" ")?.length > 7 ? "..." : ""}
                </p>
            ),
        },
        {
            key: "severity",
            header: "Severity",
            render: (row: ScanFinding) => (
                <Badge withDot variant={
                    row.severity === "critical" ? "failed" :
                        row.severity === "high" ? "failed" :
                            row.severity === "medium" ? "pending" : "success"
                }>{row.severity}</Badge>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row: ScanFinding) => (
                <Badge withDot variant={row.status === "open" ? "pending" : "success"}>{row.status}</Badge>
            ),
        },
        {
            key: "evidences",
            header: "Evidences",
            render: (row: ScanFinding) => row.evidences?.length
        },
        {
            key: "created_at",
            header: "Created",
            render: (row: ScanFinding) => new Date(row.created_at).toLocaleString()
        },
        {
            key: "actions",
            header: "Actions",
            render: (row: ScanFinding) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        {hasPermission(session, "change_organization") && <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            onClick={() => {
                                setEditFinding(row);
                                setIsModalOpen(true);
                            }}
                        >
                            <SquarePen size={18} /> Edit Finding
                        </Button>}
                        <Button variant="ghost" className="rounded-lg w-full justify-start"><Download size={18} /> Export Report</Button>
                        {/* <Button variant="ghost" className="rounded-lg w-full justify-start"><Ban size={18} /> Block</Button> */}
                        {hasPermission(session, "delete_organization") && <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => deleteMutation.mutate(row.id)}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash size={18} /> Delete
                        </Button>}
                    </PopoverContent>
                </Popover>
            ),
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                    <Input
                        placeholder="Search payments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={20} />}
                        iconPosition="right"
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={!filteredData?.length || isLoading || isFetching || isExporting}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                    <Sheet open={isModalOpen}>
                        <SheetTrigger asChild onClick={() => { setEditFinding(null); setIsModalOpen(true); }}>
                            <Button variant={"primary"} size="lg"><Plus size={20} />  Create Finding</Button>
                        </SheetTrigger>
                        <SheetContent showCloseButton={false}>
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-4">
                                    <ArrowLeft size={20} onClick={() => { setIsModalOpen(false); setEditFinding(null); }} />  {editFinding ? 'Edit Finding' : 'Create Finding'}
                                </SheetTitle>
                            </SheetHeader>
                            <CreateFindingForm finding={editFinding} setIsModalOpen={setIsModalOpen} scanId={scanId} refetch={() => { refetch(); setEditFinding(null); }} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <CustomTable data={filteredData} columns={columns} />
        </div>
    );
};

export default FindingsList;