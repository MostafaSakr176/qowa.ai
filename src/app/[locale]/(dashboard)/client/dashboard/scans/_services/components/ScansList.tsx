"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, ScanLine, Search, SquarePen, Trash, Loader2, ArrowUpRight } from "lucide-react";
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
import CreateWebScanForm from "./CreateWebForm";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axiosClient";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/utils/permissions";
import Image from "next/image";
import CreateMobileScanForm from "./CreateMobileForm";
import CreateInfraScanForm from "./CreateInfraForm";
import CreateApiScanForm from "./CreateApiForm";
import { Checkbox } from "@/components/ui/checkbox";

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

const fetchScans = async (): Promise<ScansApiResponse> => {
    const res = await api.get(`/scan/scans/`);
    return res.data;
};

const statusOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "finished", label: "Finished" },
];

const ScansList = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isWebModalOpen, setIsWebModalOpen] = useState(false);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [isInfraModalOpen, setIsInfraModalOpen] = useState(false);
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [editScanId, setEditScanId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    
    // Add these new states for row selection
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const router = useRouter();

    // Fetch scans data
    const { data, isLoading, refetch, isFetching, isError } = useQuery<ScansApiResponse>({
        queryKey: ["scans"],
        queryFn: () => fetchScans(),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            setDeletingId(id);
            await api.delete(`/scan/scans/${id}/`);
        },
        onSuccess: () => {
            toast.success("Scan deleted successfully");
            setDeletingId(null);
            refetch();
        },
        onError: (err: unknown) => {
            interface AxiosLike { response?: { data?: { detail?: string } }; message?: string }
            const e = err as AxiosLike;
            const message = e?.response?.data?.detail || e?.message || "Failed to delete scan";
            toast.error(message);
            setDeletingId(null);
        }
    });

    const handleDelete = (id: number) => {
        if (deletingId) return; // prevent double
        deleteMutation.mutate(id);
    }

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

    // Add selection handlers
    const handleSelectRow = (id: number, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
            setSelectAll(false);
        }
        setSelectedRows(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(filteredData.map(row => row.id));
            setSelectedRows(allIds);
            setSelectAll(true);
        } else {
            setSelectedRows(new Set());
            setSelectAll(false);
        }
    };

    // Update the export function to handle selected rows
    function handleExportCsv() {
        try {
            setIsExporting(true);
            
            // Determine which data to export
            const dataToExport = selectedRows.size > 0 
                ? filteredData.filter(row => selectedRows.has(row.id))
                : filteredData;
            
            if (!dataToExport.length) {
                toast.error("No data to export");
                return;
            }

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
            
            const rows = dataToExport.map(r => [
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
            a.download = `scans_${selectedRows.size > 0 ? 'selected_' : ''}${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.success(`Exported ${dataToExport.length} scan${dataToExport.length !== 1 ? 's' : ''}`);
        } finally {
            setIsExporting(false);
        }
    }

    // Clear selection when filtered data changes
    React.useEffect(() => {
        setSelectedRows(new Set());
        setSelectAll(false);
    }, [search, status]);

    // Update columns to include checkbox column
    const columns = [
        {
            key: "select",
            header: (
                <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                />
            ),
            render: (row: { id: number }) => (
                <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                    aria-label={`Select row ${row.id}`}
                />
            ),
        },
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
            render: (row: { id: number }) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => { setEditScanId(row.id); }}><SquarePen size={18} /> Edit scan</Button>
                        <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => router.push(`/dashboard/scans/${row.id}/findings`)}><ScanLine size={18} />View Findings</Button>
                        <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            disabled={deletingId === row.id && deleteMutation.isPending}
                            onClick={() => handleDelete(row.id)}
                        >
                            <Trash size={18} /> {deletingId === row.id && deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

    if (isError) return <div>Error loading scans.</div>;

    return (
        <div>
            <div className="grid grid-cols-4 gap-3 p-3 bg-[#F8F9FA] border-1 border-[#E9ECEF] rounded-2xl mb-4">
                <Sheet open={isWebModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsWebModalOpen(true)}>
                        <div className="p-4 rounded-2xl shadow-lg bg-white border border-[#E9ECEF] cursor-pointer hover:shadow-xl transition">
                            <div className="w-full flex items-start justify-between mb-4">
                                <Image src="/media/images/client/pc.png" alt="Create web scan" width={60} height={60} />
                                <ArrowUpRight size={24} />
                            </div>
                            <h6 className="text-black text-xl font-medium">Web App</h6>
                            <p className="text-[#6F6F6F] text-xs">Manage time zone, language, date format, and notification preferences.</p>
                        </div>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => { setIsWebModalOpen(false); setEditScanId(null); }} />  {editScanId ? 'Edit web scan' : 'Create Web scan'}</SheetTitle>
                        </SheetHeader>
                        <CreateWebScanForm setIsModalOpen={setIsWebModalOpen} onCreated={() => { refetch(); setEditScanId(null); }} editScanId={editScanId} />
                    </SheetContent>
                </Sheet>
                <Sheet open={isMobileModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsMobileModalOpen(true)}>
                        <div className="p-4 rounded-2xl shadow-lg bg-white border border-[#E9ECEF] cursor-pointer hover:shadow-xl transition">
                            <div className="w-full flex items-start justify-between mb-4">
                                <Image src="/media/images/client/mobile.png" alt="Create web scan" width={60} height={60} />
                                <ArrowUpRight size={24} />
                            </div>
                            <h6 className="text-black text-xl font-medium">Mobile App</h6>
                            <p className="text-[#6F6F6F] text-xs">Manage time zone, language, date format, and notification preferences.</p>
                        </div>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => { setIsMobileModalOpen(false); setEditScanId(null); }} />  {editScanId ? 'Edit Mobile scan' : 'Create Mobile scan'}</SheetTitle>
                        </SheetHeader>
                        <CreateMobileScanForm setIsModalOpen={setIsMobileModalOpen} onCreated={() => { refetch(); setEditScanId(null); }} editScanId={editScanId} />
                    </SheetContent>
                </Sheet>
                <Sheet open={isInfraModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsInfraModalOpen(true)}>
                        <div className="p-4 rounded-2xl shadow-lg bg-white border border-[#E9ECEF] cursor-pointer hover:shadow-xl transition">
                            <div className="w-full flex items-start justify-between mb-4">
                                <Image src="/media/images/client/infrastructure.png" alt="Create web scan" width={60} height={60} />
                                <ArrowUpRight size={24} />
                            </div>
                            <h6 className="text-black text-xl font-medium">Infrastructure</h6>
                            <p className="text-[#6F6F6F] text-xs">Manage time zone, language, date format, and notification preferences.</p>
                        </div>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => { setIsInfraModalOpen(false); setEditScanId(null); }} />  {editScanId ? 'Edit Infrastructure scan' : 'Create Infrastructure scan'}</SheetTitle>
                        </SheetHeader>
                        <CreateInfraScanForm setIsModalOpen={setIsInfraModalOpen} onCreated={() => { refetch(); setEditScanId(null); }} editScanId={editScanId} />
                    </SheetContent>
                </Sheet>
                <Sheet open={isApiModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsApiModalOpen(true)}>
                        <div className="p-4 rounded-2xl shadow-lg bg-white border border-[#E9ECEF] cursor-pointer hover:shadow-xl transition">
                            <div className="w-full flex items-start justify-between mb-4">
                                <Image src="/media/images/client/api.png" alt="Create API scan" width={60} height={60} />
                                <ArrowUpRight size={24} />
                            </div>
                            <h6 className="text-black text-xl font-medium">API App</h6>
                            <p className="text-[#6F6F6F] text-xs">Manage time zone, language, date format, and notification preferences.</p>
                        </div>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => { setIsApiModalOpen(false); setEditScanId(null); }} />  {editScanId ? 'Edit API scan' : 'Create API scan'}</SheetTitle>
                        </SheetHeader>
                        <CreateApiScanForm setIsModalOpen={setIsApiModalOpen} onCreated={() => { refetch(); setEditScanId(null); }} editScanId={editScanId} />
                    </SheetContent>
                </Sheet>
            </div>

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
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    {/* Show selection info */}
                    {selectedRows.size > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{selectedRows.size} selected</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedRows(new Set());
                                    setSelectAll(false);
                                }}
                                className="h-auto p-1 text-xs"
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={!filteredData.length || isLoading || isFetching || isExporting}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {selectedRows.size > 0 
                            ? `Export Selected (${selectedRows.size})` 
                            : isExporting ? 'Exporting...' : 'Export All CSV'
                        }
                    </Button>
                </div>
            </div>
            <CustomTable 
                data={filteredData} 
                columns={columns} 
                loading={isLoading} 
                onRowClick={(row) => {
                    // Prevent navigation when clicking on checkbox
                    if ((event?.target as HTMLElement)?.closest('[role="checkbox"]')) {
                        return;
                    }
                    router.push(`/dashboard/scans/${row.id}/findings`);
                }} 
            />
        </div>
    );
};

export default ScansList;