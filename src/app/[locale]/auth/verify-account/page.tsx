"use client"
import React, { useEffect, useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/ApiService'

const VerifyAccount = () => {
    const router = useRouter()
    const [email, setEmail] = useState<string | null>(null)

    // Get email from localStorage on mount (same as OTP page)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("signup_email")
            setEmail(storedEmail)
        }
    }, [])

    const mutation = useMutation({
        mutationFn: async (data: { email: string, code: string }) => {
            // Adjust endpoint as needed
            return api.post('/auth/verify', data)
        },
        onSuccess: () => {
            router.push('/dashboard')
        },
        onError: (error: {message:string}) => {
            // Handle error, e.g. show toast or error message
            alert(error?.message || "Verification failed")
        }
    })

    const handleComplete = (value: string) => {
        if (!email) {
            alert("No email found. Please restart the process.")
            return
        }
        mutation.mutate({ email, code: value })
    }

    return (
        <div className='flex flex-col h-full py-10 space-y-8 overflow-y-auto justify-center items-center'>
            <div className="w-full md:w-4/5 lg:w-3/5 space-y-4">
                <h2 className="text-5xl font-medium">Verify Account</h2>
                <p className="text-[16px] font-normal text-[#6F6F6F]">
                    We sent a code to <strong className="text-neutral-900">{' '}{email ? email : "your email"}</strong>
                </p>
            </div>
            <div className="w-full md:w-4/5 lg:w-3/5 space-y-8 flex flex-col justify-center items-center">
                <InputOTP
                    maxLength={6}
                    className="w-full"
                    onComplete={handleComplete}
                    disabled={mutation.isPending}
                >
                    <InputOTPGroup className="flex items-center justify-center gap-1 md:gap-4 w-full">
                        <InputOTPSlot index={0} className="bg-white" />
                        <InputOTPSlot index={1} className="bg-white" />
                        <InputOTPSlot index={2} className="bg-white" />
                        <InputOTPSlot index={3} className="bg-white" />
                        <InputOTPSlot index={4} className="bg-white" />
                        <InputOTPSlot index={5} className="bg-white" />
                    </InputOTPGroup>
                </InputOTP>
                <Button
                    variant="link"
                    className="p-0 h-auto text-neutral-900"
                    size="lg"
                    onClick={() => router.push('/auth/2-step-verification')}
                    disabled={mutation.isPending}
                >
                    <ArrowLeft size={15} /> Back
                </Button>
            </div>
        </div>
    )
}

export default VerifyAccount