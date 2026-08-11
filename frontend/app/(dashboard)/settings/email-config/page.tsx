'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail, Save, CheckCircle2, AlertTriangle, ExternalLink,
  Eye, EyeOff, Send, Server, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { loadAdminConfig } from '@/lib/admin-config';
import { onConfigSync } from '@/lib/config-sync';
import { sendRealEmail } from '@/lib/email-dispatcher';

type EmailProvider = 'gmail_smtp' | 'custom_smtp' | 'system_default';

interface UserEmailConfig {
  provider: EmailProvider;
  senderName: string;
  senderEmail: string;
  replyTo: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
}

const DEFAULT: UserEmailConfig = {
  provider: 'system_default',
  senderName: '',
  senderEmail: '',
  replyTo: '',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: '',
  smtpPass: '',
};

function load(uid: string): UserEmailConfig {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(`user_email_cfg_${uid}`);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch { return DEFAULT; }
}

function save(uid: string, cfg: UserEmailConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`user_email_cfg_${uid}`, JSON.stringify(cfg));
}

const PROVIDERS = [
  {
    id: 'system_default' as EmailProvider,
    emoji: '🏢',
    title: 'System Default',
    subtitle: 'অ্যাডমিন-এর কনফিগ ব্যবহার হবে — কোনো সেটআপ লাগবে না',
    badge: 'সহজ',
    badgeColor: '#34D399',
    color: '#8B5CF6',
  },
  {
    id: 'gmail_smtp' as EmailProvider,
    emoji: '📬',
    title: 'আমার Gmail দিয়ে',
    subtitle: 'নিজের Gmail থেকে email পাঠান — প্রাপক আপনার নাম দেখবে',
    badge: '৫০০/দিন ফ্রি',
    badgeColor: '#67E8F9',
    color: '#06B6D4',
  },
  {
    id: 'custom_smtp' as EmailProvider,
    emoji: '🌐',
    title: 'Custom SMTP / cPanel',
    subtitle: 'নিজের domain email (info@yourbusiness.com) ব্যবহার করুন',
    badge: 'উন্নত',
    badgeColor: '#A78BFA',
    color: '#10B981',
  },
];

export default function UserEmailSetupPage() {
  const { user } = useAuthStore();
  const uid = user?.uid || 'guest';

  const [cfg, setCfg] = useState<UserEmailConfig>(DEFAULT);
  const [adminCfg, setAdminCfg] = useState<any>({});
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCfg(load(uid));
    setAdminCfg(loadAdminConfig());
    const unsub = onConfigSync(setAdminCfg);
    return () => unsub();
  }, [uid]);

  const patch = (k: keyof UserEmailConfig, v: any) =>
    setCfg(prev => ({ ...prev, [k]: v }));

  const isReady =
    cfg.provider === 'system_default' ||
    (cfg.senderName && cfg.senderEmail && cfg.smtpPass);

  const handleSave = async () => {
    setIsSaving(true);
    save(uid, cfg);
    await new Promise(r => setTimeout(r, 400));
    setIsSaving(false);
    setToast({ msg: '✅ Email সেটআপ সেভ হয়েছে!', ok: true });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTest = async () => {
    if (!testEmail) return;
    setIsTesting(true);
    setTestResult(null);

    const res = await sendRealEmail({
      to: testEmail,
      senderName: cfg.senderName || 'Smart Email User',
      senderEmail: cfg.senderEmail || cfg.smtpUser || 'user@example.com',
      subject: '🧪 টেস্ট ইমেইল — Smart Email Sent AI',
      body: `আসসালামু আলাইকুম,\n\nএটি একটি টেস্ট ইমেইল। আপনার Email সেটআপ সফলভাবে কাজ করছে।\n\nপ্রেরক: ${cfg.senderName || 'আপনার নাম'} <${cfg.senderEmail || cfg.smtpUser || 'email@domain.com'}>\nসময়: ${new Date().toLocaleString()}`,
      smtpPass: cfg.smtpPass,
      smtpUser: cfg.smtpUser,
    });

    setTestResult({ ok: res.success, msg: res.message });
    setIsTesting(false);
  };

  const f = (k: keyof UserEmailConfig) => (cfg[k] ?? '') as string;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Mail size={22} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
              Email সেটআপ
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              আপনার Campaign কোন email থেকে পাঠাবে
            </p>
          </div>
        </div>
        <span style={{
          padding: '5px 14px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
          background: isReady ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
          color: isReady ? '#34D399' : '#FCD34D',
          border: `1px solid ${isReady ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
        }}>
          {isReady ? '✅ প্রস্তুত' : '⚠ সেটআপ বাকি'}
        </span>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 10,
          background: toast.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.ok ? '#34D399' : '#F87171',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Step 1: Provider ─────────────────────────────────── */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: '#C4B5FD',
            }}>১</div>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              কোন Email দিয়ে পাঠাবেন?
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => patch('provider', p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%',
                  fontFamily: "'Anek Bangla', sans-serif", transition: 'all 0.18s',
                  border: `2px solid ${cfg.provider === p.id ? p.color : 'rgba(255,255,255,0.06)'}`,
                  background: cfg.provider === p.id ? `${p.color}0D` : 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: cfg.provider === p.id ? p.color : 'var(--text-primary)' }}>
                      {p.title}
                    </p>
                    <span style={{
                      fontSize: '0.65rem', padding: '2px 7px', borderRadius: 999,
                      background: `${p.badgeColor}18`, color: p.badgeColor,
                      border: `1px solid ${p.badgeColor}30`, fontWeight: 700,
                    }}>{p.badge}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.subtitle}</p>
                </div>
                {cfg.provider === p.id && (
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 8px ${p.color}`,
                  }}>
                    <CheckCircle2 size={11} style={{ color: '#fff' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 2: Sender Info + Credentials ─────────────── */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: '#67E8F9',
            }}>২</div>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Inbox-এ কী দেখাবে?
            </h2>
          </div>

          {/* Live preview */}
          <div style={{
            marginBottom: 16, padding: '12px 14px', borderRadius: 10,
            background: '#fff', border: '1px solid #E8EAED',
          }}>
            <p style={{ fontSize: '0.7rem', color: '#5F6368', marginBottom: 8, fontWeight: 600 }}>
              👁 প্রাপকের Gmail-এ এভাবে দেখাবে:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
              }}>
                {(cfg.senderName || user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#202124', fontFamily: "'Anek Bangla', sans-serif", margin: 0 }}>
                  {cfg.senderName || user?.name || 'আপনার নাম'}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#5F6368', fontFamily: 'monospace', margin: 0 }}>
                  &lt;{cfg.senderEmail || cfg.smtpUser || 'your@email.com'}&gt;
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                আপনার নাম / ব্যবসার নাম *
              </label>
              <input
                className="cyber-input"
                placeholder="যেমন: রাহুল ফ্যাশন"
                value={f('senderName')}
                onChange={e => patch('senderName', e.target.value)}
              />
            </div>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                From Email *
              </label>
              <input
                className="cyber-input"
                type="email"
                placeholder={cfg.provider === 'gmail_smtp' ? 'yourname@gmail.com' : 'info@yourdomain.com'}
                value={f('senderEmail')}
                onChange={e => patch('senderEmail', e.target.value)}
              />
            </div>
          </div>

          {/* Gmail App Password */}
          {cfg.provider === 'gmail_smtp' && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                marginBottom: 12, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)',
              }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67E8F9', marginBottom: 10 }}>
                  📋 Gmail App Password (একবারই করতে হবে):
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { n: '১', t: 'Google 2-Step Verification চালু করুন', link: 'https://myaccount.google.com/signinoptions/two-step-verification', btn: 'চালু করুন →' },
                    { n: '২', t: 'App Passwords পেজে "Smart Email" নামে password বানান', link: 'https://myaccount.google.com/apppasswords', btn: 'App Password নিন →' },
                    { n: '৩', t: '16-digit password নিচে দিন', link: null, btn: null },
                  ].map(({ n, t, link, btn }) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, color: '#67E8F9',
                      }}>{n}</div>
                      <p style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{t}</p>
                      {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{
                          flexShrink: 0, padding: '4px 10px', borderRadius: 6, textDecoration: 'none',
                          background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)',
                          color: '#67E8F9', fontSize: '0.7rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          {btn} <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Gmail ঠিকানা *</label>
                  <input className="cyber-input" placeholder="yourname@gmail.com" value={f('smtpUser')} onChange={e => patch('smtpUser', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>App Password (16-digit) *</label>
                  <div style={{ position: 'relative' }}>
                    <input className="cyber-input" type={showPass ? 'text' : 'password'} placeholder="abcd efgh ijkl mnop"
                      value={f('smtpPass')} onChange={e => patch('smtpPass', e.target.value)} style={{ paddingRight: 36 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {f('smtpPass') && (
                    <p style={{ fontSize: '0.7rem', color: '#34D399', marginTop: 4 }}>✅ {f('smtpPass').length} অক্ষর দেওয়া আছে</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Custom SMTP */}
          {cfg.provider === 'custom_smtp' && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                marginBottom: 12, padding: '10px 12px', borderRadius: 8,
                background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
                fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.6,
              }}>
                📍 <strong style={{ color: '#34D399' }}>cPanel SMTP তথ্য কোথায়:</strong> cPanel → Email → Email Accounts → Connect Devices
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>SMTP Host *</label>
                  <input className="cyber-input" placeholder="mail.yourdomain.com" value={f('smtpHost')} onChange={e => patch('smtpHost', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Port</label>
                  <input className="cyber-input" placeholder="587" value={f('smtpPort')} onChange={e => patch('smtpPort', e.target.value)} />
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 3 }}>TLS: 587 | SSL: 465</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Email / Username *</label>
                  <input className="cyber-input" placeholder="info@yourdomain.com" value={f('smtpUser')} onChange={e => patch('smtpUser', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input className="cyber-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                      value={f('smtpPass')} onChange={e => patch('smtpPass', e.target.value)} style={{ paddingRight: 36 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System default info */}
          {cfg.provider === 'system_default' && (
            <div style={{
              marginTop: 14, padding: '12px 14px', borderRadius: 10,
              background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)',
              fontSize: '0.8rem', color: 'var(--text-secondary)',
            }}>
              ✅ System-এর email সেটআপ ব্যবহার হবে। অ্যাডমিন সেটিংসে email কনফিগার করা থাকলে Campaign সরাসরি পাঠানো যাবে।
            </div>
          )}
        </div>

        {/* ── Step 3: Test ─────────────────────────────────────── */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: '#34D399',
            }}>৩</div>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              টেস্ট ইমেইল পাঠান (ঐচ্ছিক)
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="cyber-input"
              type="email"
              placeholder="আপনার email দিন"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleTest}
              disabled={isTesting || !testEmail}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px',
                borderRadius: 10, border: 'none', whiteSpace: 'nowrap',
                background: isTesting || !testEmail ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                cursor: isTesting || !testEmail ? 'not-allowed' : 'pointer',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              <Send size={15} />{isTesting ? 'পাঠাচ্ছে...' : 'টেস্ট'}
            </button>
          </div>
          {testResult && (
            <div style={{
              marginTop: 10, padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem',
              background: testResult.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${testResult.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: testResult.ok ? '#34D399' : '#F87171',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {testResult.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              {testResult.msg}
            </div>
          )}
        </div>

        {/* ── Save Button ───────────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            width: '100%', height: 50, borderRadius: 12, border: 'none',
            background: isSaving ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: '#fff', fontWeight: 800, fontSize: '1rem',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: isSaving ? 'none' : '0 0 24px rgba(139,92,246,0.4)',
            fontFamily: "'Anek Bangla', sans-serif",
            transition: 'all 0.2s',
          }}
        >
          <Save size={18} />
          {isSaving ? 'সেভ হচ্ছে...' : 'সেটআপ সেভ করুন'}
        </button>

        {/* ── Advanced Settings (collapsed) ──────────────────── */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
            color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
            fontFamily: "'Anek Bangla', sans-serif", padding: '4px 0',
          }}
        >
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          উন্নত সেটিংস
        </button>

        {showAdvanced && (
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 14 }}>
              Reply-To Email (ঐচ্ছিক)
            </h3>
            <input
              className="cyber-input"
              type="email"
              placeholder="support@yourdomain.com (না দিলে From Email-এ reply আসবে)"
              value={f('replyTo')}
              onChange={e => patch('replyTo', e.target.value)}
            />
          </div>
        )}

      </div>
    </div>
  );
}
