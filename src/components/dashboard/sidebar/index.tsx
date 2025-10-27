"use client"
import * as React from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { HeartHandshake, Home, PanelLeftOpen, PanelRightOpen, QrCode, ReceiptText, Scan, Settings, Users } from 'lucide-react';
import { useLocale } from 'next-intl'
import { signOut, useSession } from 'next-auth/react';

const adminNavItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: <Home size={20} />,
  },
  {
    href: '/admin/dashboard/organizations',
    label: 'Organizations',
    icon: <Users size={20} />,
  },
  {
    href: '/admin/dashboard/invoices',
    label: 'Invoices',
    icon: <ReceiptText size={20} />,
  },
  {
    href: '/admin/dashboard/ai-scan-configrations',
    label: 'Ai scan configrations',
    icon: <QrCode size={20} />,
  },
  {
    href: '/admin/dashboard/team',
    label: 'Team',
    icon: <Users size={20} />,
  },
  {
    href: '/admin/dashboard/settings',
    label: 'Settings',
    icon: <Settings size={20} />,
  },
  {
    href: '/admin/dashboard/support',
    label: 'Support',
    icon: <HeartHandshake size={20} />,
  },
]

const clientNavItems = [
  {
    href: '/client/dashboard',
    label: 'Dashboard',
    icon: <Home size={20} />,
  },
  {
    href: '/client/dashboard/scans',
    label: 'Scans',
    icon: <Scan size={20} />,
  },
  {
    href: '/client/dashboard/team',
    label: 'Team',
    icon: <Users size={20} />,
  },
  {
    href: '/client/dashboard/settings',
    label: 'Settings',
    icon: <Settings size={20} />,
  },
  {
    href: '/client/dashboard/support',
    label: 'Support',
    icon: <HeartHandshake size={20} />,
  },
]

// Improved isActiveLink: checks for exact match or subpath, and ensures locale is handled
function isActiveLink(pathname: string, locale: string, href: string) {
  // Remove leading slash from locale if present
  const normalizedLocale = locale.startsWith('/') ? locale.slice(1) : locale;
  // Ensure pathname starts with /<locale>
  const localePrefix = `/${normalizedLocale}`;
  // Remove locale prefix from pathname for comparison
  let path = pathname;
  if (path.startsWith(localePrefix)) {
    path = path.slice(localePrefix.length);
    if (!path.startsWith('/')) path = '/' + path;
  }
  // For other items, match exact or subpath (e.g. /admin/dashboard/organizations or /admin/dashboard/organizations/...)
  return path === href;
}

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const pathname = usePathname();
  const Locale = useLocale();
  const { data: session } = useSession();

  return (
    <TooltipProvider>
      <div
        className={`sticky inset-y-0 left-0 z-50 transition-all duration-200 flex flex-col
              ${sidebarOpen ? 'w-64' : 'w-20'}
            `}
      >
        <div className="flex items-center justify-between p-4">
          {sidebarOpen ? (
            <Image
              src="/media/images/logos/dark-logo.webp"
              alt="Logo"
              width={100}
              height={80}
              className="md:w-[80px] h-auto lg:w-[100px]"
            />
          ) : ""}
          <Button
            variant="ghost"
            size="icon"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={() => setSidebarOpen((open) => !open)}
            className="ml-2 text-gray-400"
          >
            {sidebarOpen ? <PanelRightOpen size={20} /> : <PanelLeftOpen size={20} />}
          </Button>
        </div>
        <nav className="mt-8 flex-1">
          <div className="px-2 space-y-2 flex flex-col">
            {(session?.user.role === 'client' ? clientNavItems : adminNavItems).map((item) => {
              const active = isActiveLink(pathname, Locale, item.href);
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`text-sm flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                        ${sidebarOpen ? '' : 'justify-center'}
                        ${active
                          ? 'bg-[#E9ECEF] text-black shadow-sm'
                          : 'text-gray-700 hover:bg-[#E9ECEF]'
                        }
                      `}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.icon}
                      {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right" >
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>
        </nav>
        <Button
          variant="ghost"
          onClick={() =>
            signOut({
              callbackUrl: `/${Locale}/auth/login`, // يرجعك على صفحة اللوجين بعد الـ logout
            })
          }
        >
          Logout
        </Button>
      </div>
    </TooltipProvider>
  )
}

export default SideBar