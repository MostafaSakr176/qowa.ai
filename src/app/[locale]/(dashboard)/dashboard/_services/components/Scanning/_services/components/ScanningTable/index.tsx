"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Ellipsis, Logs, Search } from "lucide-react";

// Chadcn UI components
import { Input } from "@/components/ui/input";

const scans = [
  {
    id: 1,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    scans: 267400,
    completed: 267400,
  },
  {
    id: 2,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    scans: 267400,
    completed: 267400,
  },
  {
    id: 3,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    scans: 267400,
    completed: 267400,
  },
  {
    id: 4,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    paymentDate: { date: "June 28, 2023", time: "10:45PM" },
    scans: 267400,
    completed: 267400,
  }
];

const columns = [
  {
    key: "organizations",
    header: "Organizations",
    render: (row: { organizations: { name: string; mail: string; logo: React.ReactNode } }) => (
      <div className="flex items-center justify-center text-start gap-2">
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
    key: "scans",
    header: "Scans",
  },
  {
    key: "completed",
    header: "Completed",
  },
  {
    key: "actions",
    header: "",
    render: (row: { id: number }) => (
      <Ellipsis size={20} onClick={() => console.log(row.id)} />
    ),
  },
];

const ScanningTable = () => {
  const [search, setSearch] = useState("");

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let data = scans;

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

    // Sort by status if selected (optional: you can sort, but here we just filter)
    return data;
  }, [search]);

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

      </div>
      <CustomTable data={filteredData} columns={columns} />
    </div>
  );
};

export default ScanningTable;