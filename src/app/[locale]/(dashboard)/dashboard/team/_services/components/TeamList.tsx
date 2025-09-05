"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Ban, Download, Ellipsis, Plus, ScanLine, Search, SquarePen } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
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

// Types for TeamsData prop
type TeamsData = {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        id: number;
        user: {
            email: string;
            first_name: string;
            last_name: string;
            is_2fa_enabled: boolean;
        };
    }[];
};

type TeamListProps = {
    teamsData: TeamsData;
};

const TeamList: React.FC<TeamListProps> = ({ teamsData }) => {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    // Transform teamsData.results to table data
    const tableData = useMemo(() => {
        if (!teamsData?.results) return [];
        let data = teamsData.results.map((item) => ({
            id: item.id,
            user: item.user,
            // You can add more fields here as needed for the table
        }));

        // Filter by search (user email, first name, last name)
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => {
                return (
                    row.user.email.toLowerCase().includes(lower) ||
                    row.user.first_name.toLowerCase().includes(lower) ||
                    row.user.last_name.toLowerCase().includes(lower)
                );
            });
        }

        return data;
    }, [teamsData, search]);

    const columns = [
        {
            key: "id",
            header: "ID",
        },
        {
            key: "user",
            header: "User",
            render: (row: { user: { email: string; first_name: string; last_name: string; is_2fa_enabled: boolean } }) => (
                <div className="flex items-center text-start gap-2">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-[#FFE8CC] text-white">
                        {row.user.first_name?.[0]}
                        {row.user.last_name?.[0]}
                    </span>
                    <span className="font-medium text-[#070A0E]">{row.user.first_name} {row.user.last_name}</span>
                </div>

            ),
        },
        {
            key: "email",
            header: "Email",
            render: (row: { user: { email: string; first_name: string; last_name: string; is_2fa_enabled: boolean } }) => (
                <span className="font-medium text-[#070A0E]">{row.user.email}</span>
            ),
        },
        {
            key: "registerationDate",
            header: "registeration date",
            render: () => (
                <div>
                    <p className="text-sm text-[#070A0E]">June 28, 2023</p>
                    <p className="text-sm text-[#4A4C4F]">10:45PM</p>
                </div>
            ),
        },
        {
            key: "accessLevel",
            header: "Access Level",
            render: () => (
                <span>Yes</span>
            ),
        },
        {
            key: "lastLogin",
            header: "Last Login",
            render: () => (
                <span>Yesterday, 06:21 PM</span>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (row: { id: number }) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} onClick={() => console.log(row.id)} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        <Button variant="ghost" className="rounded-lg w-full justify-start"><SquarePen size={18} /> Edit User</Button>
                        <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => router.push(`/dashboard/teams/${row.id}/scans`)}><ScanLine size={18} />View Scans</Button>
                        <Button variant="ghost" className="rounded-lg w-full justify-start"><Download size={18} /> Export Report</Button>
                        <Button variant="ghost" className="rounded-lg w-full justify-start"><Ban size={18} /> Block</Button>
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
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={20} />}
                        iconPosition="right"
                    />
                </div>
                <Sheet open={isModalOpen}>
                    <SheetTrigger asChild onClick={() => setIsModalOpen(true)}>
                        <Button variant={"primary"} size="lg"><Plus size={20} />  Create User</Button>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4"><ArrowLeft size={20} onClick={() => setIsModalOpen(false)} />  Create User</SheetTitle>
                        </SheetHeader>
                        <CreateOrganizationForm setIsModalOpen={setIsModalOpen} />
                    </SheetContent>
                </Sheet>
            </div>
            <CustomTable data={tableData} columns={columns} />
        </div>
    );
};

export default TeamList;