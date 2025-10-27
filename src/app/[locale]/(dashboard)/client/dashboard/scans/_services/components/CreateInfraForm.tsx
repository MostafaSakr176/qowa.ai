"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link, Loader2Icon, Mail, Hash, Clock, Key, FileText, Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
// import { useRouter } from "@/i18n/navigation"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/lib/axiosClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


// Organization interfaces
interface Organization {
  id: number;
  name: string;
  country: string;
  number_of_apps: number;
  url: string;
  business_email: string;
  created_at: string;
  scans_count: number;
  team_members_count: number;
  rank: number;
  amount: number;
  credit: number;
}

interface OrganizationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

// Schemas (password required only on create)
const baseSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  organization: z.string().min(1, { message: "Please select an organization" }), // Add this
  number_of_ips: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  ips_range: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  port_number: z.string().regex(/^\d+$/, { message: "Enter a valid port" }),
  comment: z.string().optional(),
  test_type: z.enum(["black_box", "white_box", "gray_box"]).default("black_box"),

  time_to_start: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Enter a valid date" }),
  ips_type: z.enum(["public", "private"]).default("public"),
});

const editSchema = baseSchema;

interface ScanDetail {
  id: number
  title: string
  organization: number // Add this if it comes from API
  number_of_ips: number | string
  ips_range: number | string
  port_number: number | string
  comment: string | null
  test_type: string
  time_to_start: string
  ips_type: string
}

const CreateInfraScanForm = ({
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

  type FormValues = z.infer<typeof baseSchema> | z.infer<typeof editSchema>;

  // Add organizations query
  const { data: organizationsData, isLoading: organizationsLoading } = useQuery<OrganizationsResponse>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await api.get('/client/organizations/');
      return res.data;
    },
    staleTime: 300_000, // 5 minutes
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : baseSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: "",
      organization: "", // Add this
      number_of_ips: "",
      ips_range: "",
      port_number: "",
      comment: "",
      test_type: "gray_box",
      time_to_start: "",
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
        organization: scanDetail.organization ? String(scanDetail.organization) : "", // Add this
        number_of_ips: String(scanDetail.number_of_ips ?? ""),
        ips_range: String(scanDetail.ips_range ?? ""),
        port_number: String(scanDetail.port_number ?? ""),
        comment: scanDetail.comment || "",
        test_type: scanDetail.test_type as FormValues extends { test_type: infer B } ? B : never,
        time_to_start: (scanDetail.time_to_start || "").slice(0, 10),
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
    formdata.append("title", values.title);
    formdata.append("organization", values.organization); // Add this
    formdata.append("number_of_ips", values.number_of_ips);
    formdata.append("ips_range", values.ips_range);
    formdata.append("port_number", values.port_number);
    formdata.append("comment", values.comment || "");
    formdata.append("time_to_start", values.time_to_start);
    formdata.append("app_type", "infrastructure");
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
        <div className="w-full flex justify-start mb-4">
          <Image src="/media/images/client/infra.png" alt="Create web scan" width={60} height={60} />
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

                {/* Organization Select Field - Add this */}
                <FormField name="organization" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        label="Organization"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={organizationsLoading}
                      >
                        <SelectTrigger className="bg-[#F8FAFB]">
                          <SelectValue placeholder={organizationsLoading ? "Loading organizations..." : "Select an organization"} />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationsData?.results?.map((org) => (
                            <SelectItem key={org.id} value={org.id.toString()}>
                              {org.name} ({org.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="ips_type" render={({ field, fieldState }) => (
                  <FormItem>
                    <Label className="text-sm font-medium block">Are the IPS internal or public?</Label>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="w-full flex items-center">
                          <RadioGroupItem
                            value="public"
                            id="public"
                            className="sr-only peer" // Hide default radio
                          />
                          <Label
                            htmlFor="public"
                            className={`w-full
              flex items-center gap-3 px-3 py-3 rounded-full border-2 cursor-pointer transition-all duration-200
              ${field.value === 'public'
                                ? 'bg-[#A855F7]/10 border-[#A855F7] text-black'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }
            `}
                          >
                            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${field.value === 'public'
                                ? 'border-[#A855F7] bg-white'
                                : 'border-gray-300 bg-white'
                              }
            `}>
                              {field.value === 'public' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                              )}
                            </div>
                            <span className="font-medium">Public IPS</span>
                          </Label>
                        </div>

                        <div className="w-full flex items-center">
                          <RadioGroupItem
                            value="private"
                            id="private"
                            className="sr-only peer" // Hide default radio
                          />
                          <Label
                            htmlFor="private"
                            className={`w-full
              flex items-center gap-3 px-3 py-3 rounded-full border-2 cursor-pointer transition-all duration-200
              ${field.value === 'private'
                                ? 'bg-[#A855F7]/10 border-[#A855F7] text-black'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }
            `}
                          >
                            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${field.value === 'private'
                                ? 'border-[#A855F7] bg-white'
                                : 'border-gray-300 bg-white'
                              }
            `}>
                              {field.value === 'private' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                              )}
                            </div>
                            <span className="font-medium">Private IPS</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <FormField name="ips_range" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="bg-[#F8FAFB]" type="number" label="IPs Range" placeholder="30" error={fieldState.error} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="col-span-1">
                    <FormField name="port_number" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="bg-[#F8FAFB]" type="number" label="Port" placeholder="3000" error={fieldState.error} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
                <FormField name="number_of_ips" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="number" label="Number of IPs" placeholder="Number of IPs" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

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
                      <Textarea className="bg-[#F8FAFB]" label="Comment" placeholder="Optional comment" {...field} />
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

export default CreateInfraScanForm