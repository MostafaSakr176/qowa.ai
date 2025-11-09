"use client"
import React, { useMemo, useState } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Plus, Search } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
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
import api from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

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

    const columns = [
        { key: "id", header: "Issue ID", render: (row: SupportTicket) => <span className="font-medium">ID: {row.id}</span> },
        {
            key: "description",
            header: "Description",
            render: (row: SupportTicket) => (
                <span className="block max-w-[360px] truncate" title={row.description || "-"}>
                    {row.description || "-"}
                </span>
            )
        },
        { key: "type", header: "Type" },
        {
            key: "status",
            header: "Status",
            render: (row: SupportTicket) => (
                <Badge withDot variant={statusToVariant(row.status)}>{row.status}</Badge>
            )
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