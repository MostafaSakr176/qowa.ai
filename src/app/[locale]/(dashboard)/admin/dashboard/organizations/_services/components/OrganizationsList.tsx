"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, Building2, Plus, ScanLine, Search, SquarePen, Trash } from "lucide-react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/utils/permissions";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox"

// API response types
type OrganizationApi = {
    id: number;
    name: string;
    country: string;
    number_of_apps: number;
    url: string;
    business_email: string;
    created_at: string;
    scans_count: number;
    team_members_count: number;
    rank: number;
    amount: number;
    credit: number;
};

type OrganizationsApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: OrganizationApi[];
};

// Table row type
type OrganizationRow = {
    id: number;
    organizations: {
        name: string;
        mail: string;
        logo: React.ReactNode;
    };
    country: string;
    pest_organization: number;
    teams: number;
    states: string;
    number_of_apps: number;
    registerationDate: {
        date: string;
        time: string;
    };
    amount: string;
    url: string;
    credit: number;
};

type Country = {
    flag: string;
    country: string;
    code: string;
};

type CountriesResponse = {
    success: boolean;
    message: string;
    data: Country[];
};

const fetchCountries = async (): Promise<CountriesResponse> => {
    const res = await api.get("/core/countries/");
    return res.data;
};


// UPDATED: accept page param
const fetchOrganizations = async (page: number): Promise<OrganizationsApiResponse> => {
    const res = await api.get(`/client/organizations/?page=${page}`);
    return res.data;
};

const deleteOrganization = async (id: number) => {
    await api.delete(`/client/organizations/${id}/`);
};

