"use client"

import React, { useMemo, useState } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Building2, Search, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Ticket = {
  id: string;
  organization: { id: number; name: string; business_email: string };
  assigned_employee: null | { id: number; name: string } | string;
  type: string;
  status: string;
  priority: string;
  created_at: string;
};

interface SupportTableProps {
  tickets: Ticket[];
  loading?: boolean;
  page: number;
  rowsPerPage: number;      // length of tickets returned by server for current page
  totalCount: number;       // server total count
  totalPages?: number;      // optional; will be computed if not provided
  onPageChange: (page: number) => void;
}

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "finished", label: "Finished" },
  { value: "pending", label: "Pending" },
];

const priorityOptions = [
  { value: "all", label: "All priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const statusToVariant = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "open":
    case "pending":
    case "in_progress":
      return "pending";
    case "closed":
    case "finished":
    case "resolved":
      return "success";
    default:
      return "failed";
  }
};

const priorityToVariant = (priority?: string) => {
  switch ((priority || "").toLowerCase()) {
    case "high":
    case "urgent":
    case "critical":
      return "failed";
    case "medium":
      return "pending";
    case "low":
    default:
      return "success";
  }
};

const SupportTable: React.FC<SupportTableProps> = ({
  tickets,
  loading = false,
  page,
  rowsPerPage,
  totalCount,
  totalPages,
  onPageChange,
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [isExporting, setIsExporting] = useState(false); // added

  const computedTotalPages = useMemo(() => {
    if (totalPages && totalPages > 0) return totalPages;
    const rpp = rowsPerPage || 10;
    return Math.max(1, Math.ceil((totalCount || 0) / rpp));
  }, [rowsPerPage, totalCount, totalPages]);

  const filteredData = useMemo(() => {
    let data = tickets ?? [];

    // search in org name/email, ticket id, type, status, priority
    if (search.trim()) {
      const lower = search.toLowerCase();
      data = data.filter((t) => {
        const assignedName =
          typeof t.assigned_employee === "string"
            ? t.assigned_employee
            : t.assigned_employee?.name || "";
        return (
          t.id.toLowerCase().includes(lower) ||
          t.organization.name.toLowerCase().includes(lower) ||
          t.organization.business_email.toLowerCase().includes(lower) ||
          (t.type || "").toLowerCase().includes(lower) ||
          (t.status || "").toLowerCase().includes(lower) ||
          (t.priority || "").toLowerCase().includes(lower) ||
          assignedName.toLowerCase().includes(lower)
        );
      });
    }

    if (status !== "all") {
      data = data.filter((t) => (t.status || "").toLowerCase() === status);
    }
    if (priority !== "all") {
      data = data.filter((t) => (t.priority || "").toLowerCase() === priority);
    }

    return data;
  }, [tickets, search, status, priority]);

  // CSV helpers and export handler
  const csvEscape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const headers = [
        "Ticket ID",
        "Organization",
        "Email",
        "Type",
        "Assigned",
        "Status",
        "Priority",
        "Registration Date",
      ];
      const rows = filteredData.map((t) => {
        const assigned =
          typeof t.assigned_employee === "string"
            ? t.assigned_employee
            : t.assigned_employee?.name || "Not assigned";
        const created = new Date(t.created_at).toISOString(); // ISO for consistency
        return [
          t.id,
          t.organization.name,
          t.organization.business_email,
          t.type,
          assigned,
          t.status,
          t.priority,
          created,
        ];
      });

      const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const pad = (n: number) => String(n).padStart(2, "0");
      const d = new Date();
      a.download = `support_tickets_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
        d.getHours()
      )}${pad(d.getMinutes())}${pad(d.getSeconds())}.csv`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      key: "organization",
      header: "Organization",
      render: (row: Ticket) => (
        <div className="flex items-center text-start gap-2">
          <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-primary text-white">
            <Building2 size={20} />
          </span>
          <div>
            <p className="text-sm text-[#070A0E]">{row.organization.name}</p>
            <p className="text-sm text-[#4A4C4F]">{row.organization.business_email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row: Ticket) => capitalize(row.type),
    },
    {
      key: "assigned",
      header: "Assigned",
      render: (row: Ticket) => {
        const assigned =
          typeof row.assigned_employee === "string"
            ? row.assigned_employee
            : row.assigned_employee?.name;
        return assigned ? (
          <div>
            <p className="text-sm text-[#070A0E]">{assigned}</p>
          </div>
        ) : (
          <span className="text-sm text-[#6B7280] italic">Not assigned</span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: Ticket) => (
        <Badge withDot variant={statusToVariant(row.status)}>
          {capitalize(row.status)}
        </Badge>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (row: Ticket) => (
        <Badge withDot variant={priorityToVariant(row.priority)}>
          {capitalize(row.priority)}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Registration date",
      render: (row: Ticket) => {
        const d = new Date(row.created_at);
        return (
          <div>
            <p className="text-sm text-[#070A0E]">
              {d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-sm text-[#4A4C4F]">
              {d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        );
      },
    }
  ];

  return (
    <div>
      {/* Filters + Export */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={20} />}
            iconPosition="right"
            className="w-full md:w-64"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCsv}
          disabled={!filteredData.length || isExporting}
          className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Table */}
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SupportTable;