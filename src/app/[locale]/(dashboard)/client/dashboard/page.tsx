"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Users,
  FolderKanban,
  FileSearch,
  LayoutGrid,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import RevenueChart from '@/components/dashboard/scans-chart';
import DonutChart from "@/components/dashboard/donut-chart";


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

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#A78BFA";
const DARK = "#0D0D12";

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
    <Card className="shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{title}</div>
          {icon}
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          {hint}
          <ArrowRight size={14} className="opacity-60" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const [isMobile, setIsMobile] = useState(false);
  const [range, setRange] = useState("last_month");
  const router = useRouter();

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
        <div className="mb-2 text-2xl font-semibold">
          Can&apos;t open on mobile
        </div>
        <div className="mb-6 text-center text-muted-foreground">
          The dashboard is not available on mobile devices. Please use a desktop
          or tablet.
        </div>
        <Button variant="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={4}
          hint="From last month"
          icon={<Users size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Projects"
          value={500}
          hint="From last month"
          icon={<FolderKanban size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Findings"
          value={1800}
          hint="From last month"
          icon={<FileSearch size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Total scans projects"
          value={60}
          hint="From last month"
          icon={<LayoutGrid size={18} className="text-muted-foreground" />}
        />
      </div>

      {/* Middle charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Line chart card */}
        <Card className="lg:col-span-2 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="capitalize">Projects</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Last Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Small metrics over chart */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Total scans</div>
                <div className="text-xl font-semibold">322</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">
                  In progress scans
                </div>
                <div className="text-xl font-semibold">22</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">
                  Completed scans
                </div>
                <div className="text-xl font-semibold">300</div>
              </div>
            </div>
            <RevenueChart dataSet={dataSet} className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pt-4 pe-4 h-full" />

          </CardContent>
        </Card>

        {/* Donut chart card */}
        <DonutChart
          labels={["Open Findings", "Closed Findings"]}
          series={[12, 8]}
          colors={["#736DFF", "#2F3A61"]}
          totalLabel="Total findings"
        />
      </div>
    </div>
  );
}
