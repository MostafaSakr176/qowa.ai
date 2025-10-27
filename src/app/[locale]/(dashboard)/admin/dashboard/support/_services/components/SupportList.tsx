"use client"
import React, { useMemo, useState } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, Plus, Search, SquarePen, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import CreateTicketForm from "./CreateForm";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
// import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/formateDate";
import api from "@/lib/axiosClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { hasPermission } from "@/utils/permissions";
import { useSession } from "next-auth/react";
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
import { Checkbox } from "@/components/ui/checkbox";

type TicketFile = {
    id: number;
    file: string | null;
    description: string | null;
    uploaded_at: string;
};

type TicketOrg = {
    id: number;
    name: string;
    business_email: string;
};

type SupportTicket = {
    id: string;
    type: string;
    status: string;
    priority: string;
    assigned_employee: string[];
    organization: TicketOrg;
    scan: unknown | null;
    finding: unknown | null;
    description: string | null;
    created_at: string;
    ticket_files: TicketFile[];
};

type TicketsResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: SupportTicket[];
};

const statusOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "finished", label: "Finished" },
];

const SupportList = () => {
    const { data: session } = useSession()
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
    const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const pageSize = 10; // expected backend default page size

    const { data: ticketsData, isLoading, refetch } = useQuery<TicketsResponse>({
        queryKey: ["support-tickets", page],
        queryFn: async () => {
            const res = await api.get<TicketsResponse>(`/support/tickets/?page=${page}`);
            setTotalCount(res.data.count || 0);
            return res.data;
        },
        staleTime: 30_000,
        placeholderData: (prev) => prev,
    });

    const tickets: SupportTicket[] = useMemo(() => (ticketsData && Array.isArray(ticketsData.results) ? ticketsData.results : []), [ticketsData]);

    // Client-side filter on current page only
    const filteredData = useMemo(() => {
        let data = tickets;
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(t =>
                t.id.toLowerCase().includes(q) ||
                t.type.toLowerCase().includes(q) ||
                t.status.toLowerCase().includes(q) ||
                t.priority.toLowerCase().includes(q) ||
                t.organization?.name?.toLowerCase().includes(q) ||
                t.organization?.business_email?.toLowerCase().includes(q) ||
                (t.description || "")?.toLowerCase().includes(q)
            );
        }
        if (status !== "all") {
            data = data.filter(t => t.status === status);
        }
        return data;
    }, [tickets, search, status]);

    const statusToVariant = (s: string): "pending" | "success" | "failed" => {
        const v = (s || "").toLowerCase();
        if (v === "open" || v === "pending" || v === "in_progress") return "pending";
        if (v === "closed" || v === "finished" || v === "resolved") return "success";
        return "failed";
    };

    const priorityToVariant = (p: string): "pending" | "success" | "failed" => {
        const v = (p || "").toLowerCase();
        if (v === "high" || v === "urgent" || v === "critical") return "failed"; // red
        if (v === "medium") return "pending"; // amber
        return "success"; // low or default -> green
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/support/tickets/${id}/`);
        },
        onSuccess: (_data, id) => {
            toast.success(`Ticket #${id} deleted`);
            refetch();
            setDeleteTicketId(null);
            setTicketToDelete(null);
        },
        onError: (_err, id) => {
            toast.error(`Failed to delete ticket #${id}`);
            setDeleteTicketId(null);
            setTicketToDelete(null);
        },
        onSettled: () => setDeletingId(null)
    });

    const handleDeleteClick = (ticket: SupportTicket) => {
        setTicketToDelete(ticket);
        setDeleteTicketId(ticket.id);
    };

    const handleConfirmDelete = () => {
        if (deleteTicketId) {
            setDeletingId(deleteTicketId);
            deleteMutation.mutate(deleteTicketId);
            setDeleteConfirmText(""); // Reset input after delete
        }
    };

    const handleCancelDelete = () => {
        setDeleteTicketId(null);
        setTicketToDelete(null);
        setDeleteConfirmText(""); // Reset input
    };

    const handleSelectRow = (id: string, checked: boolean | string) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            setSelectAll(next.size === filteredData.length);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(filteredData.map(row => row.id)));
            setSelectAll(true);
        } else {
            setSelectedRows(new Set());
            setSelectAll(false);
        }
    };

    const handleExportCsv = () => {
        const dataToExport = selectedRows.size > 0
            ? filteredData.filter(row => selectedRows.has(row.id))
            : filteredData;
        if (!dataToExport.length) return;
        const headers = [
            "ID",
            "Type",
            "Status",
            "Priority",
            "Organization",
            "Business Email",
            "Assigned Employees",
            "Description",
            "Created At"
        ];
        const rows = dataToExport.map(t => [
            t.id,
            t.type,
            t.status,
            t.priority,
            t.organization?.name || "",
            t.organization?.business_email || "",
            t.assigned_employee.join(", "),
            t.description || "",
            t.created_at
        ]);
        const csv = [headers, ...rows]
            .map(line =>
                line
                    .map(field => {
                        if (field === null || field === undefined) return "";
                        const val = String(field);
                        return /[",\n]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
                    })
                    .join(",")
            )
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const ts = new Date().toISOString().split("T")[0];
        const link = document.createElement("a");
        link.href = url;
        link.download = `support_tickets_${selectedRows.size > 0 ? "selected_" : ""}${ts}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const columns = [
        {
            key: "select",
            header: <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                aria-label="Select all tickets"
            />,
            render: (row: SupportTicket) => (
                <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                    aria-label={`Select ticket #${row.id}`}
                />
            ),
        },
        { key: "id", header: "ID", render: (row: SupportTicket) => <span className="font-medium">#{row.id}</span> },
        {
            key: "organization",
            header: "Organization",
            render: (row: SupportTicket) => (
                <div className="flex items-center gap-1">
                    <Image src={"/media/images/logos/organization logo.png"} alt={row.organization?.name} width={30} height={30} />
                    <div className="text-start">
                        <p className="text-sm text-[#070A0E]">{row.organization?.name}</p>
                        <p className="text-xs text-[#4A4C4F]">{row.organization?.business_email}</p>
                    </div>
                </div>

            )
        },
        { key: "type", header: "Type" },
        {
            key: "assigned_employee",
            header: "Assigned Employee",
            render: (row: { assigned_employee: string[] }) => (
                row?.assigned_employee?.length ? (
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                        {row.assigned_employee.map((ele, idx) => (
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
            key: "status",
            header: "Status",
            render: (row: SupportTicket) => (
                <Badge withDot variant={statusToVariant(row.status)}>{row.status}</Badge>
            )
        },
        {
            key: "priority",
            header: "Priority",
            render: (row: SupportTicket) => (
                <Badge withDot variant={priorityToVariant(row.priority)}>{row.priority}</Badge>
            )
        },
        {
            key: "description",
            header: "Description",
            render: (row: SupportTicket) => (
                <span className="block max-w-[360px] truncate" title={row.description || "-"}>
                    {row.description || "-"}
                </span>
            )
        },
        {
            key: "created_at",
            header: "Registration date",
            render: (row: SupportTicket) => {
                const dt = formatDateTime(row.created_at);
                return (
                    <div>
                        <p className="text-sm text-[#070A0E]">{dt.date}</p>
                        <p className="text-xs text-[#4A4C4F]">{dt.time}</p>
                    </div>
                );
            }
        },
        {
            key: "actions",
            header: "",
            render: (row: SupportTicket) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        {hasPermission(session, "add_organization") && (
                            <Button
                                variant="ghost"
                                className="rounded-lg w-full justify-start"
                                onClick={() => {
                                    setEditingTicket(row);
                                    setIsModalOpen(true);
                                }}
                            >
                                <SquarePen size={18} /> Edit Ticket
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            onClick={handleExportCsv}
                        >
                            <Download size={18} /> Export
                        </Button>
                        <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(row)}
                            disabled={deletingId === row.id}
                        >
                            <Trash2 size={18} /> Delete
                        </Button>
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                    <Input
                        placeholder="Search tickets..."
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
                    <div className="flex items-center gap-2">
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
                            disabled={!filteredData.length || isLoading}
                            className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                        >
                            <Download size={16} />
                            {selectedRows.size > 0
                                ? `Export Selected (${selectedRows.size})`
                                : 'Export All CSV'}
                        </Button>
                    </div>
                    <Sheet open={isModalOpen}>
                        <SheetTrigger asChild onClick={() => setIsModalOpen(true)}>
                            <Button variant={"primary"} size="lg"><Plus size={20} />  Create Ticket</Button>
                        </SheetTrigger>
                        <SheetContent showCloseButton={false}>
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => setIsModalOpen(false)} />  Create Ticket</SheetTitle>
                            </SheetHeader>
                            <CreateTicketForm
                                setIsModalOpen={setIsModalOpen}
                                editingTicket={editingTicket}
                                onSuccess={() => { setEditingTicket(null); setIsModalOpen(false); refetch(); }}
                                onCancelEdit={() => setEditingTicket(null)}
                            />
                        </SheetContent>
                    </Sheet>

                </div>

            </div>

            <CustomTable
                data={filteredData}
                columns={columns}
                serverSidePagination
                page={page}
                rowsPerPage={pageSize}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={(p) => setPage(p)}
                loading={isLoading}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteTicketId !== null} onOpenChange={(open) => { if (!open) { handleCancelDelete(); setDeleteConfirmText(""); } }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Support Ticket</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete ticket <strong>#{ticketToDelete?.id}</strong> from{" "}
                            <strong>{ticketToDelete?.organization?.name}</strong>?<br />
                            This action cannot be undone and will permanently remove the ticket and all associated files.<br /><br />
                            <span className="text-destructive font-semibold">Type <b>delete</b> below to confirm:</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        value={deleteConfirmText}
                        onChange={e => setDeleteConfirmText(e.target.value)}
                        placeholder='Type "delete" to confirm'
                        className="mt-2"
                        autoFocus
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                handleCancelDelete();
                                setDeleteConfirmText("");
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                handleConfirmDelete();
                                setDeleteConfirmText("");
                            }}
                            disabled={deleteMutation.isPending || deleteConfirmText.trim().toLowerCase() !== "delete"}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete Ticket"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SupportList;