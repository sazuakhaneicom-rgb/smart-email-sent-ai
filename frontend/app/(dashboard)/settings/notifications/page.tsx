'use client';

import React, { useState } from 'react';
import { SettingsNavHeader } from '@/components/layout/SettingsNavHeader';
import { Bell, Mail, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState({
    campaignSent: true,
    domainFailed: true,
    paymentFailed: true,
    usageLimit: true,
    weeklyDigest: false,
  });
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      setToast('নোটিফিকেশন পছন্দসমূহ সেভ করা হয়েছে!');
      setTimeout(() => setToast(null), 2500);
      return next;
    });
  };

  const list = [
    { key: 'campaignSent' as const, title: 'ক্যাম্পেইন ডিসপ্যাচ অ্যালার্ট', desc: 'ক্যাম্পেইন সফলভাবে সেন্ট হলে ইমেইল অ্যালার্ট' },
    { key: 'domainFailed' as const, title: 'ডোমেইন ভেরিফিকেশন সমস্যা', desc: 'ডোমেইন যাচাইকরণ সমস্যা হলে অবিলম্বে নোটিফিকেশন' },
    { key: 'paymentFailed' as const, title: 'বিলিং / পেমেন্ট নোটিশ', desc: 'পেমেন্ট বা বিলিং সমস্যা সংক্রান্ত আপডেট' },
    { key: 'usageLimit' as const, title: 'কোটা ৮০% প্লাস সতর্কবার্তা', desc: 'দৈনিক পাঠানোর সীমা ৮০% ছাড়িয়ে গেলে সতর্কতা' },
    { key: 'weeklyDigest' as const, title: 'সাপ্তাহিক পারফরম্যান্স রিপোর্ট', desc: 'প্রতি সপ্তাহের শেষে সমাপনী সামারি ডায়জেস্ট' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      <SettingsNavHeader />

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
          নোটিফিকেশন সেটিংস
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          সিস্টেমের গুরুত্বপূর্ণ আপডেট ও অ্যালার্ট গ্রহনের পছন্দসমূহ
        </p>
      </div>

      {toast && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
          color: '#34D399', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={18} style={{ color: 'var(--neon-purple)' }} />
          ইমেইল ও সিস্টেম নোটিফিকেশন
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 10, background: 'var(--bg-raised)',
                border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 12,
              }}
            >
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  {item.desc}
                </p>
              </div>
              <button
                onClick={() => toggle(item.key)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: settings[item.key] ? '#34D399' : 'var(--text-muted)', padding: 0 }}
              >
                {settings[item.key] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
