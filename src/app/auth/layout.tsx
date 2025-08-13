import Image from 'next/image';
import React from 'react'

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <main className='w-screen h-screen bg-[#F6F8FA] grid grid-cols-1 lg:grid-cols-2 p-4' >
            <div className='w-full h-full rounded-lg overflow-hidden hidden lg:block'>
                <Image src={'/media/images/auth/auth-img.svg'} alt='logo' width={100} height={100} className='h-full w-full object-cover' />
            </div>
            {children}
        </main>
    )
}

export default AuthLayout