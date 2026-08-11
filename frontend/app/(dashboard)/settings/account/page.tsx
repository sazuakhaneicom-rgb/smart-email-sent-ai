'use client';

import React, { useState, useEffect } from 'react';
import { SettingsNavHeader } from '@/components/layout/SettingsNavHeader';
import { useAuthStore } from '@/store';
import { User, Mail, Globe, Save, CheckCircle2, ShieldAlert, Trash2 } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('bn');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);

    if (user) {
      const updatedUser = { ...user, name: name.trim() };
      setUser(updatedUser);

      // Save to localStorage
      try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.state = { ...parsed.state, user: updatedUser };
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      } catch (err) {}
    }

    await new Promise(r => setTimeout(r, 400));
    setIsSaving(false);
    setToast({ msg: 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!', ok: true });
    setTimeout(() => setToast(null), 3000);
  };

  const initials = (name || 'U').split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Top Settings Tab Navigation */}
      <SettingsNavHeader />

      {/* Page Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
          অ্যাকাউন্ট সেটিংস
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          আপনার ব্যক্তিগত প্রোফাইল ও ভাষা সেটিংস পরিবর্তন করুন
        </p>
      </div>

      {/* Success Toast */}
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

        {/* Profile Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.25rem', fontWeight: 800,
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
            }}>
              {initials}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                {name || 'ব্যবহারকারী'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {email}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                আপনার নাম *
              </label>
              <input
                type="text"
                required
                className="cyber-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                ইমেইল ঠিকানা (Read-Only)
              </label>
              <input
                type="email"
                disabled
                className="cyber-input"
                value={email}
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                ইমেইল পরিবর্তন করতে সাপোর্টে যোগাযোগ করুন।
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                ইন্টারফেস ভাষা
              </label>
              <select
                className="cyber-input"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{ background: 'var(--bg-raised)' }}
              >
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div style={{ paddingTop: 8 }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  background: isSaving ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 16px rgba(139,92,246,0.3)',
                  fontFamily: "'Anek Bangla', sans-serif",
                }}
              >
                <Save size={16} />
                {isSaving ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone Card */}
        <div style={{
          padding: 20, borderRadius: 14,
          background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F87171', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldAlert size={18} />
            অ্যাকাউন্ট অপশন
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            আপনার অ্যাকাউন্টের তথ্যাদি স্থায়ীভাবে মুছে ফেলার প্রয়োজন হলে গ্রাহক সহায়তায় যোগাযোগ করুন।
          </p>
        </div>

      </div>
    </div>
  );
}
