'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Key, Settings, Users, Activity, Shield, ArrowLeft, Terminal, Server, Bot } from 'lucide-react';

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'ওভারভিউ', exact: true },
  { href: '/admin/api-keys', icon: Key, label: 'API Keys' },
  { href: '/admin/settings', icon: Settings, label: 'গ্লোবাল সেটিংস' },
  { href: '/admin/users', icon: Users, label: 'ইউজার ম্যানেজমেন্ট' },
  { href: '/admin/system', icon: Activity, label: 'সিস্টেম হেলথ' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#030307', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '2px solid #8B5CF6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030307', fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: 'rgba(7,7,15,0.98)',
        borderRight: '1px solid rgba(139,92,246,0.12)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(139,92,246,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(139,92,246,0.5)',
            }}>
              <Terminal size={16} style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E8E8F0', lineHeight: 1.2 }}>Admin Panel</p>
              <p style={{ fontSize: '0.6rem', color: '#F87171', letterSpacing: '0.15em', textTransform: 'uppercase' }}>RESTRICTED</p>
            </div>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 6,
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.15)',
          }}>
            <p style={{ fontSize: '0.65rem', color: '#F87171', textAlign: 'center', letterSpacing: '0.1em' }}>⚠ ADMIN ACCESS</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {adminNav.map(({ href, icon: Icon, label, exact, highlight }: any) => (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive(href, exact) ? 'active' : ''}`}
              style={{ 
                marginBottom: '4px',
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px',
                color: isActive(href, exact) ? '#E8E8F0' : highlight ? '#C4B5FD' : '#8888A8',
                background: isActive(href, exact) ? 'rgba(139,92,246,0.15)' : highlight ? 'rgba(139,92,246,0.08)' : 'transparent',
                border: isActive(href, exact)
                  ? '1px solid rgba(139,92,246,0.3)'
                  : highlight ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                textDecoration: 'none', transition: 'all 0.2s',
                boxShadow: highlight && !isActive(href, exact) ? '0 0 8px rgba(139,92,246,0.1)' : 'none',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0, color: isActive(href, exact) ? '#06B6D4' : highlight ? '#A78BFA' : 'currentColor' }} />
              <span style={{ fontSize: '0.875rem' }}>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Back to app */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(139,92,246,0.10)' }}>
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 8,
            color: '#8888A8', fontSize: '0.8rem',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <ArrowLeft size={14} />
            <span>ড্যাশবোর্ডে ফিরুন</span>
          </Link>
          <button
            onClick={() => { localStorage.removeItem('admin_authenticated'); router.replace('/admin/login'); }}
            style={{
              width: '100%', marginTop: 4, padding: '8px 12px', borderRadius: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#F87171', fontSize: '0.8rem', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Anek Bangla', sans-serif",
            }}
          >
            <Shield size={14} />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 56, display: 'flex', alignItems: 'center', padding: '0 24px',
          background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(139,92,246,0.10)',
          gap: 12,
        }}>
          <span style={{ fontSize: '0.75rem', color: '#F87171', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>ADMIN</span>
          <span style={{ color: 'rgba(139,92,246,0.3)' }}>/</span>
          <span style={{ color: '#8888A8', fontSize: '0.875rem' }}>
            {adminNav.find(n => isActive(n.href, n.exact))?.label || 'Admin'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#10B981',
              boxShadow: '0 0 6px #10B981', animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>SYSTEM ONLINE</span>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
