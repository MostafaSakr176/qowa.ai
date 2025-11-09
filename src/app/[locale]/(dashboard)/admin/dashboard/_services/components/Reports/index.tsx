import AnalyticCard from '@/components/dashboard/analytic-card'
import React from 'react'
import { Calendar, CircleDollarSign, ScanLine, ShieldEllipsis } from "lucide-react";
import DonutChart from '@/components/dashboard/donut-chart';
import OrganizationsTable from './_services/components/ReportsTable';
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";

const Reports = () => {
    // Fetch reports analytics
    const { data, isLoading, isError } = useQuery({
        queryKey: ['reports-analytics'],
        queryFn: async () => {
            const res = await api.get("/core/overview/reports/");
            return res.data;
        },
        staleTime: 300_000,
    });

    // Extract totals for analytic cards
    const totals = data?.results?.totals || {};
    const total_apk = totals.total_apk ?? 0;
    const total_ipa = totals.total_ipa ?? 0;
    const total_postman = totals.total_postman ?? 0;

    // Prepare DonutChart data (example: APK, IPA, Postman)
    const donutLabels = ["APK Reports", "IPA Reports", "Postman Reports"];
    const donutSeries = [total_apk, total_ipa, total_postman];
    const donutColors = ["#736DFF", "#2F3A61", "#F59E42"];

    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                <AnalyticCard title="Total APK Reports" value={isLoading ? "..." : total_apk} icon={<ScanLine size={25} />} />
                <AnalyticCard title="Total IPA Reports" value={isLoading ? "..." : total_ipa} icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Postman Reports" value={isLoading ? "..." : total_postman} icon={<ShieldEllipsis size={25} />} />
                <AnalyticCard title="Total Organizations" value={isLoading ? "..." : data?.results?.organizations?.length ?? 0} icon={<CircleDollarSign size={25} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="col-span-5">
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <OrganizationsTable organizations={data?.results?.organizations ?? []} loading={isLoading} />
                    </div>
                </div>
                <div className="col-span-3">
                    <div className='space-y-4 rounded-xl bg-[#F8F9FA] p-2'>
                        <div className="flex items-center justify-between px-4 pt-2">
                            <h5 className="text-lg font-medium">Reports Breakdown</h5>
                        </div>
                        <DonutChart
                            labels={donutLabels}
                            series={donutSeries}
                            colors={donutColors}
                            totalLabel='Total Reports'
                            className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pe-4 h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports