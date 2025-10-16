"use client"

import { useQuery } from "@tanstack/react-query";
import AllScans, { BarDatum } from "@/components/dashboard/all-scans";
import AnalyticCard from "@/components/dashboard/analytic-card";
import DonutChart from "@/components/dashboard/donut-chart";
import { Calendar, CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users } from "lucide-react";
import api from "@/lib/axiosClient";
import React, { useMemo } from "react";

interface SeverityItem { severity: "critical" | "high" | "medium" | "low"; total: number }
interface StatusItem { status: "open" | "closed"; total: number }
interface AppTypeItem { app_type: "web" | "mobile" | "infrastructure" | "api"; total: number }

interface GeneralSummaryResponse {
  total_revenue: number;
  total_scans: number;
  scheduled_scans: number;
  total_findings: number;
  total_clients: number;
  clients_this_month: number;
  clients_today: number;
  clients_with_scans: number;
  findings_by_severity: SeverityItem[];
  findings_by_status: StatusItem[];
  scans_by_app_type: AppTypeItem[];
}

const currency = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const GeneralSummary: React.FC = () => {
  const { data, isLoading, error } = useQuery<GeneralSummaryResponse>({
    queryKey: ["general-summary"],
    queryFn: async () => {
      const res = await api.get("/core/overview/general_summary/");
      return res.data;
    },
    staleTime: 60_000
  });

  const summary = data;

  const severities = useMemo(() => {
    if (!summary) return [];
    const order: SeverityItem["severity"][] = ["critical", "high", "medium", "low"];
    const colorClasses: Record<string, { badge: string; dot: string; text: string }> = {
      critical: { badge: "bg-red-50 text-red-600", dot: "bg-red-500", text: "text-red-600" },
      high: { badge: "bg-[#FFF6ED] text-[#C4320A]", dot: "bg-[#C4320A]", text: "text-[#C4320A]" },
      medium: { badge: "bg-[#FFFAEB] text-[#B54708]", dot: "bg-[#B54708]", text: "text-[#B54708]" },
      low: { badge: "bg-[#ECFDF3] text-[#027A48]", dot: "bg-[#027A48]", text: "text-[#027A48]" }
    };
    const map: Record<string, number> = {};
    summary.findings_by_severity.forEach(s => { map[s.severity] = s.total; });
    return order.map(sev => ({
      severity: sev,
      total: map[sev] ?? 0,
      classes: colorClasses[sev]
    }));
  }, [summary]);

  const statusData = useMemo(() => {
    const open = summary?.findings_by_status.find(s => s.status === "open")?.total ?? 0;
    const closed = summary?.findings_by_status.find(s => s.status === "closed")?.total ?? 0;
    return { open, closed };
  }, [summary]);

  const scansBarData: BarDatum[] = useMemo(() => {
    if (!summary) return [];
    const labelMap: Record<AppTypeItem["app_type"], string> = {
      web: "Web",
      mobile: "Mobile",
      infrastructure: "Infrastructure",
      api: "API"
    };
    return summary.scans_by_app_type.map(i => ({
      label: labelMap[i.app_type],
      value: i.total
    }));
  }, [summary]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {/* LEFT SIDE */}
            <div className="col-span-5 space-y-4">
              {/* Stats cards grid (8) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse border border-gray-200/60"
                  />
                ))}
              </div>
              {/* Severity section */}
              <div className="bg-[#F8F9FA] dark:bg-neutral-900 rounded-md p-2 space-y-3">
                <div className="h-5 w-40 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 dark:bg-neutral-800 rounded-xl border border-[#E9ECEF] dark:border-neutral-700 shadow-sm min-h-[100px] flex items-center justify-center"
                    >
                      <div className="h-6 w-10 bg-gray-100 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          {/* RIGHT SIDE */}
          <div className="col-span-3 space-y-4">
            <div className="bg-gray-200 dark:bg-neutral-800 rounded-xl border border-[#E9ECEF] dark:border-neutral-700 h-64 animate-pulse" />
            <div className="bg-gray-200 dark:bg-neutral-800 rounded-xl border border-[#E9ECEF] dark:border-neutral-700 h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">Failed to load general summary.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="col-span-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4" >
            <AnalyticCard title="Total Revenue" value={currency(summary?.total_revenue ?? 0)} icon={<CircleDollarSign size={25} />} />
            <AnalyticCard title="All Scans" value={(summary?.total_scans ?? 0).toString()} icon={<ScanLine size={25} />} />
            <AnalyticCard title="Scheduled Scans" value={(summary?.scheduled_scans ?? 0).toString()} icon={<Calendar size={25} />} />
            <AnalyticCard title="Total Findings" value={(summary?.total_findings ?? 0).toString()} icon={<ShieldEllipsis size={25} />} />
            <AnalyticCard title="Total Clients" value={(summary?.total_clients ?? 0).toString()} icon={<Users size={25} />} />
            <AnalyticCard title="Clients This Month" value={(summary?.clients_this_month ?? 0).toString()} icon={<Users size={25} />} />
            <AnalyticCard title="Clients Today" value={(summary?.clients_today ?? 0).toString()} icon={<Hash size={25} />} />
            <AnalyticCard title="Clients w/ Scans" value={(summary?.clients_with_scans ?? 0).toString()} icon={<UserRoundCheck size={25} />} />
          </div>
          <div className="bg-[#F8F9FA] rounded-md p-2 space-y-3">
            <h6 className="text-xl font-bold">Findings</h6>
            <div className="grid grid-cols-4 gap-4">
              {severities.map(s => (
                <div
                  key={s.severity}
                  className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]"
                >
                  <span className={`absolute top-3 right-3 flex items-center text-xs font-medium px-3 py-1 rounded-full ${s.classes.badge}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 inline-block ${s.classes.dot}`}></span>
                    {s.severity.charAt(0).toUpperCase() + s.severity.slice(1)}
                  </span>
                  <span className="text-2xl font-bold text-black">{s.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF]">
            <DonutChart
              labels={["Open Findings", "Closed Findings"]}
              series={[statusData.open, statusData.closed]}
              colors={["#736DFF", "#2F3A61"]}
              totalLabel="Total findings"
            />
          </div>
          <div className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF]">
            <AllScans
              title="Scans by App Type"
              data={scansBarData}
              colors={["#5B5BD6", "#6C6CDB", "#7D7DE0", "#8E8EE5"]}
              valueFormatter={(v) => v.toLocaleString()}
              barHeight={40}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralSummary;