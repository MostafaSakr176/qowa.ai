"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, KeyRound, Locate, Lock, Mail, User, Loader2, Link2, Hash } from 'lucide-react'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/axiosClient'
import toast from 'react-hot-toast'
import { Link } from '@/i18n/navigation'

// Types for /client/profile/
interface ProfileResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_2fa_enabled: boolean;
    created_at: string;
    last_login: string | null;
  };
  client: {
    id: number;
    team_members: { id: number; role: string }[];
  };
  organization: {
    id: number;
    name: string;
    country: string;
    number_of_apps: number;
    url: string;
    business_email: string;
    created_at: string;
    scans_count: number;
    team_members_count: number;
    amount: number;
    credit: number;
  };
}

type UpdateProfilePayload = {
  user: {
    first_name: string;
    last_name: string;
  };
  organization: {
    name: string;
    number_of_apps: number;
    url: string;
    business_email: string;
  };
};

const Settings = () => {
  // User state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  // Organization state
  const [orgName, setOrgName] = useState("")
  const [orgUrl, setOrgUrl] = useState("")
  const [orgBusinessEmail, setOrgBusinessEmail] = useState("")
  const [orgNumberOfApps, setOrgNumberOfApps] = useState<number | ''>('')

  // Fetch profile data
  const { data: profileData, isLoading, error, refetch, isFetching } = useQuery<ProfileResponse>({
    queryKey: ['client-profile'],
    queryFn: async () => {
      const res = await api.get('/client/profile/')
      return res.data
    },
    staleTime: 300_000, // 5 minutes
  })

  // Populate form on data load
  React.useEffect(() => {
    if (!profileData) return
    // User
    setFirstName(profileData.user.first_name || "")
    setLastName(profileData.user.last_name || "")
    setEmail(profileData.user.email || "")
    setIs2FAEnabled(!!profileData.user.is_2fa_enabled)
    // Organization
    setOrgName(profileData.organization.name || "")
    setOrgUrl(profileData.organization.url || "")
    setOrgBusinessEmail(profileData.organization.business_email || "")
    setOrgNumberOfApps(profileData.organization.number_of_apps ?? '')
  }, [profileData])

  // Build payload from current state (uses current state for both user + org)
  const buildPayload = (): UpdateProfilePayload => {
    const numberOfApps =
      typeof orgNumberOfApps === 'string'
        ? parseInt(orgNumberOfApps || '0', 10)
        : orgNumberOfApps || 0

    return {
      user: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      },
      organization: {
        name: orgName.trim(),
        number_of_apps: Number.isFinite(numberOfApps) ? numberOfApps : 0,
        url: orgUrl.trim(),
        business_email: orgBusinessEmail.trim(),
      },
    }
  }

  // Update profile (PATCH /client/profile/)
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await api.patch('/client/profile/', payload)
      return res.data as ProfileResponse
    },
    onSuccess: () => {
      toast.success("Profile updated successfully")
      refetch()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const message =
        err?.message ||
        "Failed to update profile. Please try again."
      toast.error(message)
    },
  })

  // Submit handlers (both send user + organization)
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required")
      return
    }
    updateProfileMutation.mutate(buildPayload())
  }

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim() || !orgUrl.trim() || !orgBusinessEmail.trim()) {
      toast.error("Organization name, URL and business email are required")
      return
    }
    updateProfileMutation.mutate(buildPayload())
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
        <span className="ml-2 text-[#6B7280]">Loading profile...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Failed to load profile data. Please try again.</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* User profile section */}
      <div className="grid grid-cols-4 bg-white border-b p-6 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Data User</h2>
          <p className="text-sm text-muted-foreground">
            Your personal information and account security settings.
          </p>
        </div>

        {/* Main Content */}
        <div className="col-span-3">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="block text-sm text-muted-foreground mb-1">Avatar</span>
              <div className="w-16 h-16 rounded-full overflow-hidden border bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            {profileData?.client?.id && (
              <div className="ml-4 flex items-center gap-2">
                <span className="block text-sm text-muted-foreground mb-1">Client ID</span>
                <span className="px-3 py-1 bg-[#F5E9FF] text-[#681390] rounded-full text-sm font-medium">
                  #{profileData.client.id}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
            <Input
              className='bg-accent'
              label="First Name"
              placeholder='Input your name'
              icon={<User size={20} />}
              iconPosition='left'
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
            <Input
              className='bg-accent'
              label="Last Name"
              type='text'
              placeholder='Input your Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
            <Input
              className='bg-accent'
              label="Email"
              placeholder='Input your email'
              icon={<Mail size={20} />}
              iconPosition='left'
              type='email'
              value={email}
              disabled
              title="Email cannot be changed"
            />
            <Input
              className='bg-accent'
              label="Password"
              placeholder='••••••••'
              icon={<Lock size={20} />}
              iconPosition='left'
              type='password'
              disabled
              title="Use 'Set Password' button below to change password"
            />

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!profileData) return
                  setFirstName(profileData.user.first_name || "")
                  setLastName(profileData.user.last_name || "")
                }}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 text-white"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Organization section */}
      <div className="grid grid-cols-4 bg-white border-b p-6 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Organization settings</h2>
          <p className="text-sm text-muted-foreground">
            Update your organization details used across the platform.
          </p>
        </div>

        {/* Main Content */}
        <div className="col-span-3">
          <form onSubmit={handleOrgSubmit} className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
            <Input
              className='bg-accent'
              label="Name"
              placeholder='Organization name'
              icon={<User size={20} />}
              iconPosition='left'
              type='text'
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
            <Input
              className='bg-accent'
              label="Link URL Organization"
              type='url'
              placeholder='https://example.com'
              icon={<Link2 size={20} />}
              iconPosition='left'
              value={orgUrl}
              onChange={(e) => setOrgUrl(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
            <Input
              className='bg-accent'
              label="Business Email"
              placeholder='business@email.com'
              icon={<Mail size={20} />}
              iconPosition='left'
              type='email'
              value={orgBusinessEmail}
              onChange={(e) => setOrgBusinessEmail(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
            <Input
              className='bg-accent'
              label="Number of Apps"
              placeholder='3'
              icon={<Hash size={20} />}
              iconPosition='left'
              type='number'
              min={0}
              value={orgNumberOfApps === '' ? '' : String(orgNumberOfApps)}
              onChange={(e) => {
                const v = e.target.value
                setOrgNumberOfApps(v === '' ? '' : Number(v))
              }}
              disabled={updateProfileMutation.isPending}
            />
            {/* Optional: show country (read-only) */}
            <Input
              className='bg-accent'
              label="Country"
              placeholder='Country'
              icon={<Locate size={20} />}
              iconPosition='left'
              type='text'
              value={profileData?.organization.country ?? ''}
              disabled
              title="Country cannot be changed here"
            />

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!profileData) return
                  setOrgName(profileData.organization.name || "")
                  setOrgUrl(profileData.organization.url || "")
                  setOrgBusinessEmail(profileData.organization.business_email || "")
                  setOrgNumberOfApps(profileData.organization.number_of_apps ?? '')
                }}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 text-white"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Organization"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-muted rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Account Security</h2>
        <div className="space-y-4">
          {/* Google Authenticator (2FA) */}
          <div className="flex items-center justify-between bg-white rounded-md border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-md border p-2">
                <KeyRound className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">Google Authenticator (2FA)</div>
                <div className="text-sm text-muted-foreground">
                  Use the Authenticator to get verification codes for better security.
                </div>
              </div>
            </div>
            <div>
              <Link href="/auth/2-step-verification">
                <Button variant="outline" size="sm" className='rounded-md'>
                  {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"} <ChevronRight size={18} strokeWidth="2px" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between bg-white rounded-md border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-md border p-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm text-muted-foreground">
                  Set a unique password for better protection.
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className='rounded-md'>
              Set Password <ChevronRight size={18} strokeWidth="2px" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings