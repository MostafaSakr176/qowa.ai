"use client"

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import CardWithChart from "./_services/components/cardWithChart";
import AnalyticCard from "@/components/dashboard/analytic-card";
import WorldMap from "./_services/components/worldMap";
import {
  Calendar,
  CircleDollarSign,
  TrendingUp,
  Users,
  UserPlus,
  UserCheck2,
  UserCog2,
} from "lucide-react";

type CountryCount = { country: string; total: number };

interface OrganizationsOverviewResponse {
  total_clients: number;
  clients_with_scans_this_month: number;
  clients_with_scans_change: number;    // % change vs previous period
  customers_this_month: number;
  customers_this_month_change: number;  // %
  customers_today: number;
  customers_today_change: number;       // %
  total_team_members: number;
  total_assigned_users: number;
  try_demo: number;
  subscriber_plans: number;
  organizations_by_country: CountryCount[];
}

const formatPct = (v?: number) => {
  if (v === undefined || v === null || isNaN(v)) return "—";
  const sign = v > 0 ? "+" : v < 0 ? "" : "";
  return `${sign}${v}%`;
};

const Organization: React.FC = () => {
  const { data, isLoading, error } = useQuery<OrganizationsOverviewResponse>({
    queryKey: ["organizations-overview"],
    queryFn: async () => {
      const res = await api.get("/core/overview/organizations/");
      return res.data;
    },
    staleTime: 60_000,
  });

  const mapLabels = useMemo(() => {
    const list = data?.organizations_by_country ?? [];
    // Convert to WorldMap customLabels shape: { Country: { label: "X org(s)" } }
    const obj: Record<string, { label: string }> = {};
    list.forEach((c) => {
      obj[c.country] = { label: `${c.total} org${c.total === 1 ? "" : "s"}` };
    });
    return obj;
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse border border-[#E9ECEF]" />
          ))}
        </div>
        <div className="rounded-xl shadow border border-[#E9ECEF] p-4">
          <div className="h-[420px] rounded-md bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load organization statistics.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cards with change percentages */}
        <CardWithChart
          dataSet={[5, 10, 12, 19, 13, 16, 20]}
          title="Total Customers"
          lineColors={["#0CAF60"]}
          value={data?.total_clients ?? 0}
          percentage={formatPct(data?.customers_this_month_change)}
          icon={<Users size={20} color="#0CAF60" />}
          percentageLabel="last month"
          percentageIcon={<TrendingUp size={15} />}
        />
        <CardWithChart
          dataSet={[5, 9, 11, 17, 12, 18, 22]}
          title="Active Customers"
          lineColors={["#2563EB"]}
          value={data?.clients_with_scans_this_month ?? 0}
          percentage={formatPct(data?.clients_with_scans_change)}
          icon={<UserPlus size={20} color="#2563EB" />}
          percentageLabel="last month"
          percentageIcon={<TrendingUp size={15} />}
        />
        <CardWithChart
          dataSet={[3, 7, 10, 8, 11, 9, 12]}
          title="Customers Today"
          lineColors={["#F59E0B"]}
          value={data?.customers_this_month ?? 0}
          percentage={formatPct(data?.customers_this_month_change)}
          icon={<UserCheck2 size={20} color="#F59E0B" />}
          percentageLabel="last month"
          percentageIcon={<TrendingUp size={15} />}
        />
        <CardWithChart
          dataSet={[8, 12, 13, 16, 15, 18, 21]}
          title="Today Join"
          lineColors={["#7C3AED"]}
          value={data?.customers_today ?? 0}
          percentage={formatPct(data?.customers_today_change)}
          icon={<Users size={20} color="#7C3AED" />}
          percentageLabel="last month"
          percentageIcon={<TrendingUp size={15} />}
        />

        {/* Totals summary */}
        <AnalyticCard title="Team Members" value={(data?.total_team_members ?? 0).toString()} icon={<UserCog2 size={25} />} />
        <AnalyticCard title="Assigned Users" value={(data?.total_assigned_users ?? 0).toString()} icon={<UserCheck2 size={25} />} />
        <AnalyticCard title="Demo Trials" value={(data?.try_demo ?? 0).toString()} icon={<Calendar size={25} />} />
        <AnalyticCard title="Subscriber Plans" value={(data?.subscriber_plans ?? 0).toString()} icon={<CircleDollarSign size={25} />} />
      </div>

      <div className="rounded-xl shadow border border-[#E9ECEF] p-4">
        <WorldMap organizations_by_country={mapLabels} />
      </div>
    </div>
  );
};

export default Organization;