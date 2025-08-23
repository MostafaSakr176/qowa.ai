import AllScans from "@/components/dashboard/all-scans";
import AnalyticCard from "@/components/dashboard/analytic-card";
import DonutChart from "@/components/dashboard/donut-chart";
import AreaChart from "@/components/dashboard/line-chart";
import { Calendar, CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users } from "lucide-react";

const GeneralSummary = () => {

    const dataSet = [
        [
            [new Date("01/01/2014").getTime(), 50],
            [new Date("01/03/2014").getTime(), 70],
            [new Date("01/05/2014").getTime(), 90],
            [new Date("01/08/2014").getTime(), 50],
            [new Date("01/11/2014").getTime(), 70],
            [new Date("01/14/2014").getTime(), 90],
            [new Date("01/16/2014").getTime(), 50],
            [new Date("01/20/2014").getTime(), 70],
            [new Date("01/22/2014").getTime(), 90],
            [new Date("01/25/2014").getTime(), 50],
            [new Date("01/26/2014").getTime(), 70],
            [new Date("01/29/2014").getTime(), 90],
        ],
        [
            [new Date("01/01/2014").getTime(), 20],
            [new Date("01/02/2014").getTime(), 60],
            [new Date("01/04/2014").getTime(), 40],
            [new Date("01/06/2014").getTime(), 20],
            [new Date("01/08/2014").getTime(), 70],
            [new Date("01/09/2014").getTime(), 40],
            [new Date("01/11/2014").getTime(), 90],
            [new Date("01/13/2014").getTime(), 30],
            [new Date("01/15/2014").getTime(), 40],
            [new Date("01/18/2014").getTime(), 70],
            [new Date("01/21/2014").getTime(), 90],
            [new Date("01/22/2014").getTime(), 99],

        ]
    ];

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<ScanLine size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<ShieldEllipsis size={25} />} />
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<Users size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<Users size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Hash size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<UserRoundCheck size={25} />} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="col-span-5 space-y-4">
                    <div className="bg-[#F8F9FA] rounded-md p-2 space-y-3">
                        <h6 className="text-xl font-bold">Findings</h6>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                                <span className="absolute top-3 right-3 flex items-center bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 inline-block"></span>
                                    Critical
                                </span>
                                <span className="text-2xl font-bold text-black">990</span>
                            </div>
                            <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                                <span className="absolute top-3 right-3 flex items-center bg-[#FFF6ED] text-[#C4320A] text-xs font-medium px-3 py-1 rounded-full">
                                    <span className="w-2 h-2 bg-[#C4320A] rounded-full mr-2 inline-block"></span>
                                    High
                                </span>
                                <span className="text-2xl font-bold text-black">500</span>
                            </div>
                            <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                                <span className="absolute top-3 right-3 flex items-center bg-[#FFFAEB] text-[#B54708] text-xs font-medium px-3 py-1 rounded-full">
                                    <span className="w-2 h-2 bg-[#B54708] rounded-full mr-2 inline-block"></span>
                                    Medium
                                </span>
                                <span className="text-2xl font-bold text-black">990</span>
                            </div>
                            <div className="bg-white w-full rounded-xl border border-[#E9ECEF] shadow-sm flex items-center pt-12 pb-6 px-4 relative min-h-[100px]">
                                <span className="absolute top-3 right-3 flex items-center bg-[#ECFDF3] text-[#027A48] text-xs font-medium px-3 py-1 rounded-full">
                                    <span className="w-2 h-2 bg-[#027A48] rounded-full mr-2 inline-block"></span>
                                    Low
                                </span>
                                <span className="text-2xl font-bold text-black">990</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <AreaChart dataSet={dataSet} className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pt-4 pe-4" />
                    </div>
                </div>
                <div className="col-span-3 space-y-4">
                    <div className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF]">
                        <DonutChart labels={["Open Findings","Closed Findings"]} series={[69,40]} colors={["#736DFF","#2F3A61"]} totalLabel='Total findings' />
                    </div>
                    <div className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF]">
                        <AllScans />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralSummary