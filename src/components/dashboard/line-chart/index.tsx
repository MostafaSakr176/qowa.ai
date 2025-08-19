"use client";

import React, { useEffect, useState } from "react";

interface AreaChartProps {
  dataSet: number[][][];
  className?: string;
  lineColors?: string[];
}

// Dynamically import react-apexcharts only on the client
const DynamicChart = React.lazy(() => import("react-apexcharts"));

const AreaChart: React.FC<AreaChartProps> = ({
  dataSet,
  className,
  lineColors = ["#4338CA", "#A855F7"], // Default line colors
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only set to true on client side
    setIsClient(true);
  }, []);

  // Avoid SSR "window is not defined" error by only rendering chart on client
  if (!isClient) {
    return <div className={className} />;
  }

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: 350,
      zoom: { enabled: false },
      animations: { enabled: true, speed: 500 }
    },
    colors: lineColors, // <-- Custom line colors here
    markers: { size: [0,0], shape:"diamond" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ["#4338CA", "#A855F7"],
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 10,
        padding: 6,
        opacity: 1,
        borderWidth: 0,
        dropShadow: {
          enabled: false,
        },
      },
      formatter: function (val: number) {
        return val.toFixed(2);
      }
    },
    yaxis: {
      labels: {
        style: { colors: lineColors[1] || "#A855F7" },
        offsetX: 0,
        formatter: (val: number) => (val / 10).toFixed(2),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 8,
      min: new Date("01/01/2014").getTime(),
      max: new Date("01/20/2014").getTime()
    },
    title: {
      text: "Average rating",
      align: "left",
      style: { fontFamily: 'Inter, sans-serif', fontSize: "18px", fontWeight: 500 },
      offsetX: 14,
    },
    tooltip: { shared: true },
    legend: { position: "top", horizontalAlign: "right", offsetX: -10 },
  };

  const series = [
    { name: "PRODUCT A", data: dataSet[0] },
    { name: "PRODUCT B", data: dataSet[1] },
  ];

  return (
    <div id="chart" className={`${className}`}>
      <React.Suspense fallback={<div>Loading chart...</div>}>
        <DynamicChart options={options} series={series} type="area" height={385} />
      </React.Suspense>
    </div>
  );
};

export default AreaChart;
