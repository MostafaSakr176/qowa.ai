"use client"

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button'
import { ArrowLeft, BadgeCheck, SquarePen } from 'lucide-react'
import ScansList from './ScansList'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";
import api from "@/lib/axiosClient";
import CreateOrganizationForm from "../../../../_services/components/CreateForm";

const Scans = ({ id }: { id: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();

    // TanStack Query for organization details
    const { data: organization, refetch, isLoading } = useQuery({
        queryKey: ["organization-details", id, session?.accessToken],
        queryFn: async () => {
            const res = await api.get(
                `/client/organizations/${id}/`);
            return res.data;
        },
        enabled: !!session?.accessToken && !!id,
        // staleTime: 60_000,
    });

    const formatedOrganization = organization ? {
        ...organization,
        organizations: {
            name: organization.name,
            mail: organization.business_email,
            logo: '',
        },
        teams: organization.team_members_count || [],
        // created_at: new Date(organization.created_at),
        // updated_at: new Date(organization.updated_at),
    } : null;

    return (
        <div>
            <div className="flex items-center justify-between w-full border-b border-[#DADADB] pb-4 mb-4">
                {/* Left: Avatar, Name, Verified, Pro, Email */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {organization?.name ? organization.name[0] : "?"}
                    </div>
                    {/* Name, badges, email */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-base text-[#070A0E]">
                                {isLoading ? "Loading..." : organization?.name ?? "Organization"}
                            </span>
                            <span className="inline-flex items-center">
                                <BadgeCheck size={20} color='#1A4DFF' />
                            </span>
                        </div>
                        <span className="text-xs text-[#6B7280]">
                            {organization?.business_email ?? ""}
                        </span>
                    </div>
                </div>
                {/* Right: Edit Details Button */}
                <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <SheetTrigger asChild >
                        <Button variant={'outline'} className='border border-primary text-primary' size="lg" >
                            <SquarePen size={15} />
                            Edit Organization
                        </Button>
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4">
                                <ArrowLeft size={20} onClick={() => { setIsModalOpen(false); }} />
                                <span>Edit Organization</span>
                            </SheetTitle>
                        </SheetHeader>
                        {organization && (
                            <CreateOrganizationForm editOrganization={formatedOrganization} refetch={refetch} setIsModalOpen={setIsModalOpen} />
                        )}
                    </SheetContent>
                </Sheet>
            </div>
            <div className='rounded-xl bg-[#F8F9FA] p-2'>
                <ScansList organizationId={id} />
            </div>
        </div>
    )
}

export default Scans