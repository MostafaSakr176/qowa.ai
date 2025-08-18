"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartNoAxesColumn, RefreshCcwDot, Volleyball } from "lucide-react";
import React from "react";
import Chart from "react-apexcharts";

interface RevenueChartProps {
  dataSet: number[][][];
  className?: string;
  lineColors?: string[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  dataSet,
  className,
  lineColors = ["#4338CA", "#A855F7"], // Default line colors
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      stacked: false,
      height: 350,
      zoom: { enabled: false },
      animations: { enabled: true, speed: 500 },
      toolbar: {
        show: true,
        tools: {
          download: false, // Hide the download option
        },
      },
    },
    colors: lineColors, // <-- Custom line colors here
    markers: { size: 0 },
    stroke: { width: 2 },
    // dataLabels: {
    //   enabled: true,
    //   // Use a custom formatter to wrap the value in a rounded "badge" style using SVG foreignObject
    //   // ApexCharts does not support true borderRadius, so we use background and borderRadius via HTML
    //   // This will render a rounded label with white background and colored text
    //   style: {
    //     fontSize: '12px',
    //     fontWeight: 600,
    //     colors: ["#4338CA", "#A855F7"],
    //   },
    //   background: {
    //     enabled: true,
    //     foreColor: '#fff',
    //     borderRadius: 10, // This makes the background rounded
    //     padding: 6,
    //     opacity: 1,
    //     borderWidth: 0,
    //     dropShadow: {
    //       enabled: false,
    //     },
    //   },
    //   formatter: function (val: number) {
    //     // Optionally, you can round the value to 2 decimals
    //     return val.toFixed(2);
    //   }
    // },
    yaxis: {
      labels: {
        style: { colors: lineColors[1] || "#A855F7" },
        offsetX: 0,
        formatter: (val: number) => (val / 10).toFixed(2),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip:{enabled:false}
    },
    xaxis: {
      type: "datetime",
      tickAmount: 8,
      min: new Date("01/01/2014").getTime(),
      max: new Date("01/20/2014").getTime()
    },
    tooltip: { shared: false },
    legend: { show: false },
    grid: {
      padding: {
          top: -20
      }
  },
  };

  const series = [
    { name: "Success", data: dataSet[0] },
    { name: "Faild", data: dataSet[1] },
  ];

  return (
    <div className="rounded-xl bg-[#F8F9FA] p-2">
      <div className="flex items-center justify-between px-4 pb-2">
        <h5 className="text-lg font-medium">Retained Users’ Revenue</h5>
        <div className="w-48">
          <Select defaultValue="last_month">
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_day">Last Day</SelectItem>
              <SelectItem value="last_month" >Last Month</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div id="chart" className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
          {/* Total Revenue */}
          <div className="flex items-center border-e border-[#E9ECEF] px-6 min-w-[220px]">
            <div className="flex-shrink-0 mr-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F9FA]">
                {/* Icon: Bar Chart */}
                <ChartNoAxesColumn size={20} />
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#6B7280] font-medium">Total Revenue</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-[#222]">$96,000.00</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">+5%</span>
              </div>
            </div>
          </div>
          {/* Success */}
          <div className="flex items-center border-e border-[#E9ECEF] px-6 min-w-[220px]">
            <div className="flex-shrink-0 mr-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F9FA]">
                {/* Icon: Success (Steering wheel) */}
                <Volleyball size={20} />
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#6B7280] font-medium">Success</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-[#222]">$24,000.00</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">-3%</span>
              </div>
            </div>
          </div>
          {/* Failed */}
          <div className="flex items-center px-6 min-w-[220px]">
            <div className="flex-shrink-0 mr-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F9FA]">
                {/* Icon: Success (Steering wheel) */}
                <RefreshCcwDot size={20} />
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#6B7280] font-medium">Faild</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-[#222]">$24,000.00</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">-3%</span>
              </div>
            </div>
          </div>
        </div>
        <Chart options={options} series={series} type="line" height={200} />
      </div>
    </div>

  );
};

export default RevenueChart;