const OrganizationsList = () => {
    const { data: session } = useSession();
    const [search, setSearch] = useState("");
    const [country, setCountry] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editOrganization, setEditOrganization] = useState<OrganizationRow | null>(null);
    const [page, setPage] = useState(1);
    const [deleteOrgId, setDeleteOrgId] = useState<number | null>(null);
    const [orgToDelete, setOrgToDelete] = useState<OrganizationRow | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const router = useRouter();

    // Fetch countries
    const { data: countriesData, isLoading: countriesLoading, isError: countriesError } = useQuery<CountriesResponse>({
        queryKey: ["countries"],
        queryFn: fetchCountries,
    });

    // Fetch organizations data
    // UPDATED: include page in queryKey & queryFn, keepPreviousData for smooth pagination
    const { data, isLoading, isError, refetch, isFetching } = useQuery<OrganizationsApiResponse>({
        queryKey: ["organizations", page],
        queryFn: () => fetchOrganizations(page),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteOrganization,
        onSuccess: () => {
            refetch();
            setDeleteOrgId(null);
            setOrgToDelete(null);
        },
        onError: (error) => {
            console.error(error);
            setDeleteOrgId(null);
            setOrgToDelete(null);
        }
    });

    // Map API data to table format
    const organizations: OrganizationRow[] = useMemo(() => {
        if (!data?.results) return [];
        return data.results.map((org) => ({
            id: org.id,
            organizations: {
                name: org.name,
                mail: org.business_email,
                logo: <Building2 size={20} />,
            },
            country: org.country,
            pest_organization: org.rank,
            teams: org.team_members_count,
            number_of_apps: org.number_of_apps,
            states: "subscribers", // You may want to map this from API if available
            registerationDate: {
                date: new Date(org.created_at).toLocaleDateString(),
                time: new Date(org.created_at).toLocaleTimeString(),
            },
            url: org.url,
            amount: `$${org.amount}`,
            credit: org.credit // Example: 10% of amount as credit
        }));
    }, [data]);

    // Pagination meta (server-side)
    const pageSize = data?.results?.length || 0;
    const totalCount = data?.count ?? 0;

    const statesOptions = [
        { value: "all", label: "All" },
        { value: "open", label: "Open" },
        { value: "closed", label: "Closed" },
        { value: "finished", label: "Finished" },
    ];

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

        // Filter by country
        if (country) {
            data = data.filter((row) => row.country === country);
        }

        // Sort by priority if selected (optional: you can sort, but here we just filter)
        return data;
    }, [search, country, organizations]);

    // CSV export helper
    const handleExportCsv = () => {
        const dataToExport = selectedRows.size > 0
            ? filteredData.filter(row => selectedRows.has(row.id))
            : filteredData;
        if (!dataToExport.length) return;
        const headers = [
            "ID", "Name", "Email", "Country", "Rank", "Teams", "State", "Registration Date", "Amount", "Credits"
        ];
        const rows = dataToExport.map((r, idx) => ([
            idx + 1,
            r.organizations.name,
            r.organizations.mail,
            r.country,
            r.pest_organization,
            r.teams,
            r.states,
            r.registerationDate.date + " " + r.registerationDate.time,
            r.amount,
            r.credit
        ]));
        const csv = [headers, ...rows]
            .map(line =>
                line
                    .map(field => {
                        if (field === null || field === undefined) return "";
                        const val = String(field);
                        return /[",\n]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
                    })
                    .join(",")
            )
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const ts = new Date().toISOString().split("T")[0];
        const link = document.createElement("a");
        link.href = url;
        link.download = `organizations_${selectedRows.size > 0 ? "selected_" : ""}${ts}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDeleteClick = (organization: OrganizationRow) => {
        setOrgToDelete(organization);
        setDeleteOrgId(organization.id);
    };

    const handleConfirmDelete = () => {
        if (deleteOrgId) {
            deleteMutation.mutate(deleteOrgId);
            setDeleteConfirmText(""); // Reset input after delete
        }
    };

    const handleCancelDelete = () => {
        setDeleteOrgId(null);
        setOrgToDelete(null);
        setDeleteConfirmText(""); // Reset input
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            setSelectAll(next.size === filteredData.length);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(filteredData.map(row => row.id)));
            setSelectAll(true);
        } else {
            setSelectedRows(new Set());
            setSelectAll(false);
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
            render: (row: OrganizationRow) => (
                <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={checked => handleSelectRow(row.id, !!checked)}
                    aria-label={`Select row ${row.id}`}
                />
            ),
        },
        {
            key: "organizations",
            header: "Organizations",
            render: (row: { organizations: { name: string; mail: string; logo: React.ReactNode } }) => (
                <div className="flex items-center gap-1">
                    <Image src={"/media/images/logos/organization logo.png"} alt={row.organizations?.name} width={30} height={30} />
                    <div className="text-start">
                        <p className="text-sm text-[#070A0E]">{row.organizations?.name}</p>
                        <p className="text-xs text-[#4A4C4F]">{row.organizations?.mail}</p>
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
            key: "credit",
            header: "Credits"
        },
        {
            key: "actions",
            header: "",
            render: (row: OrganizationRow) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        {hasPermission(session, "change_organization") && <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            onClick={() => {
                                setEditOrganization(row);
                                setIsModalOpen(true);
                            }}
                        >
                            <SquarePen size={18} /> Edit Organization
                        </Button>}
                        <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => router.push("/admin/dashboard/organizations/1/scans")}><ScanLine size={18} />View Scans</Button>
                        <Button variant="ghost" className="rounded-lg w-full justify-start"><Download size={18} /> Export Report</Button>
                        {hasPermission(session, "delete_organization") && <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(row)}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash size={18} /> Delete
                        </Button>}
                    </PopoverContent>
                </Popover>
            ),
        },
    ];

    if (isError) return <div>Error loading organizations.</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-3 gap-2 items-center">
                    <Input
                        placeholder="Search organizations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={20} />}
                        iconPosition="right"
                    />
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="bg-[#fff]">
                            <SelectValue placeholder={countriesLoading ? "Loading countries..." : countriesError ? "Error loading countries" : "Select Country"} />
                        </SelectTrigger>
                        <SelectContent>
                            {countriesLoading && (
                                <div className="px-4 py-2 text-muted-foreground">Loading...</div>
                            )}
                            {countriesError && (
                                <div className="px-4 py-2 text-destructive">Error loading countries</div>
                            )}
                            {countriesData?.data?.map((c, idx) => (
                                <SelectItem key={idx} value={c.country}>
                                    <span className="flex items-center gap-2">
                                        <Image src={c.flag} alt={c.country} width={16} height={16} className="w-4 h-4" />
                                        {c.country}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    {selectedRows.size > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{selectedRows.size} selected</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedRows(new Set());
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
                        disabled={!filteredData.length || isLoading || isFetching}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white"
                    >
                        {selectedRows.size > 0
                            ? `Export Selected (${selectedRows.size})`
                            : "Export All CSV"}
                        <Download size={16} className="ml-1" />
                    </Button>
                    {hasPermission(session, "add_organization") && <Sheet open={isModalOpen}>
                        <SheetTrigger asChild onClick={() => { setIsModalOpen(true); setEditOrganization(null); }}>
                            <Button variant={"primary"} size="lg"><Plus size={20} />  Create organization</Button>
                        </SheetTrigger>
                        <SheetContent showCloseButton={false}>
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-4">
                                    <ArrowLeft size={20} onClick={() => { setIsModalOpen(false); setEditOrganization(null); }} />
                                    {editOrganization ? "Edit Organization" : "Create Organization"}
                                </SheetTitle>
                            </SheetHeader>
                            <CreateOrganizationForm
                                setIsModalOpen={setIsModalOpen}
                                refetch={refetch}
                                editOrganization={editOrganization}
                            />
                        </SheetContent>
                    </Sheet>}
                </div>

            </div>
            <CustomTable
                data={filteredData}
                columns={columns}
                onRowClick={(row) => router.push(`/admin/dashboard/organizations/${row.id}/scans`)}
                // NEW pagination props (adapt to your CustomTable API)
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={(nextPage: number) => {
                    if (nextPage !== page) setPage(nextPage);
                }}
                loading={isLoading}
                serverSidePagination
            // NEW row selection props
            // selectedRows={selectedRows}
            // onSelectRow={handleSelectRow}
            // onSelectAll={handleSelectAll}
            // selectAll={selectAll}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteOrgId !== null} onOpenChange={(open) => !open && handleCancelDelete()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{orgToDelete?.organizations.name}</strong>?<br />
                            This action cannot be undone and will permanently remove the organization and all associated data.<br /><br />
                            <span className="text-destructive font-semibold">Type <b>delete</b> below to confirm:</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        value={deleteConfirmText}
                        onChange={e => setDeleteConfirmText(e.target.value)}
                        placeholder='Type "delete" to confirm'
                        autoFocus
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete} disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending || deleteConfirmText.trim().toLowerCase() !== "delete"}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default OrganizationsList;