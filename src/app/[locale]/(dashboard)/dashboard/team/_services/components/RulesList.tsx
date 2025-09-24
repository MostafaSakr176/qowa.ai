"use client";

import React, { useMemo, useState } from "react";
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
import { Pencil, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = {
  id: string;
  name: string;
  totalUsers: number;
  totalRoles: number;
  members: { initials: string; bg: string }[];
};

interface RulesListProps {
  roles?: Role[];
  onCreate?: () => void;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

const demoRoles: Role[] = [
  {
    id: "1",
    name: "view user",
    totalUsers: 29,
    totalRoles: 11,
    members: [
      { initials: "KJ", bg: "bg-[#EF4444]" },
      { initials: "ND", bg: "bg-[#F59E0B]" },
      { initials: "GM", bg: "bg-[#60A5FA]" },
      { initials: "MH", bg: "bg-[#93C5FD]" },
    ],
  },
  {
    id: "2",
    name: "secure",
    totalUsers: 29,
    totalRoles: 11,
    members: [
      { initials: "KJ", bg: "bg-[#EF4444]" },
      { initials: "ND", bg: "bg-[#F59E0B]" },
      { initials: "GM", bg: "bg-[#60A5FA]" },
      { initials: "MH", bg: "bg-[#93C5FD]" },
    ],
  },
  {
    id: "3",
    name: "basic user",
    totalUsers: 29,
    totalRoles: 11,
    members: [
      { initials: "KJ", bg: "bg-[#EF4444]" },
      { initials: "ND", bg: "bg-[#F59E0B]" },
      { initials: "GM", bg: "bg-[#60A5FA]" },
      { initials: "MH", bg: "bg-[#93C5FD]" },
    ],
  },
  {
    id: "4",
    name: "marketing",
    totalUsers: 29,
    totalRoles: 11,
    members: [
      { initials: "KJ", bg: "bg-[#EF4444]" },
      { initials: "ND", bg: "bg-[#F59E0B]" },
      { initials: "GM", bg: "bg-[#60A5FA]" },
      { initials: "MH", bg: "bg-[#93C5FD]" },
    ],
  },
];

const RulesList: React.FC<RulesListProps> = ({
  roles = demoRoles,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc" | "users_desc">(
    "name_asc"
  );

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

        <Button
          onClick={() => onCreate?.()}
          className={cn(
            "h-10 rounded-full px-5 text-white",
            "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
          )}
        >
          Create new role
        </Button>
      </div>

      {/* Cards grid */}
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
                <span className="text-[#6B7280] font-semibold text-sm">({role.totalUsers})</span>
              </div>

              <div className="mt-6">
                <span className="text-[#111827] font-semibold">Roles</span>
                <span className="ml-2 font-bold">({role.totalRoles})</span>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <div className="w-full flex items-center justify-between pt-3">
                <button
                  onClick={() => onDelete?.(role)}
                  className="inline-flex items-center gap-2 text-[#EF4444] hover:opacity-80"
                >
                  <Trash2 size={18} />
                  <span className="font-medium">Delete</span>
                </button>
                <Separator orientation="vertical"  className="!h-8 w-[1px] bg-[#E5E7EB]" />
                <button
                  onClick={() => onEdit?.(role)}
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
    </div>
  );
};

export default RulesList;