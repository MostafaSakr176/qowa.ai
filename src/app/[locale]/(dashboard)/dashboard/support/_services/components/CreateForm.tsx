"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, FileText, Hash, Type } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/axiosClient"
import toast from "react-hot-toast"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"

// Validation schema for Create Ticket
const formSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  organization_id: z.string().min(1, { message: "Organization ID is required" }),
  description: z.string().optional(),
})

type FileItem = { file: File; description: string };

interface CreateTicketFormProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingTicket?: {
    id: string;
    type: string;
    status: string;
    priority: string;
    organization: { id: number };
    description: string | null;
    ticket_files: { id: number; file: string | null; description: string | null }[];
  } | null;
  onSuccess?: () => void;
  onCancelEdit?: () => void;
}

const CreateTicketForm = ({ setIsModalOpen, editingTicket, onSuccess, onCancelEdit }: CreateTicketFormProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "complaint",
      status: "open",
      priority: "high",
      organization_id: "",
      description: "",
    },
    mode: "onTouched",
  })

  // Populate form when editingTicket changes
  useEffect(() => {
    if (editingTicket) {
      form.reset({
        type: editingTicket.type,
        status: editingTicket.status,
        priority: editingTicket.priority,
        organization_id: String(editingTicket.organization?.id || ""),
        description: editingTicket.description || "",
      });
      // Note: existing server files not re-downloaded; we could list them separately (future enhancement)
      setFiles([]); // fresh attachments to add new ones
    } else {
      form.reset({
        type: "complaint",
        status: "open",
        priority: "high",
        organization_id: "",
        description: "",
      });
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTicket]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setFiles(prev => ([
      ...prev,
      ...selected.map(f => ({ file: f, description: "" }))
    ]));
    // reset input so same file can be selected again
    e.currentTarget.value = "";
  };

  const addDroppedFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const selected = Array.from(fileList);
    setFiles(prev => ([
      ...prev,
      ...selected.map(f => ({ file: f, description: "" }))
    ]));
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container entirely
    if (e.currentTarget === e.target) setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    addDroppedFiles(e.dataTransfer.files);
  };

  const updateFileDescription = (index: number, desc: string) => {
    setFiles(prev => prev.map((it, i) => i === index ? ({ ...it, description: desc }) : it));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const fd = new FormData();
      fd.append("type", values.type);
      fd.append("status", values.status);
      fd.append("priority", values.priority);
      fd.append("organization_id", values.organization_id);
      if (values.description) fd.append("description", values.description);

      files.forEach((it, idx) => {
        fd.append(`ticket_files[${idx}].file`, it.file, it.file.name);
        if (it.description) fd.append(`ticket_files[${idx}].description`, it.description);
      });

      if (editingTicket) {
        await api.patch(`/support/tickets/${editingTicket.id}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ticket updated successfully");
      } else {
        await api.post("/support/tickets/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ticket created successfully");
      }
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message = (typeof err === "object" && err && 'message' in err) ? String((err as { message?: string }).message) : "Failed to create ticket";
      toast.error(message || "Failed to create ticket");
    }
  }

  function handleCancel() {
    if (editingTicket && onCancelEdit) onCancelEdit();
    setIsModalOpen(false)
  }

  return (
    <div className='flex flex-col h-full overflow-y-auto justify-start items-center'
      style={{ scrollbarWidth: 'none', scrollbarColor: '#0D0D12 #fff' }}
    >
      <Form {...form}>
        <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              name="type"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Select label="Type" value={field.value} onValueChange={field.onChange} >
                      <SelectTrigger error={fieldState.error} className="bg-[#F8FAFB]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                        <SelectItem value="request">Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="status"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Select label="Status" value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger error={fieldState.error} className="bg-[#F8FAFB]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="priority"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Select label="Priority" value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger error={fieldState.error} className="bg-[#F8FAFB]">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="organization_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-[#F8FAFB]"
                      type="text"
                      label="Organization ID"
                      placeholder="Enter organization ID"
                      icon={<Hash size={20} />}
                      iconPosition="left"
                      error={fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#0D0D12]">Description</label>
                    <textarea
                      className="w-full py-2 px-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFB] text-gray-700 placeholder:text-[#9CA3AF] placeholder:text-base outline-none focus:border-[#C7C9D9] transition-colors disabled:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-60"
                      rows={4}
                      placeholder="Describe the issue"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-[#0D0D12]">Attachments</label>
            <div className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-4 w-full transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-primary'}`}>
              <label
                className={`cursor-pointer flex flex-col items-center gap-3 w-full p-4 outline-none  ${isDragActive ? 'scale-[1.01]' : ''}`}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <Image src={"/media/images/upload image.svg"} alt="upload" width={40} height={40} className={isDragActive ? 'animate-pulse' : ''} />
                <p className="text-sm text-muted-foreground text-center">
                  {isDragActive ? 'Release to upload your file(s)' : 'Drag your file(s) to start uploading'}
                </p>
                <div className="flex items-center w-full gap-2 px-2">
                  <span className="h-px bg-[#E5E7EB] flex-1" />
                  <span className="text-muted-foreground text-xs tracking-wide">OR</span>
                  <span className="h-px bg-[#E5E7EB] flex-1" />
                </div>
                <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary text-sm hover:bg-primary hover:text-white transition-all duration-200">
                  {isDragActive ? 'Drop now' : 'Upload pdf or image'}
                </span>
                <input type="file" className="hidden" multiple onChange={onFileChange} />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((it, idx) => (
                  <div key={idx} className="flex flex-col items-start gap-3 ">

                    <span className="text-sm flex-1 truncate flex  items-center gap-1" title={it.file.name}><FileText size={18} className="text-gray-500" />{it.file.name}</span>
                    <div className="w-full flex gap-2">
                      <Input
                        type="text"
                        placeholder="File description"
                        className="!rounded-full w-full bg-[#F8FAFB]"
                        icon={<Type size={16} />}
                        iconPosition="left"
                        value={it.description}
                        onChange={(e) => updateFileDescription(idx, e.target.value)}
                      />
                      <Button type="button" variant="destructive" onClick={() => removeFile(idx)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {editingTicket ? 'Save Changes' : 'Confirm'} {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateTicketForm