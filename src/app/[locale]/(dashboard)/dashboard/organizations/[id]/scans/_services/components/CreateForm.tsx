"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link, Loader2Icon, Mail, Hash, Clock, Key, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
// import { useRouter } from "@/i18n/navigation"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/lib/axiosClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Schemas (password required only on create)
const baseSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  can_register_our_email: z.boolean().default(false),
  url: z.string().url({ message: "Enter a valid URL" }),
  email_or_username: z.string().min(1, { message: "Email or username is required" }),
  password: z.string().optional(),
  are_there_2fa_or_otp: z.boolean().default(false),
  number_of_pages: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  ips_range: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  port_number: z.string().regex(/^\d+$/, { message: "Enter a valid port" }),
  comment: z.string().optional(),
  time_to_start: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Enter a valid date" }),
  how_many_endoints: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  app_type: z.enum(["web", "mobile", "api", "desktop", "infrastructure"]).default("web"),
  test_type: z.enum(["black_box", "white_box", "gray_box"]).default("black_box"),
  ips_type: z.enum(["public", "private"]).default("public"),
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
  number_of_pages: number | string
  ips_range: number | string
  port_number: number | string
  comment: string | null
  time_to_start: string
  how_many_endoints: number | string
  app_type: string
  test_type: string
  ips_type: string
}

const CreateScanForm = ({
  setIsModalOpen,
  organizationId,
  onCreated,
  editScanId,
}: {
  setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
  organizationId: string,
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
      are_there_2fa_or_otp: false,
      number_of_pages: "",
      ips_range: "",
      port_number: "",
      comment: "",
      time_to_start: "",
      how_many_endoints: "",
      app_type: "web",
      test_type: "black_box",
      ips_type: "public",
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
        are_there_2fa_or_otp: !!scanDetail.are_there_2fa_or_otp,
        number_of_pages: String(scanDetail.number_of_pages ?? ""),
        ips_range: String(scanDetail.ips_range ?? ""),
        port_number: String(scanDetail.port_number ?? ""),
        comment: scanDetail.comment || "",
        time_to_start: (scanDetail.time_to_start || "").slice(0,10),
        how_many_endoints: String(scanDetail.how_many_endoints ?? ""),
  app_type: scanDetail.app_type as FormValues extends { app_type: infer A } ? A : never,
  test_type: scanDetail.test_type as FormValues extends { test_type: infer B } ? B : never,
  ips_type: scanDetail.ips_type as FormValues extends { ips_type: infer C } ? C : never,
      })
    }
  }, [isEdit, scanDetail, form]);

  async function onSubmit(values: FormValues) {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }
    const formdata = new FormData();
    formdata.append("organization", organizationId);
    formdata.append("title", values.title);
    formdata.append("can_register_our_email", values.can_register_our_email ? "True" : "False");
    formdata.append("url", values.url);
    formdata.append("email_or_username", values.email_or_username);
  if (values.password) formdata.append("password", values.password);
    formdata.append("are_there_2fa_or_otp", values.are_there_2fa_or_otp ? "True" : "False");
    formdata.append("number_of_pages", values.number_of_pages);
    formdata.append("ips_range", values.ips_range);
    formdata.append("port_number", values.port_number);
    formdata.append("comment", values.comment || "");
    formdata.append("time_to_start", values.time_to_start);
    formdata.append("how_many_endoints", values.how_many_endoints);
    formdata.append("app_type", values.app_type);
    formdata.append("test_type", values.test_type);
    formdata.append("ips_type", values.ips_type);

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

  // Cancel button handler that does not interact with the form state
  function handleCancel() {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className='flex flex-col h-full overflow-y-auto justify-start items-center'
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: '#0D0D12 #fff',
        }}
      >
        <Form {...form}>
          <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField name="title" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" label="Title" placeholder="Scan Title" icon={<Hash size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="url" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="url" label="Target URL" placeholder="https://example.com" icon={<Link size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email_or_username" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" label="Email / Username" placeholder="user@example.com" icon={<Mail size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="password" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" label="Password" placeholder="Password" icon={<Key size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="time_to_start" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" label="Start Date" placeholder="YYYY-MM-DD" icon={<Clock size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField name="number_of_pages" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" label="Pages" placeholder="5" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="how_many_endoints" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" label="Endpoints" placeholder="10" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="port_number" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" label="Port" placeholder="3000" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField name="ips_range" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" label="IPs Range" placeholder="30" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="app_type" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select label="App Type" value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="App Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="test_type" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select label="Test Type" value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Test Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black_box">Black Box</SelectItem>
                          <SelectItem value="gray_box">Gray Box</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="ips_type" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select label="IPs Type" value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="IPs Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="comment" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" label="Comment" placeholder="Optional comment" icon={<FileText size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="can_register_our_email" render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Checkbox checked={field.value} onChange={field.onChange} /> Can Register Our Email
                    </label>
                  </FormItem>
                )} />
                <FormField name="are_there_2fa_or_otp" render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Checkbox checked={field.value} onChange={field.onChange} /> 2FA / OTP Present
                    </label>
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

export default CreateScanForm