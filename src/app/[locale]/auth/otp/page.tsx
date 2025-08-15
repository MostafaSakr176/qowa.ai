"use client"
import React from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
const ResetPassword = () => {
  const router = useRouter()

  return (
    <div className='flex flex-col h-full py-10 space-y-6 overflow-y-auto justify-center items-center'
    >
      <div className="w-full md:w-4/5 lg:w-3/5 space-y-4">
        <h2 className="text-5xl font-medium">OTP</h2>
        <p className="text-[16px] font-normal text-[#6F6F6F]">We sent a code to <strong className="text-neutral-900"> fajar@gmail.com</strong></p>
      </div>
      <div className="w-full md:w-4/5 lg:w-3/5 space-y-8 flex flex-col justify-center items-center">
        <InputOTP maxLength={6} className="w-full" onComplete={()=>router.push("/auth/reset-password")}>
          <InputOTPGroup className="flex items-center justify-center gap-1 md:gap-4 w-full">
            <InputOTPSlot index={0} className="bg-white" />
            <InputOTPSlot index={1} className="bg-white" />
            <InputOTPSlot index={2} className="bg-white" />
            <InputOTPSlot index={3} className="bg-white" />
            <InputOTPSlot index={4} className="bg-white" />
            <InputOTPSlot index={5} className="bg-white" />
          </InputOTPGroup>
        </InputOTP>
        <Button variant="link" className="p-0 h-auto text-neutral-900" size="lg" onClick={() => router.push('/auth/forget-password')}><ArrowLeft size={15} /> Back</Button>
      </div>
    </div>
  )
}

export default ResetPassword