"use client";
import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/ApiService";
import toast from "react-hot-toast";

const OtpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  // Get email from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("signup_email");
      setEmail(storedEmail);
    }
  }, []);

  // React Query mutation for submitting OTP
  const mutation = useMutation({
    mutationFn: async (values: { otp: string; email: string }) => {
      const body = {
        email: values.email,
        otp: values.otp,
      };
      return await api.post("core/verify-otp/", body);
    },
    onSuccess: () => {
      toast.success("OTP verified successfully");
      router.push("/auth/reset-password");
    },
    onError: (error: { message: string }) => {
      toast.error(error?.message || "OTP verification failed");
    },
  });

  // Handler for OTP completion
  const handleComplete = (value: string) => {
    if (!email) {
      toast.error("No email found. Please restart the process.");
      return;
    }
    mutation.mutate({ otp: value, email });
  };

  return (
    <div className="flex flex-col h-full py-10 space-y-6 overflow-y-auto justify-center items-center">
      <div className="w-full md:w-4/5 lg:w-3/5 space-y-4">
        <h2 className="text-5xl font-medium">OTP</h2>
        <p className="text-[16px] font-normal text-[#6F6F6F]">
          We sent a code to{" "}
          <strong className="text-neutral-900">
            {email ? email : "your email"}
          </strong>
        </p>
      </div>
      <div className="w-full md:w-4/5 lg:w-3/5 space-y-8 flex flex-col justify-center items-center">
        <InputOTP
          maxLength={6}
          className="w-full"
          onComplete={handleComplete}
          disabled={mutation.isPending}
        >
          <InputOTPGroup className="flex items-center justify-center gap-1 md:gap-4 w-full">
            <InputOTPSlot index={0} className="bg-white" />
            <InputOTPSlot index={1} className="bg-white" />
            <InputOTPSlot index={2} className="bg-white" />
            <InputOTPSlot index={3} className="bg-white" />
            <InputOTPSlot index={4} className="bg-white" />
            <InputOTPSlot index={5} className="bg-white" />
          </InputOTPGroup>
        </InputOTP>
        <Button
          variant="link"
          className="p-0 h-auto text-neutral-900"
          size="lg"
          onClick={() => router.push("/auth/forget-password")}
          disabled={mutation.isPending}
        >
          <ArrowLeft size={15} /> Back
        </Button>
      </div>
    </div>
  );
};

export default OtpPage;