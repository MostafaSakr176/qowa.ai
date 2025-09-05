"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, User, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "@/i18n/navigation"

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
    .max(64, { message: "Password must be at most 64 characters." })
})

// Accept accessToken as an argument
async function createEmployee(
  body: { user: { first_name: string; last_name: string; email: string; password: string } },
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

const CreateEmployeeForm = ({ setIsModalOpen }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  })

  // Use a mutation that passes the accessToken from session
  const mutation = useMutation({
    mutationFn: async (body: { user: { first_name: string; last_name: string; email: string; password: string } }) => {
      // You may need to adjust the path to the access token depending on your next-auth config
      // Commonly: session?.accessToken or session?.user?.accessToken
      const accessToken =
        session?.accessToken
      return createEmployee(body, accessToken);
    },
    onSuccess: (data) => {
      setIsModalOpen(false);
      toast.success("Create employee successfully")
      router.refresh()
      // Optionally, you can refetch team list or show a toast here
    },
    onError: (error) => {
      setErrorMsg(error?.message || "Failed to create employee");
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg(null);
    const body = {
      user: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      }
    };
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
                          placeholder="Ente client first name"
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
                disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
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