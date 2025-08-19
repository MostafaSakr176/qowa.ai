import AnalyticCard from '@/components/dashboard/analytic-card'
import React from 'react'
import { Calendar, CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users } from "lucide-react";
import RevenueChart from '@/components/dashboard/revenue-chart';
import ScanningTable from './_services/components/ScanningTable';
import SemiDonutChart from '@/components/dashboard/donut-chart';

const Scanning = () => {

    const dataSet = [
        [
            [new Date("01/01/2014").getTime(), 50],
            [new Date("01/03/2014").getTime(), 70],
            [new Date("01/05/2014").getTime(), 90],
            [new Date("01/08/2014").getTime(), 50],
            [new Date("01/11/2014").getTime(), 70],
            [new Date("01/14/2014").getTime(), 90],
            [new Date("01/16/2014").getTime(), 50],
            [new Date("01/20/2014").getTime(), 70],
            [new Date("01/22/2014").getTime(), 90],
            [new Date("01/25/2014").getTime(), 50],
            [new Date("01/26/2014").getTime(), 70],
            [new Date("01/29/2014").getTime(), 90],
        ],
        [
            [new Date("01/01/2014").getTime(), 20],
            [new Date("01/02/2014").getTime(), 60],
            [new Date("01/04/2014").getTime(), 40],
            [new Date("01/06/2014").getTime(), 20],
            [new Date("01/08/2014").getTime(), 70],
            [new Date("01/09/2014").getTime(), 40],
            [new Date("01/11/2014").getTime(), 90],
            [new Date("01/13/2014").getTime(), 30],
            [new Date("01/15/2014").getTime(), 40],
            [new Date("01/18/2014").getTime(), 70],
            [new Date("01/21/2014").getTime(), 90],
            [new Date("01/22/2014").getTime(), 99],

        ]
    ];

    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<ScanLine size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<ShieldEllipsis size={25} />} />
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<Users size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<Users size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Hash size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<UserRoundCheck size={25} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="col-span-5">
                    <RevenueChart dataSet={dataSet} className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pt-4 pe-4 h-full" />
                </div>
                <div className="col-span-3 space-y-4">
                    <div className="rounded-xl bg-[#F8F9FA] p-2 h-full flex flex-col">
                        <div className="flex items-center justify-between px-4 pt-2 pb-4">
                            <h5 className="text-lg font-medium">Scans by Status</h5>
                            <h5 className="text-lg font-medium">20k</h5>
                        </div>
                        <div className='bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] p-4 flex-1'>
                            {/* Cost per Project */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[18px] font-medium text-[#222]">Open</span>
                                    <span className="text-[18px] font-semibold text-[#22B573]">5000</span>
                                </div>
                                <div className="flex space-x-1 mt-2">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`inline-block h-8 w-2 rounded-full transition-colors duration-200 ${i < 30
                                                ? "bg-[#22B573]"
                                                : "bg-[#B2E5D6]"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* 30% Deposits Received */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[18px] font-medium text-[#222]">Pending</span>
                                    <span className="text-[18px] font-semibold text-[#FFD600]">101</span>
                                </div>
                                <div className="flex space-x-1 mt-2">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`inline-block h-8 w-2 rounded-full transition-colors duration-200 ${i < 20
                                                ? "bg-[#FFD600]"
                                                : "bg-[#FFF6B2]"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Scan Payments Done */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[18px] font-medium text-[#222]">Completed</span>
                                    <span className="text-[18px] font-semibold text-[#2563EB]">8999</span>
                                </div>
                                <div className="flex space-x-1 mt-2">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`inline-block h-8 w-2 rounded-full transition-colors duration-200 ${i < 10
                                                ? "bg-[#2563EB]"
                                                : "bg-[#BFDBFE]"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="col-span-5">
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <ScanningTable />
                    </div>
                </div>
                <div className="col-span-3">
                    <div className='space-y-4 rounded-xl bg-[#F8F9FA] p-2'>
                        <div className="flex items-center justify-between px-4 pt-2">
                            <h5 className="text-lg font-medium">Scan Intensity</h5>
                        </div>
                        <SemiDonutChart labels={["High","Medium","low"]} series={[20,50,30]} colors={["#DF1C41","#FD914D","#28806F"]} totalLabel='Total Scans' className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pe-4 h-full" />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Scanning