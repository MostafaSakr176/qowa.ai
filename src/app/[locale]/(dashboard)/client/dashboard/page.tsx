"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Users,
  FolderKanban,
  FileSearch,
  LayoutGrid,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import RevenueChart from '@/components/dashboard/scans-chart';
import DonutChart from "@/components/dashboard/donut-chart";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";


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

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#A78BFA";
const DARK = "#0D0D12";

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="shadow-none p-2 pb-0 bg-[#F8F9FA] border-0 gap-0">
      <CardContent className="px-4 py-3 border-1 bg-white rounded-lg mb-0 flex items-center justify-between">
        <div>
          <div className="font-medium text-[#343A40]">{title}</div>
          <div className=" text-2xl font-semibold">{value}</div>
        </div>
        <span className="w-10">{icon}</span>
      </CardContent>
      <div className="py-3 px-2 flex items-center justify-between gap-1 text-xs text-[#343A40]">
        {hint}
        <ArrowRight size={24} className="opacity-60" />
      </div>
    </Card>
  );
}

export default function DashboardOverview() {
  const [isMobile, setIsMobile] = useState(false);
  const [range, setRange] = useState("last_month");
  const router = useRouter();


    const series = [
      {
        name: 'Critical',
        group: 'critical',
        color: '#B42318',
        data: [44000, 55000, 41000],
      },
      {
        name: 'High',
        group: 'high',
        color: '#C4320A',
        data: [48000, 50000, 40000],
      },
      {
        name: 'Medium',
        group: 'medium',
        color: '#F79009',
        data: [13000, 36000, 20000],
      },
      {
        name: 'Low',
        group: 'low',
        color: '#027A48',
        data: [20000, 40000, 25000],
      },
    ];

    const options: ApexOptions = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        zoom: { enabled: false },
        animations: { enabled: true, speed: 400 },
        toolbar: { show: true, tools: { download: false } }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      dataLabels: {
        formatter: (val: number) => {
          return ''
        }
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun'
        ]
      },
      fill: {
        opacity: 1
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            return val / 1000 + 'K'
          }
        }
      },
      legend: {
        show: false,
        position: 'bottom',
        clusterGroupedSeriesOrientation: "vertical"
      }
    };

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1300);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="mb-2 text-2xl font-semibold">
          Can&apos;t open on mobile
        </div>
        <div className="mb-6 text-center text-[#343A40]">
          The dashboard is not available on mobile devices. Please use a desktop
          or tablet.
        </div>
        <Button variant="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={4}
          hint="From last month"
          icon={<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E9ECEF" />
            <path d="M24.3884 11L25.3913 11.9757C25.8393 12.4117 26.0633 12.6296 25.9844 12.8148C25.9056 13 25.5888 13 24.9552 13H17.1942C13.221 13 10 16.134 10 20C10 21.4872 10.4767 22.8662 11.2895 24" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.6116 29L14.6087 28.0243C14.1607 27.5883 13.9367 27.3704 14.0156 27.1852C14.0944 27 14.4112 27 15.0448 27H22.8058C26.779 27 30 23.866 30 20C30 18.5128 29.5233 17.1338 28.7105 16" stroke="#343A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          }
        />
        <StatCard
          title="Projects"
          value={500}
          hint="From last month"
          icon={<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E9ECEF" />
            <path opacity="0.12" d="M23 12.6C23 12.0399 23 11.7599 22.891 11.546C22.7951 11.3578 22.6422 11.2049 22.454 11.109C22.2401 11 21.9601 11 21.4 11L18.6 11C18.0399 11 17.7599 11 17.546 11.109C17.3578 11.2049 17.2049 11.3578 17.109 11.546C17 11.7599 17 12.0399 17 12.6L17 29H23L23 12.6Z" fill="black" />
            <path d="M17 15H12.6C12.0399 15 11.7599 15 11.546 15.109C11.3578 15.2049 11.2049 15.3578 11.109 15.546C11 15.7599 11 16.0399 11 16.6V27.4C11 27.9601 11 28.2401 11.109 28.454C11.2049 28.6422 11.3578 28.7951 11.546 28.891C11.7599 29 12.0399 29 12.6 29H17M17 29H23M17 29L17 12.6C17 12.0399 17 11.7599 17.109 11.546C17.2049 11.3578 17.3578 11.2049 17.546 11.109C17.7599 11 18.0399 11 18.6 11L21.4 11C21.9601 11 22.2401 11 22.454 11.109C22.6422 11.2049 22.7951 11.3578 22.891 11.546C23 11.7599 23 12.0399 23 12.6V29M23 19H27.4C27.9601 19 28.2401 19 28.454 19.109C28.6422 19.2049 28.7951 19.3578 28.891 19.546C29 19.7599 29 20.0399 29 20.6V27.4C29 27.9601 29 28.2401 28.891 28.454C28.7951 28.6422 28.6422 28.7951 28.454 28.891C28.2401 29 27.9601 29 27.4 29H23" stroke="#343A40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          }
        />
        <StatCard
          title="Findings"
          value={1800}
          hint="From last month"
          icon={<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E9ECEF" />
            <path d="M15 26V24M20 26V23M25 26V21M10.5 20C10.5 15.5217 10.5 13.2825 11.8912 11.8912C13.2825 10.5 15.5217 10.5 20 10.5C24.4783 10.5 26.7175 10.5 28.1088 11.8912C29.5 13.2825 29.5 15.5217 29.5 20C29.5 24.4783 29.5 26.7175 28.1088 28.1088C26.7175 29.5 24.4783 29.5 20 29.5C15.5217 29.5 13.2825 29.5 11.8912 28.1088C10.5 26.7175 10.5 24.4783 10.5 20Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.9922 19.4863C16.1473 19.5581 21.0341 19.2328 23.8137 14.8213M21.9923 14.2883L23.8678 13.9865C24.0964 13.9574 24.432 14.1379 24.5145 14.353L25.0104 15.9914" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          }
        />
        <StatCard
          title="Total scans projects"
          value={60}
          hint="From last month"
          icon={<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E9ECEF" />
            <path d="M22 10.75C23.9068 10.75 25.2615 10.7516 26.2892 10.8898C27.2952 11.025 27.8749 11.2787 28.2981 11.7019C28.7852 12.189 28.9973 12.5667 29.1147 13.2398C29.2471 13.9986 29.25 15.0809 29.25 17C29.25 17.4142 29.5858 17.75 30 17.75C30.4142 17.75 30.75 17.4142 30.75 17L30.75 16.9037C30.7501 15.1045 30.7501 13.8857 30.5924 12.982C30.417 11.9767 30.0432 11.3257 29.3588 10.6412C28.6104 9.89288 27.6615 9.56076 26.489 9.40314C25.3498 9.24997 23.8942 9.24998 22.0564 9.25H22C21.5858 9.25 21.25 9.58579 21.25 10C21.25 10.4142 21.5858 10.75 22 10.75Z" fill="black" />
            <path d="M10 22.25C10.4142 22.25 10.75 22.5858 10.75 23C10.75 24.9191 10.7529 26.0014 10.8853 26.7602C11.0028 27.4333 11.2148 27.811 11.7019 28.2981C12.1251 28.7213 12.7048 28.975 13.7109 29.1102C14.7385 29.2484 16.0932 29.25 18 29.25C18.4142 29.25 18.75 29.5858 18.75 30C18.75 30.4142 18.4142 30.75 18 30.75H17.9436C16.1058 30.75 14.6502 30.75 13.511 30.5969C12.3386 30.4392 11.3896 30.1071 10.6412 29.3588C9.95681 28.6743 9.58304 28.0233 9.40762 27.018C9.24992 26.1143 9.24995 24.8955 9.25 23.0964L9.25001 23C9.25001 22.5858 9.58579 22.25 10 22.25Z" fill="black" />
            <path d="M30 22.25C30.4142 22.25 30.75 22.5858 30.75 23L30.75 23.0963C30.7501 24.8955 30.7501 26.1143 30.5924 27.018C30.417 28.0233 30.0432 28.6743 29.3588 29.3588C28.6104 30.1071 27.6615 30.4392 26.489 30.5969C25.3498 30.75 23.8942 30.75 22.0564 30.75H22C21.5858 30.75 21.25 30.4142 21.25 30C21.25 29.5858 21.5858 29.25 22 29.25C23.9068 29.25 25.2615 29.2484 26.2892 29.1102C27.2952 28.975 27.8749 28.7213 28.2981 28.2981C28.7852 27.811 28.9973 27.4333 29.1147 26.7602C29.2471 26.0014 29.25 24.9191 29.25 23C29.25 22.5858 29.5858 22.25 30 22.25Z" fill="black" />
            <path d="M17.9436 9.25H18C18.4142 9.25 18.75 9.58579 18.75 10C18.75 10.4142 18.4142 10.75 18 10.75C16.0932 10.75 14.7385 10.7516 13.7109 10.8898C12.7048 11.025 12.1251 11.2787 11.7019 11.7019C11.2148 12.189 11.0028 12.5667 10.8853 13.2398C10.7529 13.9986 10.75 15.0809 10.75 17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25001 17.4142 9.25001 17L9.25 16.9037C9.24995 15.1045 9.24992 13.8857 9.40762 12.982C9.58304 11.9767 9.95681 11.3257 10.6412 10.6412C11.3896 9.89288 12.3386 9.56076 13.511 9.40314C14.6502 9.24997 16.1058 9.24998 17.9436 9.25Z" fill="black" />
            <path d="M10 19.25C9.58579 19.25 9.25001 19.5858 9.25001 20C9.25001 20.4142 9.58579 20.75 10 20.75H30C30.4142 20.75 30.75 20.4142 30.75 20C30.75 19.5858 30.4142 19.25 30 19.25H10Z" fill="black" />
          </svg>
          }
        />
      </div>

      {/* Middle charts row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl border border-[#E9ECEF]">
          <RevenueChart dataSet={dataSet} className="bg-white rounded-xl border border-[#E9ECEF] pt-4 pe-4 h-full" />
        </div>
        <div className="col-span-2 rounded-xl bg-[#F8F9FA] p-2">
          <div className="flex items-center justify-between px-4 pb-2">
            <h5 className="text-lg font-medium">Findings</h5>
          </div>
          <div className=" bg-white rounded-xl border border-[#E9ECEF]">
            <DonutChart
              labels={["Open Findings", "Closed Findings"]}
              series={[14, 25]}
              colors={["#736DFF", "#2F3A61"]}
              totalLabel="Total findings"
              height={350}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 rounded-xl bg-[#F8F9FA] p-2">
          <div className="flex items-center justify-between px-4 pb-2">
            <h5 className="text-lg font-medium">Findings</h5>
          </div>
          <div className=" bg-white rounded-xl border border-[#E9ECEF]">
            <ReactApexChart options={options} series={series} height={350} />
          </div>
        </div>
        <div className="col-span-2 rounded-xl bg-[#F8F9FA] p-2">
          <div className="flex items-center justify-between px-4 pb-2">
            <h5 className="text-lg font-medium">Findings</h5>
          </div>
          <div className=" bg-white rounded-xl border border-[#E9ECEF]">
            <DonutChart
              labels={["Critical", "High", "Medium", "Low"]}
              series={[14, 25, 36, 10]}
              colors={["#B42318", "#C4320A", "#F79009", "#027A48"]}
              totalLabel="Total findings"
              chartStyle="full"
              height={250}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
