"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Pencil, Search, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, Link } from "@/i18n/navigation";
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
import toast from "react-hot-toast";

// API types
interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

interface Member {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface ApiRole {
  id: number;
  name: string;
  permissions: Permission[];
  members: Member[];
}

interface RolesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiRole[];
}

// UI types
type Role = {
  id: string;
  name: string;
  totalUsers: number;
  totalRoles: number;
  members: { initials: string; bg: string }[];
};

interface RulesListProps {
  onCreate?: () => void;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

// Helper function to generate avatar colors
const getAvatarColor = (index: number) => {
  const colors = [
    "bg-[#EF4444]", // red
    "bg-[#F59E0B]", // amber
    "bg-[#60A5FA]", // blue
    "bg-[#93C5FD]", // light blue
    "bg-[#10B981]", // emerald
    "bg-[#8B5CF6]", // violet
    "bg-[#F97316]", // orange
    "bg-[#06B6D4]", // cyan
  ];
  return colors[index % colors.length];
};

// Helper function to get initials
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

// Transform API data to UI data
const transformRoles = (apiRoles: ApiRole[]): Role[] => {
  return apiRoles.map((role) => ({
    id: role.id.toString(),
    name: role.name,
    totalUsers: role.members.length,
    totalRoles: role.permissions.length,
    members: role.members.slice(0, 4).map((member, index) => ({
      initials: getInitials(member.first_name, member.last_name),
      bg: getAvatarColor(index),
    })),
  }));
};

const RulesList: React.FC<RulesListProps> = ({
  onCreate,
}) => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc" | "users_desc">(
    "name_asc"
  );

  // NEW: State for delete confirmation
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const router = useRouter();

  // Fetch roles from API
  const { data: rolesData, isLoading, error, refetch } = useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/core/groups/");
      return res.data;
    },
    staleTime: 300_000, // 5 minutes
  });

  // Transform and filter roles
  const roles = useMemo(() => {
    if (!rolesData?.results) return [];
    return transformRoles(rolesData.results);
  }, [rolesData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = roles.filter((r) => r.name.toLowerCase().includes(q));

    switch (sortBy) {
      case "name_desc":
        data = data.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "users_desc":
        data = data.sort((a, b) => b.totalUsers - a.totalUsers);
        break;
      default:
        data = data.sort((a, b) => a.name.localeCompare(b.name));
    }
    return data;
  }, [roles, query, sortBy]);

  // NEW: Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      await api.delete(`/core/groups/${roleId}/`);
    },
    onSuccess: () => {
      toast.success("Role deleted successfully");
      setDeleteRoleId(null);
      setRoleToDelete(null);
      refetch();
    },
    onError: (error: Error) => {
      const errorMessage = error?.message ||
        "Failed to delete role. Please try again.";
      toast.error(errorMessage);
      setDeleteRoleId(null);
      setRoleToDelete(null);
    },
  });

  // NEW: Handle delete click (opens confirmation dialog)
  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteRoleId(role.id);
  };

  // NEW: Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteRoleId) {
      deleteRoleMutation.mutate(deleteRoleId);
    }
  };

  // NEW: Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteRoleId(null);
    setRoleToDelete(null);
  };

  // Handle edit role - navigate to edit-role page with ID
  const handleEditRole = (role: Role) => {
    router.push(`/admin/dashboard/team/edit-role?id=${role.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] rounded-xl bg-[#F8F9FA] p-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
        <span className="ml-2 text-[#6B7280]">Loading roles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-[#F8F9FA] p-6">
        <div className="text-center text-red-600 p-4">
          <p>Failed to load roles. Please try again.</p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl bg-[#F8F9FA] p-2">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="min-w-sm">
            <Input
              placeholder="Search ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search className="text-[#9CA3AF]" size={18} />}
              iconPosition="right"
              className="h-10 w-full rounded-full pl-4 pr-10"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={(v: typeof sortBy) => setSortBy(v)}
          >
            <SelectTrigger className="h-10 w-[140px] rounded-full px-4">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Sort by</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="users_desc">Users (high → low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link href="/admin/dashboard/team/create-role">
          <Button
            onClick={() => onCreate?.()}
            className={cn(
              "h-10 rounded-full px-5 text-white",
              "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
            )}
          >
            Create new role
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !query ? (
        <div className="text-center py-12">
          <p className="text-[#6B7280] mb-4">No roles found</p>
          <Button
            onClick={() => onCreate?.()}
            className={cn(
              "rounded-full px-6 text-white",
              "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
            )}
          >
            Create your first role
          </Button>
        </div>
      ) : filtered.length === 0 && query ? (
        <div className="text-center py-12">
          <p className="text-[#6B7280]">No roles match your search</p>
        </div>
      ) : (
        /* Cards grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((role) => (
            <Card
              key={role.id}
              className="border-[#E5E7EB] rounded-2xl shadow-none hover:shadow-sm transition gap-2"
            >
              <CardHeader className="">
                <CardTitle className="text-[24px] leading-7 font-bold text-[#0D0D12] capitalize">
                  {role.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  {role.members.length > 0 ? (
                    <div className="flex -space-x-2">
                      {role.members.map((m, i) => (
                        <Avatar
                          key={i}
                          className={cn(
                            "h-7 w-7 ring-2 ring-white shadow-sm",
                            "data-[slot=avatar]:ring-background"
                          )}
                        >
                          <AvatarFallback
                            className={cn(
                              "text-[10px] font-semibold text-white",
                              m.bg
                            )}
                          >
                            {m.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#9CA3AF]">No members</div>
                  )}
                  <span className="text-[#6B7280] font-semibold text-sm">
                    ({role.totalUsers})
                  </span>
                </div>

                <div className="mt-6">
                  <span className="text-[#111827] font-semibold">Permissions</span>
                  <span className="ml-2 font-bold">({role.totalRoles})</span>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <div className="w-full flex items-center justify-around pt-3">
                  <button
                    onClick={() => handleDeleteClick(role)}
                    disabled={deleteRoleMutation.isPending}
                    className="inline-flex items-center gap-2 text-[#EF4444] hover:opacity-80 disabled:opacity-50"
                  >
                    {deleteRoleMutation.isPending && deleteRoleId === role.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                    <span className="font-medium">
                      {deleteRoleMutation.isPending && deleteRoleId === role.id ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                  <Separator orientation="vertical" className="!h-8 w-[1px] bg-[#E5E7EB]" />
                  <button
                    onClick={() => handleEditRole(role)}
                    className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#111827]"
                  >
                    <Pencil size={18} />
                    <span className="font-medium">Edit</span>
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* NEW: Delete Confirmation Dialog */}
      <AlertDialog open={deleteRoleId !== null} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role <strong>&quot;{roleToDelete?.name}&quot;</strong>?
              This action cannot be undone and will remove the role from all assigned users.
              {roleToDelete?.totalUsers && roleToDelete.totalUsers > 0 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  Warning: This role is currently assigned to {roleToDelete.totalUsers} user(s).
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              disabled={deleteRoleMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteRoleMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteRoleMutation.isPending ? "Deleting..." : "Delete Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RulesList;