"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, Plus, ScanLine, Search, SquarePen } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from "@/i18n/navigation";
import CreateScanForm from "./CreateForm";

const findings = [
    {
        id: 1,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Completed",
        progress: 40,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 2,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Completed",
        progress: 60,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 3,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Completed",
        progress: 20,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 4,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Completed",
        progress: 90,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 5,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Completed",
        progress: 40,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 6,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Completed",
        progress: 60,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 7,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Pendding",
        progress: 20,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
    {
        id: 8,
        title: "The application is susceptible to mass account hijacking due to various vulnerabilities.",
        type: "web",
        status: "Open",
        progress: 90,
        assign: ["MS", "ND", "AW"],
        startDate: { date: "June 28, 2023", time: "10:45PM" },
    },
];

const statusOptions = [
    { value: "all", label: "All" },
    { value: "Completed", label: "Completed" },
    { value: "Pendding", label: "Pendding" },
    { value: "Open", label: "Open" },
];

const FindingsList = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter()
    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = findings;

        // Filter by search (scan name, mail, invoice, method type, etc.)
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => {
                return (
                    row.title.toLowerCase().includes(lower) ||
                    row.assign.map(ele => ele.toLowerCase().includes(lower))
                );
            });
        }

        // Filter by status
        if (status !== "all") {
            data = data.filter((row) => row.status === status);
        }

        // Sort by priority if selected (optional: you can sort, but here we just filter)
        return data;
    }, [search, status]);

    const columns = [
        {
            key: "title",
            header: "Title",
            render: (row: { title: string }) => (
                <p>
                    {row.title.split(" ").slice(0, 7).join(" ")}
                    {row.title.split(" ").length > 7 ? "..." : ""}
                </p>
            ),
        },
        {
            key: "type",
            header: "Type",
        },
        {
            key: "status",
            header: "Status",
            render: (row: { status: string }) => (
                <span
                    className={`px-4 py-1 rounded-full border ${row.status === "rejected"
                        ? "border-red-800 text-red-800"
                        : row.status === "pendding"
                            ? "border-amber-500 text-amber-500"
                            : "border-emerald-700 text-emerald-700"
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            key: "progress",
            header: "Progress",
            render: (row: { progress: number }) => (
                <div className="flex items-center gap-2">
                    <Progress value={row.progress} /> {`${row.progress}%`}
                </div>
            )
        },
        {
            key: "assign",
            header: "Assign",
            render: (row: { assign: string[] }) => (
                <div className="*:data-[slot=avatar]:ring-background flex justify-center -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {row.assign.map((ele,idx) => (
                        <Avatar key={idx}>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>{ele}</AvatarFallback>
                        </Avatar>
                    ))}

                </div>
            )
        },
        {
            key: "startDate",
            header: "start date",
            render: (row: { startDate: { date: string; time: string } }) => (
                <div>
                    <p className="text-sm text-[#070A0E]">{row.startDate.date}</p>
                    <p className="text-sm text-[#4A4C4F]">{row.startDate.time}</p>
                </div>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (row: { id: number }) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} onClick={() => console.log(row.id)} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        <Button variant="ghost" className="rounded-lg"><SquarePen size={18} /> Edit scan</Button>
                        <Button variant="ghost" className="rounded-lg" onClick={() => router.push("/dashboard/organizations/1/scans/1/findings")}><ScanLine size={18} />View Findings</Button>
                        <Button variant="ghost" className="rounded-lg"><Download size={18} /> Export Report</Button>
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                    <Input
                        placeholder="Search payments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={20} />}
                        iconPosition="right"
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Sheet open={isModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsModalOpen(true)}>
                        <Button variant={"primary"} size="lg"><Plus size={20} />  Create scan</Button>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => setIsModalOpen(false)} />  Create scan</SheetTitle>
                        </SheetHeader>
                        <CreateScanForm setIsModalOpen={setIsModalOpen} />
                    </SheetContent>
                </Sheet>
            </div>
            <CustomTable data={filteredData} columns={columns}  />
        </div>
    );
};

export default FindingsList;