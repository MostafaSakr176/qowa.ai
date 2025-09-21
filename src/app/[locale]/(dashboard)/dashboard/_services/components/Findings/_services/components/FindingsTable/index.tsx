"use client"

import React, { useMemo, useState } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Ellipsis, Logs, Search, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface OrgRow {
  id: number;
  name: string;
  business_email: string;
  total_findings: number;
  total_open_findings: number;
  total_closed_findings: number;
}

interface FindingsTableProps {
  organizations: OrgRow[];
  loading?: boolean;
  page: number;
  rowsPerPage: number;   // page size returned from server
  totalCount: number;    // server total count
  totalPages?: number;   // optional; computed if not provided
  onPageChange: (p: number) => void;
}

const FindingsTable: React.FC<FindingsTableProps> = ({
  organizations,
  loading = false,
  page,
  rowsPerPage,
  totalCount,
  totalPages,
  onPageChange,
}) => {
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false); // added

  const computedTotalPages = useMemo(() => {
    if (totalPages && totalPages > 0) return totalPages;
    const rpp = rowsPerPage || 10;
    return Math.max(1, Math.ceil((totalCount || 0) / rpp));
  }, [rowsPerPage, totalCount, totalPages]);

  // Client-side filtering on the current page
  const filteredData = useMemo(() => {
    let data = organizations ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.business_email.toLowerCase().includes(q)
      );
    }
    return data;
  }, [organizations, search]);

  const columns = [
    {
      key: "organization",
      header: "Organization",
      render: (row: OrgRow) => (
        <div className="flex items-center text-start gap-2">
          <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-primary text-white">
            <Logs size={20} />
          </span>
          <div>
            <p className="text-sm text-[#070A0E]">{row.name}</p>
            <p className="text-sm text-[#4A4C4F]">{row.business_email}</p>
          </div>
        </div>
      ),
    },
    { key: "total_findings", header: "Total Findings" },
    { key: "total_open_findings", header: "Open" },
    { key: "total_closed_findings", header: "Closed" },

  ];

  // CSV helpers
  const csvEscape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const headers = [
        "ID",
        "Organization",
        "Email",
        "Total Findings",
        "Open",
        "Closed",
      ];

      const rows = filteredData.map((r) => [
        r.id,
        r.name,
        r.business_email,
        r.total_findings,
        r.total_open_findings,
        r.total_closed_findings,
      ]);

      const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const pad = (n: number) => String(n).padStart(2, "0");
      const d = new Date();
      a.download = `findings_organizations_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
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

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="w-full md:w-64">
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

      <CustomTable data={filteredData} columns={columns} loading={loading} />
    </div>
  );
};

export default FindingsTable;