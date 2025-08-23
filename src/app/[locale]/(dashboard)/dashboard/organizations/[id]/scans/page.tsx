import { Button } from '@/components/ui/button'
import { BadgeCheck, SquarePen } from 'lucide-react'
import React from 'react'
import ScansList from './_services/components/ScansList'

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
            <div className='rounded-xl bg-[#F8F9FA] p-2'>
                <ScansList />
            </div>
        </div>
    )
}

export default Scans