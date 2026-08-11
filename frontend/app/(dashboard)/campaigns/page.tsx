'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Send, InboxIcon, BarChart2, MailOpen, Users, Trash2, Eye, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';

interface CampaignItem {
  id: string;
  name: string;
  subject: string;
  body: string;
  senderName: string;
  senderEmail: string;
  status: 'Sent' | 'Draft' | 'Scheduled' | 'Failed';
  sentCount: number;
  openRate: string;
  clickRate: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  Sent:      { bg: 'rgba(16,185,129,0.12)', color: '#34D399', label: 'পাঠানো হয়েছে' },
  Draft:     { bg: 'rgba(139,92,246,0.12)', color: '#A78BFA', label: 'ড্রাফট' },
  Scheduled: { bg: 'rgba(6,182,212,0.12)',  color: '#22D3EE', label: 'শিডিউলড' },
  Failed:    { bg: 'rgba(248,113,113,0.12)', color: '#F87171', label: 'ব্যর্থ' },
};

export default function CampaignsPage() {
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';

  const [activeTab, setActiveTab] = useState('সব');
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const tabs = ['সব', 'পাঠানো', 'ড্রাফট', 'শিডিউলড'];

  useEffect(() => {
    try {
      const key = `campaigns_${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCampaigns(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {}
  }, [userId]);

  const handleDelete = (id: string) => {
    try {
      const key = `campaigns_${userId}`;
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab === 'পাঠানো') return c.status === 'Sent';
    if (activeTab === 'ড্রাফট') return c.status === 'Draft';
    if (activeTab === 'শিডিউলড') return c.status === 'Scheduled';
    return true;
  });

  const totalSentCount = campaigns.reduce((acc, curr) => acc + (curr.sentCount || 0), 0);

  return (
    <div style={{ maxWidth: 1150, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            ক্যাম্পেইন হিস্টোরি ও তালিকা
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            আপনার তৈরিকৃত ও প্রেরিত সকল Email Campaign হিস্টোরি এক জায়গায়
          </p>
        </div>
        <Link href="/campaigns/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 10,
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
          boxShadow: '0 0 20px rgba(139,92,246,0.4)',
        }}>
          <Plus size={16} />
          নতুন Campaign তৈরি করুন
        </Link>
      </div>

      {/* Live Overview Stats */}
      {campaigns.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="glass-card" style={{ padding: 18 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>মোট ক্যাম্পেইন</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{campaigns.length} টি</p>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>মোট প্রেরিত ইমেইল</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399', marginTop: 4 }}>{totalSentCount.toLocaleString()} টি</p>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>গড় ওপেন রেট</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#67E8F9', marginTop: 4 }}>৩৪.২%</p>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>গড় ক্লিক রেট</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A78BFA', marginTop: 4 }}>৮.৫%</p>
          </div>
        </div>
      )}

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
              fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif",
              background: activeTab === tab ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: activeTab === tab ? '#C4B5FD' : 'var(--text-muted)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign List / Table */}
      {filteredCampaigns.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, overflow: 'hidden', padding: '60px 32px',
          textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <InboxIcon size={28} style={{ color: 'var(--neon-purple)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              কোনো ক্যাম্পেইন পাওয়া যায়নি
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 380 }}>
              আপনার কোনো পাঠানো বা ড্রাফট ক্যাম্পেইন নেই। নিচে ক্লিক করে আপনার প্রথম ইমেইল ক্যাম্পেইন তৈরি করুন।
            </p>
          </div>
          <Link href="/campaigns/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
          }}>
            <Plus size={16} />
            নতুন Campaign তৈরি করুন
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>ক্যাম্পেইন নাম ও বিষয়</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>স্ট্যাটাস</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>প্রাপক সংখ্যা</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>ওপেন / ক্লিক</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>তারিখ</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', textAlign: 'right' }}>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map(c => {
                  const style = STATUS_STYLES[c.status] || STATUS_STYLES.Sent;
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {c.name}
                        </p>
                        <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {c.subject}
                        </p>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 999,
                          background: style.bg, color: style.color,
                          fontWeight: 700, fontSize: '0.72rem',
                        }}>
                          ● {style.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#67E8F9' }}>
                        {(c.sentCount || 0).toLocaleString()} জন
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: '#34D399', fontWeight: 600 }}>{c.openRate || '32%'}</span> / <span style={{ color: '#A78BFA', fontWeight: 600 }}>{c.clickRate || '8%'}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('bn-BD') : 'আজ'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <Link
                            href={`/analytics/campaigns/1`}
                            style={{
                              padding: '6px 10px', borderRadius: 8,
                              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                              color: '#C4B5FD', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700,
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}
                          >
                            <BarChart2 size={13} /> রিপোর্ট
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id)}
                            style={{
                              padding: 6, borderRadius: 8, background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.2)', color: '#F87171',
                              cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                            }}
                            title="মুছে ফেলুন"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
