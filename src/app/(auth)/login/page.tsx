import { Input } from '@/components/ui/input'
import { Lock, Mail } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <main className='w-screen h-screen bg-white grid grid-cols-2 p-4' >
            <div className='w-full h-full rounded-lg overflow-hidden'>
                <Image src={'/media/images/auth/auth-img.svg'} alt='logo' width={100} height={100} className='h-full w-full object-cover' />
            </div>
            <div className='flex justify-center items-center'>
                <Form>
                    <form className="w-3/5 space-y-6">
                        <FormField
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="email"
                                            icon={<Mail size={20} />}
                                            iconPosition="left"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="password"
                                            icon={<Lock size={20} />}
                                            iconPosition="left"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </main>
    )
}

export default page