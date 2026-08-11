'use client';

import React, { useState } from 'react';
import {
  Users, Send, MousePointerClick, MailOpen,
  Upload, FileText, BarChart2, TrendingUp,
  ArrowUpRight, Zap, Activity, ChevronRight,
  InboxIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import LiveMonitor from '@/components/dashboard/LiveMonitor';
import Link from 'next/link';

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  Sent:      { bg: 'rgba(16,185,129,0.10)', color: '#34D399', label: 'পাঠানো' },
  Draft:     { bg: 'rgba(139,92,246,0.10)', color: '#A78BFA', label: 'ড্রাফট' },
  Scheduled: { bg: 'rgba(6,182,212,0.10)',  color: '#22D3EE', label: 'শিডিউলড' },
  Failed:    { bg: 'rgba(248,113,113,0.10)', color: '#F87171', label: 'ব্যর্থ' },
};

export default function DashboardPage() {
  const { user, currentWorkspace } = useAuthStore();

  const cleanName = (name: string) =>
    name.replace(/\s*\(\s*ডেমো\s*\)/gi, '').replace(/\s*\(demo\)/gi, '').replace(/^demo$/gi, '').trim();

  const displayName = cleanName(user?.name || '') || 'ব্যবহারকারী';
  const displayWorkspace = cleanName(currentWorkspace?.name || '') || 'আমার ব্যবসা';

  const stats = [
    { label: 'মোট Contact', value: '০', icon: Users, color: '#8B5CF6', glow: 'rgba(139,92,246,0.2)' },
    { label: 'Campaign পাঠানো', value: '০', icon: Send, color: '#06B6D4', glow: 'rgba(6,182,212,0.2)' },
    { label: 'গড় Open Rate', value: '০%', icon: MailOpen, color: '#10B981', glow: 'rgba(16,185,129,0.2)' },
    { label: 'গড় Click Rate', value: '০%', icon: MousePointerClick, color: '#F59E0B', glow: 'rgba(245,158,11,0.2)' },
  ];

  const quickActions = [
    { icon: Send, label: 'নতুন Campaign', href: '/campaigns/new', color: '#8B5CF6' },
    { icon: Upload, label: 'Contact ইমপোর্ট', href: '/contacts/import', color: '#06B6D4' },
    { icon: FileText, label: 'Template তৈরি', href: '/templates', color: '#10B981' },
    { icon: BarChart2, label: 'রিপোর্ট দেখুন', href: '/analytics', color: '#F59E0B' },
  ];

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Welcome banner */}
      <div style={{
        marginBottom: 24,
        padding: '20px 24px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)',
          top: '50%', pointerEvents: 'none',
        }} />
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6, fontWeight: 600 }}>
            স্বাগতম
          </p>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            {displayName} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Workspace: <span style={{ color: 'var(--neon-purple-bright)', fontWeight: 600 }}>{displayWorkspace}</span>
            {currentWorkspace?.plan && <> · Plan: <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{currentWorkspace.plan.toUpperCase()}</span></>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neon-green)', fontSize: '0.8rem' }}>
          <Activity size={16} />
          <span>সব সিস্টেম চালু</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label} className="stat-card" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: 16, right: 16, height: 2,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              borderRadius: 999,
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: glow.replace('0.2', '0.1'),
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 12px ${glow}`,
              }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 6 }}>
              {value}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Middle Row: Chart area + Recent Campaigns */}
      <div className="dashboard-main-grid" style={{ marginBottom: 24 }}>
        {/* Chart — empty state */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '24px',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Campaign কার্যকলাপ</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Open Rate vs Click Rate</p>
            </div>
          </div>
          <div style={{
            flex: 1, minHeight: 220,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 16, border: '1px dashed rgba(139,92,246,0.15)', borderRadius: 12,
            background: 'rgba(139,92,246,0.02)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(139,92,246,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={24} style={{ color: 'var(--neon-purple)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>এখনো কোনো Campaign পাঠানো হয়নি</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campaign তৈরি করলে এখানে গ্রাফ দেখাবে</p>
            </div>
            <Link href="/campaigns/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', textDecoration: 'none', fontSize: '0.825rem', fontWeight: 600,
            }}>
              <Send size={14} />
              নতুন Campaign তৈরি করুন
            </Link>
          </div>
        </div>

        {/* Recent Campaigns — empty state */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>সাম্প্রতিক Campaign</h3>
            <Link href="/campaigns" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--neon-purple-bright)', fontSize: '0.75rem', textDecoration: 'none',
            }}>
              সব দেখুন <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 32, gap: 12, textAlign: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(139,92,246,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <InboxIcon size={22} style={{ color: 'var(--neon-purple)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>কোনো Campaign নেই</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>নতুন Campaign তৈরি করলে এখানে দেখাবে</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions + Live Monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

        {/* Quick Actions */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '24px',
        }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '0.95rem' }}>
            দ্রুত শুরু করুন
          </h3>
          <div className="quick-actions-grid">
            {quickActions.map(({ icon: Icon, label, href, color }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '20px 12px', borderRadius: 12, cursor: 'pointer',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.25s ease',
                  gap: 10,
                }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = `${color}10`;
                    el.style.borderColor = `${color}40`;
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = `0 8px 24px ${color}20`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--bg-raised)';
                    el.style.borderColor = 'var(--border-subtle)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Agent Monitor */}
        <LiveMonitor />

      </div>
    </div>
  );
}
