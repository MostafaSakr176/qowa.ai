"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Building, CreditCard, Link, Loader2Icon, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import Image from "next/image"
import { useSession } from "next-auth/react"

// Validation schema for CreateForm with suitable validation
const formSchema = z.object({
  organization_name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters." })
    .max(100, { message: "Organization name must be at most 100 characters." }),
  number_of_apps: z.number()
    .min(1, { message: "Please enter a valid number of apps (number > 0)." }),
  business_link: z.string()
    .url({ message: "Please enter a valid URL." })
    .max(200, { message: "URL must be at most 200 characters." }),
  business_email: z.string()
    .email({ message: "Please enter a valid business email address." }),
  country: z.string(),
  client_id: z.string().min(1, { message: "Client is required." }),
  // NEW: credit is optional (only sent for Super Admin). Validate when provided.
  credit: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === "" || (!isNaN(Number(v)) && Number(v) >= 0), {
      message: "Credit must be a non-negative number.",
    }),
})

// Type for API body
type CreateOrganizationBody = {
  client_id: number;
  name: string;
  number_of_apps: number;
  url: string;
  business_email: string;
  country: string;
  // NEW: only included for Super Admin
  credit?: number;
};

type OrganizationRow = {
  id: number;
  organizations: {
    name: string;
    mail: string;
    logo: React.ReactNode;
  };
  country: string;
  pest_organization: number;
  teams: number;
  states: string;
  number_of_apps: number;
  registerationDate: {
    date: string;
    time: string;
  };
  amount: string;
  url: string;
  credit: number;
};

type CreateOrganizationFormProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  editOrganization?: OrganizationRow | null;
};

type Country = {
  flag: string;
  country: string;
  code: string;
};

type CountriesResponse = {
  success: boolean;
  message: string;
  data: Country[];
};

const fetchCountries = async (): Promise<CountriesResponse> => {
  const res = await api.get("/core/countries/");
  return res.data;
};

// Types for clients
type ClientUser = { id: number; email: string; first_name: string; last_name: string }
type ClientItem = { id: number; user: ClientUser }
type ClientsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientItem[];
};

const fetchClients = async (): Promise<ClientsResponse> => {
  const res = await api.get("/client/clients/");
  return res.data;
};

const CreateOrganizationForm = ({
  setIsModalOpen,
  refetch,
  editOrganization,
}: CreateOrganizationFormProps) => {

  const { data: session } = useSession()
  // Set default values based on editOrganization
  const defaultValues = editOrganization
    ? {
      organization_name: editOrganization.organizations.name,
      business_link: editOrganization.url,
      business_email: editOrganization.organizations.mail,
      country: editOrganization.country,
      client_id: "", // unknown in edit context
      credit: editOrganization.credit.toString(),
      number_of_apps: editOrganization.number_of_apps,
    }
    : {
      organization_name: "",
      business_link: "",
      business_email: "",
      country: "",
      client_id: "",
      credit: "",
      number_of_apps: 1
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onTouched",
  })

  const mutation = useMutation({
    mutationFn: async (body: CreateOrganizationBody) => {
      const res = await api.post("/client/organizations/", body);
      return res.data;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      form.reset();
      refetch();
    },
    onError: (error) => {
      // Optionally: show error message
      console.error(error);
    }
  });

  // Add update mutation
  const updateMutation = useMutation({
    mutationFn: async (body: CreateOrganizationBody) => {
      if (!editOrganization) return;
      const res = await api.put(`/client/organizations/${editOrganization.id}/`, body);
      return res.data;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      form.reset();
      refetch();
    },
    onError: (error) => {
      console.error(error);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: CreateOrganizationBody = {
      client_id: Number(values.client_id),
      name: values.organization_name,
      number_of_apps: Number(values.number_of_apps),
      url: values.business_link,
      business_email: values.business_email,
      country: values.country,
      // Add credit only for Super Admin
      ...(session?.group?.name === "Super Admin" && values.credit !== undefined && values.credit !== ""
        ? { credit: Number(values.credit) }
        : {}),
    };

    if (editOrganization) {
      updateMutation.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  }

  // Cancel button handler that does not interact with the form state
  function handleCancel() {
    setIsModalOpen(false)
  }

  // Fetch countries
  const { data: countriesData, isLoading: countriesLoading, isError: countriesError } = useQuery<CountriesResponse>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  // Clients query
  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsError,
  } = useQuery<ClientsResponse>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  return (
    <>
      <div className='flex flex-col overflow-hidden justify-start items-center'
      >
        <Form {...form}>
          <form className="w-full h-full flex flex-col justify-between gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 h-full overflow-y-auto" style={{
              scrollbarWidth: 'none',
              scrollbarColor: '#0D0D12 #fff',
            }}>
              {/* Client Select Field */}
              <FormField
                name="client_id"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        label="Owaner"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={clientsLoading || clientsError}
                      >
                        <SelectTrigger error={fieldState.error} className="bg-[#F8FAFB]">
                          <SelectValue placeholder={clientsLoading ? "Loading clients..." : clientsError ? "Error loading clients" : "Select Client"} />
                        </SelectTrigger>
                        <SelectContent>
                          {clientsLoading && <div className="px-4 py-2 text-muted-foreground text-sm">Loading...</div>}
                          {clientsError && <div className="px-4 py-2 text-destructive text-sm">Error loading clients</div>}
                          {clientsData?.results.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.user.first_name} {c.user.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="organization_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-[#F8FAFB]"
                        type="text"
                        label="Organization Name"
                        placeholder="Organization name"
                        icon={<Building size={20} />}
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
                name="number_of_apps"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-[#F8FAFB]"
                        type="number"
                        label="Number of Applications"
                        placeholder="Enter number of applications"
                        icon={<Building size={20} />}
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
                name="business_link"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-[#F8FAFB]"
                        type="url"
                        label="Organization Website"
                        placeholder="https://your-organization.com"
                        icon={<Link size={20} />}
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
                name="business_email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-[#F8FAFB]"
                        type="email"
                        label="Business Email"
                        placeholder="Enter your business email"
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
                name="country"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        label="Country"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={countriesLoading || countriesError}
                      >
                        <SelectTrigger error={fieldState.error} className="bg-[#F8FAFB]">
                          <SelectValue placeholder={countriesLoading ? "Loading countries..." : countriesError ? "Error loading countries" : "Select Country"} />
                        </SelectTrigger>
                        <SelectContent>
                          {countriesLoading && (
                            <div className="px-4 py-2 text-muted-foreground">Loading...</div>
                          )}
                          {countriesError && (
                            <div className="px-4 py-2 text-destructive">Error loading countries</div>
                          )}
                          {countriesData?.data?.map((c, idx) => (
                            <SelectItem key={idx} value={c.country}>
                              <span className="flex items-center gap-2">
                                <Image src={c.flag} alt={c.country} width={16} height={16} className="w-4 h-4" />
                                {c.country}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Credit field stays visible only for Super Admin (unchanged) */}
              {session?.group?.name === "Super Admin" && (
                <FormField
                  name="credit"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-[#F8FAFB]"
                          type="number"
                          label="Credit"
                          placeholder="Enter credit amount"
                          icon={<CreditCard size={20} />}
                          iconPosition="left"
                          error={fieldState.error}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={
                  !form.formState.isValid ||
                  mutation.isPending ||
                  updateMutation.isPending ||
                  clientsLoading
                }
              >
                {editOrganization ? "Update" : "Create"} {(mutation.isPending || updateMutation.isPending) && <Loader2Icon className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateOrganizationForm