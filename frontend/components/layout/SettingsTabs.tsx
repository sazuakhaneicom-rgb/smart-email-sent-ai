'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Shield, Globe, CreditCard, Bell, Users } from 'lucide-react'

const tabs = [
  { name: 'অ্যাকাউন্ট', href: '/settings/account', icon: User },
  { name: 'নিরাপত্তা', href: '/settings/security', icon: Shield },
  { name: 'ডোমেইন', href: '/settings/domains', icon: Globe },
  { name: 'বিলিং', href: '/settings/billing', icon: CreditCard },
  { name: 'নোটিফিকেশন', href: '/settings/notifications', icon: Bell },
  { name: 'টিম', href: '/settings/team', icon: Users },
]

export function SettingsTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = tab.icon
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {tab.name}
          </Link>
        )
      })}
    </nav>
  )
}
