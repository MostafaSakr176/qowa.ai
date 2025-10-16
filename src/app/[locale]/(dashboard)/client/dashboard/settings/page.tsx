import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ChevronRight, KeyRound, Link, Locate, Lock, Mail, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Settings = () => {
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
          <div className="flex items-center gap-4 mb-8">
            <div>
              <span className="block text-sm text-muted-foreground mb-1">Avatar</span>
              <div className="w-16 h-16 rounded-full overflow-hidden border">
                <Image
                  src="/media/images/hero/testmonial.png"
                  alt="User avatar"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
            <Input className='bg-accent' label="First Name" placeholder='Input your name' icon={<User size={20} />} iconPosition='left' type='text' />
            <Input className='bg-accent' label="Last Name" type='text' placeholder='Input your Last name' />
            <Input className='bg-accent' label="Email" placeholder='Input your email' icon={<Mail size={20} />} iconPosition='left' type='email' />
            <Input className='bg-accent' label="Password" placeholder='Input your password' icon={<Lock size={20} />} iconPosition='left' type='password' />
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
            <Input className='bg-accent' label="Link URL Organization" type='url' placeholder='Input your Link URL Organization' icon={<Link size={20} />} iconPosition='left' />
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
              <Switch />
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