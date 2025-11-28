"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const steps = [
    "Target configuration",
    "Configuration check",
    "Run assessment",
    "Review results"
];

const formSchema = z.object({
    targetUrl: z.string().url({ message: "Please enter a valid URL." }),
    unauthenticated: z.boolean().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    email: z.string().email({ message: "Please enter a valid email." }).optional(),
    otp: z.string().optional(),
    authInstructions: z.string().optional(),
});

const Page = () => {
    const [step, setStep] = React.useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            targetUrl: "",
            unauthenticated: false,
            username: "",
            password: "",
            email: "",
            otp: "",
            authInstructions: ""
        },
        mode: "onTouched",
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        nextStep();
    }

    const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    return (
        <div className="max-w-3xl mx-auto p-8">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8">
                {steps.map((label, idx) => (
                    <div key={label} className="flex-1 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-dark ${step === idx ? "bg-[#9440FF]" : "bg-[#281545]"}`}>{idx + 1}</div>
                        <span className={`mt-2 text-xs ${step === idx ? "text-[#9440FF]" : "text-dark"}`}>{label}</span>
                        {idx < steps.length - 1 && <div className="w-full h-1 bg-gradient-to-r from-[#9440FF] to-[#281545] mt-2" />}
                    </div>
                ))}
            </div>

            <Form {...form}>
                {step === 0 && (
                    <form className="space-y-6 p-6 rounded-xl border border-[#d1d1d1]" onSubmit={form.handleSubmit(onSubmit)}>
                        <h2 className="text-xl font-bold mb-4">Target configuration</h2>
                        <FormField
                            name="targetUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="unauthenticated"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="unauthenticated"
                                            />
                                        </FormControl>
                                        <FormLabel htmlFor="unauthenticated" >I want to perform an unauthenticated test</FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!form.watch("unauthenticated") && (
                            <div className="space-y-4">
                                <FormField
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="outline" className="border-[#9440FF] text-[#9440FF]" onClick={() => alert("Allow XBOW to receive email")}>+ Allow XBOW to receive email</Button>
                                <FormField
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>OTP</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Upload OTP QR code" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        <FormField
                            name="authInstructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specific authentication instructions <span className="text-xs text-gray-400">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="submit" className="bg-[#9440FF] text-white" disabled={!form.formState.isValid}>Next</Button>
                        </div>
                    </form>
                )}
                {step === 1 && (
                    <div className="space-y-6 bg-[#12002A] p-6 rounded-xl border border-[#281545]">
                        <h2 className="text-xl font-bold text-white mb-4">Configuration check</h2>
                        <p>Review your configuration and proceed to run assessment.</p>
                        <div className="flex justify-between gap-2 mt-6">
                            <Button type="button" variant="outline" className="border-[#9440FF] text-[#9440FF]" onClick={prevStep}>Back</Button>
                            <Button type="button" className="bg-[#9440FF] text-white" onClick={nextStep}>Run assessment</Button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-6 bg-[#12002A] p-6 rounded-xl border border-[#281545]">
                        <h2 className="text-xl font-bold text-white mb-4">Run assessment</h2>
                        <p>Assessment in progress...</p>
                        <div className="flex justify-between gap-2 mt-6">
                            <Button type="button" variant="outline" className="border-[#9440FF] text-[#9440FF]" onClick={prevStep}>Back</Button>
                            <Button type="button" className="bg-[#9440FF] text-white" onClick={nextStep}>Review results</Button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-6 bg-[#12002A] p-6 rounded-xl border border-[#281545]">
                        <h2 className="text-xl font-bold text-white mb-4">Review results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="text-white font-semibold">Assessment summary</div>
                                <div className="text-sm text-white">Application: <span className="font-bold">XBOW W1 Demo</span></div>
                                <div className="text-sm text-white">Target URL: <span className="font-bold">{form.getValues("targetUrl") || "-"}</span></div>
                                <div className="text-sm text-white">Rate and timing: <span className="font-bold">No rate limit, anytime</span></div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-white font-semibold">Credentials</div>
                                <div className="text-sm text-white">Username: <span className="font-bold">{form.getValues("username") || "-"}</span></div>
                                <div className="text-sm text-white">Email: <span className="font-bold">{form.getValues("email") || "-"}</span></div>
                                <div className="text-sm text-white">OTP: <span className="font-bold">{form.getValues("otp") || "-"}</span></div>
                            </div>
                        </div>
                        <div className="flex justify-between gap-2 mt-6">
                            <Button type="button" variant="outline" className="border-[#9440FF] text-[#9440FF]" onClick={prevStep}>Back</Button>
                            <Button type="button" className="bg-[#9440FF] text-white" onClick={() => setStep(0)}>Start new assessment</Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
};
export default Page;