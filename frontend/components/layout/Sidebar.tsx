'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import {
  LayoutDashboard, Mail, Users, FileText, BarChart3,
  ChevronLeft, ChevronRight, Zap, LogOut,
  Building2, CreditCard, Bell, Shield, Globe, UserCheck, Bot, X,
} from 'lucide-react';

const mainNav = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { href: '/ai-agent',   icon: Bot,             label: 'AI Email Agent', isHighlighted: true },
  { href: '/campaigns',  icon: Mail,             label: 'ক্যাম্পেইন' },
  { href: '/contacts',   icon: Users,            label: 'কন্টাক্টস' },
  { href: '/templates',  icon: FileText,         label: 'টেমপ্লেট' },
  { href: '/analytics',  icon: BarChart3,        label: 'বিশ্লেষণ' },
];

const settingsNav = [
  { href: '/settings/account',       icon: UserCheck,  label: 'অ্যাকাউন্ট' },
  { href: '/settings/email-config',  icon: Mail,       label: 'Email সেটআপ', isHighlighted: true },
  { href: '/settings/security',      icon: Shield,     label: 'সিকিউরিটি' },
  { href: '/settings/domains',       icon: Globe,      label: 'ডোমেইন' },
  { href: '/settings/billing',       icon: CreditCard, label: 'বিলিং' },
  { href: '/settings/notifications', icon: Bell,       label: 'নোটিফিকেশন' },
  { href: '/settings/team',          icon: Building2,  label: 'টিম' },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, currentWorkspace } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && onMobileClose) onMobileClose();
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const cleanName = (name: string) =>
    name.replace(/\s*\(\s*ডেমো\s*\)/gi, '').replace(/\s*\(demo\)/gi, '').replace(/^demo$/gi, '').trim();

  const initials = user?.name
    ? cleanName(user.name).split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'U'
    : 'U';

  const sidebarContent = (
    <aside
      style={{
        width: isMobile ? '260px' : collapsed ? '72px' : '240px',
        minHeight: '100vh',
        height: isMobile ? '100vh' : undefined,
        background: 'var(--bg-void)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: isMobile ? 'none' : 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />
      {/* Top glow */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo */}
        <div
          style={{
            height: '64px', display: 'flex', alignItems: 'center',
            padding: (collapsed && !isMobile) ? '0 16px' : '0 20px',
            borderBottom: '1px solid var(--sidebar-border)',
            gap: '12px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--glow-purple-sm)',
              }}
            >
              <Zap size={18} style={{ color: '#fff' }} />
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  Smart Email
                </p>
                <p style={{ fontSize: '0.65rem', color: 'var(--neon-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Sent AI
                </p>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={onMobileClose}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: 4,
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Workspace badge */}
        {(!collapsed || isMobile) && currentWorkspace && (
          <div
            style={{
              margin: '12px 12px 4px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.12)',
            }}
          >
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
              Workspace
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {cleanName(currentWorkspace.name) || 'আমার ওয়ার্কস্পেস'}
            </p>
            <span
              style={{
                fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: currentWorkspace.plan === 'pro' ? 'var(--neon-purple-bright)' : 'var(--text-muted)',
              }}
            >
              {currentWorkspace.plan.toUpperCase()}
            </span>
          </div>
        )}

        {/* Main Nav */}
        <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            {(!collapsed || isMobile) && (
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px 8px', fontWeight: 600 }}>
                মেইন মেনু
              </p>
            )}
            {mainNav.map(({ href, icon: Icon, label, isHighlighted }) => (
              <Link
                key={href}
                href={href}
                className={`nav-item ${isActive(href) ? 'active' : ''}`}
                title={(collapsed && !isMobile) ? label : undefined}
                style={{
                  marginBottom: '4px',
                  justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start',
                  ...(isHighlighted ? {
                    background: isActive(href)
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.25))'
                      : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
                    border: '1px solid rgba(139,92,246,0.35)',
                    boxShadow: '0 0 14px rgba(139,92,246,0.2)',
                  } : {})
                }}
              >
                <Icon size={18} style={{ flexShrink: 0, color: isHighlighted ? 'var(--neon-cyan)' : undefined }} />
                {(!collapsed || isMobile) && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontWeight: isHighlighted ? 700 : 500, color: isHighlighted ? '#fff' : undefined }}>{label}</span>
                    {isHighlighted && (
                      <span style={{
                        fontSize: '0.55rem', fontWeight: 800, padding: '1px 6px', borderRadius: 999,
                        background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', color: '#fff',
                        boxShadow: '0 0 8px rgba(6,182,212,0.5)', letterSpacing: '0.05em'
                      }}>AI</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div>
            {(!collapsed || isMobile) && (
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px 8px', fontWeight: 600 }}>
                সেটিংস
              </p>
            )}
            {settingsNav.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-item ${isActive(href) ? 'active' : ''}`}
                title={(collapsed && !isMobile) ? label : undefined}
                style={{ marginBottom: '2px', justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start' }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {(!collapsed || isMobile) && <span style={{ fontSize: '0.825rem' }}>{label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom — User + Logout */}
        <div style={{ padding: '10px', borderTop: '1px solid var(--sidebar-border)' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: (collapsed && !isMobile) ? '8px' : '10px 12px',
              borderRadius: '10px',
              background: 'rgba(139,92,246,0.04)',
              border: '1px solid rgba(139,92,246,0.08)',
              marginBottom: '6px',
              justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start',
            }}
          >
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: '#fff',
              }}
            >
              {initials}
            </div>
            {(!collapsed || isMobile) && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cleanName(user?.name || 'ব্যবহারকারী') || 'গুগল ইউজার'}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title={(collapsed && !isMobile) ? 'লগআউট' : undefined}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start',
              gap: '8px', padding: (collapsed && !isMobile) ? '8px' : '8px 12px',
              borderRadius: '8px', border: 'none', background: 'transparent',
              color: 'var(--text-muted)', fontSize: '0.825rem', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = '#F87171';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {(!collapsed || isMobile) && <span>লগআউট</span>}
          </button>
        </div>

        {/* Collapse Toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute', right: '-12px', top: '76px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, color: 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--neon-purple)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--neon-purple-bright)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        )}
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className={`mobile-sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
          onClick={onMobileClose}
        />
        {/* Drawer */}
        <div className={`mobile-sidebar-drawer ${isMobileOpen ? 'open' : ''}`}>
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="desktop-sidebar">
      {sidebarContent}
    </div>
  );
}

