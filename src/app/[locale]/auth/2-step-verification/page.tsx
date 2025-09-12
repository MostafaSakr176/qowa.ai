"use client"
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Copy, QrCode, Smartphone } from 'lucide-react'
import Image from 'next/image'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from '@/i18n/navigation'
import { useSession } from "next-auth/react";
import toast from "react-hot-toast"
import api from "@/lib/axiosClient";

const TwoStepVerification = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [setupData, setSetupData] = useState<null | {
        otp_secret: string;
        otp_auth_url: string;
        qr_code_url: string;
        qr_code_base64: string;
    }>(null);
    const [enabling, setEnabling] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [email, setEmail] = useState<string | null>(null)


    // Fetch 2FA setup data on mount
    useEffect(() => {
        // Get email from localStorage on mount (same as OTP page)
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("signup_email")
            setEmail(storedEmail)
        }

        const fetchSetup = async () => {
            setLoading(true);
            try {
                const res = await api.post(`core/2fa/setup/`, {
                    email: email
                });
                // Ensure res is the expected object before setting state
                if (
                    res &&
                    typeof res === "object" &&
                    "otp_secret" in res &&
                    "otp_auth_url" in res &&
                    "qr_code_url" in res &&
                    "qr_code_base64" in res
                ) {
                    setSetupData(res as {
                        otp_secret: string;
                        otp_auth_url: string;
                        qr_code_url: string;
                        qr_code_base64: string;
                    });
                } else {
                    throw new Error("Invalid 2FA setup response from server");
                }
            } catch (err: unknown) {
                if (typeof err === "object" && err !== null && "message" in err) {
                    toast.error((err as { message?: string }).message || "Failed to load 2FA setup");
                } else {
                    toast.error("Failed to load 2FA setup");
                }
            } finally {
                setLoading(false);
            }
        };
        // Only fetch if authenticated
        fetchSetup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const handleCopy = () => {
        if (setupData?.otp_secret) {
            navigator.clipboard.writeText(setupData.otp_secret);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 1500);
        }
    };

    const handleComplete = async (value: string) => {
        if (!setupData) return;

        setEnabling(true);
        try {
            // Use JSON body instead of FormData for API consistency and proper Content-Type
            await api.post(
                "core/2fa/enable/",
                { code: value, email: email },
            );
            toast.success("Two-factor authentication enabled!");
            router.push("/dashboard");
        } catch (err: unknown) {
            if (typeof err === "object" && err !== null && "message" in err) {
                toast.error((err as { message?: string }).message || "Failed to enable 2FA");
            } else {
                toast.error("Failed to enable 2FA");
            }
        } finally {
            setEnabling(false);
        }
    };

    return (
        <div className="w-full md:w-4/5 h-full py-6 overflow-y-auto bg-white mx-auto rounded-lg p-6 space-y-6"
            style={{
                scrollbarWidth: 'none',
                scrollbarColor: '#0D0D12 #fff',
            }}>
            <div className="space-y-3">
                <h2 className="text-3xl font-medium">Two Factor Authentication</h2>
                <p className="text-lg font-normal">Follow the instructions below.</p>
            </div>

            <div className="bg-[#F6F8FA] rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 flex items-center justify-center"><Smartphone size={30} /></span>
                    <p className="text-[16px] font-normal">Install Google Authenticator, or a similar app like Authy</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 flex items-center justify-center"><QrCode size={30} /></span>
                    <p className="text-[16px] font-normal">Scan the QR code with an authenticator app or copy the code below to add it manually.</p>
                </div>
            </div>

            <div className="flex justify-center bg-[#F6F8FA] rounded-lg p-4 min-h-[220px]">
                {loading ? (
                    <div className="text-center w-full">Loading QR code...</div>
                ) : setupData?.qr_code_base64 ? (
                    <Image
                        src={setupData.qr_code_base64}
                        alt="2FA QR code"
                        width={200}
                        height={200}
                        className="mx-auto"
                        unoptimized
                    />
                ) : (
                    <div className="text-center w-full text-red-500">Failed to load QR code</div>
                )}
            </div>

            <InputOTP
                maxLength={6}
                onComplete={handleComplete}
                className="w-full"
                disabled={enabling || loading}
            >
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
                <p>Code for Adding Manually</p>
                <div className="flex items-center gap-6">
                    <span className="font-mono text-lg select-all">
                        {loading ? "Loading..." : setupData?.otp_secret || "N/A"}
                    </span>
                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={loading || !setupData?.otp_secret}
                        className="hover:text-blue-600 transition"
                        aria-label="Copy secret"
                    >
                        <Copy size={25} />
                    </button>
                    {copySuccess && <span className="text-green-600 text-sm">Copied!</span>}
                </div>
            </div>

            <div className='w-full flex justify-between items-center gap-6'>
                <Button
                    variant="link"
                    className="p-0 h-auto"
                    size="lg"
                    onClick={() => router.push('/auth/signup')}
                    disabled={enabling || loading}
                >
                    <ArrowLeft size={15} /> Back
                </Button>

                <Button
                    variant="link"
                    className="p-0 h-auto"
                    size="lg"
                    onClick={() => router.push('/auth/verify-account')}
                    disabled={enabling || loading}
                >
                    Skip for now <ArrowRight size={10} />
                </Button>
            </div>
        </div>
    )
}

export default TwoStepVerification