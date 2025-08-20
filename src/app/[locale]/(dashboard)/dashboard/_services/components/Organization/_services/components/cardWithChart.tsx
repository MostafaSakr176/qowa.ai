"use client"
import React, { useEffect, useState, ReactNode } from 'react'

interface CardWithChartProps {
    dataSet: number[]; // Accepts any data format compatible with ApexCharts series
    className?: string;
    lineColors?: string[];
    title?: string | ReactNode;
    icon?: ReactNode;
    value?: string | number;
    percentage?: string | number;
    percentageIcon?: ReactNode;
    percentageColorClass?: string;
    percentageBgClass?: string;
    percentageLabel?: string;
    subtitle?: string | ReactNode;
    chartName?: string;
    chartHeight?: number;
    chartWidth?: number;
}

const Chart = React.lazy(() => import("react-apexcharts"));

const CardWithChart: React.FC<CardWithChartProps> = ({
    dataSet,
    className,
    lineColors = ["#4338CA"],
    title = "Total Customers",
    icon,
    value = "2,425",
    percentage = "0%",
    percentageIcon,
    percentageColorClass = "text-[#4CAF50]",
    percentageBgClass = "bg-[#E6F4EA]",
    percentageLabel = "last month",
    subtitle,
    chartName = "Customers",
    chartHeight = 80,
    chartWidth = 130,
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className={className} />;
    }

    const options: ApexCharts.ApexOptions = {
        chart: {
            id: 'customers-chart',
            sparkline: { enabled: true },
            toolbar: { show: false },
        },
        stroke: {
            curve: 'smooth',
            width: 1,
            colors: lineColors,
        },
        fill: {
            type: "gradient",
            colors: lineColors,
            gradient: {
                shade: 'light',
                type: "vertical",
                shadeIntensity: 1,
                gradientToColors: lineColors,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        
        markers: {
            size: [0, 0, 6, 0, 0, 0, 0],
            colors: ['#fff'],
            strokeColors: '#4CAF50',
            strokeWidth: 3,
            hover: { size: 8 }
        },
        tooltip: { enabled: false },
        grid: { show: false },
        xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { show: false },
    };

    // Accepts either a full ApexCharts series array or just data array
    const series = Array.isArray(dataSet) && dataSet.length > 0 && typeof dataSet[0] === "object" && "data" in dataSet[0]
        ? dataSet
        : [
            {
                name: chartName,
                data: dataSet
            }
        ];

    return (
        <div className={`rounded-xl shadow border border-[#E9ECEF] p-4 flex flex-col justify-between ${className || ""}`}>
            <div className="flex items-center gap-3">
                <div className={percentageBgClass + " rounded-full p-2"}>
                    {icon ? (
                        icon
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#E6F4EA" />
                            <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.5c-2.01 0-6 1.005-6 3v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1c0-1.995-3.99-3-6-3Z" fill="#4CAF50" />
                        </svg>
                    )}
                </div>
                <span className="text-gray-500 font-medium text-lg">{title}</span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`flex items-center gap-1 ${percentageBgClass} ${percentageColorClass} font-semibold px-1 py-1 rounded text-xs`}>
                            {percentageIcon ? (
                                percentageIcon
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-1">
                                    <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            {percentage}
                        </span>
                        <span className="text-gray-400 text-sm">{percentageLabel}</span>
                    </div>
                    {subtitle && <div className="text-gray-400 text-xs mt-1">{subtitle}</div>}
                </div>
                <div className="w-30 h-20 flex items-end">
                    {/* ApexCharts Line Chart */}
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={chartHeight}
                        width={chartWidth}
                    />
                </div>
            </div>
        </div>
    )
}

export default CardWithChart