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
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
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

    const columns = [
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
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {row?.assigned_employee?.map((ele, idx) => (
                        <Avatar key={idx}>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>{ele}</AvatarFallback>
                        </Avatar>
                    ))}

                </div>
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
                    <PopoverTrigger className="border-0"><Ellipsis size={20} onClick={() => console.log(row.id)} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        <Button variant="ghost" className="rounded-lg" onClick={() => { setEditingTicket(row); setIsModalOpen(true); }}><SquarePen size={18} /> Edit Ticket</Button>
                        <Button variant="ghost" className="rounded-lg"><Download size={18} /> Export</Button>
                        {/* <Button variant="ghost" className="rounded-lg"><Ban size={18} /> Close</Button> */}
                        <Button
                            variant="ghost"
                            className="rounded-lg text-red-600 hover:text-red-700"
                            disabled={deletingId === row.id}
                            onClick={() => handleDelete(row.id)}
                        >
                            {deletingId === row.id ? <span className="flex items-center gap-2"><LoaderSpinner /> Deleting...</span> : <><Trash2 size={18} /> Delete</>}
                        </Button>
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/support/tickets/${id}/`);
        },
        onSuccess: (_data, id) => {
            toast.success(`Ticket #${id} deleted`);
            refetch()
        },
        onError: (_err, id) => {
            toast.error(`Failed to delete ticket #${id}`);
        },
        onSettled: () => setDeletingId(null)
    });

    function handleDelete(id: string) {
        setDeletingId(id);
        deleteMutation.mutate(id);
    }

    const LoaderSpinner = () => <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />;

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
        </div>
    );
};

export default SupportList;