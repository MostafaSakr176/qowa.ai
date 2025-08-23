"use client"
import React from 'react'
import { Bell, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from 'next/image'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

const DashboardHeader = () => {
    const pathname = usePathname()
    const router = useRouter()


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

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 p-0 text-gray-600 rounded-full bg-[#E9ECEF]"
                            aria-label="Info"
                        >
                            <Bell size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='p-0'>
                        <SheetHeader className='p-6'>
                            <SheetTitle>Notification</SheetTitle>
                        </SheetHeader>
                        {/* Tabs and Mark as Read */}

                        {/* Chadcn Tabs */}
                        <Tabs defaultValue="all" className="w-full">
                            <div className="flex items-center justify-between border-b border-[#E9ECEF] mb-2 px-6">
                                <div className="flex gap-2">
                                    {/* Tabs will be rendered below using Tabs component */}
                                    <TabsList className="flex gap-2 bg-transparent p-0 border-none">
                                        <TabsTrigger value="all" className="px-2 text-xs font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-none rounded-none data-[state=active]:shadow-none">
                                            All
                                        </TabsTrigger>
                                        <TabsTrigger value="unread" className="px-2 text-xs font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-none rounded-none data-[state=active]:shadow-none">
                                            Unread
                                        </TabsTrigger>
                                        <TabsTrigger value="mention" className="px-2 text-xs font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-none rounded-none data-[state=active]:shadow-none">
                                            Mention
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs px-3 py-1 rounded-sm border-gray-300">
                                <CheckCheck size={15} />
                                    Mark As Read
                                </Button>
                            </div>


                            {/* All Tab */}
                            <TabsContent value="all" className="mt-2">
                                    {/* Loren Terry */}
                                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition">
                                        <Image
                                            width={50} height={50}
                                            src="/media/images/hero/testmonial.png"
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt='user'
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-sm text-[#070A0E]">Loren Terry</span>
                                                <span className="text-xs text-gray-400 ml-2">created a new campaign</span>
                                            </div>
                                            <span className="text-xs text-gray-400">Today · 14:39 pm</span>
                                        </div>
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                    </div>
                                    {/* Error AI (highlighted) */}
                                    <div className="flex items-center gap-3 px-4 py-2 bg-[#F8D7DA]">
                                        <Image
                                            width={50} height={50}
                                            src="/media/images/hero/testmonial.png"
                                            alt="Error AI"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-sm text-[#070A0E]">Error .AI</span>
                                            </div>
                                            <span className="text-xs text-red-700">Today · 11:30 am</span>
                                        </div>
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                    </div>
                                    {/* Enzo Fernandez */}
                                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition">
                                        <Image
                                            width={50} height={50}
                                            src="/media/images/hero/testmonial.png"
                                            alt="Enzo Fernandez"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-sm text-[#070A0E]">Enzo Fernandez</span>
                                                <span className="text-xs text-gray-400 ml-2">created new campaign</span>
                                            </div>
                                            <span className="text-xs text-gray-400">Today · 08:10 am</span>
                                        </div>
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                    </div>
                            </TabsContent>
                        </Tabs>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default DashboardHeader