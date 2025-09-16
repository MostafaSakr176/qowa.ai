"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, Lock, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from 'next-intl';
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import { useState } from "react"

// ✅ shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const formSchema = z.object({
  email: z.string()
    .min(5, { message: "Email must be at least 5 characters." })
    .email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(3, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password must be at most 64 characters." })
})

const Login = () => {
  const router = useRouter()
  const t = useTranslations();
  const [loading, setLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [userCreds, setUserCreds] = useState<{ email: string, password: string }>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      // The error is not caused by this line, but by a problem with how `toast` is imported or used.
      // The correct import for react-hot-toast is:
      // import toast from "react-hot-toast"
      // and you should use `toast.error("message")` as you do elsewhere.
      // The error message suggests that `toast.error` is not a function, which usually means
      // the import is broken or being mocked incorrectly by Turbopack.

      // For debugging, you can log the response here:
      console.log("Login response:", res);

      if (res?.error === "OTP_REQUIRED") {
        setUserCreds(values)
        setShowOtpModal(true)
      } else if (res?.ok) {
        toast.success("Login successful")
        router.push("/dashboard")
      } else {
        toast.error(res?.error || "Login failed")
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Unexpected error occurred")
      } else {
        toast.error("Unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit() {
    if (!userCreds) return
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email: userCreds.email,
      password: userCreds.password,
      otp: otp, // 👈 نبعته هنا
    })

    if (res?.ok) {
      toast.success("Login successful")
      setShowOtpModal(false)
      router.push("/dashboard")
    } else {
      toast.error(res?.error || "OTP verification failed")
    }

    setLoading(false)
  }

  return (
    <div className='flex flex-col justify-center items-center'>
       <div className="w-full md:w-4/5 lg:w-3/5 space-y-2 mb-6"> 
       <h2 className="text-3xl font-medium">{t("welcome")}</h2> 
       <p className="text-[16px] font-normal text-[#6F6F6F]">Please login to your account</p> 
       </div>
      {/* Login Form */}
      <Form {...form}>
        <form
          className="w-full md:w-4/5 lg:w-3/5 space-y-4 mb-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    icon={<Mail size={20} />}
                    iconPosition="left"
                    error={fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    icon={<Lock size={20} />}
                    iconPosition="left"
                    error={fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            variant="primary"
            disabled={!form.formState.isValid || loading}
          >
            {loading ? (
              <>Logging in <Loader2Icon className="animate-spin ml-2" /></>
            ) : (
              "Login"
            )}
          </Button>
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-1">
                    <span className="text-secondary">
                      Don&apos;t have an account? <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/auth/signup')}>Register</Button>
                    </span>
                    <span className="text-secondary">
                      <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/auth/forget-password')}>Forget Password?</Button>
                    </span>
                  </div>
        </form>
      </Form>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enter 2FA Authentcation Code</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="space-x-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleOtpSubmit}
              disabled={otp.length !== 6 || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Login
