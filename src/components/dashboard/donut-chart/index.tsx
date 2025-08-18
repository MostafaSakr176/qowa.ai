"use client"

import ReactApexChart from "react-apexcharts";
import React from "react";

const LEGEND_LABELS = ["Open Findings", "Closed Findings"];
const LEGEND_COLORS = ["#4338CA", "#A855F7"];
const SERIES = [40, 60];

export default function ApexChart() {
    const total = SERIES.reduce((acc, val) => acc + val, 0);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'donut',
            animations: { enabled: true, speed: 1000 }
        },
        colors: LEGEND_COLORS,
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10,
                donut: {
                    size: '75%',
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
                            label: "Total Findings",
                            fontSize: "22px",
                            fontWeight: 600,
                            color: "#000",
                            formatter: function () {
                                return total.toString();
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // We'll render custom legend below
        },
        grid: {
            padding: {
                bottom: -90,
                top: -20
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

    // ApexCharts only shows donut.labels.total if you set labels in options and pass labels prop to the chart
    return (
        <div>
            <div id="chart" className="relative">
                <div className="flex justify-around gap-6 p-6">
                    {LEGEND_LABELS.map((label, idx) => (
                        <div key={label} className="flex flex-col items-start space-x-2">
                            <div className="flex items-center space-x-2">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 6,
                                        height: 20,
                                        borderRadius: "12px",
                                        backgroundColor: LEGEND_COLORS[idx],
                                    }}
                                />
                                <span className="text-lg text-neutral-950 font-medium">{label}</span>
                            </div>
                            <span className="text-xl text-neutral-700 font-semibold">
                                {SERIES[idx]}
                            </span>
                        </div>
                    ))}
                </div>
                <ReactApexChart
                    options={{ ...options, labels: LEGEND_LABELS }}
                    series={SERIES}
                    type="donut"
                    height={300}
                />
            </div>
        </div>
    );
}
