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
import { useSession } from "next-auth/react";
import { hasPermission } from "@/utils/permissions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    const [selectAll, setSelectAll] = useState(false);
    const [editUser, setEditUser] = useState<IRow | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const { data: session } = useSession();

    // NEW: State for delete confirmation
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [userToDelete, setUserToDelete] = useState<IRow | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    // Fetch teams data using react-query
    const {
        data: teamsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
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

    // Updated delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return deleteEmployee(id);
        },
        onSuccess: () => {
            toast.success("User deleted successfully");
            setDeletingId(null);
            setDeleteUserId(null);
            setUserToDelete(null);
            refetch();
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to delete user");
            setDeletingId(null);
            setDeleteUserId(null);
            setUserToDelete(null);
        }
    });

    // NEW: Handle delete click (opens confirmation dialog)
    const handleDeleteClick = (user: IRow) => {
        setUserToDelete(user);
        setDeleteUserId(user.id);
    };

    // NEW: Handle confirm delete
    const handleConfirmDelete = () => {
        if (deleteUserId) {
            setDeletingId(deleteUserId);
            deleteMutation.mutate(deleteUserId);
            setDeleteConfirmText(""); // Reset input after delete
        }
    };

    // NEW: Handle cancel delete
    const handleCancelDelete = () => {
        setDeleteUserId(null);
        setUserToDelete(null);
        setDeleteConfirmText(""); // Reset input
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        setSelectedRows(prev => {
            const next = checked ? [...prev, id] : prev.filter(rowId => rowId !== id);
            setSelectAll(next.length === tableData.length && tableData.length > 0);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(tableData.map(row => row.id));
            setSelectAll(true);
        } else {
            setSelectedRows([]);
            setSelectAll(false);
        }
    };

    // Helper to safely wrap CSV values in quotes and escape existing quotes
    function csvEscape(value: unknown) {
        if (value === null || value === undefined) return "";
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
    }

    const handleExportCsv = () => {
        try {
            setIsExporting(true);
            const dataToExport = selectedRows.length > 0
                ? tableData.filter(row => selectedRows.includes(row.id))
                : tableData;
            if (!dataToExport.length) {
                toast.error("No data to export");
                return;
            }

            const headers = [
                "ID",
                "First Name",
                "Last Name",
                "Email",
                "Role",
                "Registration Date",
                "Last Login Date",
                "2FA Enabled"
            ];

            const rows = dataToExport.map((row, idx) => {
                const created = formatDateTime(row.created_at);
                const lastLogin = formatDateTime(row.last_login);
                return [
                    idx + 1,
                    row.first_name,
                    row.last_name,
                    row.email,
                    row.group_name || "None",
                    created?.date + ""+created?.time,
                    lastLogin?.date + " " + lastLogin?.time,
                    row.is_2fa_enabled ? "Yes" : "No"
                ].map(csvEscape).join(",");
            });

            const csvContent = [headers.map(csvEscape).join(","), ...rows].join("\r\n");
            const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const now = new Date();
            const fileName = `employees_${selectedRows.length > 0 ? "selected_" : ""}${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("CSV exported successfully");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to export CSV";
            toast.error(message);
        } finally {
            setIsExporting(false);
        }
    };



    const columns = [
        {
            key: "select",
            header: (
                <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                />
            ),
            render: (row: IRow) => (
                <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={checked => handleSelectRow(row.id, !!checked)}
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
            render: (row: IRow) => (
                <div>
                    <p className="text-sm text-[#070A0E]">{formatDateTime(row?.last_login)?.date}</p>
                    <p className="text-sm text-[#4A4C4F]">{formatDateTime(row?.last_login)?.time}</p>
                </div>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (row: IRow) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        {hasPermission(session, "change_employee") && <Sheet open={isModalOpen}>
                            <SheetTrigger
                                asChild
                                onClick={() => {
                                    setEditUser(row);
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
                                    editUser={editUser}
                                    refetch={refetch}
                                />
                            </SheetContent>
                        </Sheet>}

                        {hasPermission(session, "delete_employee") && <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(row)}
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
                        </Button>}
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

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
                <div className="flex items-center gap-2">
                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{selectedRows.length} selected</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedRows([]);
                                    setSelectAll(false);
                                }}
                                className="h-auto p-1 text-xs"
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={!tableData.length || isLoading || isFetching || isExporting}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {selectedRows.length > 0
                            ? `Export Selected (${selectedRows.length})`
                            : "Export All CSV"}
                    </Button>
                    {hasPermission(session, "add_employee") && <Sheet open={isModalOpen}>
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
                                editUser={editUser}
                                refetch={refetch}
                            />
                        </SheetContent>
                    </Sheet>}
                </div>
            </div>
            <CustomTable data={tableData} columns={columns} />

            {/* NEW: Delete Confirmation Dialog */}
            <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => { if (!open) { handleCancelDelete(); setDeleteConfirmText(""); } }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong> ({userToDelete?.email})?<br />
                            This action cannot be undone and will permanently remove the user from the system.<br /><br />
                            <span className="text-destructive font-semibold">Type <b>delete</b> below to confirm:</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        value={deleteConfirmText}
                        onChange={e => setDeleteConfirmText(e.target.value)}
                        placeholder='Type "delete" to confirm'
                        className="mt-2"
                        autoFocus
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                handleCancelDelete();
                                setDeleteConfirmText("");
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                handleConfirmDelete();
                                setDeleteConfirmText("");
                            }}
                            disabled={deleteMutation.isPending || deleteConfirmText.trim().toLowerCase() !== "delete"}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete User"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TeamList;