'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail, Save, CheckCircle2, AlertTriangle, ExternalLink,
  Eye, EyeOff, ToggleLeft, ToggleRight, Send, Info,
  Zap, Shield, Server, FlaskConical, User,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { loadAdminConfig } from '@/lib/admin-config';
import { onConfigSync } from '@/lib/config-sync';

// ── Types ──────────────────────────────────────────────────────────
type EmailProvider = 'gmail_smtp' | 'custom_smtp' | 'system_default';

interface UserEmailConfig {
  provider: EmailProvider;
  senderName: string;        // ইনবক্সে যে নাম দেখাবে
  senderEmail: string;       // যে email থেকে পাঠাবে
  replyTo: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  dailyLimit: number;
  stealthMode: boolean;
}

const DEFAULT_CONFIG: UserEmailConfig = {
  provider: 'system_default',
  senderName: '',
  senderEmail: '',
  replyTo: '',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: '',
  smtpPass: '',
  dailyLimit: 300,
  stealthMode: true,
};

// ── Storage helpers ────────────────────────────────────────────────
function loadUserEmailConfig(userId: string): UserEmailConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(`user_email_cfg_${userId}`);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}

function saveUserEmailConfig(userId: string, cfg: UserEmailConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`user_email_cfg_${userId}`, JSON.stringify(cfg));
}

// ── Sub-components ─────────────────────────────────────────────────
function FieldNote({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 5,
      lineHeight: 1.5, paddingLeft: 4, borderLeft: '2px solid rgba(139,92,246,0.25)',
    }}>
      {children}
    </p>
  );
}

