import { Button } from '@/components/ui/button'
import { BadgeCheck, SquarePen } from 'lucide-react'
import React from 'react'
import ClientPage from './_services/components/ClientPage'

interface PageProps {
    params: Promise<{ scanId: string }>;
}

const Scans = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const id = resolvedParams?.scanId;

    return (
        <div>
            <ClientPage scanId={id} />
        </div>
    )
}

export default Scans