"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const evidenceSchema = z.object({
  file: z.any().refine((file) => file instanceof File, { message: "File is required" }),
  description: z.string().optional(),
});

const baseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  steps_to_reproduce: z.string().min(2, "Steps are required"),
  impact: z.string().min(2, "Impact is required"),
  severity: z.enum(["critical", "high", "medium", "low"]),
});

const createSchema = baseSchema.extend({
  scan: z.string().min(1, "Scan is required"),
  evidences: z.array(evidenceSchema).min(1, "At least one evidence is required"),
});

const editSchema = baseSchema.extend({
  status: z.enum(["open", "closed"]).default("open"),
});

export interface FindingForEdit {
  id: number;
  scan: number;
  title: string;
  description: string;
  steps_to_reproduce: string;
  impact: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "closed" | "pending" | "finished";
}


import api from '@/lib/axiosClient';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Textarea } from "@/components/ui/textarea"

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;
type FormValues = CreateValues | EditValues;

const CreateFindingForm = ({ setIsModalOpen, scanId, refetch, finding }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; scanId: string; refetch: () => void; finding?: FindingForEdit | null }) => {
  const isEdit = !!finding;
  const activeSchema = isEdit ? editSchema : createSchema;

  // Using any here due to union schema complexity with react-hook-form generics
  // The runtime validation is enforced by zod; narrowing happens in submit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    // Casting schema to any due to union create/edit differences
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(activeSchema as any),
    defaultValues: (isEdit ? {
      title: finding?.title ?? "",
      description: finding?.description ?? "",
      steps_to_reproduce: finding?.steps_to_reproduce ?? "",
      impact: finding?.impact ?? "",
      severity: finding?.severity ?? "high",
      status: finding?.status ?? "open",
    } : {
      scan: scanId,
      title: "",
      description: "",
      steps_to_reproduce: "",
      impact: "",
      severity: "high",
      evidences: [{ file: undefined, description: "" }],
    }) as FormValues,
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData();
      if (!isEdit && 'scan' in values) {
        formData.append("scan", values.scan);
      }
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("steps_to_reproduce", values.steps_to_reproduce);
      formData.append("impact", values.impact);
      formData.append("severity", values.severity);
      if (isEdit && 'status' in values) {
        formData.append("status", values.status);
      }
      if (!isEdit && 'evidences' in values) {
        (values.evidences as { file: File; description?: string }[]).forEach((ev, idx) => {
          if (ev.file) formData.append(`evidences[${idx}].file`, ev.file, (ev.file as File).name);
          if (ev.description) formData.append(`evidences[${idx}].description`, ev.description);
        });
      }
      if (process.env.NODE_ENV !== 'production') {
        for (const pair of formData.entries()) {
          console.log('FormData ->', pair[0], pair[1]);
        }
      }
      const res = isEdit
        ? await api.patch(`/scan/findings/${finding?.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await api.post("/scan/findings/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data;
    },
    onSuccess: () => {
      toast.success(isEdit ? "Finding updated successfully" : "Finding added successfully");
      setIsModalOpen(false);
      refetch();
      form.reset();
    },
    onError: (err: unknown) => {
      let message = isEdit ? "Failed to update finding" : "Failed to add finding";
      if (typeof err === 'object' && err !== null) {
        const maybeAxios = err as { response?: { data?: { detail?: string } } };
        if (maybeAxios.response?.data?.detail) message = maybeAxios.response.data.detail;
      }
      if (message === (isEdit ? "Failed to update finding" : "Failed to add finding") && err instanceof Error && err.message) {
        message = err.message;
      }
      toast.error(message);
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  return (
      <div className='flex flex-col overflow-hidden justify-start items-center'
      >
        <Form {...form}>
          <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 h-full overflow-y-auto" style={{
              scrollbarWidth: 'none',
              scrollbarColor: '#0D0D12 #fff',
            }}>
            <FormField
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input className="bg-[#F8FAFB]" type="text" label="Title" placeholder="Finding title" error={fieldState.error} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="bg-[#F8FAFB]" label="Description" placeholder="Finding description" error={fieldState.error} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="steps_to_reproduce"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="bg-[#F8FAFB]" label="Steps to Reproduce" placeholder="Steps to reproduce" error={fieldState.error} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="impact"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="bg-[#F8FAFB]" label="Impact" placeholder="Impact" error={fieldState.error} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="severity"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Select label="Severity" value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-[#F8FAFB]" error={fieldState.error}>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEdit && (
              <FormField
                name="status"

                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select label="Status" value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-[#F8FAFB]" error={fieldState.error}>
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
            )}
            {!isEdit && (
              <FormField
                name="evidences"
                render={({ field }) => (
                  <FormItem>
                    <label className="block font-medium mb-1">Evidences</label>
                    {field.value?.map((ev: { description: string }, idx: number) => (
                      <div key={idx} className="border rounded-md p-2 mb-2 flex flex-col gap-2">
                        <Input
                        className="bg-[#F8FAFB]"
                          type="file"
                          name={`evidence-file-${idx}`}
                          label="File"
                          placeholder="Upload evidence"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            const evidences = [...field.value];
                            evidences[idx].file = file;
                            field.onChange(evidences);
                          }}
                          required
                        />
                        <Input className="bg-[#F8FAFB]" type="text" label="Description" placeholder="Evidence description" value={ev.description || ""}
                          onChange={e => {
                            const evidences = [...field.value];
                            evidences[idx].description = e.target.value;
                            field.onChange(evidences);
                          }} />
                        <Button type="button" variant="destructive" onClick={() => {
                          const evidences = field.value.filter((_: { file: File | undefined; description: string }, i: number) => i !== idx);
                          field.onChange(evidences);
                        }}><Trash size={18} /> Delete</Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...field.value, { file: undefined, description: "" }])}>Add Evidence</Button>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
            >
              {isEdit ? 'Save Changes' : 'Create'} {form.formState.isSubmitting || mutation.isPending ? <Loader2Icon className="animate-spin" /> : null}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


export default CreateFindingForm