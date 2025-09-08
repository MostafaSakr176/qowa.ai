"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, User, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "@/i18n/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multiSelect"

// Validation schema for CreateForm with suitable validation
const formSchema = z.object({
  first_name: z.string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(50, { message: "First name must be at most 50 characters." }),
  last_name: z.string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(50, { message: "Last name must be at most 50 characters." }),
  email: z.string()
    .email({ message: "Please enter a valid business email address." }),
  password: z.string()
    .min(3, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password must be at most 64 characters." }),
  group: z.string({ error: "Please select a group." }),
  scan: z.union([z.string(), z.array(z.string())]).optional(),
})

// Accept accessToken as an argument
async function createEmployee(
  body: {
    user: { first_name: string; last_name: string; email: string; password: string },
    group_id: number,
    scan_ids?: number[]
  },
  accessToken: string | undefined
) {
  if (!accessToken) {
    throw new Error("No access token found in session");
  }
  const res = await fetch("https://api.qowa.ai/employee/employees/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create employee");
  }
  return res.json();
}

// Fetch groups for select input
async function fetchGroups(accessToken: string | undefined) {
  if (!accessToken) throw new Error("No access token found in session");
  const res = await fetch("https://api.qowa.ai/core/groups/", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch groups");
  }
  const data = await res.json();
  // Map to { value, label, name, id }
  return (data.results || []).map((group: { id: number | string; name: string }) => ({
    value: String(group.id),
    label: group.name,
    name: group.name,
    id: group.id,
  }));
}

// Fetch scans for select input
async function fetchScans(accessToken: string | undefined) {
  if (!accessToken) throw new Error("No access token found in session");
  const res = await fetch("https://api.qowa.ai/scan/scans/", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch scans");
  }
  const data = await res.json();

  // Map to { value, label, id }
  return data?.results?.map((scan: { id: number | string; title: string }) => ({
    value: String(scan.id),
    label: scan.title,
    id: scan.id,
  }));
}

const CreateEmployeeForm = ({ setIsModalOpen }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter()

  // Fetch groups using react-query
  const {
    data: groupOptions,
    isLoading: groupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ['groups', session?.accessToken],
    queryFn: () => fetchGroups(session?.accessToken),
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      group: "",
      scan: [],
    },
    mode: "onTouched",
  })

  // Watch group field to determine if "Tester" is selected
  const selectedGroupId = useWatch({ control: form.control, name: "group" });
  const selectedGroup = groupOptions?.find((g: { value: string }) => g.value === selectedGroupId);
  const isTester = selectedGroup?.label === "Tester" && selectedGroup?.value === "2";

  // Fetch scans only if Tester is selected
  const {
    data: scanOptions,
    isLoading: scansLoading,
    error: scansError,
  } = useQuery({
    queryKey: ['scans', session?.accessToken],
    queryFn: () => fetchScans(session?.accessToken),
    enabled: !!session?.accessToken && isTester,
    staleTime: 5 * 60 * 1000,
  });

  // Use a mutation that passes the accessToken from session
  const mutation = useMutation({
    mutationFn: async (body: {
      user: { first_name: string; last_name: string; email: string; password: string },
      group_id: number,
      scan_ids?: number[]
    }) => {
      const accessToken = session?.accessToken
      return createEmployee(body, accessToken);
    },
    onSuccess: () => {
      setIsModalOpen(false);
      toast.success("Create employee successfully")
      router.refresh()
    },
    onError: (error) => {
      setErrorMsg(error?.message || "Failed to create employee");
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg(null);

    // Find group_id as number
    const groupObj = groupOptions?.find((g: { value: string }) => g.value === values.group);
    const group_id = groupObj ? Number(groupObj.value) : undefined;

    // Prepare scan_ids as array of numbers if present and isTester
    let scan_ids: number[] | undefined = undefined;
    if (isTester && values.scan) {
      if (Array.isArray(values.scan)) {
        scan_ids = values.scan.map((id) => Number(id));
      } else if (typeof values.scan === "string" && values.scan !== "") {
        scan_ids = [Number(values.scan)];
      }
    }

    const body: {
      user: { first_name: string; last_name: string; email: string; password: string },
      group_id: number,
      scan_ids?: number[]
    } = {
      user: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      },
      group_id: group_id!,
    };

    if (isTester && scan_ids && scan_ids.length > 0) {
      body.scan_ids = scan_ids;
    }

    mutation.mutate(body);
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="first_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          label="First Name"
                          placeholder="Enter client first name"
                          icon={<User size={20} />}
                          iconPosition="left"
                          error={fieldState.error}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="last_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          label="Last Name"
                          placeholder="Enter client last name"
                          icon={<User size={20} />}
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
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        label="Email"
                        placeholder="Enter Employee email"
                        icon={<Mail size={20} />}
                        iconPosition="left"
                        error={fieldState.error}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        label="Password"
                        placeholder="Enter your Employee Password"
                        icon={<Mail size={20} />}
                        iconPosition="left"
                        error={fieldState.error}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="group"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        disabled={groupsLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger error={fieldState.error}>
                          <SelectValue placeholder={groupsLoading ? "Loading groups..." : "Select group"} />
                        </SelectTrigger>
                        <SelectContent>
                          {groupsLoading && (
                            <div className="px-2 py-1 text-muted-foreground text-sm">Loading...</div>
                          )}
                          {groupOptions && groupOptions.length > 0 && groupOptions.map((group: { value: string, label: string }) => (
                            <SelectItem key={group.value} value={group.value}>
                              {group.label}
                            </SelectItem>
                          ))}
                          {groupOptions && groupOptions.length === 0 && !groupsLoading && (
                            <div className="px-2 py-1 text-muted-foreground text-sm">No groups found</div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Conditionally render scan select if Tester is selected */}
              {isTester && (
                <>
                  <FormField
                    name="scan"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>List all projects</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={scanOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Search and select scans..."
                            searchable
                            maxSelectedDisplay={3}
                            error={fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {groupsError && (
                <div className="text-red-500 text-sm">Failed to load groups</div>
              )}
              {isTester && scansError && (
                <div className="text-red-500 text-sm">Failed to load scans</div>
              )}
              {errorMsg && (
                <div className="text-red-500 text-sm">{errorMsg}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending || groupsLoading || (isTester && scansLoading)}
              >
                Create {(form.formState.isSubmitting || mutation.isPending) && <Loader2Icon className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateEmployeeForm