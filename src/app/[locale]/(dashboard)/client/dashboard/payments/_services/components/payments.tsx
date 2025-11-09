"use client";
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Download, Ellipsis, Building2, Search, SquarePen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axiosClient";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
interface Organization {
  id: number;
  name: string;
  business_email: string;
  country: string;
}

interface ApiInvoice {
  id: string;
  organization: Organization;
  amount: string;
  status: string;
  transaction_date: string;
  payment_method: string;
  card_last4?: string;
  card_brand?: string;
}

interface InvoicesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiInvoice[];
}

interface TableInvoice {
  id: string;
  organizations: {
    name: string;
    mail: string;
    logo: React.ReactNode;
  };
  invoice: string;
  paymentDate: { date: string; time: string };
  amount: string;
  method: {
    type: string;
    number: string;
    logo: React.ReactNode;
  };
  status: string;
}

// Helper to format date/time
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  };
}

// Map API data to table row format
function mapInvoices(apiInvoices: ApiInvoice[]): TableInvoice[] {
  return apiInvoices.map((inv) => ({
    id: inv.id,
    organizations: {
      name: inv.organization?.name ?? "",
      mail: inv.organization?.business_email ?? "",
      logo: <Building2 size={20} />,
    },
    invoice: `#${inv.id.slice(0, 8).toUpperCase()}`,
    paymentDate: formatDateTime(inv.transaction_date),
    amount: `$${Number(inv.amount).toLocaleString()}`,
    method: {
      type: inv.card_brand
        ? inv.card_brand.charAt(0).toUpperCase() + inv.card_brand.slice(1)
        : inv.payment_method,
      number: inv.card_last4 ? `•••• ${inv.card_last4}` : "",
      logo: (
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0.25H32C34.0711 0.25 35.75 1.92893 35.75 4V20C35.75 22.0711 34.0711 23.75 32 23.75H4C1.92893 23.75 0.25 22.0711 0.25 20V4C0.25 1.92893 1.92893 0.25 4 0.25Z" fill="white" />
          <path d="M4 0.25H32C34.0711 0.25 35.75 1.92893 35.75 4V20C35.75 22.0711 34.0711 23.75 32 23.75H4C1.92893 23.75 0.25 22.0711 0.25 20V4C0.25 1.92893 1.92893 0.25 4 0.25Z" stroke="#F0F0F1" strokeWidth="0.5" />
          <path d="M21.245 6.34793H14.7553V18.0101H21.245V6.34793Z" fill="#FF5F00" />
          <path d="M15.1674 12.179C15.1664 11.0559 15.4209 9.9472 15.9117 8.93695C16.4025 7.9267 17.1167 7.04135 18.0002 6.34792C16.9061 5.48791 15.592 4.95308 14.2083 4.80457C12.8246 4.65605 11.427 4.89983 10.1753 5.50807C8.92356 6.1163 7.86822 7.06443 7.12988 8.24409C6.39154 9.42376 6 10.7873 6 12.179C6 13.5707 6.39154 14.9343 7.12988 16.1139C7.86822 17.2936 8.92356 18.2417 10.1753 18.85C11.427 19.4582 12.8246 19.702 14.2083 19.5535C15.592 19.405 16.9061 18.8701 18.0002 18.0101C17.1167 17.3167 16.4025 16.4313 15.9117 15.4211C15.4209 14.4108 15.1664 13.3022 15.1674 12.179Z" fill="#EB001B" />
          <path d="M30 12.179C30.0001 13.5707 29.6086 14.9343 28.8703 16.1139C28.132 17.2936 27.0766 18.2417 25.825 18.8499C24.5733 19.4582 23.1757 19.702 21.792 19.5535C20.4083 19.405 19.0943 18.8701 18.0002 18.0101C18.8829 17.316 19.5966 16.4305 20.0873 15.4204C20.578 14.4103 20.833 13.302 20.833 12.179C20.833 11.056 20.578 9.94772 20.0873 8.93763C19.5966 7.92754 18.8829 7.04205 18.0002 6.34792C19.0943 5.48791 20.4083 4.95308 21.792 4.80456C23.1757 4.65605 24.5733 4.89985 25.825 5.50808C27.0766 6.11632 28.132 7.06446 28.8703 8.24412C29.6086 9.42378 30.0001 10.7874 30 12.179Z" fill="#F79E1B" />
          <path d="M29.2924 16.7749V16.5361H29.3887V16.4875H29.1435V16.5361H29.2398V16.7749H29.2924ZM29.7684 16.7749V16.487H29.6933L29.6068 16.685L29.5203 16.487H29.4451V16.7749H29.4982V16.5578L29.5793 16.745H29.6343L29.7154 16.5573V16.7749H29.7684Z" fill="#F79E1B" />
        </svg>
      ),
    },
    status:
      inv.status === "succeeded"
        ? "success"
        : inv.status === "refunded"
          ? "rejected"
          : inv.status,
  }));
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "pendding", label: "Pendding" },
  { value: "rejected", label: "Rejected" },
];

