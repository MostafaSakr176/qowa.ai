"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
    Search,
    BarChart3,
    Building2,
    ChevronUp,
    ChevronDown,
    Users,
    Scan,
    CreditCard,
    HelpCircle,
    FileText,
    Settings,
    Shield,
    Database,
    Key,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Permission {
    id: number;
    name: string;
    codename: string;
    content_type: number;
    enabled: boolean;
}

interface MenuSection {
    id: string;
    name: string;
    icon: React.ReactNode;
    permissions: Permission[];
    expanded: boolean;
    selectedCount: number;
}

// Content type to section mapping
const CONTENT_TYPE_MAPPING: Record<number, { name: string; icon: React.ReactNode }> = {
    1: { name: "Log Entries", icon: <FileText size={20} className="text-[#681390]" /> },
    2: { name: "Permissions", icon: <Key size={20} className="text-[#681390]" /> },
    3: { name: "Groups", icon: <Users size={20} className="text-[#681390]" /> },
    4: { name: "Content Types", icon: <Database size={20} className="text-[#681390]" /> },
    5: { name: "Sessions", icon: <Shield size={20} className="text-[#681390]" /> },
    6: { name: "Blacklisted Tokens", icon: <Shield size={20} className="text-[#681390]" /> },
    7: { name: "Outstanding Tokens", icon: <Shield size={20} className="text-[#681390]" /> },
    8: { name: "Users", icon: <Users size={20} className="text-[#681390]" /> },
    9: { name: "Employees", icon: <Users size={20} className="text-[#681390]" /> },
    10: { name: "Testers", icon: <Users size={20} className="text-[#681390]" /> },
    11: { name: "Clients", icon: <Users size={20} className="text-[#681390]" /> },
    12: { name: "Organizations", icon: <Building2 size={20} className="text-[#681390]" /> },
    13: { name: "Team Members", icon: <Users size={20} className="text-[#681390]" /> },
    14: { name: "Invitations", icon: <FileText size={20} className="text-[#681390]" /> },
    15: { name: "Scans", icon: <Scan size={20} className="text-[#681390]" /> },
    16: { name: "Findings", icon: <BarChart3 size={20} className="text-[#681390]" /> },
    17: { name: "Evidence", icon: <FileText size={20} className="text-[#681390]" /> },
    18: { name: "Ticket Files", icon: <FileText size={20} className="text-[#681390]" /> },
    19: { name: "Tickets", icon: <HelpCircle size={20} className="text-[#681390]" /> },
    20: { name: "Stripe Customers", icon: <CreditCard size={20} className="text-[#681390]" /> },
    21: { name: "Transactions", icon: <CreditCard size={20} className="text-[#681390]" /> },
};

