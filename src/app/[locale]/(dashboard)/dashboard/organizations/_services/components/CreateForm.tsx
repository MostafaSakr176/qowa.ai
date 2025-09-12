"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Building, Link, Loader2Icon, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import Image from "next/image"

// Validation schema for CreateForm with suitable validation
const formSchema = z.object({
  organization_name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters." })
    .max(100, { message: "Organization name must be at most 100 characters." }),
  apps_number: z.string()
    .refine(val => {
      const num = Number(val)
      return !isNaN(num) && num > 0 && Number.isInteger(num)
    }, { message: "Please enter a valid number of apps (integer > 0)." }),
  business_link: z.string()
    .url({ message: "Please enter a valid URL." })
    .max(200, { message: "URL must be at most 200 characters." }),
  business_email: z.string()
    .email({ message: "Please enter a valid business email address." }),
  country: z.string(),
})

// Type for API body
type CreateOrganizationBody = {
  client_id: number;
  name: string;
  number_of_apps: number;
  url: string;
  business_email: string;
  country: string;
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
    registerationDate: {
        date: string;
        time: string;
    };
    amount: string;
};

type CreateOrganizationFormProps = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: () => void;
    editOrganization?: OrganizationRow | null;
};

// Replace with actual client_id (get from context/session if needed)
const CLIENT_ID = 36;

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

const CreateOrganizationForm = ({
    setIsModalOpen,
    refetch,
    editOrganization,
}: CreateOrganizationFormProps) => {
    // Set default values based on editOrganization
    const defaultValues = editOrganization
        ? {
            organization_name: editOrganization.organizations.name,
            apps_number: editOrganization.teams.toString(),
            business_link: "", // You may want to pass the URL if available
            business_email: editOrganization.organizations.mail,
            country: editOrganization.country,
        }
        : {
            organization_name: "",
            apps_number: "",
            business_link: "",
            business_email: "",
            country: "",
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
    const payload = {
      client_id: 36,
      name: values.organization_name,
      number_of_apps: Number(values.apps_number),
      url: values.business_link,
      business_email: values.business_email,
      country: values.country,
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
              <FormField
                name="organization_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
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
                name="apps_number"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        label="How many apps in the organization?"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger error={fieldState.error}>
                          <SelectValue placeholder="Select number of apps" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <SelectTrigger error={fieldState.error}>
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
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={!form.formState.isValid || mutation.isPending}
              >
                Create {mutation.isPending && <Loader2Icon className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateOrganizationForm