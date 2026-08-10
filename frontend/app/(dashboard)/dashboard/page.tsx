'use client';

import React, { useState } from 'react';
import {
  Users, Send, MousePointerClick, MailOpen,
  Upload, FileText, BarChart2, TrendingUp,
  ArrowUpRight, Zap, Activity, ChevronRight,
} from 'lucide-react';
import { mockDashboardStats, mockTrendData, mockRecentCampaigns } from '@/lib/mock-data';
import { formatNumber, formatPercent, formatDate } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import LiveMonitor from '@/components/dashboard/LiveMonitor';


const PIE_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(16,16,36,0.95)',
        border: '1px solid rgba(139,92,246,0.4)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 0 20px rgba(139,92,246,0.2)',
        fontFamily: "'Anek Bangla', sans-serif",
      }}>
        <p style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600, marginBottom: 6 }}>
          {new Date(label).toLocaleDateString('bn-BD')}
        </p>
        {payload.map((entry: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
            <span style={{ color: '#8888A8' }}>{entry.name}:</span>
            <span style={{ color: '#E8E8F0', fontWeight: 600 }}>{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  Sent:      { bg: 'rgba(16,185,129,0.10)', color: '#34D399', label: 'পাঠানো' },
  Draft:     { bg: 'rgba(139,92,246,0.10)', color: '#A78BFA', label: 'ড্রাফট' },
  Scheduled: { bg: 'rgba(6,182,212,0.10)',  color: '#22D3EE', label: 'শিডিউলড' },
  Failed:    { bg: 'rgba(248,113,113,0.10)', color: '#F87171', label: 'ব্যর্থ' },
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('৩০ দিন');
  const { user, currentWorkspace } = useAuthStore();

  const stats = [
    {
      label: 'মোট Contact',
      value: formatNumber(mockDashboardStats.contacts),
      trend: mockDashboardStats.contactsTrend,
      icon: Users,
      color: '#8B5CF6',
      glow: 'rgba(139,92,246,0.2)',
    },
    {
      label: 'Campaign পাঠানো',
      value: String(mockDashboardStats.campaigns),
      icon: Send,
      color: '#06B6D4',
      glow: 'rgba(6,182,212,0.2)',
    },
    {
      label: 'গড় Open Rate',
      value: formatPercent(mockDashboardStats.openRate),
      trend: mockDashboardStats.openRateTrend,
      icon: MailOpen,
      color: '#10B981',
      glow: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'গড় Click Rate',
      value: formatPercent(mockDashboardStats.clickRate),
      trend: mockDashboardStats.clickRateTrend,
      icon: MousePointerClick,
      color: '#F59E0B',
      glow: 'rgba(245,158,11,0.2)',
    },
  ];

  const pieData = [
    { name: 'Subscribed', value: 9240 },
    { name: 'Unsubscribed', value: 1890 },
    { name: 'Bounced', value: 420 },
    { name: 'Complained', value: 90 },
  ];

  const quickActions = [
    { icon: Send, label: 'নতুন Campaign', href: '/campaigns/new', color: '#8B5CF6' },
    { icon: Upload, label: 'Contact ইমপোর্ট', href: '/contacts/import', color: '#06B6D4' },
    { icon: FileText, label: 'Template তৈরি', href: '/templates/new', color: '#10B981' },
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
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)',
          top: '50%',
          animation: 'scan-line 4s linear infinite',
          pointerEvents: 'none',
        }} />
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6, fontWeight: 600 }}>
            স্বাগতম
          </p>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            {user?.name || 'ব্যবহারকারী'} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Workspace: <span style={{ color: 'var(--neon-purple-bright)', fontWeight: 600 }}>{currentWorkspace?.name}</span>
            {' '} · Plan: <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{currentWorkspace?.plan?.toUpperCase()}</span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neon-green)', fontSize: '0.8rem' }}>
          <Activity size={16} />
          <span>সব সিস্টেম চালু</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map(({ label, value, trend, icon: Icon, color, glow }) => (
          <div key={label} className="stat-card" style={{ position: 'relative' }}>
            {/* Color accent line at top */}
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
              {trend !== undefined && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem',
                  color: (typeof trend === 'object' ? trend.positive : trend > 0) ? '#34D399' : '#F87171',
                  background: (typeof trend === 'object' ? trend.positive : trend > 0) ? 'rgba(16,185,129,0.1)' : 'rgba(248,113,113,0.1)',
                  padding: '3px 8px', borderRadius: 999,
                }}>
                  <TrendingUp size={12} style={{ transform: !(typeof trend === 'object' ? trend.positive : trend > 0) ? 'scaleY(-1)' : 'none' }} />
                  {typeof trend === 'object' ? trend.value : `${Math.abs(trend)}%`}
                </div>
              )}
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 6 }}>
              {value}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 24 }}>
        {/* Line Chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Campaign কার্যকলাপ</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Open Rate vs Click Rate</p>
            </div>
            <div style={{
              display: 'flex', gap: 4,
              background: 'var(--bg-raised)', borderRadius: 8, padding: 4,
            }}>
              {['৭ দিন', '৩০ দিন', '৯০ দিন'].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  style={{
                    padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 600,
                    background: timeRange === r ? 'rgba(139,92,246,0.2)' : 'transparent',
                    color: timeRange === r ? 'var(--neon-purple-bright)' : 'var(--text-muted)',
                    fontFamily: "'Anek Bangla', sans-serif",
                    transition: 'all 0.2s',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,92,246,0.08)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).getDate().toString()}
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#4A4A68', fontFamily: "'Anek Bangla', sans-serif" }}
                  dy={8}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4A4A68', fontFamily: "'Anek Bangla', sans-serif" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" name="Open Rate" dataKey="open_rate" stroke="#8B5CF6" strokeWidth={2.5} dot={false}
                  activeDot={{ r: 5, fill: '#8B5CF6', stroke: 'rgba(139,92,246,0.3)', strokeWidth: 4 }} />
                <Line type="monotone" name="Click Rate" dataKey="click_rate" stroke="#06B6D4" strokeWidth={2.5} dot={false}
                  activeDot={{ r: 5, fill: '#06B6D4', stroke: 'rgba(6,182,212,0.3)', strokeWidth: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Campaigns */}
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {mockRecentCampaigns.slice(0, 6).map((c) => {
              const s = STATUS_MAP[c.status] || STATUS_MAP.Draft;
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.05)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div>
                    <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{c.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {formatDate(c.date)} · {formatNumber(c.sent)} পাঠানো
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                    {c.openRate > 0 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--neon-green)', fontWeight: 600 }}>{c.openRate}% Open</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions + Pie Chart + Live Monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 20 }}>

        {/* Quick Actions */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '24px',
        }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '0.95rem' }}>
            দ্রুত শুরু করুন
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

        {/* Pie Chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '24px',
        }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.95rem' }}>লিস্ট ওভারভিউ</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>মোট ১১,৬৪০ কন্টাক্ট</p>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                      stroke="none"
                      style={{ filter: `drop-shadow(0 0 4px ${PIE_COLORS[i % PIE_COLORS.length]}60)` }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(16,16,36,0.95)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: 8,
                    fontFamily: "'Anek Bangla', sans-serif",
                    color: '#E8E8F0',
                  }}
                />
                <Legend
                  iconType="circle"
                  formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: "'Anek Bangla', sans-serif" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Agent Monitor */}
        <LiveMonitor />

      </div>
    </div>
  );
}
