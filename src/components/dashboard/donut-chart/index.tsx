"use client"

import React, { useEffect, useState } from "react";

// Dynamically import react-apexcharts only on the client side
const ReactApexChart = React.lazy(() => import("react-apexcharts"));

export interface SemiDonutChartProps {
    className?: string;
    series: number[];
    labels: string[];
    colors?: string[];
    totalLabel?: string;
    totalFormatter?: (series: number[]) => string;
    legend?: boolean; // show/hide custom legend
    height?: number;
}

const DEFAULT_COLORS = ["#4338CA", "#A855F7"];
const DEFAULT_TOTAL_LABEL = "Total";
const DEFAULT_HEIGHT = 300;

export default function SemiDonutChart({
    className,
    series,
    labels,
    colors = DEFAULT_COLORS,
    totalLabel = DEFAULT_TOTAL_LABEL,
    totalFormatter,
    legend = true,
    height = DEFAULT_HEIGHT,
}: SemiDonutChartProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const total = series.reduce((acc, val) => acc + val, 0);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'donut',
            animations: { enabled: true, speed: 1000 },
            toolbar: { show: false },
        },
        colors: colors,
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10,
                customScale:1,
                expandOnClick: false, // Disable click effect
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                            color: "#343A40"
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: totalLabel,
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#000",
                            formatter: function () {
                                if (typeof totalFormatter === "function") {
                                    return totalFormatter(series);
                                }
                                return total.toString();
                            }
                        }
                    }
                }
            }
        },
        stroke: { width: 5, curve: "smooth" },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // We'll render custom legend below if needed
        },
        grid: {
            padding: {
                bottom: -110,
                top: -20
            }
        },
        states: {
            active: {
                filter: {
                    type: 'none', // Remove any style when click on
                }
            },
            hover: {
                filter: {
                    type: 'none',
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
            }
        }]
    };

    // Avoid SSR "window is not defined" error by only rendering chart on client
    if (!isClient) {
        return <div />;
    }

    // ApexCharts only shows donut.labels.total if you set labels in options and pass labels prop to the chart
    return (
        <div id="chart" className={`relative ${className || ""}`}>
            {legend && (
                <div className="flex justify-around gap-6 p-6">
                    {labels.map((label, idx) => (
                        <div key={label} className="flex flex-col items-start space-x-2">
                            <div className="flex items-center space-x-2">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 6,
                                        height: 20,
                                        borderRadius: "12px",
                                        backgroundColor: colors[idx] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
                                    }}
                                />
                                <span className="text-lg text-neutral-950 font-medium">{label}</span>
                            </div>
                            <span className="text-xl text-neutral-700 font-semibold">
                                {series[idx]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <React.Suspense fallback={<div className={`h-[${height}px]`} />}>
                <ReactApexChart
                    options={{ ...options, labels }}
                    series={series}
                    type="donut"
                    height={height}
                />
            </React.Suspense>
        </div>
    );
}
