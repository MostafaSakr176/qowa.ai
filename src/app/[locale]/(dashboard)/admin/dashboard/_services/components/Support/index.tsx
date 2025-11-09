"use client"

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import AnalyticCard from "@/components/dashboard/analytic-card";
import { CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users, TicketCheck } from "lucide-react";
import TicketsTable from "./_services/components/TicketsTable";

type Ticket = {
    id: string;
    organization: { id: number; name: string; business_email: string; country: string };
    assigned_employee: null | { id: number; name: string };
    type: string;
    status: string;
    priority: string;
    created_at: string;
};

type Totals = {
    total_requests: number;
    total_complaint: number;
    total_scan_issue: number;
    total_payment_issue: number;
    total_feedback: number;
    total_open: number;
    total_closed: number;
    total_support: number;
};

type SupportOverviewCore = {
    totals: Totals;
    tickets: Ticket[];
};

type SupportOverviewResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: SupportOverviewCore;
};

const Support = () => {
    const [page, setPage] = useState(1);

    // Fetch support analytics
    const { data, isLoading, isFetching, error } = useQuery<SupportOverviewResponse>({
        queryKey: ["support-overview", page],
        queryFn: async () => {
            const res = await api.get(`/core/overview/support/?page=${page}`);
            return res.data;
        },
        staleTime: 60_000,
    });

    const totals: Totals = data?.results?.totals ?? {
        total_requests: 0,
        total_complaint: 0,
        total_scan_issue: 0,
        total_payment_issue: 0,
        total_feedback: 0,
        total_open: 0,
        total_closed: 0,
        total_support: 0,
    };

    const tickets: Ticket[] = useMemo(() => data?.results?.tickets ?? [], [data]);
    const count = data?.count ?? 0;
    const rowsPerPage = useMemo(() => (tickets?.length || 10), [tickets]);
    const totalPages = rowsPerPage ? Math.ceil(count / rowsPerPage) : 1;

    if (error) {
        return <div className="p-4 text-sm text-red-600">Failed to load support statistics.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards (from totals) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticCard title="Total Requests" value={totals.total_requests?.toString()} icon={<TicketCheck size={25} />} />
                <AnalyticCard title="Complaints" value={totals.total_complaint?.toString()} icon={<Users size={25} />} />
                <AnalyticCard title="Scan Issues" value={totals.total_scan_issue?.toString()} icon={<ScanLine size={25} />} />
                <AnalyticCard title="Payment Issues" value={totals.total_payment_issue?.toString()} icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="Feedback" value={totals.total_feedback?.toString()} icon={<ShieldEllipsis size={25} />} />
                <AnalyticCard title="Open Tickets" value={totals.total_open?.toString()} icon={<Hash size={25} />} />
                <AnalyticCard title="Closed Tickets" value={totals.total_closed?.toString()} icon={<UserRoundCheck size={25} />} />
                <AnalyticCard title="Support Agents" value={totals.total_support?.toString()} icon={<Users size={25} />} />
            </div>

            {/* Tickets Table */}
            <div className="rounded-xl bg-[#F8F9FA] p-2">
                <TicketsTable
                    tickets={data?.results?.tickets ?? []}
                    loading={isLoading || isFetching}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={count}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default Support