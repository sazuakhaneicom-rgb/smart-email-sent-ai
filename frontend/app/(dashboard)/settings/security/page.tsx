'use client';

import React, { useState } from 'react';
import { SettingsNavHeader } from '@/components/layout/SettingsNavHeader';
import { Smartphone, Monitor, Shield, Save, CheckCircle2, Lock } from 'lucide-react';

export default function SecuritySettingsPage() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [twoFA, setTwoFA] = useState(false);

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      setToast({ msg: 'বর্তমান ও নতুন পাসওয়ার্ড প্রদান করুন।', ok: false });
      return;
    }
    if (newPass !== confirmPass) {
      setToast({ msg: 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।', ok: false });
      return;
    }
    setToast({ msg: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!', ok: true });
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      <SettingsNavHeader />

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
          সিকিউরিটি সেটিংস
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          আপনার অ্যাকাউন্টের পাসওয়ার্ড, ২-ফ্যাক্টর অথেনটিকেশন ও সেশন কন্ট্রোল
        </p>
      </div>

      {toast && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 10,
          background: toast.ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.ok ? '#34D399' : '#F87171',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Password Change Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={18} style={{ color: 'var(--neon-purple)' }} />
            পাসওয়ার্ড পরিবর্তন
          </h3>
          <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 450 }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                className="cyber-input"
                placeholder="••••••••"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                className="cyber-input"
                placeholder="••••••••"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                className="cyber-input"
                placeholder="••••••••"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(139,92,246,0.3)',
                  fontFamily: "'Anek Bangla', sans-serif",
                }}
              >
                <Save size={15} /> পাসওয়ার্ড আপডেট করুন
              </button>
            </div>
          </form>
        </div>

        {/* 2FA Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} style={{ color: 'var(--neon-cyan)' }} />
                টু-ফ্যাক্টর অথেনটিকেশন (2FA)
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                আপনার অ্যাকাউন্টের নিরাপত্তার জন্য 2FA চালু রাখুন
              </p>
            </div>
            <button
              onClick={() => setTwoFA(!twoFA)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: twoFA ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                color: twoFA ? '#34D399' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              {twoFA ? '✅ 2FA চালু আছে' : '2FA চালু করুন'}
            </button>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            সক্রিয় সেশনসমূহ
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderRadius: 10, background: 'var(--bg-raised)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Monitor size={22} style={{ color: 'var(--neon-purple)' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Windows • Chrome Browser</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>বর্তমান ডিভাইস (Active)</p>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#34D399', fontWeight: 700 }}>
                বর্তমান সেশন
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
