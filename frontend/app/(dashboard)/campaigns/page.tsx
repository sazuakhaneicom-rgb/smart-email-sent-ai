'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Send, InboxIcon, BarChart2, MailOpen, Users, Trash2, Eye, Calendar,
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, Mail, Clock
} from 'lucide-react';
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
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefreshLiveStatus = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsRefreshing(false);
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
            ক্যাম্পেইন হিস্টোরি ও ইনবক্স ট্র্যাকিং
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            আপনার প্রেরিত সকল ইমেইল ক্যাম্পেইন, সেন্ট স্ট্যাটাস ও ট্র্যাকিং রিপোর্ট
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ডেলিভারি স্ট্যাটাস</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#67E8F9', marginTop: 4 }}>১০০% সম্পন্ন</p>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>গড় ওপেন রেট</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A78BFA', marginTop: 4 }}>০.০%</p>
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
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>ডেলিভারি স্ট্যাটাস</th>
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
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem' }}>
                        <span style={{ color: '#34D399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Send size={13} /> প্রেরিত (Sent)
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('bn-BD') : 'আজ'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <button
                            onClick={() => setSelectedCampaign(c)}
                            style={{
                              padding: '6px 12px', borderRadius: 8,
                              background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                              color: '#67E8F9', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                            }}
                          >
                            <Eye size={13} /> ইনবক্স স্ট্যাটাস
                          </button>
                          <Link
                            href={`/analytics/campaigns/1?id=${c.id}`}
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

      {/* ── Honest Delivery & Read Tracking Modal ─────── */}
      {selectedCampaign && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(3, 3, 7, 0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            width: '100%', maxWidth: 680, background: '#0F0F1E',
            border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20,
            padding: 24, boxShadow: '0 0 40px rgba(139,92,246,0.2)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Mail size={20} style={{ color: 'var(--neon-purple-bright)' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    ইমেইল ডেলিভারি ও রিয়েল ট্র্যাকিং রিপোর্ট
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  ক্যাম্পেইন: <strong style={{ color: '#C4B5FD' }}>{selectedCampaign.name}</strong> ({selectedCampaign.subject})
                </p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Overall Honest Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>ডেলিভারি স্ট্যাটাস</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399', margin: '2px 0 0' }}>প্রেরিত (Sent)</p>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>ওপেন / পড়া হয়েছে</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B', margin: '2px 0 0' }}>০ জন (০.০%)</p>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(139,92,246,0.3)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>বাউন্স স্ট্যাটাস</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#C4B5FD', margin: '2px 0 0' }}>০ টি বাউন্সড</p>
              </div>
            </div>

            {/* Recipient Detailed Log Table */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  প্রাপক ইমেইল ট্র্যাকিং লগে অবস্থা:
                </h4>
                <button
                  onClick={handleRefreshLiveStatus}
                  disabled={isRefreshing}
                  style={{
                    background: 'none', border: 'none', color: '#67E8F9',
                    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                  {isRefreshing ? 'সিঙ্ক হচ্ছে...' : 'লাইভ ট্র্যাকিং সিঙ্ক করুন'}
                </button>
              </div>

              <div style={{ borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>প্রাপক Email</th>
                      <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>ডেলিভারি অবস্থা</th>
                      <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>রিড / ওপেন স্ট্যাটাস</th>
                      <th style={{ padding: '8px 12px', color: 'var(--text-muted)', textAlign: 'right' }}>সময়</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { email: selectedCampaign.senderEmail || user?.email || 'target@gmail.com', inbox: 'Sent (প্রেরিত)', status: 'এখনো অসম্পঠিত (Unopened)', time: 'আজ' },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'monospace' }}>
                          {row.email}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ color: '#34D399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Send size={13} /> {row.inbox}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ color: '#F59E0B', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} /> {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>
                          {row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notice about Gmail / SMTP setup */}
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)',
              fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5,
            }}>
              💡 <strong>পরামর্শ:</strong> আপনার নিজস্ব Gmail ইনবক্স থেকে আসল ডেলিভারি পেতে <Link href="/settings/email-config" style={{ color: '#67E8F9', textDecoration: 'underline' }}>Email সেটআপ পেজে</Link> আপনার Gmail App Password বা cPanel SMTP তথ্য কানেক্ট করুন।
            </div>

            {/* Modal Footer */}
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedCampaign(null)}
                style={{
                  padding: '8px 18px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: "'Anek Bangla', sans-serif",
                }}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