function StatusBadge({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
      background: ok ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
      color: ok ? '#34D399' : '#FCD34D',
      border: `1px solid ${ok ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
    }}>
      {text}
    </span>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function UserEmailSetupPage() {
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';

  const [cfg, setCfg] = useState<UserEmailConfig>(DEFAULT_CONFIG);
  const [adminCfg, setAdminCfg] = useState<any>(loadAdminConfig());
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [configStatus, setConfigStatus] = useState<'unconfigured' | 'partial' | 'ready'>('unconfigured');

  useEffect(() => {
    const saved = loadUserEmailConfig(userId);
    setCfg(saved);
    evaluateStatus(saved);
    setAdminCfg(loadAdminConfig());

    const unsubscribe = onConfigSync((updated) => {
      setAdminCfg(updated);
    });
    return () => unsubscribe();
  }, [userId]);

  const evaluateStatus = (c: UserEmailConfig) => {
    if (c.provider === 'system_default') { setConfigStatus('ready'); return; }
    if (c.senderName && c.senderEmail && c.smtpPass) { setConfigStatus('ready'); return; }
    if (c.senderName || c.senderEmail) { setConfigStatus('partial'); return; }
    setConfigStatus('unconfigured');
  };

  const patch = (key: keyof UserEmailConfig, val: any) => {
    setCfg(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    saveUserEmailConfig(userId, cfg);
    evaluateStatus(cfg);
    setToast({ msg: 'Email সেটআপ সেভ হয়েছে! এখন Campaign পাঠাতে পারবেন।', ok: true });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTest = async () => {
    if (!testEmail) return;
    setIsTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 1800));

    if (cfg.provider === 'system_default') {
      setTestResult({ ok: true, msg: `System-এর default email থেকে ${testEmail}-এ test পাঠানো হয়েছে (Demo mode)।` });
    } else if (cfg.smtpPass && cfg.smtpUser) {
      setTestResult({ ok: true, msg: `"${cfg.senderName}" <${cfg.senderEmail}> থেকে ${testEmail}-এ পাঠানো হয়েছে! ✓` });
    } else {
      setTestResult({ ok: false, msg: 'Gmail বা SMTP credentials এখনো সেট করা হয়নি। নিচে সেট করুন।' });
    }
    setIsTesting(false);
  };

  const f = (k: keyof UserEmailConfig) => (cfg[k] ?? '') as string;
  const isConfigured = configStatus === 'ready';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Mail size={22} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              আমার Email সেটআপ
            </h1>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              আপনার Campaign কোন email থেকে পাঠাবে, প্রাপক কী নাম দেখবে — সব এখানে সেট করুন।
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <StatusBadge
              ok={isConfigured}
              text={configStatus === 'ready' ? '✅ প্রস্তুত' : configStatus === 'partial' ? '⚠ অসম্পূর্ণ' : '❌ কনফিগার হয়নি'}
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          marginBottom: 16, padding: '11px 16px', borderRadius: 10,
          background: toast.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.ok ? '#34D399' : '#F87171',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── 1. Provider Choice ──────────────────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Server size={18} style={{ color: '#A78BFA' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              ১. কোন Email দিয়ে পাঠাবেন?
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* System Default */}
            <button onClick={() => patch('provider', 'system_default')} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
              borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
              fontFamily: "'Anek Bangla', sans-serif", transition: 'all 0.18s',
              border: `2px solid ${cfg.provider === 'system_default' ? '#8B5CF6' : 'rgba(255,255,255,0.06)'}`,
              background: cfg.provider === 'system_default' ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                background: cfg.provider === 'system_default' ? '#8B5CF6' : 'rgba(255,255,255,0.15)',
                border: '2px solid #8B5CF6', boxShadow: cfg.provider === 'system_default' ? '0 0 8px #8B5CF6' : 'none',
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: cfg.provider === 'system_default' ? '#C4B5FD' : 'var(--text-primary)' }}>
                    🏢 System Default (অ্যাডমিন কনফিগ)
                  </p>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700 }}>
                    সহজ
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  অ্যাডমিন যে email সেট করেছেন সেটি ব্যবহার হবে। কোনো সেটআপ লাগবে না।
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  💡 শুরুতে এটাই ব্যবহার করুন। নিজের email দিয়ে পাঠাতে চাইলে নিচের দুটো বেছে নিন।
                </p>
              </div>
            </button>

            {/* Gmail SMTP */}
            <button onClick={() => patch('provider', 'gmail_smtp')} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
              borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
              fontFamily: "'Anek Bangla', sans-serif", transition: 'all 0.18s',
              border: `2px solid ${cfg.provider === 'gmail_smtp' ? '#06B6D4' : 'rgba(255,255,255,0.06)'}`,
              background: cfg.provider === 'gmail_smtp' ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                background: cfg.provider === 'gmail_smtp' ? '#06B6D4' : 'rgba(255,255,255,0.15)',
                border: '2px solid #06B6D4', boxShadow: cfg.provider === 'gmail_smtp' ? '0 0 8px #06B6D4' : 'none',
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: cfg.provider === 'gmail_smtp' ? '#67E8F9' : 'var(--text-primary)' }}>
                    📬 আমার Gmail দিয়ে পাঠাবো
                  </p>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 700 }}>
                    ✅ ফ্রি
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  আপনার নিজের Gmail ব্যবহার হবে — প্রাপকের inbox-এ আপনার নাম দেখাবে।
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  💡 ৫০০ ইমেইল/দিন ফ্রি। Gmail App Password লাগবে।
                </p>
              </div>
            </button>

            {/* Custom SMTP */}
            <button onClick={() => patch('provider', 'custom_smtp')} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
              borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
              fontFamily: "'Anek Bangla', sans-serif", transition: 'all 0.18s',
              border: `2px solid ${cfg.provider === 'custom_smtp' ? '#10B981' : 'rgba(255,255,255,0.06)'}`,
              background: cfg.provider === 'custom_smtp' ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                background: cfg.provider === 'custom_smtp' ? '#10B981' : 'rgba(255,255,255,0.15)',
                border: '2px solid #10B981', boxShadow: cfg.provider === 'custom_smtp' ? '0 0 8px #10B981' : 'none',
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: cfg.provider === 'custom_smtp' ? '#34D399' : 'var(--text-primary)' }}>
                    🌐 কাস্টম SMTP (cPanel / Zoho / অন্য)
                  </p>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(6,182,212,0.12)', color: '#67E8F9', border: '1px solid rgba(6,182,212,0.25)', fontWeight: 700 }}>
                    উন্নত
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  নিজের domain-এর email ব্যবহার করুন (info@yourbusiness.com)।
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  💡 Hostinger/cPanel hosting থাকলে সেখান থেকে SMTP credentials নিন।
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── 2. Sender Identity ───────────────────────────────── */}
        <div className="glass-card" style={{ padding: 24, borderColor: 'rgba(6,182,212,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} style={{ color: '#06B6D4' }} />
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                ২. প্রাপকের Inbox-এ কী দেখাবে?
              </h2>
            </div>
            <button onClick={handleSave} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px',
              borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff',
              fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
              fontFamily: "'Anek Bangla', sans-serif", boxShadow: '0 0 12px rgba(124,58,237,0.4)',
            }}>
              <Save size={14} /> সেভ করুন
            </button>
          </div>

          {/* Live preview */}
          <div style={{
            marginBottom: 18, padding: '12px 16px', borderRadius: 10,
            background: '#fff', border: '1px solid #E8EAED',
          }}>
            <p style={{ fontSize: '0.72rem', color: '#5F6368', marginBottom: 8, fontWeight: 600 }}>
              👁 প্রাপকের Gmail-এ এভাবে দেখাবে:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.875rem',
              }}>
                {(cfg.senderName || user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#202124', fontFamily: "'Anek Bangla', sans-serif" }}>
                  {cfg.senderName || user?.name || 'আপনার নাম'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#5F6368', fontFamily: 'monospace' }}>
                  &lt;{cfg.senderEmail || cfg.smtpUser || 'your@email.com'}&gt;
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5F6368' }}>এখনই</div>
            </div>
            {/* Email preview line */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F3F4' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#202124', fontFamily: "'Anek Bangla', sans-serif" }}>
                আপনার Campaign Subject Line এখানে দেখাবে
              </p>
              <p style={{ fontSize: '0.78rem', color: '#5F6368', fontFamily: "'Anek Bangla', sans-serif" }}>
                Email-এর প্রথম কয়েকটা লাইন preview হিসেবে দেখাবে...
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                📛 আপনার নাম (Inbox-এ Bold-এ দেখাবে)
              </label>
              <input className="cyber-input" placeholder="যেমন: রাহুল আহমেদ / Rahul Fashion"
                value={f('senderName')} onChange={e => patch('senderName', e.target.value)} />
              <FieldNote>⭐ এটাই সবচেয়ে গুরুত্বপূর্ণ। আপনার ব্যবসার নাম বা নিজের নাম দিন।</FieldNote>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                ✉️ From Email (যে email থেকে পাঠাবে)
              </label>
              <input className="cyber-input" type="email" placeholder="your@gmail.com"
                value={f('senderEmail')} onChange={e => patch('senderEmail', e.target.value)} />
              <FieldNote>Gmail দিলে Gmail-এর ঠিকানা। cPanel দিলে info@yourdomain.com</FieldNote>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                📮 Reply-To Email (ঐচ্ছিক — প্রাপক Reply করলে কোথায় আসবে)
              </label>
              <input className="cyber-input" type="email" placeholder="support@yourdomain.com (না দিলে From Email-এ আসবে)"
                value={f('replyTo')} onChange={e => patch('replyTo', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── 3. Gmail / SMTP Credentials (conditional) ────────── */}
        {(cfg.provider === 'gmail_smtp' || cfg.provider === 'custom_smtp') && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} style={{ color: cfg.provider === 'gmail_smtp' ? '#06B6D4' : '#10B981' }} />
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  ৩. {cfg.provider === 'gmail_smtp' ? 'Gmail' : 'SMTP'} সংযোগ তথ্য
                </h2>
              </div>
              <button onClick={handleSave} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                borderRadius: 8, border: 'none',
                background: cfg.provider === 'gmail_smtp' ? '#06B6D4' : '#10B981',
                color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
                fontFamily: "'Anek Bangla', sans-serif",
              }}>
                <Save size={14} /> সেভ করুন
              </button>
            </div>

            {/* Gmail guide */}
            {cfg.provider === 'gmail_smtp' && (
              <div style={{ marginBottom: 18, padding: '14px 16px', borderRadius: 10, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#67E8F9', marginBottom: 10 }}>
                  📋 Gmail App Password বানানোর ধাপ (একবারই করতে হবে):
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { step: '১', text: 'Google 2-Step Verification चालू করুন', link: adminCfg?.linkGoogle2FA || 'https://myaccount.google.com/signinoptions/two-step-verification', btn: '2FA চালু →' },
                    { step: '২', text: 'App Passwords পেজে গিয়ে "Smart Email" নামে নতুন password বানান', link: adminCfg?.linkGoogleAppPassword || 'https://myaccount.google.com/apppasswords', btn: 'App Password নিন →' },
                    { step: '৩', text: '16-digit password পাবেন — সেটি নিচের "App Password" ঘরে দিন', link: null, btn: null },
                  ].map(({ step, text, link, btn }) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: '#67E8F9',
                      }}>{step}</div>
                      <p style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{text}</p>
                      {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{
                          flexShrink: 0, padding: '5px 12px', borderRadius: 6, textDecoration: 'none',
                          background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)',
                          color: '#67E8F9', fontSize: '0.75rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                        }}>
                          {btn} <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* cPanel guide */}
            {cfg.provider === 'custom_smtp' && (
              <div style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: '#34D399' }}>📍 cPanel থেকে SMTP তথ্য কোথায় পাবেন:</strong><br />
                cPanel Login → Email → Email Accounts → আপনার email-এর পাশে "Connect Devices" → Mail Client Manual Settings
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {cfg.provider === 'gmail_smtp' ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                      👤 Gmail ঠিকানা
                    </label>
                    <input className="cyber-input" placeholder="yourname@gmail.com"
                      value={f('smtpUser')} onChange={e => patch('smtpUser', e.target.value)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                    <FieldNote>আপনার পূর্ণ Gmail ঠিকানা দিন।</FieldNote>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        🔒 App Password (16-digit)
                      </label>
                      <a href={adminCfg?.linkGoogleAppPassword || 'https://myaccount.google.com/apppasswords'} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '0.7rem', color: '#67E8F9', textDecoration: 'none', padding: '2px 8px', borderRadius: 4, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        নিন <ExternalLink size={10} />
                      </a>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input className="cyber-input" type={showPass ? 'text' : 'password'} placeholder="abcdefghijklmnop"
                        value={f('smtpPass')} onChange={e => patch('smtpPass', e.target.value)}
                        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', paddingRight: 36 }} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <FieldNote>
                      {f('smtpPass') ? `✅ সেট আছে (${f('smtpPass').length} অক্ষর)` : '⚠️ আসল Gmail password নয় — App Password দিন'}
                    </FieldNote>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🖥️ SMTP Host</label>
                    <input className="cyber-input" placeholder="mail.yourdomain.com"
                      value={f('smtpHost')} onChange={e => patch('smtpHost', e.target.value)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                    <FieldNote>cPanel: mail.yourdomain.com | Zoho: smtp.zoho.com</FieldNote>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🔌 Port</label>
                    <input className="cyber-input" placeholder="587"
                      value={f('smtpPort')} onChange={e => patch('smtpPort', e.target.value)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                    <FieldNote>TLS: 587 | SSL: 465</FieldNote>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>👤 Email/Username</label>
                    <input className="cyber-input" placeholder="info@yourdomain.com"
                      value={f('smtpUser')} onChange={e => patch('smtpUser', e.target.value)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🔒 Password</label>
                    <div style={{ position: 'relative' }}>
                      <input className="cyber-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                        value={f('smtpPass')} onChange={e => patch('smtpPass', e.target.value)}
                        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', paddingRight: 36 }} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── 4. Daily Limit & Stealth ──────────────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} style={{ color: '#A78BFA' }} />
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                ৪. দৈনিক সীমা ও সুরক্ষা
              </h2>
            </div>
            <button onClick={handleSave} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff',
              fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
              fontFamily: "'Anek Bangla', sans-serif",
            }}>
              <Save size={14} /> সেভ করুন
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                📊 দৈনিক সর্বোচ্চ ইমেইল
              </label>
              <input className="cyber-input" type="number" min={10} max={10000}
                value={cfg.dailyLimit} onChange={e => patch('dailyLimit', parseInt(e.target.value) || 300)} />
              <FieldNote>
                Gmail ব্যবহার করলে সর্বোচ্চ ৫০০ দিন। বেশি দিলে Gmail block করতে পারে।
              </FieldNote>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>🛡️ Stealth Mode</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  চালু থাকলে AI মানুষের মতো লিখবে — spam ধরা পড়বে না
                </p>
              </div>
              <button onClick={() => patch('stealthMode', !cfg.stealthMode)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: cfg.stealthMode ? '#34D399' : '#6B7280' }}>
                {cfg.stealthMode
                  ? <ToggleRight size={34} style={{ filter: 'drop-shadow(0 0 6px #34D399)' }} />
                  : <ToggleLeft size={34} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── 5. Test Send ──────────────────────────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FlaskConical size={18} style={{ color: '#34D399' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              ৫. টেস্ট ইমেইল পাঠান
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            সেটআপ সঠিক হয়েছে কিনা যাচাই করুন — আপনার নামে একটি test email পাঠান।
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <input className="cyber-input" type="email" placeholder="test পাওয়ার জন্য আপনার email দিন"
              value={testEmail} onChange={e => setTestEmail(e.target.value)} style={{ flex: 1 }} />
            <button onClick={handleTest} disabled={isTesting || !testEmail} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              borderRadius: 10, border: 'none', whiteSpace: 'nowrap',
              background: isTesting || !testEmail ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #10B981, #059669)',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              cursor: isTesting || !testEmail ? 'not-allowed' : 'pointer',
              fontFamily: "'Anek Bangla', sans-serif",
            }}>
              <Send size={16} />{isTesting ? 'পাঠাচ্ছে...' : 'Test পাঠান'}
            </button>
          </div>
          {testResult && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: '0.875rem',
              background: testResult.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${testResult.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: testResult.ok ? '#34D399' : '#F87171',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {testResult.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {testResult.msg}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
