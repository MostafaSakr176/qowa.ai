"use client";

import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Ellipsis, Building2, Search, Download, Loader2 } from "lucide-react";

// Chadcn UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface OrganizationRow {
  id: number;
  name: string;
  business_email: string;
  first_scan_date: string | null;
  total_scans: number;
  total_completed_scans: number;
}

const OrganizationsTable = ({ organizations = [] }: { organizations: OrganizationRow[] }) => {
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let data = organizations;

    // Filter by search (organization name, mail, invoice, method type, etc.)
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      data = data.filter((row) => {
        return (
          row.name.toLowerCase().includes(lower) ||
          row.business_email.toLowerCase().includes(lower)
        );
      });
    }

    // Sort by status if selected (optional: you can sort, but here we just filter)
    return data;
  }, [search, organizations]);

  // CSV helpers
  const csvEscape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const headers = ["ID", "Organization", "Email", "First Scan", "Total Scans", "Completed"];
      const rows = filteredData.map((r) => [
        r.id,
        r.name,
        r.business_email,
        r.first_scan_date ? new Date(r.first_scan_date).toISOString().slice(0, 10) : "",
        r.total_scans,
        r.total_completed_scans,
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map(csvEscape).join(","))
        .join("\r\n");

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      const pad = (n: number) => String(n).padStart(2, "0");
      const d = new Date();
      a.download = `organizations_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
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
      key: "id",
      header: "ID",
      render: (row: OrganizationRow) => row.id,
    },
    {
      key: "name",
      header: "Organization",
      render: (row: OrganizationRow) => (
        <div className="flex items-center text-start gap-2">
          <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-primary text-white">
            <Building2 size={20} />
          </span>
          <div>
            <p className="text-sm text-[#070A0E]">{row.name}</p>
            <p className="text-sm text-[#4A4C4F]">{row.business_email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "first_scan_date",
      header: "First Scan",
      render: (row: OrganizationRow) =>
        row.first_scan_date ? new Date(row.first_scan_date).toLocaleDateString() : "—",
    },
    {
      key: "total_scans",
      header: "Total Scans",
      render: (row: OrganizationRow) => row.total_scans,
    },
    {
      key: "total_completed_scans",
      header: "Completed",
      render: (row: OrganizationRow) => row.total_completed_scans,
    },
    {
      key: "actions",
      header: "",
      render: (row: { id: number }) => (
        <Ellipsis size={20} onClick={() => console.log(row.id)} />
      ),
    },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center justify-between">

        <div className="max-w-sm">
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={20} />}
            iconPosition="right"
          />
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
      <CustomTable data={filteredData} columns={columns} loading={false} />
    </div>
  );
};

export default OrganizationsTable;