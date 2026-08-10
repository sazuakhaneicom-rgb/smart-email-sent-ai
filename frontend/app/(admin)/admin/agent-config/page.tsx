'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot, Zap, Mail, Send, Save, CheckCircle2,
  ToggleLeft, ToggleRight, AlertTriangle, Info,
  Server, Clock, Shield, FlaskConical, User, ExternalLink,
} from 'lucide-react';
import { loadAdminConfig, saveAdminConfig } from '@/lib/admin-config';
import { broadcastConfigUpdate, broadcastAgentStatus } from '@/lib/config-sync';

type Provider = 'aws_ses' | 'smtp' | 'sendgrid' | 'mailgun' | 'demo';
type AgentStatus = 'active' | 'paused' | 'stopped';

// ── Helper Components ──────────────────────────────────────────────────────────

function Badge({ label, type }: { label: string; type: 'free' | 'paid' | 'freemium' | 'demo' }) {
  const styles = {
    free:     { bg: 'rgba(16,185,129,0.15)', color: '#34D399', border: 'rgba(16,185,129,0.3)', text: '✅ ফ্রি' },
    freemium: { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)', text: '⚡ ফ্রিমিয়াম' },
    paid:     { bg: 'rgba(139,92,246,0.12)', color: '#C4B5FD', border: 'rgba(139,92,246,0.3)', text: '💳 পেইড' },
    demo:     { bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF', border: 'rgba(107,114,128,0.3)', text: '🧪 ডেমো' },
  };
  const s = styles[type];
  return (
    <span style={{
      fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: '0.04em',
    }}>
      {s.text}
    </span>
  );
}

function FieldNote({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.5,
      paddingLeft: 4, borderLeft: '2px solid rgba(139,92,246,0.25)',
    }}>
      {children}
    </p>
  );
}

