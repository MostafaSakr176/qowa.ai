"use client"

import React, { useCallback, useState } from "react"
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
  email_or_username: z.string().min(1, { message: "Email or username is required" }),
  password: z.string().optional(),
  number_of_ips: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  comment: z.string().optional(),
  time_to_start: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Enter a valid date" }),
  how_many_endoints: z.string().regex(/^\d+$/, { message: "Enter a valid number" }),
  test_type: z.enum(["black_box", "white_box", "gray_box"]).default("black_box"),
});
const createSchema = baseSchema.extend({
  password: z.string().min(1, { message: "Password is required" })
});
const editSchema = baseSchema;

interface ScanDetail {
  id: number
  title: string
  organization?: number // Add this if it comes from API
  how_many_endoints: number | string
  email_or_username: string
  number_of_ips: number | string
  comment: string | null
  time_to_start: string
  app_type: string
  test_type: string
}

type FileItem = { file: File; description: string };

const CreateApiScanForm = ({
  setIsModalOpen,
  onCreated,
  editScanId,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onCreated?: () => void,
  editScanId?: number | null,
}) => {
  const [jsonFiles, setJsonFiles] = useState<FileItem[]>([]);
  const [isDragActiveJson, setIsDragActiveJson] = useState(false);
  const { data: session } = useSession();
  const isEdit = !!editScanId;

  type FormValues = z.infer<typeof createSchema> | z.infer<typeof editSchema>;

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
    resolver: zodResolver(isEdit ? editSchema : createSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: "",
      organization: "", // Add this
      number_of_ips: "",
      email_or_username: "",
      password: "",
      comment: "",
      time_to_start: "",
      how_many_endoints: "",
      test_type: "gray_box",
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

  // Update prefill form when editing
  React.useEffect(() => {
    if (isEdit && scanDetail) {
      form.reset({
        title: scanDetail.title || "",
        organization: scanDetail.organization ? String(scanDetail.organization) : "", // Add this
        email_or_username: scanDetail.email_or_username || "",
        password: "",
        number_of_ips: String(scanDetail.number_of_ips ?? ""),
        comment: scanDetail.comment || "",
        time_to_start: (scanDetail.time_to_start || "").slice(0, 10),
        how_many_endoints: String(scanDetail.how_many_endoints ?? ""),
        test_type: scanDetail.test_type as FormValues extends { test_type: infer B } ? B : never,
      })
    }
  }, [isEdit, scanDetail, form]);

  // Update onSubmit function
  async function onSubmit(values: FormValues) {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("organization", values.organization); // Add this
    formdata.append("how_many_endoints", values.how_many_endoints);
    formdata.append("number_of_ips", values.number_of_ips);
    formdata.append("email_or_username", values.email_or_username);
    if (values.password) formdata.append("password", values.password);
    formdata.append("comment", values.comment || "");
    formdata.append("time_to_start", values.time_to_start);
    formdata.append("app_type", "api");
    formdata.append("test_type", values.test_type);

    // Append JSON files
    jsonFiles.forEach((it, idx) => {
      formdata.append('post_man_file', it.file);
    });

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

  // Update the file handlers to filter only JSON files
  const onJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    console.log("Selected files:", selected); // Debug log

    // Filter only JSON files
    const jsonOnly = selected.filter(file =>
      file.name.toLowerCase().endsWith('.json') ||
      file.type === 'application/json'
    );

    if (jsonOnly.length !== selected.length) {
      toast.error("Only JSON files are allowed in this section");
    }

    if (jsonOnly.length > 0) {
      setJsonFiles(prev => ([
        ...prev,
        ...jsonOnly.map(f => ({ file: f, description: "" }))
      ]));
    }

    e.currentTarget.value = "";
  };

  const removeJsonFile = (index: number) => {
    setJsonFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addDroppedJsonFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const selected = Array.from(fileList);

    console.log("Dropped files:", selected); // Debug log

    // Filter only JSON files
    const jsonOnly = selected.filter(file =>
      file.name.toLowerCase().endsWith('.json') ||
      file.type === 'application/json'
    );

    if (jsonOnly.length !== selected.length) {
      toast.error("Only JSON files are allowed in this section");
    }

    if (jsonOnly.length > 0) {
      setJsonFiles(prev => ([
        ...prev,
        ...jsonOnly.map(f => ({ file: f, description: "" }))
      ]));
    }
  }, []);

  // JSON drag handlers
  const onJsonDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActiveJson) setIsDragActiveJson(true);
  };

  const onJsonDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActiveJson) setIsDragActiveJson(true);
  };

  const onJsonDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) setIsDragActiveJson(false);
  };

  const onJsonDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActiveJson(false);
    addDroppedJsonFiles(e.dataTransfer.files);
  };

  return (
    <>
      <div className='flex flex-col h-full overflow-y-auto justify-start items-center'
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: '#0D0D12 #fff',
        }}
      >
        <div className="w-full flex justify-start mb-4">
          <Image src="/media/images/client/api.png" alt="Create web scan" width={60} height={60} />
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

                <FormField name="how_many_endoints" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="number" label="how many endpoints / api ?" placeholder="30" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* JSON Upload Section - Updated to accept only JSON files */}
                <div>
                  <h3 className="text-sm font-medium mb-2">JSON Files</h3>
                  <div className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-4 w-full transition-colors ${isDragActiveJson ? 'border-primary bg-primary/5' : 'border-primary'}`}>
                    <label
                      className={`cursor-pointer flex flex-col items-center gap-3 w-full p-4 outline-none ${isDragActiveJson ? 'scale-[1.01]' : ''}`}
                      onDragOver={onJsonDragOver}
                      onDragEnter={onJsonDragEnter}
                      onDragLeave={onJsonDragLeave}
                      onDrop={onJsonDrop}
                    >
                      <Image src={"/media/images/upload image.svg"} alt="upload" width={40} height={40} className={isDragActiveJson ? 'animate-pulse' : ''} />
                      <p className="text-sm text-muted-foreground text-center">
                        {isDragActiveJson ? 'Release to upload JSON files' : 'Drag JSON files to start uploading'}
                      </p>
                      <div className="flex items-center w-full gap-2 px-2">
                        <span className="h-px bg-[#E5E7EB] flex-1" />
                        <span className="text-muted-foreground text-xs tracking-wide">OR</span>
                        <span className="h-px bg-[#E5E7EB] flex-1" />
                      </div>
                      <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary text-sm hover:bg-primary hover:text-white transition-all duration-200">
                        {isDragActiveJson ? 'Drop JSON files now' : 'Upload JSON Files'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".json" // Accept only JSON files
                        onChange={onJsonFileChange}
                      />
                    </label>
                  </div>
                  {jsonFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">JSON Files ({jsonFiles.length})</h4>
                      {jsonFiles.map((it, idx) => (
                        <div key={idx} className="flex flex-col items-start gap-3 p-2 border rounded-lg">
                          <span className="text-sm flex-1 truncate flex items-center gap-1" title={it.file.name}>
                            <FileText size={18} className="text-green-500" />
                            <div>
                              <div className="font-medium">{it.file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {(it.file.size / 1024 / 1024).toFixed(2)} MB • JSON File
                              </div>
                            </div>
                          </span>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeJsonFile(idx)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FormField name="number_of_ips" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="number" label="Number of IPs" placeholder="Number of IPs" error={fieldState.error} {...field} />
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

export default CreateApiScanForm