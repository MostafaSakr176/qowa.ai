import AnalyticCard from '@/components/dashboard/analytic-card'
import React from 'react'
import { Calendar, CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users } from "lucide-react";
import SemiDonutChart from '@/components/dashboard/donut-chart';
import FindingsTable from './_services/components/ReportsTable';

const Reports = () => {

    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<ScanLine size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<ShieldEllipsis size={25} />} />
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<ScanLine size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<ShieldEllipsis size={25} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="col-span-5">
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <FindingsTable />
                    </div>
                </div>
                <div className="col-span-3">
                    <div className='space-y-4 rounded-xl bg-[#F8F9FA] p-2'>
                        <div className="flex items-center justify-between px-4 pt-2">
                            <h5 className="text-lg font-medium">Findings</h5>
                        </div>
                        <SemiDonutChart labels={["Open Findings", "Closed Findings"]} series={[69, 40]} colors={["#736DFF", "#2F3A61"]} totalLabel='Total findings' className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pe-4 h-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports