"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2Icon, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { useMutation } from '@tanstack/react-query'
import { api } from "@/lib/ApiService"
import toast from "react-hot-toast"

// Improved validation schema for login
const formSchema = z.object({
    email: z.string()
        .min(5, { message: "Email must be at least 5 characters." })
        .email({ message: "Please enter a valid email address." }),
})

const ForgetPassword = () => {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
        mode: "onTouched", // Show errors when clicking outside inputs
    })

    // React Query mutation for forget password
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            // The body is just the email
            const body = {
                email: values.email
            }
            // Adjust the endpoint as needed
            return await api.post("core/password-reset/request/", body)
        },
        onSuccess: (data) => {
            // Optionally show a success toast or message
            toast.success("Reset instructions sent to your email")
            router.push('/auth/otp')
        },
        onError: (error: {message:string}) => {
            // Optionally handle error, e.g. show toast
            toast.error(error?.message || "Failed to send reset instructions")
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="w-full md:w-4/5 lg:w-3/5 space-y-2 mb-6">
                <h2 className="text-3xl font-medium">Forgot Password</h2>
                <p className="text-[16px] font-normal text-[#6F6F6F]">No worries, we’ll send you reset instructions</p>
            </div>
            <Form {...form}>
                <form className="w-full md:w-4/5 lg:w-3/5 space-y-4 mb-2 flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="email"
                                        label="Email"
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
                    <Button
                        type="submit"
                        className="w-full"
                        variant="primary"
                        disabled={!form.formState.isValid || mutation.isPending}
                    >
                        Reset Password {mutation.isPending && <Loader2Icon className="animate-spin" />}
                    </Button>
                    <Button variant="link" className="p-0 h-auto text-neutral-900" size="lg" onClick={()=>router.push('/auth/login')} ><ArrowLeft size={15} /> Back</Button>
                </form>
            </Form>
        </div>
    )
}

export default ForgetPassword