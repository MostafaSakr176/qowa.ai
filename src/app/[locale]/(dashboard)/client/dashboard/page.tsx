"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import RevenueChart from "@/components/dashboard/scans-chart";
import DonutChart from "@/components/dashboard/donut-chart";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import { Loader2 } from "lucide-react";

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
  ],
];

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#A78BFA";

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="shadow-none p-2 pb-0 bg-[#F8F9FA] border-0 gap-0">
      <CardContent className="px-4 py-3 border-1 bg-white rounded-lg mb-0 flex items-center justify-between">
        <div>
          <div className="font-medium text-[#343A40]">{title}</div>
          <div className=" text-2xl font-semibold">{value}</div>
        </div>
        <span className="w-10">{icon}</span>
      </CardContent>
      <div className="py-3 px-2 flex items-center justify-between gap-1 text-xs text-[#343A40]">
        {hint}
        <ArrowRight size={24} className="opacity-60" />
      </div>
    </Card>
  );
}

/* API types */
interface GeneralSummaryResponse {
  total_scans: number;
  total_findings: number;
  total_users: number;
  in_progress_scans: number;
  completed_scans: number;
  open_findings: number;
  closed_findings: number;
  findings_by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function DashboardOverview() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const { data: stats, isLoading, isFetching, error, refetch } = useQuery<
    GeneralSummaryResponse
  >({
    queryKey: ["client-general-summary"],
    queryFn: async () => {
      const res = await api.get<GeneralSummaryResponse>(
        "/core/client-overview/general_summary/"
      );
      return res.data;
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1300);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="mb-2 text-2xl font-semibold">Can&lsquo;t open on mobile</div>
        <div className="mb-6 text-center text-[#343A40]">
          The dashboard is not available on mobile devices. Please use a desktop
          or tablet.
        </div>
        <Button variant="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4">Failed to load statistics.</div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>Retry</Button>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const totalUsers = stats?.total_users ?? (isLoading ? "..." : 0);
  const totalScans = stats?.total_scans ?? (isLoading ? "..." : 0);
  const totalFindings = stats?.total_findings ?? (isLoading ? "..." : 0);
  const inProgressScans = stats?.in_progress_scans ?? (isLoading ? "..." : 0);
  const openFindings = stats?.open_findings ?? 0;
  const closedFindings = stats?.closed_findings ?? 0;
  const sev = stats?.findings_by_severity ?? { critical: 0, high: 0, medium: 0, low: 0 };

  const series = [
    {
      name: "Critical",
      group: "critical",
      color: "#B42318",
      data: [44000, 55000, 41000],
    },
    {
      name: "High",
      group: "high",
      color: "#C4320A",
      data: [48000, 50000, 40000],
    },
    {
      name: "Medium",
      group: "medium",
      color: "#F79009",
      data: [13000, 36000, 20000],
    },
    {
      name: "Low",
      group: "low",
      color: "#027A48",
      data: [20000, 40000, 25000],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      zoom: { enabled: false },
      animations: { enabled: true, speed: 400 },
      toolbar: { show: true, tools: { download: false } },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { horizontal: false } },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    fill: { opacity: 1 },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          return `${val / 1000}K`;
        },
      },
    },
    legend: { show: false },
  };

  return (
    <div className="space-y-4">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={totalUsers}
          hint="From last month"
          icon={
            <div className="w-10 h-10 rounded bg-white border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          }
        />
        <StatCard
          title="In progress scans"
          value={inProgressScans}
          hint="From last month"
          icon={
            <div className="w-10 h-10 rounded bg-white border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 21V10" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 21V4" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          }
        />
        <StatCard
          title="Findings"
          value={totalFindings}
          hint="From last month"
          icon={
            <div className="w-10 h-10 rounded bg-white border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 11V6" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 17a1 1 0 100-2 1 1 0 000 2z" stroke="#343A40" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          }
        />
        <StatCard
          title="Total scans"
          value={totalScans}
          hint="From last month"
          icon={
            <div className="w-10 h-10 rounded bg-white border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M5 21h14" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 11h10" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          }
        />
      </div>

      {/* Middle charts row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl border border-[#E9ECEF]">
          <RevenueChart dataSet={dataSet} className="bg-white rounded-xl border border-[#E9ECEF] pt-4 pe-4 h-full" />
        </div>

        <div className="col-span-2 rounded-xl bg-[#F8F9FA] p-2">
          <div className="flex items-center justify-between px-4 pb-2">
            <h5 className="text-lg font-medium">Findings</h5>
          </div>
          <div className="bg-white rounded-xl border border-[#E9ECEF]">
            {isLoading ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" /> Loading...
              </div>
            ) : (
              <DonutChart
                labels={["Open Findings", "Closed Findings"]}
                series={[openFindings, closedFindings]}
                colors={[PURPLE, "#2F3A61"]}
                totalLabel="Total findings"
                height={350}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 rounded-xl bg-[#F8F9FA] p-2">
          <div className="flex items-center justify-between px-4 pb-2">
            <h5 className="text-lg font-medium">Findings</h5>
          </div>
          <div className="bg-white rounded-xl border border-[#E9ECEF]">
            <ReactApexChart options={options} series={series} height={350} />
          </div>
        </div>

        <div className="col-span-2 rounded-xl bg-[#F8F9FA] p-2">
          <div className="flex items-center justify-between px-4 pb-2">
            <h5 className="text-lg font-medium">Severity</h5>
          </div>
          <div className="bg-white rounded-xl border border-[#E9ECEF] p-4">
            {isLoading ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" /> Loading...
              </div>
            ) : (
              <DonutChart
                labels={["Critical", "High", "Medium", "Low"]}
                series={[sev.critical, sev.high, sev.medium, sev.low]}
                colors={["#B42318", "#C4320A", "#F79009", "#027A48"]}
                totalLabel="Total findings"
                chartStyle="full"
                height={250}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}