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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";

type ScanApi = {
    id: number;
    title: string;
    status: string;
    created_at: string;
    testers: { id: number; email: string; first_name: string; last_name: string }[];
    team_members: { id: number; email: string; first_name: string; last_name: string }[];
    progress: number;
};

type ScansApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: ScanApi[];
};

type ScanRow = {
    id: number;
    title: string;
    type: string;
    status: string;
    progress: number;
    assign: string[];
    startDate: { date: string; time: string };
};

const fetchScans = async (organizationId: string): Promise<ScansApiResponse> => {
    const res = await api.get(`/scan/scans/?organization_id=${organizationId}`);
    return res.data;
};

const statusOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "finished", label: "Finished" },
];

const ScansList = ({ organizationId }: { organizationId: string }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    // Fetch scans data
    const { data, isLoading, isError } = useQuery<ScansApiResponse>({
        queryKey: ["scans", organizationId],
        queryFn: () => fetchScans(organizationId),
    });

    // Map API data to table format
    const scans: ScanRow[] = useMemo(() => {
        if (!data?.results) return [];
        return data.results.map((scan) => ({
            id: scan.id,
            title: scan.title,
            type: "web", // Not provided by API, set default or map if available
            status: scan.status === "pending" ? "open" : scan.status, // Map API status if needed
            progress: scan.progress,
            assign: scan.testers.map(t => `${t.first_name[0] ?? ""}${t.last_name[0] ?? ""}`),
            startDate: {
                date: new Date(scan.created_at).toLocaleDateString(),
                time: new Date(scan.created_at).toLocaleTimeString(),
            },
        }));
    }, [data]);

    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = scans;

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
    }, [search, status, scans]);

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
                <Badge withDot variant={row.status === "closed" ? "failed" : row.status === "open" ? "pending" : "success"}>{row.status}</Badge>
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
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {row.assign.map((ele, idx) => (
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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading scans.</div>;

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
            <CustomTable data={filteredData} columns={columns} onRowClick={(row) => router.push(`/dashboard/organizations/${row.id}/scans/${row.id}/findings`)} />
        </div>
    );
};

export default ScansList;