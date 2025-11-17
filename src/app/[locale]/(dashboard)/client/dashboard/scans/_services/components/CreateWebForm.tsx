"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, Mail, Clock, Key, FileText, Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/lib/axiosClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// Schemas (password required only on create)
const baseSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  can_register_our_email: z.boolean().default(false),
  url: z.string().url({ message: "Enter a valid URL" }),
  email_or_username: z.string().min(1, { message: "Email or username is required" }),
  password: z.string().optional(),
  are_there_2fa_or_otp: z.string(),
  excluded_endpoints: z.array(z.string()).optional(),
  comment: z.string().optional(),
  time_to_start: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Enter a valid date" }),
  test_type: z.enum(["black_box", "white_box", "gray_box"]).default("black_box"),
});
const createSchema = baseSchema.extend({
  password: z.string().min(1, { message: "Password is required" })
});
const editSchema = baseSchema;

interface ScanDetail {
  id: number
  title: string
  can_register_our_email: boolean
  url: string
  email_or_username: string
  are_there_2fa_or_otp: boolean
  excluded_endpoints?: string
  comment: string | null
  time_to_start: string
  test_type: string
}

const CreateWebScanForm = ({
  setIsModalOpen,
  onCreated,
  editScanId,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onCreated?: () => void,
  editScanId?: number | null,
}) => {
  const { data: session } = useSession();
  const isEdit = !!editScanId;

  type FormValues = z.infer<typeof createSchema> | z.infer<typeof editSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: "",
      can_register_our_email: false,
      url: "",
      email_or_username: "",
      password: "",
      are_there_2fa_or_otp: "",
      excluded_endpoints: [],
      test_type: "gray_box",
      time_to_start: "",
      comment: "",
    },
    mode: "onTouched",
  })

  // Fetch detail for edit prefilling
  const { data: scanDetail, isLoading: scanLoading } = useQuery<ScanDetail>({
    queryKey: ['scan-detail', editScanId],
    queryFn: async () => {
      const res = await api.get(`/scan/scans/${editScanId}/`);
      return res.data;
    },
    enabled: isEdit && !!editScanId
  });

  // Prefill form when editing
  React.useEffect(() => {
    if (isEdit && scanDetail) {
      form.reset({
        title: scanDetail.title || "",
        can_register_our_email: !!scanDetail.can_register_our_email,
        url: scanDetail.url || "",
        email_or_username: scanDetail.email_or_username || "",
        password: "",
        are_there_2fa_or_otp: !!scanDetail.are_there_2fa_or_otp ? "True" : "False",
        excluded_endpoints: scanDetail.excluded_endpoints
          ? String(scanDetail.excluded_endpoints)
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        test_type: scanDetail.test_type as FormValues extends { test_type: infer B } ? B : never,
        time_to_start: (scanDetail.time_to_start || "").slice(0, 10),
        comment: scanDetail.comment || "",
      })
    }
  }, [isEdit, scanDetail, form]);

  // Excluded endpoints input state
  const [excludedInput, setExcludedInput] = useState("");
  const excludedEndpoints = form.watch("excluded_endpoints") || [];

  const handleAddExcluded = () => {
    const url = excludedInput.trim();
    if (url && !excludedEndpoints.includes(url)) {
      form.setValue("excluded_endpoints", [...excludedEndpoints, url]);
      setExcludedInput("");
    }
  };

  const handleRemoveExcluded = (url: string) => {
    form.setValue(
      "excluded_endpoints",
      excludedEndpoints.filter((item: string) => item !== url)
    );
  };

  async function onSubmit(values: FormValues) {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("can_register_our_email", values.can_register_our_email ? "True" : "False");
    formdata.append("url", values.url);
    formdata.append("email_or_username", values.email_or_username);
    if (values.password) formdata.append("password", values.password);
    formdata.append("are_there_2fa_or_otp", String(values.are_there_2fa_or_otp));
    formdata.append("test_type", values.test_type);
    formdata.append("time_to_start", values.time_to_start);
    formdata.append("comment", values.comment || "");
    formdata.append("app_type", "web");
    // Add excluded_endpoints as comma-separated string
    if (values.excluded_endpoints && values.excluded_endpoints.length > 0) {
      formdata.append("excluded_endpoints", values.excluded_endpoints.join(", "));
    }

    try {
      if (isEdit && editScanId) {
        await api.patch(`/scan/scans/${editScanId}/`, formdata, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Scan updated successfully");
      } else {
        await api.post("/scan/scans/", formdata, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Scan created successfully");
      }
      setIsModalOpen(false);
      onCreated?.();
    } catch (e) {
      interface AxiosLikeErrorData { detail?: string }
      interface AxiosLikeError { response?: { data?: AxiosLikeErrorData }; message?: string }
      const axiosErr = e as AxiosLikeError;
      const message = axiosErr?.response?.data?.detail || axiosErr?.message || (isEdit ? "Failed to update scan" : "Failed to create scan");
      toast.error(message);
      console.error(e);
    }
  }

  function handleCancel() {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className='flex flex-col  h-full overflow-y-auto justify-start items-center' style={{
        scrollbarWidth: 'none',
        scrollbarColor: '#0D0D12 #fff',
      }}>
        <div className="w-full flex justify-start mb-4">
          <Image src="/media/images/client/pc.png" alt="Create web scan" width={60} height={60} />
        </div>
        <Form {...form}>
          <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField name="title" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="text" label="Title" placeholder="Scan Title" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="relative">
                  <Input
                    className="bg-[#F8FAFB] ps-10"
                    type="text"
                    label="You can register our email in your application"
                    defaultValue=" qowa.ai@gmail.com"
                    icon={<Mail size={20} />}
                    iconPosition="left"
                    readOnly
                  />
                  <div className="absolute ltr:right-4 rtl:right-4 bottom-3">
                    <FormField name="can_register_our_email" render={({ field }) => (
                      <FormItem>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#8B5CF6]"
                        />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <FormField name="url" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="url" label="URL" placeholder="https://example.com" icon={<Globe size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="email_or_username" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="text" label="Email / Username" placeholder="user@example.com" icon={<Mail size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="password" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="password" label="Password" placeholder="Password" icon={<Key size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="are_there_2fa_or_otp" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select label="Are there 2FA / otp?" value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-[#F8FAFB]">
                          <SelectValue placeholder="Yes or No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="True">Yes</SelectItem>
                          <SelectItem value="False">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Excluded Endpoints */}
                <div>
                  <label className="block text-sm font-medium mb-1">Excluded Endpoints</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      className="bg-[#F8FAFB] flex-1"
                      type="text"
                      placeholder="Enter endpoint URL"
                      value={excludedInput}
                      onChange={(e) => setExcludedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddExcluded();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddExcluded} disabled={!excludedInput.trim()}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {excludedEndpoints.map((url: string) => (
                      <span
                        key={url}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        {url}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="ml-1 p-0"
                          onClick={() => handleRemoveExcluded(url)}
                          aria-label="Remove"
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>

                <FormField name="test_type" render={({ field, fieldState }) => (
                  <FormItem>
                    <Label>Test Type</Label>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gray_box" id="gray_box" />
                          <Label htmlFor="gray_box">Gray Box</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="black_box" id="black_box" />
                          <Label htmlFor="black_box">Black Box</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="time_to_start" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="date" label="Start Date" placeholder="YYYY-MM-DD" icon={<Clock size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="comment" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea className="bg-[#F8FAFB]" label="Comment" placeholder="Optional comment" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {isEdit ? 'Update' : 'Create'} {(form.formState.isSubmitting || scanLoading) && <Loader2Icon className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateWebScanForm