"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axiosClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    ArrowLeft,
    UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/navigation";

interface Permission {
    id: number;
    name: string;
    codename: string;
    content_type: number;
    enabled: boolean;
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_2fa_enabled: boolean;
    created_at: string;
    last_login: string | null;
}

interface Employee {
    id: number;
    user: User;
    group_name: string | null;
    group_id: number | null;
}

interface EmployeesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Employee[];
}

interface RoleData {
    id: number;
    name: string;
    permissions: Array<{
        id: number;
        name: string;
        codename: string;
        content_type: number;
    }>;
    members: Array<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    }>;
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

// Helper function to get user initials
const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

// Helper function to get avatar color
const getAvatarColor = (index: number) => {
    const colors = [
        "bg-[#EF4444]", "bg-[#F59E0B]", "bg-[#60A5FA]", "bg-[#93C5FD]",
        "bg-[#10B981]", "bg-[#8B5CF6]", "bg-[#F97316]", "bg-[#06B6D4]"
    ];
    return colors[index % colors.length];
};

const EditRolePage = () => {
    const [roleName, setRoleName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sections, setSections] = useState<MenuSection[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleId = searchParams.get('id');

    // Fetch all permissions
    const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useQuery<Permission[]>({
        queryKey: ["permissions"],
        queryFn: async () => {
            const res = await api.get("/core/groups/all_permissions/");
            return res.data.map((perm: Permission) => ({
                ...perm,
                enabled: false,
            }));
        },
        staleTime: 300_000,
    });

    // Fetch role details if editing
    const { data: roleData, isLoading: roleLoading, error: roleError, refetch: refetchRole } = useQuery<RoleData>({
        queryKey: ["role", roleId],
        queryFn: async () => {
            if (!roleId) throw new Error("No role ID provided");
            const res = await api.get(`/core/groups/${roleId}/`);
            return res.data;
        },
        enabled: !!roleId,
    });

    // Fetch employees for user selection
    const { data: employeesData, isLoading: employeesLoading } = useQuery<EmployeesResponse>({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await api.get("/employee/employees/");
            return res.data;
        },
        staleTime: 300_000,
    });

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async (roleData: { name: string; permission_ids: number[] }) => {
            if (!roleId) throw new Error("No role ID provided");
            const res = await api.patch(`/core/groups/${roleId}/`, roleData);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Role updated successfully!");
            console.log("Role updated:", data);
            router.push('/admin/dashboard/team');
        },
        onError: (error: Error) => {
            const errorMessage = error?.message ||
                               "Failed to update role. Please try again.";
            toast.error(errorMessage);
        },
    });

    // Add user to role mutation
    const addUserMutation = useMutation({
        mutationFn: async (userId: number) => {
            if (!roleId) throw new Error("No role ID provided");
            const res = await api.post(`/core/groups/${roleId}/add-users/`, {
                user_ids: [userId]
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("User added to role successfully!");
            setSelectedUserId("");
            refetchRole();
        },
        onError: (error: Error) => {
            const errorMessage = error?.message ||
                               "Failed to add user to role.";
            toast.error(errorMessage);
        },
    });

    // Group permissions by content_type into sections
    const menuSections = useMemo<MenuSection[]>(() => {
        if (!permissionsData) return [];

        const rolePermissionIds = roleData?.permissions?.map(p => p.id) || [];

        const grouped = permissionsData.reduce((acc, permission) => {
            const contentType = permission.content_type;
            if (!acc[contentType]) {
                acc[contentType] = [];
            }
            const enabled = rolePermissionIds.includes(permission.id);
            acc[contentType].push({ ...permission, enabled });
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
    }, [permissionsData, roleData]);

    // Update sections when menuSections change
    React.useEffect(() => {
        setSections(menuSections);
    }, [menuSections]);

    // Set role name when role data loads
    React.useEffect(() => {
        if (roleData) {
            setRoleName(roleData.name);
        }
    }, [roleData]);

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

        updateRoleMutation.mutate(roleData);
    };

    const handleAddUser = () => {
        if (!selectedUserId) {
            toast.error("Please select a user to add");
            return;
        }
        addUserMutation.mutate(Number(selectedUserId));
    };

    // Filter available users (exclude those already in the role)
    const availableUsers = useMemo(() => {
        if (!employeesData || !roleData) return [];
        
        const roleUserIds = roleData.members.map(member => member.id);
        return employeesData.results.filter(employee => 
            !roleUserIds.includes(employee.user.id)
        );
    }, [employeesData, roleData]);

    const filteredSections = sections.filter((section) =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.permissions.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalSelected = sections.reduce((acc, section) => acc + section.selectedCount, 0);
    const totalPermissions = sections.reduce((acc, section) => acc + section.permissions.length, 0);

    const isLoading = permissionsLoading || roleLoading;
    const error = permissionsError || roleError;

    if (!roleId) {
        return (
            <div className="text-center text-red-600 p-4">
                No role ID provided for editing.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
                <span className="ml-2 text-[#6B7280]">Loading role data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Failed to load role data. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between p-4 border border-[#E5E7EB] rounded-2xl">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/admin/dashboard/team')}
                            className="p-2"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <h1 className="text-2xl font-semibold text-[#111827]">Edit Role</h1>
                    </div>
                    <p className="text-[#6B7280] mt-1 max-w-md">
                        Edit role permissions and settings. Changes will affect all users assigned to this role.
                    </p>
                    {/* Role Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#374151]">Role Name</label>
                        <Input
                            placeholder="Enter Role Name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="max-w-md h-9 rounded-lg border-[#D1D5DB]"
                            disabled={updateRoleMutation.isPending}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={!roleName.trim() || totalSelected === 0 || updateRoleMutation.isPending}
                    className={cn(
                        "px-6 py-2 rounded-full text-white font-medium flex items-center gap-2",
                        "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 disabled:opacity-50"
                    )}
                >
                    {updateRoleMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
                </Button>
            </div>

            {/* Role Members Section */}
            <Card className="border border-[#E5E7EB] rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#111827] flex items-center gap-2">
                        <Users size={24} className="text-[#8B5CF6]" />
                        Role Members ({roleData?.members.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add User Section */}
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-[#374151] block mb-2">
                                Add User to Role
                            </label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a user to add..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employeesLoading ? (
                                        <SelectItem value="loading" disabled>
                                            <div className="flex items-center gap-2">
                                                <Loader2 size={16} className="animate-spin" />
                                                Loading users...
                                            </div>
                                        </SelectItem>
                                    ) : availableUsers.length === 0 ? (
                                        <SelectItem value="no-users" disabled>
                                            No available users
                                        </SelectItem>
                                    ) : (
                                        availableUsers.map((employee) => (
                                            <SelectItem key={employee.user.id} value={employee.user.id.toString()}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className={cn(
                                                            "text-xs font-semibold text-white",
                                                            getAvatarColor(employee.user.id)
                                                        )}>
                                                            {getInitials(employee.user.first_name, employee.user.last_name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-medium">
                                                            {employee.user.first_name} {employee.user.last_name}
                                                        </div>
                                                        <div className="text-sm text-[#6B7280]">
                                                            {employee.user.email}
                                                        </div>
                                                        </div>
                                                        {employee.group_name && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {employee.group_name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleAddUser}
                            disabled={!selectedUserId || addUserMutation.isPending}
                            className={cn(
                                "px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2",
                                "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 disabled:opacity-50"
                            )}
                        >
                            {addUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus size={16} />
                            )}
                            {addUserMutation.isPending ? "Adding..." : "Add User"}
                        </Button>
                    </div>

                    {/* Current Members */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-[#374151]">Current Members</h3>
                        {roleData?.members && roleData.members.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {roleData.members.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className={cn(
                                                    "text-xs font-semibold text-white",
                                                    getAvatarColor(index)
                                                )}>
                                                    {getInitials(member.first_name, member.last_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {member.first_name} {member.last_name}
                                                </div>
                                                <div className="text-xs text-[#6B7280]">
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#6B7280]">
                                <Users size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No members assigned to this role yet.</p>
                                <p className="text-sm">Add users using the dropdown above.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#111827]">PERMISSIONS</h2>

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

export default EditRolePage;