"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Ban, Download, Ellipsis, Logs, Plus, ScanLine, Search, SquarePen } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
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
import CreateOrganizationForm from "./CreateForm";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useRouter } from "@/i18n/navigation";

const organizations = [
    {
        id: 1,
        organizations: {
            name: "StellarTech sakr",
            mail: "stellartech@uimiye.com",
            logo: <Logs size={20} />,
        },
        country: "Egypt",
        pest_organization: 209,
        teams: 5,
        states: "subscribers",
        registerationDate: { date: "June 28, 2023", time: "10:45PM" },
        amount: "$328.85",
    },
    {
        id: 2,
        organizations: {
            name: "StellarTech sakr",
            mail: "stellartech@uimiye.com",
            logo: <Logs size={20} />,
        },
        country: "Egypt",
        pest_organization: 209,
        teams: 5,
        states: "subscribers",
        registerationDate: { date: "June 28, 2023", time: "10:45PM" },
        amount: "$328.85",
    },
    {
        id: 3,
        organizations: {
            name: "StellarTech sakr",
            mail: "stellartech@uimiye.com",
            logo: <Logs size={20} />,
        },
        country: "Egypt",
        pest_organization: 209,
        teams: 5,
        states: "subscribers",
        registerationDate: { date: "June 28, 2023", time: "10:45PM" },
        amount: "$328.85",
    },
    {
        id: 4,
        organizations: {
            name: "StellarTech sakr",
            mail: "stellartech@uimiye.com",
            logo: <Logs size={20} />,
        },
        country: "Egypt",
        pest_organization: 209,
        teams: 5,
        states: "subscribers",
        registerationDate: { date: "June 28, 2023", time: "10:45PM" },
        amount: "$328.85",
    }
];

const statesOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "finished", label: "Finished" },
];

const OrganizationsList = () => {
    const [search, setSearch] = useState("");
    const [states, setStates] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter()
    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = organizations;

        // Filter by search (organization name, mail, invoice, method type, etc.)
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => {
                return (
                    row.organizations.name.toLowerCase().includes(lower) ||
                    row.organizations.mail.toLowerCase().includes(lower)
                );
            });
        }

        // Filter by status
        if (states !== "all") {
            data = data.filter((row) => row.states === states);
        }

        // Sort by priority if selected (optional: you can sort, but here we just filter)
        return data;
    }, [search, states]);

    const columns = [
        {
            key: "organizations",
            header: "Organizations",
            render: (row: { organizations: { name: string; mail: string; logo: React.ReactNode } }) => (
                <div className="flex items-center justify-center text-start gap-2">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-primary text-white">
                        {row.organizations.logo}
                    </span>
                    <div>
                        <p className="text-sm text-[#070A0E]">{row.organizations.name}</p>
                        <p className="text-sm text-[#4A4C4F]">{row.organizations.mail}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "country",
            header: "Country",
        },
        {
            key: "pest_organization",
            header: "Best Organizations"
        },
        {
            key: "teams",
            header: "Teams"
        },
        {
            key: "states",
            header: "States"
        },
        {
            key: "registerationDate",
            header: "registeration date",
            render: (row: { registerationDate: { date: string; time: string } }) => (
                <div>
                    <p className="text-sm text-[#070A0E]">{row.registerationDate.date}</p>
                    <p className="text-sm text-[#4A4C4F]">{row.registerationDate.time}</p>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Amount"
        },
        {
            key: "actions",
            header: "",
            render: (row: { id: number }) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} onClick={() => console.log(row.id)} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        <Button variant="ghost" className="rounded-lg"><SquarePen size={18} /> Edit Organization</Button>
                        <Button variant="ghost" className="rounded-lg" onClick={()=>router.push("/dashboard/organizations/1/scans")}><ScanLine size={18} />View Scans</Button>
                        <Button variant="ghost" className="rounded-lg"><Download size={18} /> Export Report</Button>
                        <Button variant="ghost" className="rounded-lg"><Ban size={18} /> Block</Button>
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
                    <Select value={states} onValueChange={setStates}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statesOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Sheet open={isModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsModalOpen(true)}>
                        <Button variant={"primary"} size="lg"><Plus size={20} />  Create organization</Button>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => setIsModalOpen(false)} />  Create Organization</SheetTitle>
                        </SheetHeader>
                        <CreateOrganizationForm setIsModalOpen={setIsModalOpen} />
                    </SheetContent>
                </Sheet>
            </div>
            <CustomTable data={filteredData} columns={columns} />
        </div>
    );
};

export default OrganizationsList;