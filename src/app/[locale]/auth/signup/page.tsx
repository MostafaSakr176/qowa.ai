"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Building, Link, Loader2Icon, Lock, User, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/ApiService"
import toast from 'react-hot-toast';

// Validation schema for signup with suitable validation
const formSchema = z.object({
  first_name: z.string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(50, { message: "First name must be at most 50 characters." }),
  last_name: z.string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(50, { message: "Last name must be at most 50 characters." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." }),
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
  password_confirm: z.string().min(1, { message: "Please confirm your password." }),
  organization: z.object({
    name: z.string()
      .min(2, { message: "Organization name must be at least 2 characters." })
      .max(100, { message: "Organization name must be at most 100 characters." }),
    number_of_apps: z.string()
      .refine(val => {
        const num = Number(val)
        return !isNaN(num) && num > 0 && Number.isInteger(num)
      }, { message: "Please enter a valid number of apps (integer > 0)." }),
    url: z.string()
      .url({ message: "Please enter a valid URL." })
      .max(200, { message: "URL must be at most 200 characters." }),
    business_email: z.string()
      .email({ message: "Please enter a valid business email address." }),
  }),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords do not match.",
  path: ["password_confirm"],
})

const SignUp = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
      organization: {
        name: "",
        number_of_apps: "",
        url: "",
        business_email: "",
      },
    },
    mode: "onTouched",
  })

  // React Query mutation for signup
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Prepare body as per API requirements
      const body = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        password_confirm: values.password_confirm,
        organization: {
          name: values.organization.name,
          number_of_apps: Number(values.organization.number_of_apps),
          url: values.organization.url,
          business_email: values.organization.business_email,
        }
      }
      // Adjust endpoint as needed
      return api.post("client/register/", body)
    },
    onSuccess: (_data, variables) => {
      // Pass the registered email to the OTP page via query param or localStorage
      // Here, we'll use localStorage for simplicity and reliability
      if (typeof window !== "undefined") {
        localStorage.setItem("signup_email", variables.email)
      }
      router.push('/auth/2-step-verification')
    },
    onError: (error: {message:string}) => {
      // Optionally handle error, e.g. show toast
      toast.error(error.message || "Signup failed")
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <>
      <div className='flex flex-col h-full py-10 overflow-y-auto justify-start items-center'
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
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      label="Email"
                      placeholder="Enter your Email"
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
              name="organization.name"
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
            <FormField
              name="organization.number_of_apps"
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
              name="organization.url"
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
              name="organization.business_email"
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
              name="password_confirm"
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
              disabled={!form.formState.isValid || mutation.isPending}
            >
              Sign Up {mutation.isPending && <Loader2Icon className="animate-spin" />}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col lg:flex-row items-center justify-center w-full md:w-4/5 lg:w-3/5 gap-1">
          <span className="text-secondary">
            Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/auth/login')}>Login</Button>
          </span>
        </div>
      </div>
    </>
  )
}

export default SignUp