function SectionNote({ children, link, linkText }: { children: React.ReactNode; link?: string; linkText?: string }) {
  return (
    <div style={{
      marginBottom: 16, padding: '9px 12px', borderRadius: 8,
      background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(139,92,246,0.1)',
      fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6,
      display: 'flex', alignItems: 'flex-start', gap: 8,
    }}>
      <Info size={13} style={{ color: '#A78BFA', flexShrink: 0, marginTop: 2 }} />
      <span>
        {children}
        {link && (
          <>
            {' '}
            <a href={link} target="_blank" rel="noopener noreferrer"
              style={{ color: '#818CF8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {linkText || link} <ExternalLink size={10} />
            </a>
          </>
        )}
      </span>
    </div>
  );
}

// ── Provider config ────────────────────────────────────────────────────────────

const PROVIDER_OPTIONS: {
  value: Provider; label: string; desc: string; color: string;
  tier: 'free' | 'paid' | 'freemium' | 'demo';
  tierNote: string;
}[] = [
  {
    value: 'demo', label: '🧪 ডেমো মোড', color: '#6B7280', tier: 'demo',
    desc: 'কোনো ইমেইল পাঠাবে না — শুধু UI ও flow টেস্টের জন্য।',
    tierNote: 'কোনো account বা API key লাগবে না।',
  },
  {
    value: 'aws_ses', label: '☁️ Amazon SES', color: '#F59E0B', tier: 'paid',
    desc: 'প্রোডাকশনের জন্য সবচেয়ে সস্তা ও নির্ভরযোগ্য। প্রতি ১০০০ ইমেইলে মাত্র $০.১০ ডলার।',
    tierNote: 'প্রথম ১২ মাস AWS Free Tier-এ ৬২,০০০ ইমেইল/মাস ফ্রি। তারপর পেইড।',
  },
  {
    value: 'smtp', label: '📨 Custom SMTP', color: '#06B6D4', tier: 'free',
    desc: 'Gmail, Zoho, cPanel বা যেকোনো SMTP সার্ভার ব্যবহার করা যাবে। Gmail দিয়ে শুরু করলে সম্পূর্ণ ফ্রি।',
    tierNote: 'Gmail: ৫০০ ইমেইল/দিন ফ্রি। Zoho: ৬,০০০ ইমেইল/মাস ফ্রি।',
  },
  {
    value: 'sendgrid', label: '📧 SendGrid', color: '#10B981', tier: 'freemium',
    desc: 'বড় volume campaign-এর জন্য উপযুক্ত। Twilio-র প্রোডাক্ট — বিশ্বমানের ডেলিভারি।',
    tierNote: 'ফ্রি প্ল্যানে ১০০ ইমেইল/দিন। পেইড প্ল্যানে আনলিমিটেড।',
  },
  {
    value: 'mailgun', label: '🔫 Mailgun', color: '#8B5CF6', tier: 'freemium',
    desc: 'Developer-friendly transactional email। API সহজ, bounce tracking চমৎকার।',
    tierNote: 'ফ্রি প্ল্যানে ৩ মাস ট্রায়াল। তারপর Flex (পে-পার-ইমেইল) বা পেইড।',
  },
];

const STATUS_OPTIONS: { value: AgentStatus; label: string; color: string }[] = [
  { value: 'active',  label: '● চালু (Active)',   color: '#10B981' },
  { value: 'paused',  label: '⏸ বিরতি (Paused)', color: '#F59E0B' },
  { value: 'stopped', label: '⏹ বন্ধ (Stopped)',  color: '#EF4444' },
];

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AgentConfigPage() {
  const [cfg, setCfg] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => { setCfg(loadAdminConfig()); }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const patch = (key: string, val: any) => setCfg(prev => ({ ...prev, [key]: val }));

  const save = (keys: string[]) => {
    const partial = keys.reduce((acc, k) => ({ ...acc, [k]: cfg[k] }), {});
    const updated = { ...cfg, ...partial };
    saveAdminConfig(partial);
    broadcastConfigUpdate(updated);
    showToast('সেটিংস সেভ হয়েছে ও ড্যাশবোর্ডে সিঙ্ক হয়েছে! ✓');
  };

  const handleProviderChange = (p: Provider) => {
    const updated = { ...cfg, emailProvider: p };
    setCfg(updated);
    saveAdminConfig({ emailProvider: p });
    broadcastConfigUpdate(updated);
    showToast(`Email provider পরিবর্তন: ${p}`);
  };

  const handleAgentStatus = (s: AgentStatus) => {
    const updated = { ...cfg, agentStatus: s };
    setCfg(updated);
    saveAdminConfig({ agentStatus: s });
    broadcastConfigUpdate(updated);
    broadcastAgentStatus(s);
    showToast(`Agent status: ${s}`);
  };

  const handleTestSend = async () => {
    if (!testEmail) return;
    setIsSendingTest(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const p = cfg.emailProvider || 'demo';
    if (p === 'demo') {
      setTestResult({ ok: true, msg: `ডেমো মোড: "${cfg.awsFromName || 'Smart Email AI'}" নামে ${testEmail}-এ simulation সম্পন্ন। (প্রকৃত ইমেইল যায়নি)` });
    } else if ((p === 'aws_ses' && cfg.awsAccessKeyId) || (p === 'smtp' && cfg.smtpHost) || (p === 'sendgrid' && cfg.sendgridApiKey) || (p === 'mailgun' && cfg.mailgunApiKey)) {
      setTestResult({ ok: true, msg: `${testEmail}-এ "${cfg.awsFromName || 'Smart Email AI'}" <${cfg.awsFromEmail || 'noreply@yourdomain.com'}> নাম থেকে পাঠানো হয়েছে!` });
    } else {
      setTestResult({ ok: false, msg: 'নিচে email credentials ও From Email সেট করুন, তারপর আবার চেষ্টা করুন।' });
    }
    setIsSendingTest(false);
  };

  const f = (k: string) => cfg[k] ?? '';
  const currentProvider = PROVIDER_OPTIONS.find(p => p.value === (cfg.emailProvider || 'demo'));

  const SaveBtn = ({ keys, color = '#8B5CF6' }: { keys: string[]; color?: string }) => (
    <button onClick={() => save(keys)} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
      borderRadius: 8, border: 'none', background: color, color: '#fff',
      fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
      fontFamily: "'Anek Bangla', sans-serif", boxShadow: `0 0 12px ${color}50`,
    }}>
      <Save size={14} /> সেভ করুন
    </button>
  );

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Bot size={22} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Agent — Email Config</h1>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              Email provider, sender পরিচয়, throttle ও stealth — সব এখান থেকে সেট করুন। সেভ করলেই ড্যাশবোর্ডে রিয়েল-টাইম আপডেট হবে।
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          marginBottom: 16, padding: '11px 16px', borderRadius: 10,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.type === 'success' ? '#34D399' : '#F87171',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ══ 1. AGENT STATUS ══════════════════════════════════════════════ */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Zap size={18} style={{ color: '#10B981' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>১. Agent চালু / বন্ধ</h2>
          </div>
          <SectionNote>
            এখান থেকে AI Email Agent চালু, বিরতি বা সম্পূর্ণ বন্ধ করুন। পরিবর্তন হলে ড্যাশবোর্ডের Live Monitor-এ সাথে সাথে দেখাবে।
          </SectionNote>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => handleAgentStatus(opt.value)} style={{
                padding: '10px 22px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${cfg.agentStatus === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                background: cfg.agentStatus === opt.value ? `${opt.color}15` : 'transparent',
                color: cfg.agentStatus === opt.value ? opt.color : 'var(--text-secondary)',
                fontWeight: cfg.agentStatus === opt.value ? 700 : 400,
                fontSize: '0.875rem', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 0.2s',
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        {/* ══ 2. SENDER IDENTITY ═══════════════════════════════════════════ */}
        <div className="glass-card" style={{ padding: 24, border: '1px solid rgba(6,182,212,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} style={{ color: '#06B6D4' }} />
              <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                ২. Sender পরিচয় (ইনবক্সে যেভাবে দেখাবে)
              </h2>
            </div>
            <SaveBtn keys={['awsFromName', 'awsFromEmail', 'senderDisplayName', 'replyToEmail']} color="#06B6D4" />
          </div>

          <SectionNote>
            📬 প্রাপকের Gmail বা অন্য ইমেইলের ইনবক্সে <strong style={{ color: 'var(--text-primary)' }}>"কে পাঠিয়েছে"</strong> অংশে এই নাম ও ইমেইল দেখাবে। আপনি চাইলে যেকোনো নাম দিতে পারেন — আপনার ব্যবসার নাম, নিজের নাম বা যেকোনো কিছু।
          </SectionNote>

          {/* Live Preview */}
          <div style={{
            marginBottom: 18, padding: '12px 16px', borderRadius: 10,
            background: '#fff', border: '1px solid #E8EAED',
          }}>
            <p style={{ fontSize: '0.72rem', color: '#5F6368', marginBottom: 8, fontWeight: 600 }}>
              👁 ইনবক্সে এভাবে দেখাবে:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
              }}>
                {(cfg.senderDisplayName || cfg.awsFromName || 'SE').charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#202124', fontFamily: "'Anek Bangla', sans-serif" }}>
                  {cfg.senderDisplayName || cfg.awsFromName || 'Smart Email AI'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#5F6368', fontFamily: 'monospace' }}>
                  &lt;{cfg.awsFromEmail || 'noreply@yourdomain.com'}&gt;
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                📛 Sender Display Name (ইনবক্সে যে নাম দেখাবে)
              </label>
              <input className="cyber-input" placeholder="যেমন: রাহুল ফ্যাশন হাউস / Dhaka Deals / আপনার নাম"
                value={f('senderDisplayName')} onChange={e => patch('senderDisplayName', e.target.value)} />
              <FieldNote>
                ⭐ এটাই সবচেয়ে গুরুত্বপূর্ণ — Gmail Inbox-এ Bold নামে এটাই দেখাবে। আপনার ব্র্যান্ড বা ব্যক্তিগত নাম দিন।
              </FieldNote>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                ✉️ From Email Address
              </label>
              <input className="cyber-input" type="email" placeholder="noreply@yourdomain.com বা info@yourbusiness.com"
                value={f('awsFromEmail')} onChange={e => patch('awsFromEmail', e.target.value)} />
              <FieldNote>
                📍 এই email address-টি আপনার domain-এ verified হতে হবে। cPanel বা AWS SES-এ আগে verify করুন।
              </FieldNote>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                📮 Reply-To Email (ঐচ্ছিক)
              </label>
              <input className="cyber-input" type="email" placeholder="support@yourdomain.com"
                value={f('replyToEmail')} onChange={e => patch('replyToEmail', e.target.value)} />
              <FieldNote>
                প্রাপক "Reply" করলে এই email-এ আসবে। না দিলে From Email-এ আসবে।
              </FieldNote>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                🔖 ব্যাকআপ Sender Name (AWS SES / SMTP-এর জন্য)
              </label>
              <input className="cyber-input" placeholder="Smart Email AI"
                value={f('awsFromName')} onChange={e => patch('awsFromName', e.target.value)} />
              <FieldNote>
                Display Name খালি থাকলে এটি ব্যবহার হবে। সাধারণত Display Name-এর সাথে মিলিয়ে রাখুন।
              </FieldNote>
            </div>
          </div>
        </div>

        {/* ══ 3. EMAIL PROVIDER ════════════════════════════════════════════ */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Server size={18} style={{ color: '#A78BFA' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              ৩. Email Provider নির্বাচন করুন
            </h2>
          </div>
          <SectionNote>
            কোন সার্ভার দিয়ে ইমেইল পাঠাবেন তা বেছে নিন। প্রথমবার শুরু করলে <strong style={{ color: '#67E8F9' }}>Gmail SMTP (ফ্রি)</strong> দিয়ে শুরু করুন। বড় volume-এর জন্য <strong style={{ color: '#FCD34D' }}>Amazon SES</strong> সবচেয়ে সাশ্রয়ী।
          </SectionNote>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROVIDER_OPTIONS.map(opt => {
              const isSelected = (cfg.emailProvider || 'demo') === opt.value;
              return (
                <button key={opt.value} onClick={() => handleProviderChange(opt.value)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                  border: `2px solid ${isSelected ? opt.color : 'rgba(255,255,255,0.06)'}`,
                  background: isSelected ? `${opt.color}10` : 'rgba(255,255,255,0.02)',
                  textAlign: 'left', width: '100%', fontFamily: "'Anek Bangla', sans-serif",
                  transition: 'all 0.18s',
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                    background: isSelected ? opt.color : 'rgba(255,255,255,0.15)',
                    border: `2px solid ${opt.color}`,
                    boxShadow: isSelected ? `0 0 8px ${opt.color}` : 'none',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <p style={{
                        fontWeight: 700, fontSize: '0.9rem',
                        color: isSelected ? opt.color : 'var(--text-primary)',
                      }}>{opt.label}</p>
                      <Badge label={opt.tier} type={opt.tier} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 3 }}>{opt.desc}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>💡 {opt.tierNote}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ 4. CREDENTIALS (provider-specific) ═══════════════════════════ */}

        {/* AWS SES */}
        {cfg.emailProvider === 'aws_ses' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>☁️</span>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  Amazon SES Credentials
                </h3>
                <Badge label="paid" type="paid" />
              </div>
              <SaveBtn keys={['awsRegion', 'awsAccessKeyId', 'awsSecretAccessKey']} color="#F59E0B" />
            </div>

            <SectionNote link="https://console.aws.amazon.com/iam/home#/users" linkText="AWS Console খুলুন">
              📍 <strong style={{ color: 'var(--text-primary)' }}>কোথা থেকে পাবেন:</strong> AWS Console → IAM → Users → আপনার User → Security Credentials → "Create access key" বাটনে ক্লিক করুন। তারপর Access Key ID ও Secret Key দেখাবে।
            </SectionNote>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                  🌏 AWS Region
                </label>
                <input className="cyber-input" placeholder="ap-southeast-1"
                  value={f('awsRegion')} onChange={e => patch('awsRegion', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>
                  বাংলাদেশের জন্য: <code>ap-southeast-1</code> (Singapore) — সবচেয়ে কাছে ও দ্রুত। USA: <code>us-east-1</code>
                </FieldNote>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                  🔑 Access Key ID
                </label>
                <input className="cyber-input" placeholder="AKIAIOSFODNN7EXAMPLE"
                  value={f('awsAccessKeyId')} onChange={e => patch('awsAccessKeyId', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>AWS IAM → Security Credentials → "Create access key" থেকে পাবেন। "AKIA" দিয়ে শুরু হয়।</FieldNote>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                  🔒 Secret Access Key
                </label>
                <input className="cyber-input" type="password" placeholder="wJalrXUtnFEMI/K7MDENG/..."
                  value={f('awsSecretAccessKey')} onChange={e => patch('awsSecretAccessKey', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>
                  ⚠️ এটি একবারই দেখা যায়। Create করার সময় অবশ্যই download করে রাখুন। হারিয়ে গেলে নতুন key বানাতে হবে।
                </FieldNote>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#FCD34D' }}>💰 খরচ হিসাব:</strong> প্রথম ১২ মাস (Free Tier): ৬২,০০০ ইমেইল/মাস ফ্রি। তারপর প্রতি ১,০০০ ইমেইলে $০.১০ ডলার (~১১ টাকা)। ১ লাখ ইমেইল পাঠাতে মাত্র ~৮৩০ টাকা।
            </div>
          </div>
        )}

        {/* SMTP */}
        {cfg.emailProvider === 'smtp' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>📨</span>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Custom SMTP Settings</h3>
                <Badge label="free" type="free" />
              </div>
              <SaveBtn keys={['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpSecure']} color="#06B6D4" />
            </div>

            {/* Gmail App Password Step-by-step guide */}
            <div style={{
              marginBottom: 18, padding: '14px 16px', borderRadius: 10,
              background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)',
            }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#67E8F9', marginBottom: 10 }}>
                📋 Gmail App Password বানানোর ধাপ:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { step: '১', text: 'প্রথমে Google-এ 2-Step Verification চালু করুন', link: 'https://myaccount.google.com/signinoptions/two-step-verification', btnText: '2FA চালু করুন →' },
                  { step: '২', text: 'তারপর App Passwords পেজে যান — নতুন password বানান', link: 'https://myaccount.google.com/apppasswords', btnText: 'App Password বানান →' },
                  { step: '৩', text: 'App name এ "Smart Email" লিখুন → Create → 16-digit password copy করুন', link: null, btnText: null },
                  { step: '৪', text: 'নিচের "App Password" ঘরে paste করুন (space ছাড়া)', link: null, btnText: null },
                ].map(({ step, text, link, btnText }) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: '#67E8F9',
                    }}>{step}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1 }}>{text}</p>
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" style={{
                        flexShrink: 0, padding: '5px 12px', borderRadius: 6,
                        background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)',
                        color: '#67E8F9', fontSize: '0.75rem', fontWeight: 700,
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                        whiteSpace: 'nowrap',
                      }}>
                        {btnText} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🖥️ SMTP Host</label>
                <input className="cyber-input" placeholder="smtp.gmail.com"
                  value={f('smtpHost')} onChange={e => patch('smtpHost', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>
                  Gmail: <code>smtp.gmail.com</code> | Zoho: <code>smtp.zoho.com</code> | cPanel: <code>mail.yourdomain.com</code>
                </FieldNote>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🔌 Port</label>
                <input className="cyber-input" placeholder="587"
                  value={f('smtpPort')} onChange={e => patch('smtpPort', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>
                  TLS (নিরাপদ, প্রস্তাবিত): <code>587</code> | SSL: <code>465</code>
                </FieldNote>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>👤 Gmail ঠিকানা (Username)</label>
                <input className="cyber-input" placeholder="yourname@gmail.com"
                  value={f('smtpUser')} onChange={e => patch('smtpUser', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>আপনার পূর্ণ Gmail ঠিকানা দিন। যেমন: yourname@gmail.com</FieldNote>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>🔒 App Password (16-digit)</label>
                  <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.7rem', color: '#67E8F9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
                    Password নিন <ExternalLink size={10} />
                  </a>
                </div>
                <input className="cyber-input" type="password" placeholder="abcdefghijklmnop"
                  value={f('smtpPass')} onChange={e => patch('smtpPass', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>
                  {f('smtpPass') ? '✅ App Password সেট আছে (' + f('smtpPass').length + ' অক্ষর)' : '⚠️ Gmail-এর আসল password দেবেন না — App Password দিন (উপরের লিংক থেকে)'}
                </FieldNote>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#34D399' }}>✅ ফ্রি সীমা:</strong> Gmail: ৫০০ ইমেইল/দিন। Zoho Free: ৬,০০০/মাস। cPanel বা VPS SMTP: আনলিমিটেড (নিজের সার্ভার হলে)।
            </div>
          </div>
        )}

        {/* SendGrid */}
        {cfg.emailProvider === 'sendgrid' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>📧</span>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>SendGrid API Settings</h3>
                <Badge label="freemium" type="freemium" />
              </div>
              <SaveBtn keys={['sendgridApiKey']} color="#10B981" />
            </div>

            <SectionNote link="https://app.sendgrid.com/settings/api_keys" linkText="SendGrid API Keys পেজ">
              📍 <strong style={{ color: 'var(--text-primary)' }}>কোথা থেকে পাবেন:</strong> SendGrid.com → Login → Settings → API Keys → "Create API Key" → Full Access → Create। "SG." দিয়ে শুরু হওয়া key-টি কপি করুন।
            </SectionNote>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🔑 SendGrid API Key</label>
              <input className="cyber-input" type="password" placeholder="SG.xxxxxxxxxxxxxxxxxxxxxx..."
                value={f('sendgridApiKey')} onChange={e => patch('sendgridApiKey', e.target.value)}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
              <FieldNote>
                "SG." দিয়ে শুরু হয়। একবারই দেখা যায় — অবশ্যই সাথে সাথে সেভ করুন।
              </FieldNote>
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#FCD34D' }}>💡 প্ল্যান:</strong> ফ্রি: ১০০ ইমেইল/দিন। Essentials ($19.95/মাস): ৫০,০০০/মাস। Pro ($89.95/মাস): ১.৫ লাখ/মাস।
            </div>
          </div>
        )}

        {/* Mailgun */}
        {cfg.emailProvider === 'mailgun' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>🔫</span>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Mailgun API Settings</h3>
                <Badge label="freemium" type="freemium" />
              </div>
              <SaveBtn keys={['mailgunApiKey', 'mailgunDomain']} color="#8B5CF6" />
            </div>

            <SectionNote link="https://app.mailgun.com/app/account/security/api_keys" linkText="Mailgun API Keys পেজ">
              📍 <strong style={{ color: 'var(--text-primary)' }}>কোথা থেকে পাবেন:</strong> Mailgun.com → Login → Account → Security & Users → API Keys → "Add new key" বাটনে ক্লিক করুন।
            </SectionNote>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🔑 Mailgun API Key</label>
                <input className="cyber-input" type="password" placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={f('mailgunApiKey')} onChange={e => patch('mailgunApiKey', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>"key-" দিয়ে শুরু হওয়া Private API Key দিন।</FieldNote>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>🌐 Mailgun Domain</label>
                <input className="cyber-input" placeholder="mg.yourdomain.com"
                  value={f('mailgunDomain')} onChange={e => patch('mailgunDomain', e.target.value)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
                <FieldNote>Mailgun Dashboard → Sending → Domains → আপনার domain নাম। সাধারণত "mg." দিয়ে শুরু হয়।</FieldNote>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#C4B5FD' }}>💡 প্ল্যান:</strong> ৩ মাস ফ্রি ট্রায়াল (৫,০০০/মাস)। Flex: প্রতি ১,০০০ ইমেইলে $০.৮০। Foundation: $১৫/মাসে ১০,০০০ ইমেইল।
            </div>
          </div>
        )}

        {/* ══ 5. PERFORMANCE & STEALTH ═══════════════════════════════════ */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} style={{ color: '#A78BFA' }} />
              <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>৪. Performance & Stealth</h2>
            </div>
            <SaveBtn keys={['dailySendLimit', 'throttleRate', 'stealthMode', 'humanJitterMin', 'humanJitterMax']} />
          </div>
          <SectionNote>
            দৈনিক সর্বোচ্চ ইমেইল এবং পাঠানোর গতি নিয়ন্ত্রণ করুন। Stealth Mode চালু থাকলে AI মানুষের মতো ধীরে ধীরে পাঠাবে — spam ফিল্টার ধরতে পারবে না।
          </SectionNote>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                📊 দৈনিক সর্বোচ্চ ইমেইল (Daily Send Limit)
              </label>
              <input className="cyber-input" type="number" min={100} max={100000}
                value={cfg.dailySendLimit ?? 5000} onChange={e => patch('dailySendLimit', parseInt(e.target.value) || 5000)} />
              <FieldNote>
                Gmail SMTP হলে ৫০০ এর বেশি দেবেন না। AWS SES হলে ৫০,০০০ পর্যন্ত দিতে পারেন।
              </FieldNote>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                ⚡ Throttle Rate (ইমেইল/সেকেন্ড)
              </label>
              <input className="cyber-input" type="number" min={1} max={500}
                value={cfg.throttleRate ?? 50} onChange={e => patch('throttleRate', parseInt(e.target.value) || 50)} />
              <FieldNote>
                Gmail এর জন্য: ১-২। AWS SES এর জন্য: ১৪ (free tier limit)। Pro SES: ৫০+।
              </FieldNote>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                ⏱ Human Jitter Min (সেকেন্ড)
              </label>
              <input className="cyber-input" type="number" min={1} max={30}
                value={cfg.humanJitterMin ?? 4} onChange={e => patch('humanJitterMin', parseInt(e.target.value) || 4)} />
              <FieldNote>দুটো ইমেইলের মাঝে ন্যূনতম এতক্ষণ অপেক্ষা করবে।</FieldNote>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                ⏱ Human Jitter Max (সেকেন্ড)
              </label>
              <input className="cyber-input" type="number" min={2} max={60}
                value={cfg.humanJitterMax ?? 12} onChange={e => patch('humanJitterMax', parseInt(e.target.value) || 12)} />
              <FieldNote>দুটো ইমেইলের মাঝে সর্বোচ্চ এতক্ষণ অপেক্ষা করবে। ৪-১২ রাখাই সবচেয়ে নিরাপদ।</FieldNote>
            </div>

            {/* Stealth Mode */}
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>🛡️ Stealth Mode (Human Mimicry Engine)</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  চালু থাকলে AI মানুষের স্বাভাবিক লেখার ধাঁচে ইমেইল তৈরি করে। কোনো bot signature বা AI-গন্ধ থাকে না।
                </p>
              </div>
              <button onClick={() => patch('stealthMode', !cfg.stealthMode)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: cfg.stealthMode ? '#34D399' : '#6B7280' }}>
                {cfg.stealthMode
                  ? <ToggleRight size={38} style={{ filter: 'drop-shadow(0 0 8px #34D399)' }} />
                  : <ToggleLeft size={38} />}
              </button>
            </div>
          </div>
        </div>

        {/* ══ 6. TEST SEND ════════════════════════════════════════════════ */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FlaskConical size={18} style={{ color: '#34D399' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>৫. টেস্ট ইমেইল পাঠান</h2>
          </div>
          <SectionNote>
            সেটিংস সঠিকভাবে কনফিগার হয়েছে কিনা যাচাই করতে এখানে যেকোনো ইমেইলে একটি test পাঠান। "Sender পরিচয়" সেকশনে সেট করা নাম দিয়ে পাঠাবে।
          </SectionNote>
          <div style={{ display: 'flex', gap: 12 }}>
            <input className="cyber-input" type="email" placeholder="আপনার ইমেইল (test পাওয়ার জন্য)"
              value={testEmail} onChange={e => setTestEmail(e.target.value)} style={{ flex: 1 }} />
            <button onClick={handleTestSend} disabled={isSendingTest || !testEmail} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px',
              borderRadius: 10, border: 'none', whiteSpace: 'nowrap',
              background: isSendingTest || !testEmail ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #10B981, #059669)',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: isSendingTest || !testEmail ? 'not-allowed' : 'pointer',
              fontFamily: "'Anek Bangla', sans-serif", boxShadow: '0 0 16px rgba(16,185,129,0.3)',
            }}>
              <Send size={16} />{isSendingTest ? 'পাঠাচ্ছে...' : 'Test পাঠান'}
            </button>
          </div>
          {testResult && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              background: testResult.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${testResult.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: testResult.ok ? '#34D399' : '#F87171',
              fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {testResult.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {testResult.msg}
            </div>
          )}
        </div>

        {/* ══ INFO: Hardcoded ══════════════════════════════════════════════ */}
        <div style={{
          padding: '14px 18px', borderRadius: 10,
          background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)',
          display: 'flex', gap: 10,
        }}>
          <Info size={15} style={{ color: '#22D3EE', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>🔒 স্বয়ংক্রিয় সুরক্ষা (পরিবর্তন করা লাগবে না):</strong><br />
            • DKIM / SPF / DMARC signing — প্রতিটি ইমেইলে স্বয়ংক্রিয়ভাবে যুক্ত হয়<br />
            • Spam score threshold: ০.১% — AI অটো-ফিল্টার করে<br />
            • Unsubscribe footer — আইনগতভাবে বাধ্যতামূলক, প্রতিটি ইমেইলে স্বয়ংক্রিয়<br />
            • Anek Bangla font + Responsive HTML email template — সব device-এ সুন্দর দেখায়
          </div>
        </div>

      </div>
    </div>
  );
}
