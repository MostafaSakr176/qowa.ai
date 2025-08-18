"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { BadgeDollarSign, Ellipsis, Logs, Search } from "lucide-react";

// Chadcn UI components
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const invoices = [
  {
    id: 1,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    invoice: "#UM-8424",
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    amount: "$328.85",
    method: {
      type: "Mastercard",
      number: "5832••••42",
      logo: <BadgeDollarSign size={30} />,
    },
    status: "rejected",
  },
  {
    id: 2,
    organizations: {
      name: "StellarTech Moo",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    invoice: "#UM-8424",
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    amount: "$328.85",
    method: {
      type: "Mastercard",
      number: "5832••••42",
      logo: <BadgeDollarSign size={25} />,
    },
    status: "pendding",
  },
  {
    id: 3,
    organizations: {
      name: "StellarTech John",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    invoice: "#UM-8424",
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    amount: "$328.85",
    method: {
      type: "Mastercard",
      number: "5832••••42",
      logo: <BadgeDollarSign size={25} />,
    },
    status: "success",
  },
  {
    id: 4,
    organizations: {
      name: "StellarTech Solutions",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    invoice: "#UM-8424",
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    amount: "$328.85",
    method: {
      type: "Mastercard",
      number: "5832••••42",
      logo: <BadgeDollarSign size={25} />,
    },
    status: "rejected",
  },
];

const columns = [
  {
    key: "organizations",
    header: "Organizations",
    render: (row: { organizations: { name: string; mail: string; logo: React.ReactNode } }) => (
      <div className="flex items-center gap-2">
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
    render: (row: { paymentDate: { date: string; time: string } }) => (
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
    render: (row: { method: { type: string; number: string; logo: React.ReactNode } }) => (
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
    render: (row: { status: string }) => (
      <span
        className={`px-4 py-1 rounded-full border ${
          row.status === "rejected"
            ? "border-red-800 text-red-800"
            : row.status === "pendding"
            ? "border-amber-500 text-amber-500"
            : "border-emerald-700 text-emerald-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    render: (row: { id: number }) => (
      <Ellipsis size={20} onClick={() => console.log(row.id)} />
    ),
  },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "pendding", label: "Pendding" },
  { value: "rejected", label: "Rejected" },
];

const PaymentsTable = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let data = invoices;

    // Filter by search (organization name, mail, invoice, method type, etc.)
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      data = data.filter((row) => {
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
      data = data.filter((row) => row.status === status);
    }

    // Sort by status if selected (optional: you can sort, but here we just filter)
    return data;
  }, [search, status]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4 items-center">
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
      <CustomTable data={filteredData} columns={columns} />
    </div>
  );
};

export default PaymentsTable;