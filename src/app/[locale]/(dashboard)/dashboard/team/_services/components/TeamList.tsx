"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Ban, Download, Ellipsis, Plus, Search, SquarePen, Loader2 } from "lucide-react";
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
import CreateTeamForm from "./CreateForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/axiosClient";
import { formatDateTime } from "@/utils/formateDate";

// Types for TeamsData prop
type TeamsData = {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        id: number;
        user: {
            id: number;
            email: string;
            first_name: string;
            last_name: string;
            is_2fa_enabled: boolean;
            created_at: string;
            last_login: string | null;
        };
        group_name: string | null;
    }[];
};

type IRow = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_2fa_enabled: boolean;
    created_at: string;
    last_login: string | null;
    group_name: string | null;
}

// Fetch employees API call
async function fetchEmployees(): Promise<TeamsData> {
    const res = await api.get("/employee/employees/");
    return res.data;
}

// Delete employee API call
async function deleteEmployee(id: number) {
    const res = await api.delete(`/employee/employees/${id}/`);
    if (res.status !== 204 && res.status !== 200) {
        throw new Error("Failed to delete employee");
    }
    return true;
}

const TeamList: React.FC = () => {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [editUser, setEditUser] = useState<IRow | null>(null); // NEW

    // Fetch teams data using react-query
    const {
        data: teamsData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<TeamsData, Error>({
        queryKey: ["teams"],
        queryFn: () => fetchEmployees(),
    });

    // Transform teamsData.results to table data
    const tableData = useMemo(() => {
        if (!teamsData?.results) return [];
        let data = teamsData.results.map((item) => ({
            ...item.user,
            id: item.id,
            group_name: item.group_name
            // You can add more fields here as needed for the table
        }));

        // Filter by search (user email, first name, last name)
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => {
                return (
                    row.email.toLowerCase().includes(lower) ||
                    row.first_name.toLowerCase().includes(lower) ||
                    row.last_name.toLowerCase().includes(lower)
                );
            });
        }

        return data;
    }, [teamsData, search]);

    // Tanstack mutation for delete
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            setDeletingId(id);
            return deleteEmployee(id);
        },
        onSuccess: () => {
            toast.success("User deleted successfully");
            setDeletingId(null);
            refetch();
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to delete user");
            setDeletingId(null);
        }
    });

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };



    const columns = [
        {
            key: "select",
            header: (
                <Checkbox
                    checked={selectedRows.length === tableData.length && tableData.length > 0}
                    onCheckedChange={checked => {
                        if (checked) {
                            setSelectedRows(tableData.map(row => row.id));
                        } else {
                            setSelectedRows([]);
                        }
                    }}
                    aria-label="Select all rows"
                />
            ),
            render: (row: IRow) => (
                <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={checked => {
                        if (checked) {
                            setSelectedRows(prev => [...prev, row.id]);
                        } else {
                            setSelectedRows(prev => prev.filter(id => id !== row.id));
                        }
                    }}
                    aria-label={`Select row ${row.id}`}
                />
            ),
        },
        {
            key: "user",
            header: "User",
            render: (row: IRow) => (
                <div className="flex items-center text-start gap-2">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-[#FFE8CC] text-white">
                        {row.first_name?.[0]}
                        {row.last_name?.[0]}
                    </span>
                    <span className="font-medium text-[#070A0E]">{row.first_name} {row.last_name}</span>
                </div>
            ),
        },
        {
            key: "email",
            header: "Email",
            render: (row: IRow) => (
                <span className="font-medium text-[#070A0E]">{row.email}</span>
            ),
        },
        {
            key: "created_at",
            header: "registeration date",
            render: (row: IRow) => (
                <div>
                    <p className="text-sm text-[#070A0E]">{formatDateTime(row.created_at)?.date}</p>
                    <p className="text-sm text-[#4A4C4F]">{formatDateTime(row.created_at)?.time}</p>
                </div>
            ),
        },
        {
            key: "group_name",
            header: "Role",
            render: (row: IRow) => (
                <span>{row.group_name ? row.group_name : "None"}</span>
            ),
        },
        {
            key: "last_login",
            header: "Last Login",
            render: (row:IRow) => (
                <div>
                    <p className="text-sm text-[#070A0E]">{formatDateTime(row?.last_login)?.date}</p>
                    <p className="text-sm text-[#4A4C4F]">{formatDateTime(row?.last_login)?.time}</p>
                </div>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (row:IRow) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        <Sheet open={isModalOpen}>
                            <SheetTrigger
                                asChild
                                onClick={() => {
                                    setEditUser(row);          // set row for edit
                                    setIsModalOpen(true);
                                }}
                            >
                                <Button variant="ghost" className="rounded-lg w-full justify-start">
                                    <SquarePen size={18} /> Edit User
                                </Button>
                            </SheetTrigger>
                            <SheetContent showCloseButton={false}>
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-4">
                                        <ArrowLeft
                                            size={20}
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setEditUser(null);
                                            }}
                                        />  {editUser ? "Edit User" : "Create User"}
                                    </SheetTitle>
                                </SheetHeader>
                                <CreateTeamForm
                                    setIsModalOpen={setIsModalOpen}
                                    editUser={editUser}        // PASS EDIT DATA
                                    refetch={refetch}
                                />
                            </SheetContent>
                        </Sheet>

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-2">Loading users...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-red-500">
                <span>Error loading users: {error?.message}</span>
                <Button onClick={() => refetch()} className="mt-2">Retry</Button>
            </div>
        );
    }

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
                    <SheetTrigger
                        asChild
                        onClick={() => {
                            setIsModalOpen(true);
                            setEditUser(null); // ensure fresh create
                        }}
                    >
                        <Button variant={"primary"} size="lg"><Plus size={20} />  Create User</Button>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4">
                                <ArrowLeft
                                    size={20}
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditUser(null);
                                    }}
                                />  {editUser ? "Edit User" : "Create User"}
                            </SheetTitle>
                        </SheetHeader>
                        <CreateTeamForm
                            setIsModalOpen={setIsModalOpen}
                            editUser={editUser}   // PASS WHEN NULL OR OBJECT
                            refetch={refetch}
                        />
                    </SheetContent>
                </Sheet>
            </div>
            <CustomTable data={tableData} columns={columns} />
        </div>
    );
};

export default TeamList;