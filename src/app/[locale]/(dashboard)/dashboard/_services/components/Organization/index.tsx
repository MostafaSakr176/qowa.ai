"use client"
import React from 'react'
import CardWithChart from './_services/components/cardWithChart'
import { Calendar, CircleDollarSign, ScanLine, ShieldEllipsis, TrendingUp, Users } from 'lucide-react'
import AnalyticCard from '@/components/dashboard/analytic-card'
import WorldMap from './_services/components/worldMap'
const Organization = () => {
    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-4 gap-4'>
                <CardWithChart
                    dataSet={[5, 10, 12, 19, 13, 16, 20]}
                    title="Total Customer"
                    lineColors={["#0CAF60"]}
                    percentage={"15%"}
                    icon={<Users size={20} color='#0CAF60' />}
                    percentageLabel='last month'
                    percentageIcon={<TrendingUp size={15} />}
                />
                <CardWithChart
                    dataSet={[5, 10, 12, 19, 13, 16, 20]}
                    title="Total Customer"
                    lineColors={["#0CAF60"]}
                    percentage={"15%"}
                    icon={<Users size={20} color='#0CAF60' />}
                    percentageLabel='last month'
                    percentageIcon={<TrendingUp size={15} />}
                />
                <CardWithChart
                    dataSet={[5, 10, 12, 19, 13, 16, 20]}
                    title="Total Customer"
                    lineColors={["#0CAF60"]}
                    percentage={"15%"}
                    icon={<Users size={20} color='#0CAF60' />}
                    percentageLabel='last month'
                    percentageIcon={<TrendingUp size={15} />}
                />
                <CardWithChart
                    dataSet={[5, 10, 12, 19, 13, 16, 20]}
                    title="Total Customer"
                    lineColors={["#0CAF60"]}
                    percentage={"15%"}
                    icon={<Users size={20} color='#0CAF60' />}
                    percentageLabel='last month'
                    percentageIcon={<TrendingUp size={15} />}
                />
                <AnalyticCard title="Total Revenue" value="$62,302" icon={<CircleDollarSign size={25} />} />
                <AnalyticCard title="All scans" value="50000" icon={<ScanLine size={25} />} />
                <AnalyticCard title="Schedule Scans" value="200" icon={<Calendar size={25} />} />
                <AnalyticCard title="Total Findings" value="50000" icon={<ShieldEllipsis size={25} />} />
            </div>

            <div className='rounded-xl shadow border border-[#E9ECEF] p-4'>
                <WorldMap />
            </div>
        </div>

    )
}

export default Organization