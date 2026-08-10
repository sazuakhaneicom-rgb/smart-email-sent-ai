'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, Settings, User, ChevronDown, Terminal } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, currentWorkspace, logout } = useAuthStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'ড্যাশবোর্ড',
    '/campaigns/new': 'নতুন ক্যাম্পেইন',
    '/campaigns': 'ক্যাম্পেইন',
    '/contacts/import': 'কন্টাক্ট ইমপোর্ট',
    '/contacts/lists': 'লিস্ট ও সেগমেন্ট',
    '/contacts': 'কন্টাক্টস',
    '/templates': 'টেমপ্লেট',
    '/analytics': 'বিশ্লেষণ',
    '/settings/account': 'অ্যাকাউন্ট',
    '/settings/security': 'সিকিউরিটি',
    '/settings/domains': 'ডোমেইন সেটিংস',
    '/settings/billing': 'বিলিং ও সাবস্ক্রিপশন',
    '/settings/notifications': 'নোটিফিকেশন',
    '/settings/team': 'টিম ম্যানেজমেন্ট',
  };

  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? 'ড্যাশবোর্ড';

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const planLabel = currentWorkspace?.plan === 'pro' ? 'PRO'
    : currentWorkspace?.plan === 'business' ? 'BUSINESS'
    : 'FREE';

  const planColor = currentWorkspace?.plan === 'pro' ? '#A78BFA'
    : currentWorkspace?.plan === 'business' ? '#22D3EE'
    : '#4A4A68';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const iconButtonStyle: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 8, border: 'none',
    background: 'transparent', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-muted)', transition: 'all 0.2s ease',
  };

  const notifications = [
    { text: '"বৈশাখী অফার" ক্যাম্পেইন সফলভাবে পাঠানো হয়েছে।', time: '১০ মিনিট আগে', dot: '#10B981' },
    { text: '৫০০ নতুন কন্টাক্ট ইমপোর্ট সম্পন্ন।', time: '২ ঘন্টা আগে', dot: '#06B6D4' },
    { text: 'সিস্টেম আপটাইম ৯৯.৯% — সব ঠিক আছে।', time: '১ দিন আগে', dot: '#8B5CF6' },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30, height: 56,
      background: 'rgba(7,7,15,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139,92,246,0.10)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', gap: 16,
      fontFamily: "'Anek Bangla', sans-serif",
    }}>
      {/* Left — breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--neon-purple)',
          boxShadow: '0 0 6px var(--neon-purple)',
        }} />
        <h1 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Search */}
        <button style={iconButtonStyle}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          <Search size={16} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            style={{ ...iconButtonStyle, position: 'relative' }}
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 7, height: 7, borderRadius: '50%',
              background: '#F87171',
              boxShadow: '0 0 6px rgba(248,113,113,0.8)',
              border: '1.5px solid var(--bg-void)',
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 320, background: 'rgba(12,12,26,0.98)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.1)',
              backdropFilter: 'blur(20px)',
              zIndex: 50,
            }}>
              <div style={{
                padding: '14px 16px', borderBottom: '1px solid rgba(139,92,246,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>নোটিফিকেশন</span>
                <span style={{
                  fontSize: '0.65rem', padding: '2px 8px', borderRadius: 999,
                  background: 'rgba(248,113,113,0.12)', color: '#F87171',
                  border: '1px solid rgba(248,113,113,0.2)', fontWeight: 600,
                }}>৩ নতুন</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  padding: '12px 16px', display: 'flex', gap: 10,
                  borderBottom: i < notifications.length - 1 ? '1px solid rgba(139,92,246,0.06)' : 'none',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.05)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: 5, boxShadow: `0 0 6px ${n.dot}` }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.text}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan badge */}
        <div style={{
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(139,92,246,0.08)',
          border: `1px solid ${planColor}30`,
          fontSize: '0.65rem', fontWeight: 700,
          color: planColor, letterSpacing: '0.1em',
        }}>
          {planLabel}
        </div>

        {/* User menu */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 8px 4px 4px', borderRadius: 10,
              border: '1px solid transparent', background: 'transparent', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.2)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: '#fff',
              boxShadow: '0 0 10px rgba(139,92,246,0.3)',
            }}>
              {initials}
            </div>
            <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 220, background: 'rgba(12,12,26,0.98)',
              border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.1)',
              backdropFilter: 'blur(20px)', zIndex: 50,
            }}>
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(139,92,246,0.1)',
              }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{user?.name || 'ব্যবহারকারী'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              </div>
              {[
                { icon: User, label: 'প্রোফাইল', href: '/settings/account' },
                { icon: Settings, label: 'সেটিংস', href: '/settings/account' },
                { icon: Terminal, label: 'Admin Panel', href: '/admin' },
              ].map(({ icon: Icon, label, href }) => (
                <button key={label}
                  onClick={() => { router.push(href); setShowUserMenu(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', border: 'none', background: 'transparent',
                    color: 'var(--text-secondary)', fontSize: '0.825rem', cursor: 'pointer',
                    fontFamily: "'Anek Bangla', sans-serif",
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', border: 'none', background: 'transparent',
                    color: '#F87171', fontSize: '0.825rem', cursor: 'pointer',
                    fontFamily: "'Anek Bangla', sans-serif",
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.08)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                >
                  <LogOut size={15} />
                  লগআউট
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
