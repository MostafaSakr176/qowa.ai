'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SideNav from './mobile-menu'
import LanguageSwitcher from './langSwitcher'

const navItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About Us",
  },
  {
    href: "/features",
    label: "Features",
  },
  {
    href: "/pricings",
    label: "Pricings",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/contact",
    label: "Contact",
  }
]

export default function Header() {
  const pathname = usePathname();

  // Helper to check if the nav item is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Responsive height classes for nav and links
  // h-12 (mobile), md:h-14, lg:h-16, xl:h-20
  const navAndLinkHeight = "h-10 md:h-12 lg:h-14";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4 lg:py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/media/images/logos/Logo.webp"
              alt="Logo"
              width={120}
              height={80}
              className="w-[90px] h-auto md:w-[120px] md:h-auto lg:w-[140px] lg:h-auto"
              // Responsive logo size
            />
          </div>

          {/* Desktop Navigation */}
          <nav
            className={`
              hidden lg:flex
              items-center
              space-x-4 xl:space-x-8
              px-3 md:px-6 lg:px-8
              py-1.5 md:py-2 lg:py-3
              rounded-full
              bg-white/10
              border border-white/30
              shadow-soft
              backdrop-blur-md
              [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.1)]
              ${navAndLinkHeight}
            `}
            style={{ minHeight: '44px' }}
          >
            {navItems.map((item, idx) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={
                    (active
                      ? "text-white font-medium transition-colors duration-200 "
                      : "text-white/80 hover:text-white font-medium transition-colors duration-200 ") +
                    // Responsive font size and padding
                    "px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 flex items-center " +
                    navAndLinkHeight +
                    " text-sm md:text-base lg:text-lg"
                  }
                  aria-current={active ? "page" : undefined}
                  style={{ height: '100%' }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Try Demo Button */}
          <div className={`items-center ${navAndLinkHeight}`}>
            <Link
              href="/dashboard"
              className={`
                text-white
                flex
                items-center
                px-4 md:px-6 lg:px-8
                py-1.5 md:py-2 lg:py-3
                rounded-full
                bg-white/10
                border border-white/30
                shadow-soft
                backdrop-blur-md
                [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.1)]
                ${navAndLinkHeight}
                hover:bg-white/20
                transition-all duration-200
                text-sm md:text-base lg:text-lg
              `}
            >
              Try Demo
            </Link>

            {/* <LanguageSwitcher /> */}
          </div>

          <div className='flex justify-end lg:hidden w-[90px] h-auto md:w-[120px] md:h-auto lg:w-[140px] lg:h-auto'>
            <SideNav navItems={navItems} />
          </div>
        </div>
      </div>
    </header>
  )
} 