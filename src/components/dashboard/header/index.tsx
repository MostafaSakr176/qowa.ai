"use client"
import React from 'react'
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'

const DashboardHeader = () => {
    const pathname = usePathname()
    const router = useRouter()


    console.log(pathname.split("/")[3]);


    return (
        <header className="flex items-center bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 h-12">
            <ChevronLeft size={20} className="text-neutral-900" onClick={() => router.back()} />
            <ChevronRight size={20} className="text-gray-400" onClick={() => router.forward()} />
            <span className="ms-2 text-xl font-semibold text-gray-800 border-s border-gray-300 ps-4">
                {(() => {
                    const segments = pathname.split("/").filter(Boolean);
                    const segment = segments[segments.length - 1] || "";
                    return segment.charAt(0).toUpperCase() + segment.slice(1);
                })()}
            </span>
            <div className="ml-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 p-0 text-gray-600 rounded-full bg-[#E9ECEF]"
                    aria-label="Info"
                >
                    <Bell size={10} />
                </Button>
            </div>
        </header>
    )
}

export default DashboardHeader