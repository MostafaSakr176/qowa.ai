"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Ban, Download, Ellipsis, Plus, ScanLine, Search, SquarePen, Loader2 } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
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
import { useRouter } from "@/i18n/navigation";
import CreateTeamForm from "./CreateForm";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

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

// Delete employee API call
async function deleteEmployee(id: number, accessToken: string | undefined) {
    if (!accessToken) {
        throw new Error("No access token found in session");
    }
    const res = await fetch(`https://api.qowa.ai/employee/employees/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to delete employee");
    }
    return true;
}

const TeamList: React.FC<TeamListProps> = ({ teamsData }) => {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const router = useRouter();
    const { data: session } = useSession();

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

    // Tanstack mutation for delete
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            setDeletingId(id);
            // You may need to adjust the path to the access token depending on your next-auth config
            const accessToken = session?.accessToken;
            return deleteEmployee(id, accessToken);
        },
        onSuccess: () => {
            toast.success("User deleted successfully");
            setDeletingId(null);
            router.refresh();
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete user");
            setDeletingId(null);
        }
    });

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

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
                        <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            onClick={() => handleDelete(row.id)}
                            disabled={deletingId === row.id && deleteMutation.isPending}
                        >
                            <Ban size={18} />
                            {deletingId === row.id && deleteMutation.isPending ? (
                                <span className="flex items-center gap-2 ml-1">
                                    <Loader2 className="animate-spin" size={16} /> Deleting...
                                </span>
                            ) : (
                                <span>Delete</span>
                            )}
                        </Button>
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
                        <CreateTeamForm setIsModalOpen={setIsModalOpen} />
                    </SheetContent>
                </Sheet>
            </div>
            <CustomTable data={tableData} columns={columns} />
        </div>
    );
};

export default TeamList;