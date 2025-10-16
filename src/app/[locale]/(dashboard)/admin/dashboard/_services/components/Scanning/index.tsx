"use client"

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";

import AnalyticCard from "@/components/dashboard/analytic-card";
import ScansChart from "@/components/dashboard/scans-chart";
import DonutChart from "@/components/dashboard/donut-chart";
import OrganizationsTable from "./_services/components/OrganizationsTable";
import {
  Calendar,
  ScanLine,
  ShieldEllipsis,
  Activity,
  Flame,
  AlertTriangle,
  Triangle,
  Circle,
} from "lucide-react";

// -------------------- Types --------------------
interface AppTypeItem {
  app_type: "web" | "mobile" | "infrastructure" | "api";
  total: number;
}
interface SeverityItem {
  severity: "low" | "medium" | "high" | "critical";
  total: number;
}
interface StatusItem {
  status: string;
  total: number;
}
interface DailyScansDay {
  open: number;
  completed: number;
}
interface OrganizationItem {
  id: number;
  name: string;
  business_email: string;
  first_scan_date: string | null;
  total_scans: number;
  total_completed_scans: number;
}
interface ScanningStatsCore {
  total_scans: number;
  scheduled_scans: number;
  running_scans: number;
  scans_by_app_type: AppTypeItem[];
  findings_by_severity: SeverityItem[];
  scans_by_status: StatusItem[];
  daily_scans_this_month: Record<string, DailyScansDay>;
  organizations: OrganizationItem[];
}
interface ScanningApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ScanningStatsCore;
}

// -------------------- Fetch Hook --------------------
const useScanningStats = () =>
  useQuery<ScanningApiResponse>({
    queryKey: ["scanning-stats"],
    queryFn: async () => {
      const res = await api.get("/core/overview/scanning/");
      return res.data;
    },
    staleTime: 60_000,
  });

// -------------------- Helpers --------------------
const severityOrder: SeverityItem["severity"][] = ["critical", "high", "medium", "low"];
const severityColorMap: Record<
  SeverityItem["severity"],
  { badge: string; dot: string; text: string; cardIcon: React.ReactNode }
> = {
  critical: {
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
    text: "text-red-600",
    cardIcon: <Flame size={25} />,
  },
  high: {
    badge: "bg-[#FFF6ED] text-[#C4320A]",
    dot: "bg-[#C4320A]",
    text: "text-[#C4320A]",
    cardIcon: <AlertTriangle size={25} />,
  },
  medium: {
    badge: "bg-[#FFFAEB] text-[#B54708]",
    dot: "bg-[#B54708]",
    text: "text-[#B54708]",
    cardIcon: <Triangle size={25} />,
  },
  low: {
    badge: "bg-[#ECFDF3] text-[#027A48]",
    dot: "bg-[#027A48]",
    text: "text-[#027A48]",
    cardIcon: <Circle size={25} />,
  },
};

