import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axiosClient'
import AnalyticCard from '@/components/dashboard/analytic-card'
import { Calendar, Hash, ShieldEllipsis, UserRoundCheck } from "lucide-react";
import DonutChart from '@/components/dashboard/donut-chart';
import FindingsTable from './_services/components/FindingsTable'

// API types
type Totals = {
  total_findings: number;
  total_open: number;
  total_closed: number;
  awaiting_reviews: number;
  total_critical: number;
  total_high: number;
  total_medium: number;
  total_low: number;
};
type OrgRow = {
  id: number;
  name: string;
  business_email: string;
  total_findings: number;
  total_open_findings: number;
  total_closed_findings: number;
};
type FindingsOverviewCore = { totals: Totals; organizations: OrgRow[] }
type FindingsOverviewResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: FindingsOverviewCore;
}

const Findings = () => {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, error } = useQuery<FindingsOverviewResponse>({
    queryKey: ['findings-overview', page],
    queryFn: async () => {
      const res = await api.get(`/core/overview/findings/?page=${page}`)
      return res.data
    },
    staleTime: 60_000,
  })

  const totals: Totals = data?.results?.totals ?? {
    total_findings: 0,
    total_open: 0,
    total_closed: 0,
    awaiting_reviews: 0,
    total_critical: 0,
    total_high: 0,
    total_medium: 0,
    total_low: 0,
  }

  const organizations: OrgRow[] = useMemo(
    () => data?.results?.organizations ?? [],
    [data?.results?.organizations]
  )
  const totalCount = data?.count ?? 0
  const rowsPerPage = useMemo(() => organizations.length || 10, [organizations])
  const totalPages = rowsPerPage ? Math.max(1, Math.ceil(totalCount / rowsPerPage)) : 1

  if (error) {
    return <div className="p-4 text-sm text-red-600">Failed to load findings.</div>
  }

  return (
    <div className='space-y-4'>
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
        <AnalyticCard title="Total Findings" value={(totals.total_findings ?? 0).toString()} icon={<ShieldEllipsis size={25} />} />
        <AnalyticCard title="Open Findings" value={(totals.total_open ?? 0).toString()} icon={<Hash size={25} />} />
        <AnalyticCard title="Closed Findings" value={(totals.total_closed ?? 0).toString()} icon={<UserRoundCheck size={25} />} />
        <AnalyticCard title="Awaiting Reviews" value={(totals.awaiting_reviews ?? 0).toString()} icon={<Calendar size={25} />} />
      </div>

      {/* Severity tiles */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
          <span className="absolute top-3 right-3 flex items-center bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 inline-block"></span>
            Critical
          </span>
          <span className="text-2xl font-bold text-black">{totals.total_critical ?? 0}</span>
        </div>
        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min_h-[100px] min-h-[100px]">
          <span className="absolute top-3 right-3 flex items-center bg-[#FFF6ED] text-[#C4320A] text-xs font-medium px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-[#C4320A] rounded-full mr-2 inline-block"></span>
            High
          </span>
          <span className="text-2xl font-bold text-black">{totals.total_high ?? 0}</span>
        </div>
        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
          <span className="absolute top-3 right-3 flex items-center bg-[#FFFAEB] text-[#B54708] text-xs font-medium px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-[#B54708] rounded-full mr-2 inline-block"></span>
            Medium
          </span>
          <span className="text-2xl font-bold text-black">{totals.total_medium ?? 0}</span>
        </div>
        <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
          <span className="absolute top-3 right-3 flex items-center bg-[#ECFDF3] text-[#027A48] text-xs font-medium px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-[#027A48] rounded-full mr-2 inline-block"></span>
            Low
          </span>
          <span className="text-2xl font-bold text-black">{totals.total_low ?? 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="col-span-5">
          <div className='rounded-xl bg-[#F8F9FA] p-2'>
            {/* Pass organizations with pagination props */}
            <FindingsTable
              organizations={organizations}
              loading={isLoading || isFetching}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
        <div className="col-span-3">
          <div className='space-y-4 rounded-xl bg-[#F8F9FA] p-2'>
            <div className="flex items-center justify-between px-4 pt-2">
              <h5 className="text-lg font-medium">Findings</h5>
            </div>
            <DonutChart
              labels={["Open Findings", "Closed Findings"]}
              series={[totals.total_open ?? 0, totals.total_closed ?? 0]}
              colors={["#736DFF", "#2F3A61"]}
              totalLabel='Total findings'
              className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pe-4 h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Findings