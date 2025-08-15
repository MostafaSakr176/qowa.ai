"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2Icon, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        router.push('/auth/otp')
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
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                        Reset Password {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                    </Button>
                    <Button variant="link" className="p-0 h-auto text-neutral-900" size="lg" onClick={()=>router.push('/auth/login')} ><ArrowLeft size={15} /> Back</Button>
                </form>
            </Form>
        </div>
    )
}

export default ForgetPassword