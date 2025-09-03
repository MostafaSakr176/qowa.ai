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
import toast from 'react-hot-toast'

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
            return api.post('core/verify-otp/', data)
        },
        onSuccess: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("signup_email");
            }
            toast.success("Verification successful")
            router.push('/auth/login')
        },
        onError: (error: {message:string}) => {
            // Handle error, e.g. show toast or error message
            toast.error(error?.message || "Verification failed")
        }
    })

    const resendCodeMutation = useMutation({
        mutationFn: async (data: { email: string }) => {
            // Use the correct endpoint for resending OTP
            return api.post('core/resend-otp/', data)
        },
        onSuccess: () => {
            toast.success("Code resent successfully")
        },
        onError: (error: {message:string}) => {
            toast.error(error?.message || "Failed to resend code")
        }
    })

    const handleComplete = (value: string) => {
        if (!email) {
            alert("No email found. Please restart the process.")
            return
        }
        mutation.mutate({ email, code: value })
    }

    const resendCode = () => {
        if (!email) {
            alert("No email found. Please restart the process.")
            return
        }
        resendCodeMutation.mutate({ email })
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
                <div className='w-full flex justify-between items-center gap-6'>
                <Button
                    variant="link"
                    className="p-0 h-auto text-neutral-900"
                    size="lg"
                    onClick={() => router.push('/auth/2-step-verification')}
                    disabled={mutation.isPending}
                >
                    <ArrowLeft size={15} /> Back
                </Button>

                <Button
                    variant="link"
                    className="p-0 h-auto text-neutral-900"
                    size="lg"
                    onClick={resendCode}
                    disabled={mutation.isPending || resendCodeMutation.isPending}
                >
                    resend code
                </Button>
                </div>
                
            </div>
        </div>
    )
}

export default VerifyAccount