'use client';

import React from 'react';
import { SettingsNavHeader } from '@/components/layout/SettingsNavHeader';
import { Check, Download, Zap, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function BillingSettingsPage() {
  const { currentWorkspace } = useAuthStore();
  const activePlan = currentWorkspace?.plan || 'free';

  const mockInvoices = [
    { id: 'INV-001', date: '১০ আগস্ট, ২০২৬', amount: '৳০.০০', plan: 'Free Plan', status: 'পরিশোধিত' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      <SettingsNavHeader />

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
          বিলিং ও সাবস্ক্রিপশন
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          আপনার বর্তমান প্ল্যান, ব্যবহার সীমা এবং ইনভয়েস ইতিহাস
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Usage Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                বর্তমান প্ল্যান
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                {activePlan.toUpperCase()} PLAN
              </h3>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>
              সক্রিয় সাবস্ক্রিপশন
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 6, color: 'var(--text-secondary)' }}>
                <span>দৈনিক ইমেইল সীমা</span>
                <span>০ / ৫০০</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-raised)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            প্ল্যান অপশনসমূহ
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {/* Free */}
            <div className="glass-card" style={{ padding: 20, border: '1px solid rgba(139,92,246,0.3)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>শুরুর জন্য</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>Free</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>০ টাকা <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/মাস</span></p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> ৫০০ ইমেইল/দিন (Gmail)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> কন্টাক্ট ইমপোর্ট ও লিস্ট</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> রেডিমেড টেমপ্লেট</li>
              </ul>
              <button disabled style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '0.825rem', cursor: 'not-allowed' }}>
                বর্তমান প্ল্যান
              </button>
            </div>

            {/* Pro */}
            <div className="glass-card" style={{ padding: 20, borderColor: 'rgba(6,182,212,0.3)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#67E8F9', textTransform: 'uppercase' }}>জনপ্রিয়</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>Pro</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>১,৪৯০ টাকা <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/মাস</span></p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> ৫০,০০০ ইমেইল/মাস</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> কাস্টম ডোমেইন (SES/cPanel)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> AI অটোমেশন ও এনালিটিক্স</li>
              </ul>
              <button style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer' }}>
                আপগ্রেড করুন
              </button>
            </div>

            {/* Business */}
            <div className="glass-card" style={{ padding: 20 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C4B5FD', textTransform: 'uppercase' }}>ব্যবসার জন্য</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>Business</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>৪,৯৯০ টাকা <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/মাস</span></p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> ২,০০,০০০+ ইমেইল/মাস</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> আনলিমিটেড কন্টাক্টস</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#34D399" /> ডেডিকেটেড আইপি ও সাপোর্ট</li>
              </ul>
              <button style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer' }}>
                আপগ্রেড করুন
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            ইনভয়েস হিস্ট্রি
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>ইনভয়েস আইডি</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>তারিখ</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>পরিমাণ</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{inv.id}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{inv.amount}</td>
                  <td style={{ padding: '10px 12px', color: '#34D399', fontWeight: 600 }}>{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
