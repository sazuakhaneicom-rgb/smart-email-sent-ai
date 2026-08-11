'use client';

import { useState } from 'react';
import { Plus, Send, InboxIcon, BarChart2, MailOpen, Users } from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  Sent:      { bg: 'rgba(16,185,129,0.10)', color: '#34D399', label: 'পাঠানো' },
  Draft:     { bg: 'rgba(139,92,246,0.10)', color: '#A78BFA', label: 'ড্রাফট' },
  Scheduled: { bg: 'rgba(6,182,212,0.10)',  color: '#22D3EE', label: 'শিডিউলড' },
  Failed:    { bg: 'rgba(248,113,113,0.10)', color: '#F87171', label: 'ব্যর্থ' },
};

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('সব');
  const tabs = ['সব', 'ড্রাফট', 'শিডিউলড', 'পাঠানো'];
  const campaigns: any[] = [];

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            ক্যাম্পেইনসমূহ
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            আপনার সব email campaign এক জায়গায়
          </p>
        </div>
        <Link href="/campaigns/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 10,
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
          boxShadow: '0 0 20px rgba(139,92,246,0.3)',
        }}>
          <Plus size={16} />
          নতুন Campaign
        </Link>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: 'var(--bg-raised)', borderRadius: 10, padding: 4,
        width: 'fit-content',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: '0.825rem', fontWeight: 600, fontFamily: "'Anek Bangla', sans-serif",
              background: activeTab === tab ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: activeTab === tab ? 'var(--neon-purple-bright)' : 'var(--text-muted)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        <div style={{
          padding: '80px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', gap: 20,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <InboxIcon size={32} style={{ color: 'var(--neon-purple)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              এখনো কোনো Campaign নেই
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400 }}>
              আপনার প্রথম email campaign তৈরি করুন। Contact-দের কাছে সুন্দর email পাঠান এবং ট্র্যাক করুন।
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/campaigns/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', textDecoration: 'none', fontWeight: 700,
            }}>
              <Plus size={16} />
              প্রথম Campaign তৈরি করুন
            </Link>
            <Link href="/contacts" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: 'var(--neon-purple-bright)', textDecoration: 'none', fontWeight: 600,
            }}>
              <Users size={16} />
              Contact যোগ করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
