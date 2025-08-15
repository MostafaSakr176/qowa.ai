"use client"
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Copy, QrCode, Smartphone } from 'lucide-react'
import Image from 'next/image'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from 'next/navigation'

const TwoStepVerification = () => {

    const router = useRouter()

    return (
        <div className="w-full md:w-4/5 h-full py-6 overflow-y-auto bg-white mx-auto rounded-lg p-6 space-y-6"
            style={{
                scrollbarWidth: 'none',
                scrollbarColor: '#0D0D12 #fff',
            }}>

            <div className="space-y-3">
                <h2 className="text-3xl font-medium">Tow Factor Authentication</h2>
                <p className="text-lg font-normal">Follow the instructions from below.</p>
            </div>

            <div className="bg-[#F6F8FA] rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 flex items-center justify-center"><Smartphone size={30} /></span>
                    <p className="text-[16px] font-normal">Install Google  Authenticator, or a similar app like Authy</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 flex items-center justify-center"><QrCode size={30} /></span>
                    <p className="text-[16px] font-normal">Scan QR code With an authenticator App or Copy <br /> the code below to add it manually.</p>
                </div>
            </div>
            <div className="flex justify-center bg-[#F6F8FA] rounded-lg p-4">
                <Image src={'/media/images/auth/qr-code.svg'} alt='logo' width={200} height={200} />
            </div>

            <InputOTP maxLength={6} onComplete={(e) => console.log(e)} className="w-full">
                <InputOTPGroup className="flex items-center justify-center gap-1 md:gap-4 w-full">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>

            <div className="text-[#36394A]">
                <p>Code for Adding  Manually</p>
                <div className="flex items-center gap-6">
                    <span>MNIA27882ML33899MJ743</span>
                    <Copy size={25} />
                </div>
            </div>

            <div className='w-full flex justify-between items-center gap-6'>
                <Button variant="link" className="p-0 h-auto " size="lg" onClick={() => router.push('/auth/signup')}><ArrowLeft size={15} /> Back</Button>

                <Button variant="link" className="p-0 h-auto" size="lg" onClick={() => router.push('/auth/verify-account')}> Skip for now <ArrowRight size={10} /></Button>
            </div>

        </div>
    )
}

export default TwoStepVerification