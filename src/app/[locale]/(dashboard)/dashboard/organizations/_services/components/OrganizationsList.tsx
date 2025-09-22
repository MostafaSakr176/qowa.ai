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
    const [states, setStates] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editOrganization, setEditOrganization] = useState<OrganizationRow | null>(null);
    const [page, setPage] = useState(1);
    const router = useRouter();

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
        },
        onError: (error) => {
            // Optionally: show error message
            console.error(error);
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

        // Filter by status
        if (states !== "all") {
            data = data.filter((row) => row.states === states);
        }

        // Sort by priority if selected (optional: you can sort, but here we just filter)
        return data;
    }, [search, states, organizations]);

    // CSV export helper
    const handleExportCsv = () => {
        if (!filteredData.length) return;
        const headers = [
            "ID",
            "Name",
            "Email",
            "Country",
            "Rank",
            "Teams",
            "State",
            "Registration Date",
            "Amount",
            "Credits"
        ];

        const rows = filteredData.map((r, idx) => ([
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
        link.download = `organizations_${ts}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const columns = [
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
                        <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => router.push("/dashboard/organizations/1/scans")}><ScanLine size={18} />View Scans</Button>
                        <Button variant="ghost" className="rounded-lg w-full justify-start"><Download size={18} /> Export Report</Button>
                        {/* <Button variant="ghost" className="rounded-lg w-full justify-start"><Ban size={18} /> Block</Button> */}
                        {hasPermission(session, "delete_organization") && <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => deleteMutation.mutate(row.id)}
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
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={!filteredData.length || isLoading || isFetching}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white"
                    >
                        Export CSV <Download size={16} className="mr-1" />
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
                onRowClick={(row) => router.push(`/dashboard/organizations/${row.id}/scans`)}
                // NEW pagination props (adapt to your CustomTable API)
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={(nextPage: number) => {
                    if (nextPage !== page) setPage(nextPage);
                }}
                loading={isLoading}
                serverSidePagination
            />
        </div>
    );
};

export default OrganizationsList;