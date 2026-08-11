'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Mail, Shield, Globe, CreditCard, Bell, Users } from 'lucide-react';

const tabs = [
  { name: 'অ্যাকাউন্ট', href: '/settings/account', icon: User },
  { name: 'Email সেটআপ', href: '/settings/email-config', icon: Mail },
  { name: 'সিকিউরিটি', href: '/settings/security', icon: Shield },
  { name: 'ডোমেইন', href: '/settings/domains', icon: Globe },
  { name: 'বিলিং', href: '/settings/billing', icon: CreditCard },
  { name: 'নোটিফিকেশন', href: '/settings/notifications', icon: Bell },
  { name: 'টিম', href: '/settings/team', icon: Users },
];

export function SettingsNavHeader() {
  const pathname = usePathname();

  return (
    <div style={{
      marginBottom: 24,
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: 4,
    }}>
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 10,
                fontSize: '0.85rem', fontWeight: 600,
                textDecoration: 'none', whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                fontFamily: "'Anek Bangla', sans-serif",
                background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)',
                color: isActive ? 'var(--neon-purple-bright)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'rgba(139,92,246,0.3)' : 'var(--border-subtle)'}`,
                boxShadow: isActive ? '0 0 12px rgba(139,92,246,0.15)' : 'none',
              }}
            >
              <Icon size={16} />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
