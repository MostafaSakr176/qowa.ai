"use client"

import React, { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link, Loader2Icon, Mail, Hash, Clock, Key, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/lib/axiosClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// Schemas (password required only on create)
const baseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  can_register_our_email: z.boolean().optional(),
  url: z.string().optional(),
  email_or_username: z.string().optional(),
  password: z.string().optional(),
  are_there_2fa_or_otp: z.string().optional(),
  number_of_pages: z.string().optional(),
  ips_range: z.string().optional(),
  port_number: z.string().optional(),
  comment: z.string().optional(),
  time_to_start: z.string().optional(),
  how_many_endoints: z.string().optional(),
  app_type: z.string().optional(),
  test_type: z.string().optional(),
  ips_type: z.string().optional(),
  number_of_ips: z.string().optional(),
});
const createSchema = baseSchema;
const editSchema = baseSchema;

type FileItem = { file: File; description: string };

const CreateScanForm = ({
  setIsModalOpen,
  organizationId,
  onCreated,
  editScanId,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  organizationId: string,
  onCreated?: () => void,
  editScanId?: number | null,
}) => {
  // Separate states for APK, IPA, JSON files
  const [apkFiles, setApkFiles] = useState<FileItem[]>([]);
  const [ipaFiles, setIpaFiles] = useState<FileItem[]>([]);
  const [jsonFiles, setJsonFiles] = useState<FileItem[]>([]);
  const [isDragActiveApk, setIsDragActiveApk] = useState(false);
  const [isDragActiveIpa, setIsDragActiveIpa] = useState(false);
  const [isDragActiveJson, setIsDragActiveJson] = useState(false);

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
      are_there_2fa_or_otp: "False",
      number_of_pages: "",
      ips_range: "",
      port_number: "",
      comment: "",
      time_to_start: "",
      how_many_endoints: "",
      app_type: "web",
      test_type: "black_box",
      ips_type: "public",
      number_of_ips: "",
    },
    mode: "onTouched",
  });

  // Fetch detail for edit prefilling
  const { data: scanDetail, isLoading: scanLoading } = useQuery({
    queryKey: ['scan-detail', editScanId],
    queryFn: async () => {
      const res = await api.get(`/scan/scans/${editScanId}/`);
      return res.data;
    },
    enabled: isEdit && !!editScanId
  });

  React.useEffect(() => {
    if (isEdit && scanDetail) {
      form.reset({
        title: scanDetail.title || "",
        can_register_our_email: !!scanDetail.can_register_our_email,
        url: scanDetail.url || "",
        email_or_username: scanDetail.email_or_username || "",
        password: "",
        are_there_2fa_or_otp: scanDetail.are_there_2fa_or_otp,
        number_of_pages: String(scanDetail.number_of_pages ?? ""),
        ips_range: String(scanDetail.ips_range ?? ""),
        port_number: String(scanDetail.port_number ?? ""),
        comment: scanDetail.comment || "",
        time_to_start: (scanDetail.time_to_start || "").slice(0, 10),
        how_many_endoints: String(scanDetail.how_many_endoints ?? ""),
        app_type: scanDetail.app_type,
        test_type: scanDetail.test_type,
        ips_type: scanDetail.ips_type,
        number_of_ips: String(scanDetail.number_of_ips ?? ""),
      });
    }
  }, [isEdit, scanDetail, form]);

  async function onSubmit(values: FormValues) {

    console.log("values");

    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }
    const formdata = new FormData();
    formdata.append("organization", organizationId);
    formdata.append("title", values.title);
    formdata.append("can_register_our_email", values.can_register_our_email ? "True" : "False");
    if (values.url) formdata.append("url", values.url);
    if (values.email_or_username) formdata.append("email_or_username", values.email_or_username);
    if (values.password) formdata.append("password", values.password);
    formdata.append("are_there_2fa_or_otp", values.are_there_2fa_or_otp ? "True" : "False");
    if (values.number_of_pages) formdata.append("number_of_pages", values.number_of_pages);
    if (values.ips_range) formdata.append("ips_range", values.ips_range);
    if (values.port_number) formdata.append("port_number", values.port_number);
    formdata.append("comment", values.comment || "");
    if (values.time_to_start) formdata.append("time_to_start", values.time_to_start);
    if (values.how_many_endoints) formdata.append("how_many_endoints", values.how_many_endoints);
    if (values.app_type) formdata.append("app_type", values.app_type);
    if (values.test_type) formdata.append("test_type", values.test_type);
    if (values.ips_type) formdata.append("ips_type", values.ips_type);
    if (values.number_of_ips) formdata.append("number_of_ips", values.number_of_ips);

    // Append files based on app_type
    if (values.app_type === "mobile") {
      apkFiles.forEach((it) => formdata.append('apk_file', it.file));
      ipaFiles.forEach((it) => formdata.append('ipa_file', it.file));
    }
    if (values.app_type === "api") {
      jsonFiles.forEach((it) => formdata.append('post_man_file', it.file));
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

  // Watch app_type for conditional rendering
  const appType = form.watch("app_type");

  return (
      <div className='flex flex-col overflow-hidden justify-start items-center'
      >
        <Form {...form}>
          <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 h-full overflow-y-auto" style={{
              scrollbarWidth: 'none',
              scrollbarColor: '#0D0D12 #fff',
            }}>
            <div className="grid grid-cols-1 gap-4">
              {/* App Type Select */}
              <FormField name="app_type" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select label="App Type" value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-[#F8FAFB]">
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

              {/* Common Fields */}
              <FormField name="title" render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input className="bg-[#F8FAFB]" type="text" label="Title" placeholder="Scan Title" icon={<Hash size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Conditional Fields */}
              {appType === "web" && (
                <>
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
                            checked={field.value}  // Add checked prop
                            onCheckedChange={field.onChange}  // Add onCheckedChange prop
                            className="data-[state=checked]:bg-[#8B5CF6]"
                          />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                  <FormField name="url" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="url" label="Target URL" placeholder="https://example.com" icon={<Link size={20} />} iconPosition="left" error={fieldState.error} {...field} />
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
                  <FormField name="number_of_pages" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="number" label="Pages" placeholder="5" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="test_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select label="Test Type" value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-[#F8FAFB]">
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
                        <Textarea className="bg-[#F8FAFB]" label="Comment" placeholder="Optional comment" icon={<FileText size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </>
              )}

              {appType === "mobile" && (
                <>
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
                            checked={field.value}  // Add checked prop
                            onCheckedChange={field.onChange}  // Add onCheckedChange prop
                            className="data-[state=checked]:bg-[#8B5CF6]"
                          />
                        </FormItem>
                      )} />
                    </div>
                  </div>
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
                  <FormField name="test_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select label="Test Type" value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-[#F8FAFB]">
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
                  {/* APK/IPA file upload fields (use your drag/drop logic here) */}
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
                  <FormField name="comment" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea className="bg-[#F8FAFB]" label="Comment" placeholder="Optional comment" icon={<FileText size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </>
              )}

              {appType === "infrastructure" && (
                <>
                  <FormField name="number_of_ips" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="number" label="Number of IPs" placeholder="Number of IPs" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="ips_range" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="number" label="IPs Range" placeholder="30" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="port_number" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="number" label="Port" placeholder="3000" error={fieldState.error} {...field} />
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
                  <FormField name="test_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select label="Test Type" value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-[#F8FAFB]">
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
                  <FormField name="ips_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select label="IPs Type" value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-[#F8FAFB]">
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
                        <Textarea className="bg-[#F8FAFB]" label="Comment" placeholder="Optional comment" icon={<FileText size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </>
              )}

              {appType === "api" && (
                <>
                  <FormField name="how_many_endoints" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="number" label="Endpoints" placeholder="10" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
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
                  <FormField name="test_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select label="Test Type" value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-[#F8FAFB]">
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
                  <FormField name="time_to_start" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="bg-[#F8FAFB]" type="date" label="Start Date" placeholder="YYYY-MM-DD" icon={<Clock size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* JSON file upload field (use your drag/drop logic here) */}
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
                  <FormField name="comment" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea className="bg-[#F8FAFB]" label="Comment" placeholder="Optional comment" icon={<FileText size={20} />} iconPosition="left" error={fieldState.error} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
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
  )
}

export default CreateScanForm
