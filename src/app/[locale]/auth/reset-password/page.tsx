"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2Icon, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl';

// Improved validation schema for login
const formSchema = z.object({
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

const Login = () => {
    const router = useRouter()
    const t = useTranslations();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
        mode: "onTouched", // Show errors when clicking outside inputs
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        router.push('/auth/login')
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="w-full md:w-4/5 lg:w-3/5 space-y-2 mb-6">
                <h2 className="text-3xl font-medium">{t("welcome")}</h2>
                <p className="text-[16px] font-normal text-[#6F6F6F]">Please login to your account</p>
            </div>
            <Form {...form}>
                <form className="w-full md:w-4/5 lg:w-3/5 space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
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
                        Create new password {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                    </Button>
                    <Button variant="link" className="p-0 h-auto text-neutral-900" size="lg" onClick={() => router.push('/auth/otp')}><ArrowLeft size={15} /> Back</Button>

                </form>
            </Form>
        </div>
    )
}

export default Login