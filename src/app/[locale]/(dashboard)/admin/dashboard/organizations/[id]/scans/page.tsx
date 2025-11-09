import React from 'react'
import Scans from './_services/components/clientPage';

interface PageProps {
    params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
  return (
    <Scans id={id} />
  )
}

export default Page