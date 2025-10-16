"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, Plus, ScanLine, Search, SquarePen, Trash, Loader2 } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress"
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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from "@/i18n/navigation";
import CreateScanForm from "./CreateForm";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axiosClient";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/utils/permissions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ScanApi = {
    id: number;
    title: string;
    status: string;
    app_type: string;
    created_at: string;
    testers: { id: number; email: string; first_name: string; last_name: string }[];
    team_members: { id: number; email: string; first_name: string; last_name: string }[];
    progress: number;
};

type ScansApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: ScanApi[];
};

type ScanRow = {
    id: number;
    title: string;
    app_type: string;
    status: string;
    progress: number;
    assign: string[];
    startDate: { date: string; time: string };
};

const fetchScans = async (organizationId: string): Promise<ScansApiResponse> => {
    const res = await api.get(`/scan/scans/?organization_id=${organizationId}`);
    return res.data;
};

const statusOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "finished", label: "Finished" },
];

const ScansList = ({ organizationId }: { organizationId: string }) => {
    const { data: session } = useSession();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editScanId, setEditScanId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // NEW: State for delete confirmation
    const [deleteScanId, setDeleteScanId] = useState<number | null>(null);
    const [scanToDelete, setScanToDelete] = useState<ScanRow | null>(null);

    const router = useRouter();

    // Fetch scans data
    const { data, isLoading, refetch, isFetching, isError } = useQuery<ScansApiResponse>({
        queryKey: ["scans", organizationId],
        queryFn: () => fetchScans(organizationId),
    });

    // Updated delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/scan/scans/${id}/`);
        },
        onSuccess: () => {
            toast.success("Scan deleted successfully");
            setDeletingId(null);
            setDeleteScanId(null);
            setScanToDelete(null);
            refetch();
        },
        onError: (err: unknown) => {
            interface AxiosLike { response?: { data?: { detail?: string } }; message?: string }
            const e = err as AxiosLike;
            const message = e?.response?.data?.detail || e?.message || "Failed to delete scan";
            toast.error(message);
            setDeletingId(null);
            setDeleteScanId(null);
            setScanToDelete(null);
        }
    });

    // NEW: Handle delete click (opens confirmation dialog)
    const handleDeleteClick = (scan: ScanRow) => {
        setScanToDelete(scan);
        setDeleteScanId(scan.id);
    };

    // NEW: Handle confirm delete
    const handleConfirmDelete = () => {
        if (deleteScanId) {
            setDeletingId(deleteScanId);
            deleteMutation.mutate(deleteScanId);
        }
    };

    // NEW: Handle cancel delete
    const handleCancelDelete = () => {
        setDeleteScanId(null);
        setScanToDelete(null);
    };

    // Map API data to table format
    const scans: ScanRow[] = useMemo(() => {
        if (!data?.results) return [];
        return data.results.map((scan) => ({
            id: scan.id,
            title: scan.title,
            app_type: scan.app_type, // Not provided by API, set default or map if available
            status: scan.status === "pending" ? "open" : scan.status, // Map API status if needed
            progress: scan.progress,
            assign: scan.testers.map(t => `${t.first_name[0] ?? ""}${t.last_name[0] ?? ""}`),
            startDate: {
                date: new Date(scan.created_at).toLocaleDateString(),
                time: new Date(scan.created_at).toLocaleTimeString(),
            },
        }));
    }, [data]);

    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = scans;

        // Filter by search (scan name, mail, invoice, method type, etc.)
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => {
                return (
                    row.title.toLowerCase().includes(lower) ||
                    row.assign.map(ele => ele.toLowerCase().includes(lower))
                );
            });
        }

        // Filter by status
        if (status !== "all") {
            data = data.filter((row) => row.status === status);
        }

        // Sort by priority if selected (optional: you can sort, but here we just filter)
        return data;
    }, [search, status, scans]);

    // CSV helpers
    function csvEscape(value: unknown) {
        if (value === null || value === undefined) return "";
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
    }

    function handleExportCsv() {
        try {
            setIsExporting(true);
            if (!filteredData.length) return;
            const headers = [
                "ID",
                "Title",
                "Type",
                "Status",
                "Progress %",
                "Assigned Initials",
                "Created Date",
                "Created Time"
            ];
            const rows = filteredData.map(r => [
                r.id,
                r.title,
                r.app_type,
                r.status,
                r.progress,
                r.assign.join(' '),
                r.startDate.date,
                r.startDate.time
            ].map(csvEscape).join(','));
            const csv = [headers.map(csvEscape).join(','), ...rows].join('\r\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const now = new Date();
            a.href = url;
            a.download = `scans_${organizationId}_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
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
            key: "title",
            header: "Title",
            render: (row: { title: string }) => (
                <p>
                    {row.title.split(" ").slice(0, 7).join(" ")}
                    {row.title.split(" ").length > 7 ? "..." : ""}
                </p>
            ),
        },
        {
            key: "app_type",
            header: "Type",
        },
        {
            key: "status",
            header: "Status",
            render: (row: { status: string }) => (
                <Badge withDot variant={row.status === "closed" ? "failed" : row.status === "open" ? "pending" : "success"}>{row.status}</Badge>
            ),
        },
        {
            key: "progress",
            header: "Progress",
            render: (row: { progress: number }) => (
                <div className="flex items-center gap-2">
                    <Progress value={row.progress} /> {`${row.progress}%`}
                </div>
            )
        },
        {
            key: "assign",
            header: "Assign",
            render: (row: { assign: string[] }) => (
                row.assign && row.assign.length ? (
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                        {row.assign.map((ele, idx) => (
                            <Avatar key={idx}>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>{ele}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-[#6B7280] italic">Not assigned</span>
                )
            )
        },
        {
            key: "startDate",
            header: "start date",
            render: (row: { startDate: { date: string; time: string } }) => (
                <div>
                    <p className="text-sm text-[#070A0E]">{row.startDate.date}</p>
                    <p className="text-sm text-[#4A4C4F]">{row.startDate.time}</p>
                </div>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (row: ScanRow) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        {hasPermission(session, "change_scan") && (
                            <Button 
                                variant="ghost" 
                                className="rounded-lg w-full justify-start" 
                                onClick={() => { 
                                    setEditScanId(row.id); 
                                    setIsModalOpen(true); 
                                }}
                            >
                                <SquarePen size={18} /> Edit scan
                            </Button>
                        )}
                        <Button 
                            variant="ghost" 
                            className="rounded-lg w-full justify-start" 
                            onClick={() => router.push(`/admin/dashboard/organizations/${organizationId}/scans/${row.id}/findings`)}
                        >
                            <ScanLine size={18} />View Findings
                        </Button>
                        {hasPermission(session, "delete_scan") && (
                            <Button
                                variant="ghost"
                                className="rounded-lg w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deletingId === row.id}
                                onClick={() => handleDeleteClick(row)}
                            >
                                <Trash size={18} /> 
                                {deletingId === row.id && deleteMutation.isPending ? (
                                    <span className="flex items-center gap-2 ml-1">
                                        <Loader2 className="animate-spin" size={16} /> Deleting...
                                    </span>
                                ) : (
                                    "Delete"
                                )}
                            </Button>
                        )}
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

    if (isError) return <div>Error loading scans.</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                    <Input
                        placeholder="Search scans..."
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
                            {statusOptions.map((opt) => (
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
                        disabled={!filteredData.length || isLoading || isFetching || isExporting}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                    {hasPermission(session, "add_scan") && <Sheet open={isModalOpen}>
                        <SheetTrigger asChild onClick={() => setIsModalOpen(true)}>
                            <Button variant={"primary"} size="lg" onClick={() => { setEditScanId(null); }}><Plus size={20} />  Create scan</Button>
                        </SheetTrigger>
                        <SheetContent showCloseButton={false}>
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => { setIsModalOpen(false); setEditScanId(null); }} />  {editScanId ? 'Edit scan' : 'Create scan'}</SheetTitle>
                            </SheetHeader>
                            <CreateScanForm setIsModalOpen={setIsModalOpen} organizationId={organizationId} onCreated={() => { refetch(); setEditScanId(null); }} editScanId={editScanId} />
                        </SheetContent>
                    </Sheet>}
                </div>
            </div>
            <CustomTable data={filteredData} columns={columns} loading={isLoading} onRowClick={(row) => router.push(`/dashboard/organizations/${organizationId}/scans/${row.id}/findings`)} />

            {/* NEW: Delete Confirmation Dialog */}
            <AlertDialog open={deleteScanId !== null} onOpenChange={(open) => !open && handleCancelDelete()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Scan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the scan <strong>&quot;{scanToDelete?.title}&quot;</strong>? 
                            This action cannot be undone and will permanently remove the scan and all associated findings and evidence.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            onClick={handleCancelDelete} 
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete Scan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ScansList;