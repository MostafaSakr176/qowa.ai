import React from 'react'
import ScansList from './_services/components/ScansList'

interface PageProps {
    params: Promise<{ id: string }>;
}


const Scans = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const id = resolvedParams.id;


    return (
        <ScansList />
    )
}

export default Scans