const PaymentsList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Fetch invoices from API using api.get
  const { data, isLoading } = useQuery<InvoicesApiResponse>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await api.get<InvoicesApiResponse>("/payment/transactions/");
      return res.data;
    },
    staleTime: 60_000,
  });

  // Map and filter data
  const filteredData = useMemo(() => {
    const apiInvoices = data?.results ?? [];
    let mapped = mapInvoices(apiInvoices);

    // Filter by search
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      mapped = mapped.filter((row) => {
        return (
          row.organizations.name.toLowerCase().includes(lower) ||
          row.organizations.mail.toLowerCase().includes(lower) ||
          row.invoice.toLowerCase().includes(lower) ||
          row.method.type.toLowerCase().includes(lower) ||
          row.method.number.toLowerCase().includes(lower) ||
          row.amount.toLowerCase().includes(lower)
        );
      });
    }

    // Filter by status
    if (status !== "all") {
      mapped = mapped.filter((row) => row.status === status);
    }

    return mapped;
  }, [data, search, status]);

  // CSV export helper
  const handleExportCsv = () => {
    const dataToExport = selectedRows.size > 0
      ? filteredData.filter(row => selectedRows.has(row.id))
      : filteredData;
    if (!dataToExport.length) return;
    const headers = [
      "Invoice ID",
      "Organization Name",
      "Organization Email",
      "Payment Date",
      "Payment Time",
      "Amount",
      "Method",
      "Card Number",
      "Status"
    ];
    const rows = dataToExport.map((row) => [
      row.invoice,
      row.organizations.name,
      row.organizations.mail,
      row.paymentDate.date,
      row.paymentDate.time,
      row.amount,
      row.method.type,
      row.method.number,
      row.status
    ]);
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
    link.download = `invoices_${selectedRows.size > 0 ? "selected_" : ""}${ts}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      setSelectAll(next.size === filteredData.length && filteredData.length > 0);
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
      render: (row: TableInvoice) => (
        <Checkbox
          checked={selectedRows.has(row.id)}
          onCheckedChange={checked => handleSelectRow(row.id, !!checked)}
          aria-label={`Select row ${row.id}`}
        />
      ),
    },
    {
      key: "id",
      header: "Id",
      render: (row: TableInvoice) => <span className="font-mono"># {row.id}</span>,
    },
    {
      key: "organizations",
      header: "Organizations",
      render: (row: TableInvoice) => (
        <div className="flex items-center text-start gap-2">
          <span className="flex items-center justify-center h-8 w-8 rounded-full p-1 bg-primary text-white">
            {row.organizations.logo}
          </span>
          <div>
            <p className="text-sm text-[#070A0E]">{row.organizations.name}</p>
            <p className="text-sm text-[#4A4C4F]">{row.organizations.mail}</p>
          </div>
        </div>
      ),
    },
    {
      key: "invoice",
      header: "Invoice",
    },
    {
      key: "paymentDate",
      header: "Payment",
      render: (row: TableInvoice) => (
        <div>
          <p className="text-sm text-[#070A0E]">{row.paymentDate.date}</p>
          <p className="text-sm text-[#4A4C4F]">{row.paymentDate.time}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
    },
    {
      key: "method",
      header: "Method",
      render: (row: TableInvoice) => (
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-8 w-8 rounded-sm p-1 text-red-800 border border-[#F0F0F1]">
            {row.method.logo}
          </span>
          <div>
            <p className="text-sm text-[#070A0E]">{row.method.type}</p>
            <p className="text-sm text-[#4A4C4F]">{row.method.number}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: TableInvoice) => (
        <Badge withDot variant={row.status === "rejected" ? "failed" : row.status === "pendding" ? "pending" : "success"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: TableInvoice) => (
        <Popover>
          <PopoverTrigger className="border-0"><Ellipsis size={20} onClick={() => console.log(row.id)} /></PopoverTrigger>
          <PopoverContent className="flex flex-col items-start p-2" align="end">
            <Button variant="ghost" className="rounded-lg"><SquarePen size={18} /> Edit Status</Button>
            <Button variant="ghost" className="rounded-lg"><Download size={18} /> Export Report</Button>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between gap-2 mb-4 items-center">
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={20} />}
            iconPosition="right"
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
        </div>
        <Button
          variant="outline"
          onClick={handleExportCsv}
          disabled={!filteredData.length || isLoading}
          className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white"
        >
          {selectedRows.size > 0
            ? `Export Selected (${selectedRows.size})`
            : "Export All CSV"}
          <Download size={16} className="ml-1" />
        </Button>
      </div>

      <CustomTable data={filteredData} columns={columns} loading={isLoading} />
    </div>
  );
};

export default PaymentsList;