const Scanning: React.FC = () => {
  const { data, isLoading, error } = useScanningStats();
  const stats = data?.results;

  // Derived totals
  const severityTotals = useMemo(() => {
    const base: Record<SeverityItem["severity"], number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    stats?.findings_by_severity.forEach((s) => {
      base[s.severity] = s.total;
    });
    return base;
  }, [stats]);

  const totalFindings = useMemo(
    () => Object.values(severityTotals).reduce((a, b) => a + b, 0),
    [severityTotals]
  );

  // Scan status bars (dynamic)
  const scanStatusBars = useMemo(() => {
    if (!stats) return [];
    const total = stats.scans_by_status.reduce((a, b) => a + b.total, 0) || 1;
    const MAX_SEGMENTS = 40;
    const colorMap: Record<string, { active: string; inactive: string; labelColor: string }> = {
      open: { active: "bg-[#22B573]", inactive: "bg-[#B2E5D6]", labelColor: "text-[#22B573]" },
      pending: { active: "bg-[#FFD600]", inactive: "bg-[#FFF6B2]", labelColor: "text-[#FFD600]" },
      finished: { active: "bg-[#2563EB]", inactive: "bg-[#BFDBFE]", labelColor: "text-[#2563EB]" },
      completed: { active: "bg-[#2563EB]", inactive: "bg-[#BFDBFE]", labelColor: "text-[#2563EB]" },
      closed: { active: "bg-[#64748B]", inactive: "bg-[#CBD5E1]", labelColor: "text-[#64748B]" },
    };
    return stats.scans_by_status.map((s) => {
      const pct = s.total / total;
      const segments = Math.max(0, Math.round(pct * MAX_SEGMENTS));
      const colors = colorMap[s.status] || {
        active: "bg-indigo-500",
        inactive: "bg-indigo-200",
        labelColor: "text-indigo-500",
      };
      return { ...s, segments, colors };
    });
  }, [stats]);

  // Daily scans -> chart dataset (OPEN vs COMPLETED) using API response (daily_scans_this_month)
  // ScansChart expects: dataSet = [ [ [timestamp,value], ... ], [ [timestamp,value], ... ] ]
  // (same shape previously used with random data)
  const chartDataset = useMemo(() => {
    if (!stats || !stats.daily_scans_this_month) return [];

    const entries = Object.entries(stats.daily_scans_this_month)
      .filter(([, v]) => v && typeof v.open === "number" && typeof v.completed === "number")
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const openSeries: [number, number][] = [];
    const completedSeries: [number, number][] = [];

    entries.forEach(([dateStr, val]) => {
      const ts = new Date(dateStr + "T00:00:00Z").getTime(); // normalize to midnight UTC
      openSeries.push([ts, val.open]);
      completedSeries.push([ts, val.completed]);
    });

    return [openSeries, completedSeries];
  }, [stats]);

  // Severity donut
  const severityDonutSeries = useMemo(
    () => severityOrder.map((sev) => severityTotals[sev]),
    [severityTotals]
  );

  const severityDonutLabels = ["Critical", "High", "Medium", "Low"];
  const severityDonutColors = ["#DF1C41", "#FD914D", "#FACC15", "#16A34A"];

  // Scans by app type (optional future use)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse border border-gray-200/60"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div className="col-span-5">
            <div className="h-80 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          </div>
            <div className="col-span-3 space-y-4">
              <div className="h-96 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div className="col-span-5">
            <div className="h-96 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          </div>
          <div className="col-span-3">
            <div className="h-72 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return <div className="text-sm text-red-600">Failed to load scanning statistics.</div>;
  }

  console.log(chartDataset);
  

  return (
    <div className="space-y-4">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticCard title="Total Scans" value={stats.total_scans.toString()} icon={<ScanLine size={25} />} />
        <AnalyticCard
          title="Scheduled Scans"
          value={stats.scheduled_scans.toString()}
          icon={<Calendar size={25} />}
        />
        <AnalyticCard
          title="Running Scans"
          value={stats.running_scans.toString()}
          icon={<Activity size={25} />}
        />
        <AnalyticCard
          title="Total Findings"
          value={totalFindings.toString()}
          icon={<ShieldEllipsis size={25} />}
        />
        <AnalyticCard
          title="Critical"
          value={severityTotals.critical.toString()}
          icon={severityColorMap.critical.cardIcon}
        />
        <AnalyticCard title="High" value={severityTotals.high.toString()} icon={severityColorMap.high.cardIcon} />
        <AnalyticCard
          title="Medium"
          value={severityTotals.medium.toString()}
          icon={severityColorMap.medium.cardIcon}
        />
        <AnalyticCard title="Low" value={severityTotals.low.toString()} icon={severityColorMap.low.cardIcon} />
      </div>

      {/* Chart + Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="col-span-5">
          <ScansChart
            dataSet={chartDataset}
            // If your ScansChart supports custom labels, uncomment / add prop as implemented:
            // seriesLabels={["Open Scans", "Completed Scans"]}
            className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pt-4 pe-4 h-full"
          />
        </div>
        <div className="col-span-3 space-y-4">
          <div className="rounded-xl bg-[#F8F9FA] p-2 h-full flex flex-col">
            <div className="flex items-center justify-between px-4 pt-2 pb-4">
              <h5 className="text-lg font-medium">Scans by Status</h5>
              <h5 className="text-lg font-medium">
                {stats.scans_by_status.reduce((a, b) => a + b.total, 0)}
              </h5>
            </div>
            <div className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] p-4 flex-1 overflow-y-auto">
              {scanStatusBars.map((s) => (
                <div key={s.status} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[18px] font-medium text-[#222] capitalize">{s.status}</span>
                    <span className={`text-[18px] font-semibold ${s.colors.labelColor}`}>{s.total}</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span
                        key={i}
                        className={`inline-block h-8 w-2 rounded-full transition-colors duration-200 ${
                          i < s.segments ? s.colors.active : s.colors.inactive
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {!scanStatusBars.length && (
                <div className="text-sm text-muted-foreground">No status data.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table + Severity Donut */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="col-span-5">
          <div className="rounded-xl bg-[#F8F9FA] p-2">
            {/* Pass organizations from API to the table */}
            <OrganizationsTable organizations={stats.organizations} />
          </div>
        </div>
        <div className="col-span-3">
          <div className="space-y-4 rounded-xl bg-[#F8F9FA] p-2">
            <div className="flex items-center justify-between px-4 pt-2">
              <h5 className="text-lg font-medium">Findings Severity</h5>
            </div>
            <DonutChart
              labels={severityDonutLabels}
              series={severityDonutSeries}
              colors={severityDonutColors}
              totalLabel="Total Findings"
              className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pe-4 h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanning;