"use client";

import React from "react";
import Chart from "react-apexcharts";

interface AreaChartProps {
  dataSet: number[][][];
  className?: string;
  lineColors?: string[];
}

const AreaChart: React.FC<AreaChartProps> = ({
  dataSet,
  className,
  lineColors = ["#4338CA", "#A855F7"], // Default line colors
}) => {
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
      // Use a custom formatter to wrap the value in a rounded "badge" style using SVG foreignObject
      // ApexCharts does not support true borderRadius, so we use background and borderRadius via HTML
      // This will render a rounded label with white background and colored text
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ["#4338CA", "#A855F7"],
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 10, // This makes the background rounded
        padding: 6,
        opacity: 1,
        borderWidth: 0,
        dropShadow: {
          enabled: false,
        },
      },
      formatter: function (val: number) {
        // Optionally, you can round the value to 2 decimals
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
      <Chart options={options} series={series} type="area" height={385} />
    </div>
  );
};

export default AreaChart;
