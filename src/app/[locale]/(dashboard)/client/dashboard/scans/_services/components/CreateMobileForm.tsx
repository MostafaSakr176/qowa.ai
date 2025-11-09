"use client"

import React, { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link, Loader2Icon, Mail, Hash, Clock, Key, FileText, Globe, Type } from 'lucide-react'
import { Button } from "@/components/ui/button"
// import { useRouter } from "@/i18n/navigation"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/lib/axiosClient"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add organization interface
// interface Organization {
//   id: number;
//   name: string;
//   country: string;
//   number_of_apps: number;
//   url: string;
//   business_email: string;
//   created_at: string;
//   scans_count: number;
//   team_members_count: number;
//   rank: number;
//   amount: number;
//   credit: number;
// }

// interface OrganizationsResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Organization[];
// }

// Schemas (password required only on create)
const baseSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  can_register_our_email: z.boolean().default(false),
  email_or_username: z.string().min(1, { message: "Email or username is required" }),
  password: z.string().optional(),
  comment: z.string().optional(),
  time_to_start: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Enter a valid date" }),
  test_type: z.enum(["black_box", "white_box", "gray_box"]).default("black_box"),
  // organization: z.string().min(1, { message: "Please select an organization" }), // Add this line
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
  comment: string | null
  time_to_start: string
  test_type: string
}
type FileItem = { file: File; description: string };

