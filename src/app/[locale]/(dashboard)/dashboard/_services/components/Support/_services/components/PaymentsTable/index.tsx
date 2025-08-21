"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Ellipsis, Logs, Search } from "lucide-react";

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
    type: "Complaint",
    assigned: { name: "Mostafa Sakr", username: "@sakr" },
    priority: "Open",
    registerationDate: { date: "June 28, 2023", time: "10:45PM" },
  },
  {
    id: 2,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    type: "Complaint",
    assigned: { name: "Mostafa Sakr", username: "@sakr" },
    priority: "Closed",
    registerationDate: { date: "June 28, 2023", time: "10:45PM" },
  },
  {
    id: 3,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    type: "Complaint",
    assigned: { name: "Mostafa Sakr", username: "@sakr" },
    priority: "Open",
    registerationDate: { date: "June 28, 2023", time: "10:45PM" },
  },
  {
    id: 4,
    organizations: {
      name: "StellarTech sakr",
      mail: "stellartech@uimiye.com",
      logo: <Logs size={20} />,
    },
    type: "Complaint",
    assigned: { name: "Mostafa Sakr", username: "@sakr" },
    priority: "Closed",
    registerationDate: { date: "June 28, 2023", time: "10:45PM" },
  },
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
    key: "type",
    header: "Type",
  },
  {
    key: "assigned",
    header: "Assigned",
    render: (row: { assigned: { name: string; username: string } }) => (
      <div>
        <p className="text-sm text-[#070A0E]">{row.assigned.name}</p>
        <p className="text-sm text-[#4A4C4F]">{row.assigned.username}</p>
      </div>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (row: { priority: string }) => (
      <span
        className={`px-4 py-1 rounded-full border ${
          row.priority === "Closed"
            ? "border-red-800 text-red-800"
            : "border-emerald-700 text-emerald-700"
        }`}
      >
        {row.priority}
      </span>
    ),
  },
  {
    key: "registerationDate",
    header: "registeration date",
    render: (row: { registerationDate: { date: string; time: string } }) => (
      <div>
        <p className="text-sm text-[#070A0E]">{row.registerationDate.date}</p>
        <p className="text-sm text-[#4A4C4F]">{row.registerationDate.time}</p>
      </div>
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

const priorityOptions = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "finished", label: "Finished" },
];

const SupportTable = () => {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

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
          row.assigned.name.toLowerCase().includes(lower) ||
          row.assigned.username.toLowerCase().includes(lower)
        );
      });
    }

    // Filter by status
    if (priority !== "all") {
      data = data.filter((row) => row.priority === priority);
    }

    // Sort by priority if selected (optional: you can sort, but here we just filter)
    return data;
  }, [search, priority]);

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
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
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
      <CustomTable data={filteredData} columns={columns} />
    </div>
  );
};

export default SupportTable;