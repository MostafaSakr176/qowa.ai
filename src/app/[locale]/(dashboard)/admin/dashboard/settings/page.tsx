"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Switch } from '@/components/ui/switch'
import { ChevronRight, KeyRound, Locate, Lock, Mail, User, Loader2, Link2 } from 'lucide-react'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/axiosClient'
import toast from 'react-hot-toast'
import { Link } from '@/i18n/navigation'

interface UserProfile {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_2fa_enabled: boolean;
    created_at: string;
    last_login: string | null;
  };
  group_name: string | null;
  group_id: number | null;
}

const Settings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Fetch profile data
  const { data: profileData, isLoading, error, refetch } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/employee/employees/me/');
      return res.data;
    },
    staleTime: 300_000, // 5 minutes
  });

  // Set form values when data loads
  React.useEffect(() => {
    if (profileData) {
      setFirstName(profileData.user.first_name);
      setLastName(profileData.user.last_name);
      setEmail(profileData.user.email);
      setIs2FAEnabled(profileData.user.is_2fa_enabled);
    }
  }, [profileData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { user: { first_name: string; last_name: string } }) => {
      const res = await api.patch('/employee/employees/me/', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      console.log("Profile updated:", data);
      refetch();
    },
    onError: (error: Error) => {
      const errorMessage = error?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    updateProfileMutation.mutate({
      user: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
        <span className="ml-2 text-[#6B7280]">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Failed to load profile data. Please try again.</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
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
            {profileData?.group_name && (
              <div className="ml-4 flex items-center gap-2">
                <span className="block text-sm text-muted-foreground mb-1">Role</span>
                <span className="px-3 py-1 bg-[#F5E9FF] text-[#681390] rounded-full text-sm font-medium">
                  {profileData.group_name}
                </span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
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
                  setFirstName(profileData?.user.first_name || "");
                  setLastName(profileData?.user.last_name || "");
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
      <div className="grid grid-cols-4 bg-white border-b p-6 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Organization settings</h2>
        </div>
        {/* Main Content */}
        <div className="col-span-3">
          <form className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
            <Input className='bg-accent' label="Name" placeholder='Organization name' icon={<User size={20} />} iconPosition='left' type='text' />
            <Input className='bg-accent' label="Link URL Organization" type='url' placeholder='Input your Link URL Organization' icon={<Link2 size={20} />} iconPosition='left' />
            <div className='col-span-2'>
              <Input className='bg-accent' label="Organization address" placeholder='ex. Asia / Bandung' icon={<Locate size={20} />} iconPosition='left' type='text' />
            </div>
          </form>
        </div>
      </div>
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
              {/* <Switch
                checked={is2FAEnabled}
                disabled
                title="2FA settings will be available soon"
              /> */}
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