const CreateMobileScanForm = ({
  setIsModalOpen,
  onCreated,
  editScanId,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onCreated?: () => void,
  editScanId?: number | null,
}) => {
  // Separate states for APK and IPA files
  const [apkFiles, setApkFiles] = useState<FileItem[]>([]);
  const [ipaFiles, setIpaFiles] = useState<FileItem[]>([]);
  const [isDragActiveApk, setIsDragActiveApk] = useState(false);
  const [isDragActiveIpa, setIsDragActiveIpa] = useState(false);

  const { data: session } = useSession();
  const isEdit = !!editScanId;

  type FormValues = z.infer<typeof createSchema> | z.infer<typeof editSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: "",
      can_register_our_email: false,
      email_or_username: "",
      password: "",
      comment: "",
      time_to_start: "",
      test_type: "gray_box",
      // organization: "", // Add this line
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

  // Add the organizations query after your existing queries
  // const { data: organizationsData, isLoading: organizationsLoading } = useQuery<OrganizationsResponse>({
  //   queryKey: ['organizations'],
  //   queryFn: async () => {
  //     const res = await api.get('/client/organizations/');
  //     return res.data;
  //   },
  //   staleTime: 300_000, // 5 minutes
  // });

  // Prefill form when editing
  React.useEffect(() => {
    if (isEdit && scanDetail) {
      form.reset({
        title: scanDetail.title || "",
        can_register_our_email: !!scanDetail.can_register_our_email,
        email_or_username: scanDetail.email_or_username || "",
        password: "",
        comment: scanDetail.comment || "",
        time_to_start: (scanDetail.time_to_start || "").slice(0, 10),
        test_type: scanDetail.test_type as FormValues extends { test_type: infer B } ? B : never,
        // organization: "", // You might need to add this to ScanDetail interface if it comes from API
      })
    }
  }, [isEdit, scanDetail, form]);

  // Fix 3: Update the FormData submission with better debugging
  async function onSubmit(values: FormValues) {

    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }

    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("can_register_our_email", values.can_register_our_email ? "True" : "False");
    formdata.append("email_or_username", values.email_or_username);
    if (values.password) formdata.append("password", values.password);
    formdata.append("comment", values.comment || "");
    formdata.append("time_to_start", values.time_to_start);
    formdata.append("app_type", "mobile");
    formdata.append("test_type", values.test_type);
    // formdata.append("organization", values.organization); // Add this line

    // Append APK files
    apkFiles.forEach((it, idx) => {
      formdata.append('apk_file', it.file);
    });

    // Append IPA files
    ipaFiles.forEach((it, idx) => {
      formdata.append('ipa_file', it.file);
    });

    try {
      if (isEdit && editScanId) {
        const response = await api.patch(`/scan/scans/${editScanId}/`, formdata, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log("Update response:", response.data);
        toast.success("Scan updated successfully");
      } else {
        const response = await api.post("/scan/scans/", formdata, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log("Create response:", response.data);
        toast.success("Scan created successfully");
      }
      setIsModalOpen(false);
      onCreated?.();
    } catch (e) {
      interface AxiosLikeErrorData { detail?: string }
      interface AxiosLikeError { response?: { data?: AxiosLikeErrorData }; message?: string }
      const axiosErr = e as AxiosLikeError;
      console.error("Submit error:", axiosErr);
      const message = axiosErr?.response?.data?.detail || axiosErr?.message || (isEdit ? "Failed to update scan" : "Failed to create scan");
      toast.error(message);
    }
  }

  // Cancel button handler that does not interact with the form state
  function handleCancel() {
    setIsModalOpen(false)
  }

  // Update the file handlers to filter only APK and IPA files
  const onApkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    console.log("Selected files:", selected); // Debug log

    // Filter only APK files
    const apkOnly = selected.filter(file => 
      file.name.toLowerCase().endsWith('.apk') || 
      file.type === 'application/vnd.android.package-archive'
    );
    
    if (apkOnly.length !== selected.length) {
      toast.error("Only APK files are allowed in this section");
    }

    if (apkOnly.length > 0) {
      setApkFiles(prev => ([
        ...prev,
        ...apkOnly.map(f => ({ file: f, description: "" }))
      ]));
    }
    
    e.currentTarget.value = "";
  };

  const addDroppedApkFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const selected = Array.from(fileList);

    // Filter only APK files
    const apkOnly = selected.filter(file =>
      file.name.toLowerCase().endsWith('.apk')
    );

    if (apkOnly.length !== selected.length) {
      toast.error("Only APK files are allowed in this section");
    }

    if (apkOnly.length > 0) {
      setApkFiles(prev => ([
        ...prev,
        ...apkOnly.map(f => ({ file: f, description: "" }))
      ]));
    }
  }, []);

  // IPA file handlers - Updated to accept only IPA files
  const onIpaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    console.log("Selected IPA files:", selected); // Debug log

    // Filter only IPA files
    const ipaOnly = selected.filter(file => 
      file.name.toLowerCase().endsWith('.ipa') || 
      file.type === 'application/octet-stream'
    );
    
    if (ipaOnly.length !== selected.length) {
      toast.error("Only IPA files are allowed in this section");
    }

    if (ipaOnly.length > 0) {
      setIpaFiles(prev => ([
        ...prev,
        ...ipaOnly.map(f => ({ file: f, description: "" }))
      ]));
    }
    
    e.currentTarget.value = "";
  };

  const addDroppedIpaFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const selected = Array.from(fileList);

    // Filter only IPA files
    const ipaOnly = selected.filter(file =>
      file.name.toLowerCase().endsWith('.ipa')
    );

    if (ipaOnly.length !== selected.length) {
      toast.error("Only IPA files are allowed in this section");
    }

    if (ipaOnly.length > 0) {
      setIpaFiles(prev => ([
        ...prev,
        ...ipaOnly.map(f => ({ file: f, description: "" }))
      ]));
    }
  }, []);

  // APK drag handlers
  const onApkDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActiveApk) setIsDragActiveApk(true);
  };

  const onApkDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActiveApk) setIsDragActiveApk(true);
  };

  const onApkDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) setIsDragActiveApk(false);
  };

  const onApkDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActiveApk(false);
    addDroppedApkFiles(e.dataTransfer.files);
  };

  // IPA drag handlers
  const onIpaDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActiveIpa) setIsDragActiveIpa(true);
  };

  const onIpaDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActiveIpa) setIsDragActiveIpa(true);
  };

  const onIpaDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) setIsDragActiveIpa(false);
  };

  const onIpaDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActiveIpa(false);
    addDroppedIpaFiles(e.dataTransfer.files);
  };

  const removeApkFile = (index: number) => {
    setApkFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeIpaFile = (index: number) => {
    setIpaFiles(prev => prev.filter((_, i) => i !== index));
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
          <Image src="/media/images/client/mobile.png" alt="Create mobile scan" width={60} height={60} />
        </div>
        <Form {...form}>
          <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Title field */}
                <FormField name="title" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-[#F8FAFB]" type="text" label="Title" placeholder="Scan Title" error={fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Organization select field - New addition */}
                {/* <FormField name="organization" render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger error={fieldState.error}>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationsData?.results.map(org => (
                            <SelectItem key={org.id} value={org.id.toString()}>
                              {org.name} ({org.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} /> */}

                {/* File upload sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* APK Upload Section - Updated to accept only APK files */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Android APK Files</h3>
                    <div className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-4 w-full transition-colors ${isDragActiveApk ? 'border-primary bg-primary/5' : 'border-primary'}`}>
                      <label
                        className={`cursor-pointer flex flex-col items-center gap-3 w-full p-4 outline-none ${isDragActiveApk ? 'scale-[1.01]' : ''}`}
                        onDragOver={onApkDragOver}
                        onDragEnter={onApkDragEnter}
                        onDragLeave={onApkDragLeave}
                        onDrop={onApkDrop}
                      >
                        <Image src={"/media/images/upload image.svg"} alt="upload" width={40} height={40} className={isDragActiveApk ? 'animate-pulse' : ''} />
                        <p className="text-sm text-muted-foreground text-center">
                          {isDragActiveApk ? 'Release to upload APK files' : 'Drag APK files to start uploading'}
                        </p>
                        <div className="flex items-center w-full gap-2 px-2">
                          <span className="h-px bg-[#E5E7EB] flex-1" />
                          <span className="text-muted-foreground text-xs tracking-wide">OR</span>
                          <span className="h-px bg-[#E5E7EB] flex-1" />
                        </div>
                        <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary text-sm hover:bg-primary hover:text-white transition-all duration-200">
                          {isDragActiveApk ? 'Drop APK files now' : 'Upload APK Files'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".apk" // Accept only APK files
                          onChange={onApkFileChange}
                        />
                      </label>
                    </div>
                    {apkFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">APK Files ({apkFiles.length})</h4>
                        {apkFiles.map((it, idx) => (
                          <div key={idx} className="flex flex-col items-start gap-3 p-2 border rounded-lg">
                            <span className="text-sm flex-1 truncate flex items-center gap-1" title={it.file.name}>
                              <FileText size={18} className="text-green-500" />
                              <div>
                                <div className="font-medium">{it.file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(it.file.size / 1024 / 1024).toFixed(2)} MB • APK File
                                </div>
                              </div>
                            </span>
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeApkFile(idx)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* IPA Upload Section - Updated to accept only IPA files */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">iOS IPA Files</h3>
                    <div className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-4 w-full transition-colors ${isDragActiveIpa ? 'border-primary bg-primary/5' : 'border-primary'}`}>
                      <label
                        className={`cursor-pointer flex flex-col items-center gap-3 w-full p-4 outline-none ${isDragActiveIpa ? 'scale-[1.01]' : ''}`}
                        onDragOver={onIpaDragOver}
                        onDragEnter={onIpaDragEnter}
                        onDragLeave={onIpaDragLeave}
                        onDrop={onIpaDrop}
                      >
                        <Image src={"/media/images/upload image.svg"} alt="upload" width={40} height={40} className={isDragActiveIpa ? 'animate-pulse' : ''} />
                        <p className="text-sm text-muted-foreground text-center">
                          {isDragActiveIpa ? 'Release to upload IPA files' : 'Drag IPA files to start uploading'}
                        </p>
                        <div className="flex items-center w-full gap-2 px-2">
                          <span className="h-px bg-[#E5E7EB] flex-1" />
                          <span className="text-muted-foreground text-xs tracking-wide">OR</span>
                          <span className="h-px bg-[#E5E7EB] flex-1" />
                        </div>
                        <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary text-sm hover:bg-primary hover:text-white transition-all duration-200">
                          {isDragActiveIpa ? 'Drop IPA files now' : 'Upload IPA Files'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".ipa" // Accept only IPA files
                          onChange={onIpaFileChange}
                        />
                      </label>
                    </div>
                    {ipaFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">IPA Files ({ipaFiles.length})</h4>
                        {ipaFiles.map((it, idx) => (
                          <div key={idx} className="flex flex-col items-start gap-3 p-2 border rounded-lg">
                            <span className="text-sm flex-1 truncate flex items-center gap-1" title={it.file.name}>
                              <FileText size={18} className="text-blue-500" />
                              <div>
                                <div className="font-medium">{it.file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(it.file.size / 1024 / 1024).toFixed(2)} MB • IPA File
                                </div>
                              </div>
                            </span>
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeIpaFile(idx)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rest of your form fields... */}
                {/* Email registration field */}
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

                {/* Other form fields... */}
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
                <FormField name="test_type" render={({ field }) => (
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
                disabled={form.formState.isSubmitting}
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

export default CreateMobileScanForm