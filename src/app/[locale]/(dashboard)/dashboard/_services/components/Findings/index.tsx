import AnalyticCard from '@/components/dashboard/analytic-card'
import React from 'react'
import { Calendar, CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users } from "lucide-react";
import DonutChart from '@/components/dashboard/donut-chart';
import FindingsTable from './_services/components/FindingsTable';

const Findings = () => {

    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<ScanLine size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<ShieldEllipsis size={25} />} />
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                    <span className="absolute top-3 right-3 flex items-center bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2 inline-block"></span>
                        Critical
                    </span>
                    <span className="text-2xl font-bold text-black">990</span>
                </div>
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#FFF6ED] text-[#C4320A] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#C4320A] rounded-full mr-2 inline-block"></span>
                        High
                    </span>
                    <span className="text-2xl font-bold text-black">500</span>
                </div>
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#FFFAEB] text-[#B54708] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#B54708] rounded-full mr-2 inline-block"></span>
                        Medium
                    </span>
                    <span className="text-2xl font-bold text-black">990</span>
                </div>
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#ECFDF3] text-[#027A48] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#027A48] rounded-full mr-2 inline-block"></span>
                        Low
                    </span>
                    <span className="text-2xl font-bold text-black">990</span>
                </div>
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
                        <DonutChart labels={["Open Findings", "Closed Findings"]} series={[69, 40]} colors={["#736DFF", "#2F3A61"]} totalLabel='Total findings' className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pe-4 h-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Findings