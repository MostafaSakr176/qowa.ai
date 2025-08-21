import AnalyticCard from "@/components/dashboard/analytic-card";
import AreaChart from "@/components/dashboard/line-chart";
import { Calendar, CircleDollarSign, Hash, ScanLine, ShieldEllipsis, UserRoundCheck, Users } from "lucide-react";
import SupportTable from "./_services/components/PaymentsTable";

const Support = () => {

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
        <div className="space-y-6">
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
            <AreaChart dataSet={dataSet} className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] pt-4 pe-4" />
            <SupportTable />
        </div>
    )
}

export default Support