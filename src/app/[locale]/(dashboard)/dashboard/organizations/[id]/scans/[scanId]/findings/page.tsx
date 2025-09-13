import { Button } from '@/components/ui/button'
import { BadgeCheck, SquarePen } from 'lucide-react'
import React from 'react'
import FindingsList from './_services/components/FindingsList'
import DonutChart from '@/components/dashboard/donut-chart'

const Scans = () => {
    return (
        <div>
            <div className="flex items-center justify-between w-full border-b border-[#DADADB] pb-4 mb-4">
                {/* Left: Avatar, Name, Verified, Pro, Email */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        KM
                    </div>
                    {/* Name, badges, email */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-base text-[#070A0E]">Kadir Miye</span>
                            {/* Verified badge */}
                            <span className="inline-flex items-center">
                                <BadgeCheck size={20} color='#1A4DFF' />
                            </span>
                            {/* PRO badge */}
                            <span className="bg-[#F1F6FF] text-[#1A4DFF] text-xs font-semibold px-2 py-0.5 rounded-md ml-1">PRO</span>
                        </div>
                        <span className="text-xs text-[#6B7280]">kadirumiye.com</span>
                    </div>
                </div>
                {/* Right: Edit Details Button */}
                <Button variant={'outline'} className='border border-primary text-primary' size="lg">
                    <SquarePen size={15} />
                    Edit Details
                </Button>
            </div>
            <div className='grid grid-cols-5 items-start gap-4'>
                <div className='col-span-4'>
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <FindingsList />
                    </div>
                </div>
                <div className='col-span-1 space-y-4'>
                    <div className='bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF]'>
                        <DonutChart chartStyle='full' labels={["Open Findings", "Closed Findings", "Open Findings", "Closed Findings"]} showLegend={false} series={[10, 40, 20, 30]} colors={["#736DFF", "#2F3A61", "#EE534F", "#FFA828"]} totalLabel='Total findings' />
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                            <span className="absolute top-3 right-3 flex items-center bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 inline-block"></span>
                                Critical
                            </span>
                            <span className="text-2xl font-bold text-black">990</span>
                        </div>
                        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                            <span className="absolute top-3 right-3 flex items-center bg-[#FFF6ED] text-[#C4320A] text-xs font-medium px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-[#C4320A] rounded-full mr-2 inline-block"></span>
                                High
                            </span>
                            <span className="text-2xl font-bold text-black">500</span>
                        </div>
                        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                            <span className="absolute top-3 right-3 flex items-center bg-[#FFFAEB] text-[#B54708] text-xs font-medium px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-[#B54708] rounded-full mr-2 inline-block"></span>
                                Medium
                            </span>
                            <span className="text-2xl font-bold text-black">990</span>
                        </div>
                        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                            <span className="absolute top-3 right-3 flex items-center bg-[#ECFDF3] text-[#027A48] text-xs font-medium px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-[#027A48] rounded-full mr-2 inline-block"></span>
                                Low
                            </span>
                            <span className="text-2xl font-bold text-black">990</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scans