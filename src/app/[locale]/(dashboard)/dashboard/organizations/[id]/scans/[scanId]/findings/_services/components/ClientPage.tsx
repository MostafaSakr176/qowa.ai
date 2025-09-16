"use client";
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axiosClient';
import FindingsList from './FindingsList';
import Statistics from './Statistics';
export interface Evidence {
    id: number;
    description: string | null;
    file: string;
    uploaded_at: string;
}

export interface ScanFinding {
    id: number;
    scan: number;
    title: string;
    description: string;
    steps_to_reproduce: string;
    impact: string;
    severity: "critical" | "high" | "medium" | "low";
    status: "open" | "closed";
    evidences: Evidence[];
    created_at: string;
    updated_at: string;
}

const fetchFindings = async (scanId: string) => {
    const res = await api.get(`/scan/findings/?scan=${scanId}`);
    // If your API returns { results: ScanFinding[] }, adjust accordingly:
    // return res.data.results || [];
    return res.data || [];
};

const ClientPage = ({ scanId }: { scanId: string }) => {
    const { data: findingsData, isLoading, isError, error } = useQuery({
        queryKey: ['scan-findings', scanId],
        queryFn: () => fetchFindings(scanId),
    });

    console.log(findingsData);
    

    if (isError) return <div>Error: {error?.message}</div>;

    return (
            <div className='grid grid-cols-5 items-start gap-4'>
                <div className='col-span-4'>
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <FindingsList findings={findingsData?.results} scanId={scanId} />
                    </div>
                </div>
                <div className='col-span-1 space-y-4'>
                    <Statistics statisticsData={findingsData?.statistics} />
                </div>
            </div>
    );
}

export default ClientPage