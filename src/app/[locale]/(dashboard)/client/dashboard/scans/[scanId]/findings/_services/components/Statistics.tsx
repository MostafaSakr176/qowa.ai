import DonutChart from '@/components/dashboard/donut-chart'
import React from 'react'

// ----- Statistics Interfaces -----
export interface SeverityBreakdown {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

export interface StatusBreakdown {
    open: number;
    closed: number;
}

export interface FindingsStatistics {
    total_findings: number;
    severity_breakdown: SeverityBreakdown;
    status_breakdown: StatusBreakdown;
}

interface StatisticsProps {
    statisticsData?: FindingsStatistics | null;
}

const emptySeverity: SeverityBreakdown = { critical: 0, high: 0, medium: 0, low: 0 };
const emptyStatus: StatusBreakdown = { open: 0, closed: 0 };

const Statistics: React.FC<StatisticsProps> = ({ statisticsData }) => {
    const severity_breakdown = statisticsData?.severity_breakdown ?? emptySeverity;
    // const status_breakdown = statisticsData?.status_breakdown ?? emptyStatus;

    // Prepare donut data (open vs closed)
    const donutSeries = [severity_breakdown.critical, severity_breakdown.high,severity_breakdown.medium,severity_breakdown.low];
    const donutLabels = ["Critical", "High", "Medium", "Low"];

    return (
        <div>
            <div className='bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] mb-4'>
                <DonutChart
                    chartStyle='full'
                    labels={donutLabels}
                    showLegend={false}
                    series={donutSeries}
                        // Colors: open (blue), closed (dark)
                    colors={["#B42318", "#C4320A", "#F79009", "#027A48"]}
                    totalLabel={`Total findings`}
                />
            </div>
            <div className="space-y-4">
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#B42318]/10 text-[#B42318] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#B42318] rounded-full mr-2 inline-block"></span>
                        Critical
                    </span>
                    <span className="text-2xl font-bold text-black">{severity_breakdown.critical}</span>
                </div>
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#C4320A]/10 text-[#C4320A] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#C4320A] rounded-full mr-2 inline-block"></span>
                        High
                    </span>
                    <span className="text-2xl font-bold text-black">{severity_breakdown.high}</span>
                </div>
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#F79009]/10 text-[#F79009] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#F79009] rounded-full mr-2 inline-block"></span>
                        Medium
                    </span>
                    <span className="text-2xl font-bold text-black">{severity_breakdown.medium}</span>
                </div>
                <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-8 pb-4 px-4 relative min-h-[80px]">
                    <span className="absolute top-3 right-3 flex items-center bg-[#027A48]/10 text-[#027A48] text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-[#027A48] rounded-full mr-2 inline-block"></span>
                        Low
                    </span>
                    <span className="text-2xl font-bold text-black">{severity_breakdown.low}</span>
                </div>
            </div>
        </div>
    )
}

export default Statistics