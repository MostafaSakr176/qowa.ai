"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Building, Link, Loader2Icon, Lock, User, Mail, QrCode, Phone, Smartphone, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import Image from "next/image"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
// Validation schema for signup with suitable validation
const formSchema = z.object({
  first_name: z.string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(50, { message: "First name must be at most 50 characters." }),
  last_name: z.string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(50, { message: "Last name must be at most 50 characters." }),
  organization_name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters." })
    .max(100, { message: "Organization name must be at most 100 characters." }),
  apps_number: z.string()
    .refine(val => {
      const num = Number(val)
      return !isNaN(num) && num > 0 && Number.isInteger(num)
    }, { message: "Please enter a valid number of apps (integer > 0)." }),
  business_link: z.string()
    .url({ message: "Please enter a valid URL." })
    .max(200, { message: "URL must be at most 200 characters." }),
  business_email: z.string()
    .email({ message: "Please enter a valid business email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password must be at most 64 characters." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      {
        message:
          "Password must contain uppercase, lowercase, number, and special character.",
      }
    ),
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

const SignUp = () => {
  const [isLogin, setLsLogin] = useState<boolean>(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      organization_name: "",
      apps_number: "",
      business_link: "",
      business_email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...signupData } = values
    console.log(signupData)
    setLsLogin(true)
  }

  return (
    <>
      {!isLogin && <div
        className='flex flex-col h-full py-10 overflow-y-auto justify-start items-center'
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: '#0D0D12 #fff',
        }}
      >
        <div className="w-full md:w-4/5 lg:w-3/5 space-y-2 mb-6">
          <h2 className="text-3xl font-medium">Create your account</h2>
          <p className="text-[16px] font-normal text-[#6F6F6F]">Sign up to get started</p>
        </div>
        <Form {...form}>
          <form className="w-full md:w-4/5 lg:w-3/5 space-y-4 mb-2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="first_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        label="First Name"
                        placeholder="Enter your first name"
                        icon={<User size={20} />}
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
                name="last_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        label="Last Name"
                        placeholder="Enter your last name"
                        icon={<User size={20} />}
                        iconPosition="left"
                        error={fieldState.error}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="organization_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      label="Organization Name"
                      placeholder="Organization name"
                      icon={<Building size={20} />}
                      iconPosition="left"
                      error={fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
            name="apps_number"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    label="How many apps in the organization?"
                    placeholder="Enter number of apps"
                    min={1}
                    error={fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
            <FormField
              name="apps_number"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      label="How many apps in the organization?"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger error={fieldState.error}>
                        <SelectValue placeholder="Select number of apps" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="business_link"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="url"
                      label="Organization Website"
                      placeholder="https://your-organization.com"
                      icon={<Link size={20} />}
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
              name="business_email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      label="Business Email"
                      placeholder="Enter your business email"
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
                      placeholder="Create a password"
                      label="Password"
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
            <FormField
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      label="Confirm Password"
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
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Sign Up {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col lg:flex-row items-center justify-between w-full md:w-4/5 lg:w-3/5 gap-1">
          <span className="text-secondary">
            Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/auth/login')}>Login</Button>
          </span>
          <Button variant="link" className="p-0 h-auto" >Forgot Password?</Button>
        </div>
      </div>}

      {isLogin && <div className="w-full md:w-4/5 h-full py-6 overflow-y-auto bg-white mx-auto rounded-lg p-6 space-y-4"
      style={{
        scrollbarWidth: 'none',
        scrollbarColor: '#0D0D12 #fff',
      }}>

        <h2 className="text-3xl font-medium">Tow Factor Authentication</h2>
        <p className="text-lg font-normal">Follow the instructions from below.</p>

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

          <InputOTP maxLength={6} onChange={(e)=>console.log(e)} className="w-full">
            <InputOTPGroup className="flex items-center justify-center gap-4 w-full">
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

      </div>}
    </>
  )
}

export default SignUp