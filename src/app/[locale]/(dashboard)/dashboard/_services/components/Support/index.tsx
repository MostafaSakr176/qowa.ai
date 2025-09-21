"use client"

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import AnalyticCard from "@/components/dashboard/analytic-card";
import AreaChart from "@/components/dashboard/line-chart";
import { CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users, TicketCheck } from "lucide-react";
import SupportTable from "./_services/components/PaymentsTable";

type Ticket = {
    id: string;
    organization: { id: number; name: string; business_email: string };
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

    const tickets: Ticket[] = data?.results?.tickets ?? [];
    const count = data?.count ?? 0;
    const rowsPerPage = useMemo(() => (tickets?.length || 10), [tickets]);
    const totalPages = rowsPerPage ? Math.ceil(count / rowsPerPage) : 1;

    // Keep your chart (or wire it to another endpoint later)
    const dataSet = useMemo(() => [
        tickets.slice(0, 12).map((t, i) => [new Date(t.created_at).getTime(), (i % 3) * 25 + 20]),
        tickets.slice(0, 12).map((t, i) => [new Date(t.created_at).getTime(), (i % 4) * 20 + 10]),
    ], [tickets]);

    if (error) {
        return <div className="p-4 text-sm text-red-600">Failed to load support statistics.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards (from totals) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticCard title="Total Requests" value={(totals.total_requests ?? 0).toString()} icon={<TicketCheck size={25} />} />
                <AnalyticCard title="Complaints" value={(totals.total_complaint ?? 0).toString()} icon={<Users size={25} />} />
                <AnalyticCard title="Scan Issues" value={(totals.total_scan_issue ?? 0).toString()} icon={<ScanLine size={25} />} />
                <AnalyticCard title="Payment Issues" value={(totals.total_payment_issue ?? 0).toString()} icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="Feedback" value={(totals.total_feedback ?? 0).toString()} icon={<ShieldEllipsis size={25} />} />
                <AnalyticCard title="Open Tickets" value={(totals.total_open ?? 0).toString()} icon={<Hash size={25} />} />
                <AnalyticCard title="Closed Tickets" value={(totals.total_closed ?? 0).toString()} icon={<UserRoundCheck size={25} />} />
                <AnalyticCard title="Support Agents" value={(totals.total_support ?? 0).toString()} icon={<Users size={25} />} />
            </div>

            {/* <AreaChart
        dataSet={dataSet}
        className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pt-4 pe-4"
      /> */}

            {/* Pass tickets and pagination props to the table */}
            <div className="rounded-xl bg-[#F8F9FA] p-2">
                <SupportTable
                    tickets={tickets}
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

export default Support;