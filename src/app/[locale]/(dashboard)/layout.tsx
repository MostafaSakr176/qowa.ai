
import type { Metadata } from 'next'
import * as React from 'react'
import SideBar from '@/components/dashboard/sidebar'
import DashboardHeader from '@/components/dashboard/header'

export const metadata: Metadata = {
  title: 'Dashboard - Your Company',
  description: 'Dashboard for your business management',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="h-full flex bg-[#F8F9FA] p-3 gap-2">
      <SideBar />
      {/* Main Content */}
      <main className="flex-1 transition-all h-full duration-200 p-4 space-y-4 bg-white border border-[#E9ECEF] rounded-2xl">
        <DashboardHeader />
        <div 
          className="overflow-y-auto"
          style={{
            scrollbarWidth: 'none',        // Firefox
            msOverflowStyle: 'none',       // IE 10+
            maxHeight: 'calc(100% - 4rem)'
          }}
        >
          {children}
        </div>

      </main>
    </div>
  )
}