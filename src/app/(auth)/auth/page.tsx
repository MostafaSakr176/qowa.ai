import Image from 'next/image'
import React from 'react'

const page = () => {

    
    return (
        <main className='w-screen h-screen bg-white grid grid-cols-2 p-4' >
            <div className='w-full h-full rounded-lg overflow-hidden'>
                <Image src={'/media/images/auth/auth-img.svg'} alt='logo' width={100} height={100} className='h-full w-full object-cover' />
            </div>
        </main>

    )
}

export default page