const CreateRolePage = () => {
    const [roleName, setRoleName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch permissions from API
    const { data: permissionsData, isLoading, error } = useQuery<Permission[]>({
        queryKey: ["permissions"],
        queryFn: async () => {
            const res = await api.get("/core/groups/all_permissions/");
            return res.data.map((perm: Permission) => ({
                ...perm,
                enabled: false, // Initially all permissions are disabled
            }));
        },
        staleTime: 300_000, // 5 minutes
    });

    // Create role mutation
    const createRoleMutation = useMutation({
        mutationFn: async (roleData: { name: string; permission_ids: number[] }) => {
            const res = await api.post("/core/groups/", roleData);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Role created successfully!");
            console.log("Role created:", data);
            // Reset form
            setRoleName("");
            setSections(prev => prev.map(section => ({
                ...section,
                permissions: section.permissions.map(perm => ({
                    ...perm,
                    enabled: false
                })),
                selectedCount: 0
            })));
            // Optional: redirect to roles list
            // router.push('/dashboard/team');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Failed to create role. Please try again.";
            toast.error(errorMessage);
        },
    });

    // Group permissions by content_type into sections
    const menuSections = useMemo<MenuSection[]>(() => {
        if (!permissionsData) return [];

        const grouped = permissionsData.reduce((acc, permission) => {
            const contentType = permission.content_type;
            if (!acc[contentType]) {
                acc[contentType] = [];
            }
            acc[contentType].push(permission);
            return acc;
        }, {} as Record<number, Permission[]>);

        return Object.entries(grouped)
            .map(([contentTypeStr, permissions]) => {
                const contentType = Number(contentTypeStr);
                const mapping = CONTENT_TYPE_MAPPING[contentType] || {
                    name: `Content Type ${contentType}`,
                    icon: <Settings size={20} className="text-[#8B5CF6]" />,
                };

                const selectedCount = permissions.filter((p) => p.enabled).length;

                return {
                    id: `section-${contentType}`,
                    name: mapping.name,
                    icon: mapping.icon,
                    permissions: permissions.sort((a, b) => a.name.localeCompare(b.name)),
                    expanded: true,
                    selectedCount,
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [permissionsData]);

    const [sections, setSections] = useState<MenuSection[]>([]);

    // Update sections when menuSections change
    React.useEffect(() => {
        setSections(menuSections);
    }, [menuSections]);

    const toggleSection = (sectionId: string) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? { ...section, expanded: !section.expanded }
                    : section
            )
        );
    };

    const togglePermission = (sectionId: string, permissionId: number) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id === sectionId) {
                    const updatedPermissions = section.permissions.map((perm) =>
                        perm.id === permissionId
                            ? { ...perm, enabled: !perm.enabled }
                            : perm
                    );
                    const selectedCount = updatedPermissions.filter((p) => p.enabled).length;
                    return { ...section, permissions: updatedPermissions, selectedCount };
                }
                return section;
            })
        );
    };

    const toggleSelectAll = (checked: boolean) => {
        setSections((prev) =>
            prev.map((section) => ({
                ...section,
                permissions: section.permissions.map((perm) => ({
                    ...perm,
                    enabled: checked,
                })),
                selectedCount: checked ? section.permissions.length : 0,
            }))
        );
    };

    const handleSave = () => {
        const selectedPermissions = sections.flatMap((section) =>
            section.permissions.filter((p) => p.enabled).map((p) => p.id)
        );

        if (!roleName.trim()) {
            toast.error("Please enter a role name");
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }

        const roleData = {
            name: roleName.trim(),
            permission_ids: selectedPermissions,
        };

        console.log("Creating role:", roleData);
        createRoleMutation.mutate(roleData);
    };

    const filteredSections = sections.filter((section) =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.permissions.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalSelected = sections.reduce((acc, section) => acc + section.selectedCount, 0);
    const totalPermissions = sections.reduce((acc, section) => acc + section.permissions.length, 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
                <span className="ml-2 text-[#6B7280]">Loading permissions...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Failed to load permissions. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between p-4 border border-[#E5E7EB] rounded-2xl">
                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold text-[#111827]">Role</h1>
                    <p className="text-[#6B7280] mt-1 max-w-md">
                        A role provided access to predefined menus and features so that
                        depending on assigned role an administrator can have access to what
                        he need
                    </p>
                    {/* Role Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#374151]">Role Name</label>
                        <Input
                            placeholder="Enter Role Name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="max-w-md h-9 rounded-lg border-[#D1D5DB]"
                            disabled={createRoleMutation.isPending}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={!roleName.trim() || totalSelected === 0 || createRoleMutation.isPending}
                    className={cn(
                        "px-6 py-2 rounded-full text-white font-medium flex items-center gap-2",
                        "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 disabled:opacity-50"
                    )}
                >
                    {createRoleMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {createRoleMutation.isPending ? "Creating..." : "Save new role"}
                </Button>
            </div>

            {/* Main Menu Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#111827]">MAIN MENU</h2>

                {/* Search and Select All */}
                <div className="flex items-center justify-between">
                    <div className="relative max-w-sm">
                        <Input
                            placeholder="Search permissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 rounded-lg border-[#D1D5DB]"
                            icon={<Search size={16} />}
                            iconPosition="left"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-[#6B7280]">
                            Selected: {totalSelected}/{totalPermissions}
                        </span>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="select-all"
                                checked={totalSelected === totalPermissions && totalPermissions > 0}
                                onCheckedChange={(checked) => toggleSelectAll(checked)}
                                className="data-[state=checked]:bg-[#8B5CF6]"
                            />
                            <label
                                htmlFor="select-all"
                                className="text-sm font-medium text-[#374151] cursor-pointer"
                            >
                                Select All
                            </label>
                        </div>
                    </div>
                </div>

                {/* Menu Sections */}
                <div className="space-y-3">
                    {filteredSections.map((section) => (
                        <Card key={section.id} className="border-0 p-0 overflow-hidden rounded-none shadow-none">
                            <CardContent className="p-0 rounded-none">
                                {/* Section Header */}
                                <div
                                    className="flex items-center justify-between p-2 cursor-pointer bg-[#F5E9FF] rounded-none"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        {section.icon}
                                        <span className="font-medium text-[#681390]">
                                            {section.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-[#681390]">
                                            {section.selectedCount}/{section.permissions.length}
                                        </span>
                                        {section.expanded ? (
                                            <ChevronUp size={20} className="text-[#681390]" />
                                        ) : (
                                            <ChevronDown size={20} className="text-[#681390]" />
                                        )}
                                    </div>
                                </div>

                                {/* Permissions List */}
                                {section.expanded && (
                                    <div className="py-4 space-y-3">
                                        {section.permissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center justify-between space-x-3"
                                            >
                                                <Switch
                                                    id={`permission-${permission.id}`}
                                                    checked={permission.enabled}
                                                    onCheckedChange={() =>
                                                        togglePermission(section.id, permission.id)
                                                    }
                                                    className="data-[state=checked]:bg-[#8B5CF6]"
                                                />
                                                <div className="flex-1">
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="text-sm text-[#374151] cursor-pointer block"
                                                    >
                                                        {permission.name}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateRolePage;