"use client"
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { Ellipsis, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";


interface Organization {
  organization_name: string;
  business_email: string;
  num_apks: number;
  num_ipas: number;
  num_postman: number;
}

// Helper to map API organizations to table rows
function mapOrganizationsToRows(organizations: Organization[]) {
  return organizations.map((org, idx) => ({
    id: idx + 1,
    organizations: {
      name: org.organization_name,
      mail: org.business_email,
      logo: <Building2 size={20} />,
    },
    total: org.num_apks + org.num_ipas + org.num_postman,
    open: org.num_apks,      // You can adjust these fields as needed
    closed: org.num_postman, // You can adjust these fields as needed
  }));
}

const columns = [
  {
    key: "organizations",
    header: "Organizations",
    render: (row: { organizations: { name: string; mail: string; logo: React.ReactNode } }) => (
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
    key: "total",
    header: "Total Reports",
  },
  {
    key: "open",
    header: "APK Reports",
  },
  {
    key: "closed",
    header: "Postman Reports",
  }
];

const OrganizationsTable = ({ organizations, loading }: { organizations: Organization[]; loading: boolean }) => {
  const [search, setSearch] = useState("");

  // Map API organizations to table rows
  const mappedRows = useMemo(() => mapOrganizationsToRows(organizations), [organizations]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let data = mappedRows;

    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      data = data.filter((row) => {
        return (
          row.organizations.name.toLowerCase().includes(lower) ||
          row.organizations.mail.toLowerCase().includes(lower)
        );
      });
    }

    return data;
  }, [search, mappedRows]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4 items-center">
        <Input
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={20} />}
          iconPosition="right"
        />
      </div>
      <CustomTable data={filteredData} columns={columns} loading={loading} />
    </div>
  );
};

export default OrganizationsTable;