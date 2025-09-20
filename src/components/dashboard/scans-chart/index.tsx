"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartNoAxesColumn, RefreshCcwDot, Volleyball } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

interface ScansChartProps {
  // dataSet: [ [ [ts,value], ... ], [ [ts,value], ... ] ]
  dataSet: number[][][];
  className?: string;
  lineColors?: string[];
  seriesLabels?: [string, string]; // optional custom labels (e.g., ["Open Scans","Completed Scans"])
}

// Dynamically import Chart only on client side to avoid "window is not defined"
const Chart = React.lazy(() => import("react-apexcharts"));

const formatNum = (v: number) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
  return v.toString();
};

const ScansChart: React.FC<ScansChartProps> = ({
  dataSet,
  className,
  lineColors = ["#4338CA", "#A855F7"], // Default line colors
  seriesLabels = ["Completed Scans", "Open Scans"]
}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Derive dynamic axis bounds from dataset
  const { series, xMin, xMax, yMax, tickAmount } = useMemo(() => {
    const sA = dataSet[0] || [];
    const sB = dataSet[1] || [];
    const merged = [...sA, ...sB].filter(p => Array.isArray(p) && p.length === 2);
    const times = merged.map(p => p[0]);
    const vals = merged.map(p => p[1]);
    const xMin = times.length ? Math.min(...times) : Date.now();
    const xMax = times.length ? Math.max(...times) : Date.now();
    const rawMax = vals.length ? Math.max(...vals) : 0;
    const yMax = rawMax === 0 ? 1 : rawMax * 1.1; // add headroom
    const uniqueTs = Array.from(new Set(times));
    const tickAmount = Math.min(10, Math.max(2, uniqueTs.length));
    return {
      series: [
        { name: seriesLabels[0], data: sA },
        { name: seriesLabels[1], data: sB }
      ],
      xMin,
      xMax,
      yMax,
      tickAmount
    };
  }, [dataSet, seriesLabels]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      animations: { enabled: true, speed: 400 },
      toolbar: { show: true, tools: { download: false } }
    },
    colors: lineColors,
    markers: { size: 0 },
    stroke: { width: 2, curve: "smooth" },
    yaxis: {
      min: 0,
      max: yMax,
      decimalsInFloat: 0,
      labels: {
        style: { colors: "#6B7280" },
        formatter: (val: number) => formatNum(val)
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: true }
    },
    xaxis: {
      type: "datetime",
      min: xMin,
      max: xMax,
      tickAmount,
      labels: {
        hideOverlappingLabels: true,
        datetimeUTC: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    tooltip: {
      shared: true,
      x: { format: "yyyy-MM-dd" },
      y: {
        formatter: (val: number) => formatNum(val)
      }
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    grid: {
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { top: 0 }
    }
  };

  return (
    <div className="rounded-xl bg-[#F8F9FA] p-2">
      <div className="flex items-center justify-between px-4 pb-2">
        <h5 className="text-lg font-medium">Scan Intensity</h5>
        <div className="w-48">
          <Select defaultValue="this_month">
            <SelectTrigger>
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3m">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <div className="flex items-center border-e border-[#E9ECEF] px-6 min-w-[220px]">
            <div className="flex-shrink-0 mr-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#EEF2FF]">
                <ChartNoAxesColumn size={18} className="text-indigo-600" />
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#6B7280] font-medium">{seriesLabels[0]}</div>
              <div className="text-lg font-semibold text-[#222]">
                {formatNum(series[0].data.reduce((a: number, b: number[]) => a + (b[1] || 0), 0))}
              </div>
            </div>
          </div>
          <div className="flex items-center border-e border-[#E9ECEF] px-6 min-w-[220px]">
            <div className="flex-shrink-0 mr-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F3FF]">
                <Volleyball size={18} className="text-violet-600" />
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#6B7280] font-medium">{seriesLabels[1]}</div>
              <div className="text-lg font-semibold text-[#222]">
                {formatNum(series[1].data.reduce((a: number, b: number[]) => a + (b[1] || 0), 0))}
              </div>
            </div>
          </div>
          <div className="flex items-center px-6 min-w-[220px]">
            <div className="flex-shrink-0 mr-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F9FA]">
                <RefreshCcwDot size={18} className="text-slate-600" />
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#6B7280] font-medium">Data Points</div>
              <div className="text-lg font-semibold text-[#222]">
                {new Set([...series[0].data, ...series[1].data].map((p: number[]) => p[0])).size}
              </div>
            </div>
          </div>
        </div>

        {isClient && (
          <React.Suspense fallback={<div className="h-52 flex items-center justify-center text-sm">Loading chart...</div>}>
            <Chart options={options} series={series as {
              name: string;
              data: number[][];
            }[]} type="line" height={260} />
          </React.Suspense>
        )}
      </div>
    </div>
  );
};

export default ScansChart;
