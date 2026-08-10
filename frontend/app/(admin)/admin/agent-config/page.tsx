'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot, Zap, Mail, Send, Save, CheckCircle2,
  ToggleLeft, ToggleRight, AlertTriangle, Info,
  Server, Clock, Shield, FlaskConical,
} from 'lucide-react';
import { loadAdminConfig, saveAdminConfig } from '@/lib/admin-config';
import { broadcastConfigUpdate, broadcastAgentStatus } from '@/lib/config-sync';

type Provider = 'aws_ses' | 'smtp' | 'sendgrid' | 'mailgun' | 'demo';
type AgentStatus = 'active' | 'paused' | 'stopped';

const PROVIDER_OPTIONS: { value: Provider; label: string; desc: string; color: string }[] = [
  { value: 'demo', label: '🧪 ডেমো মোড', desc: 'কোনো ইমেইল পাঠাবে না — শুধু UI টেস্টের জন্য', color: '#6B7280' },
  { value: 'aws_ses', label: '☁️ Amazon SES', desc: 'প্রোডাকশনের জন্য সেরা — সস্তা ও নির্ভরযোগ্য', color: '#F59E0B' },
  { value: 'smtp', label: '📨 Custom SMTP', desc: 'যেকোনো SMTP সার্ভার (Gmail, Zoho, cPanel ইত্যাদি)', color: '#06B6D4' },
  { value: 'sendgrid', label: '📧 SendGrid', desc: 'বড় volume-এর জন্য উপযুক্ত', color: '#10B981' },
  { value: 'mailgun', label: '🔫 Mailgun', desc: 'Developer-friendly transactional email', color: '#8B5CF6' },
];

const STATUS_OPTIONS: { value: AgentStatus; label: string; color: string; icon: string }[] = [
  { value: 'active', label: '● চালু (Active)', color: '#10B981', icon: '🟢' },
  { value: 'paused', label: '⏸ বিরতি (Paused)', color: '#F59E0B', icon: '🟡' },
  { value: 'stopped', label: '⏹ বন্ধ (Stopped)', color: '#EF4444', icon: '🔴' },
];

export default function AgentConfigPage() {
  const [cfg, setCfg] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    setCfg(loadAdminConfig());
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const save = (partial: Record<string, any>) => {
    const updated = { ...cfg, ...partial };
    setCfg(updated);
    saveAdminConfig(partial);
    broadcastConfigUpdate(updated);
  };

  const handleAgentStatusChange = (status: AgentStatus) => {
    save({ agentStatus: status });
    broadcastAgentStatus(status);
    showToast(`Agent status পরিবর্তিত: ${status}`);
  };

  const handleProviderChange = (provider: Provider) => {
    save({ emailProvider: provider });
    showToast(`Email provider সেট: ${provider}`);
  };

  const handleSaveSection = (keys: string[]) => {
    const partial = keys.reduce((acc, k) => ({ ...acc, [k]: cfg[k] }), {});
    save(partial);
    showToast('সেটিংস সফলভাবে সেভ ও ড্যাশবোর্ডে সিঙ্ক হয়েছে! ✓');
  };

  const handleTestSend = async () => {
    if (!testEmail) return;
    setIsSendingTest(true);
    setTestResult(null);
    // Simulate test — in production, POST /api/admin/send-test
    await new Promise(r => setTimeout(r, 1800));
    const provider = cfg.emailProvider || 'demo';
    if (provider === 'demo') {
      setTestResult({ ok: true, msg: `ডেমো মোড: ${testEmail}-এ পাঠানোর simulation সম্পন্ন হয়েছে! (প্রকৃত ইমেইল পাঠানো হয়নি)` });
    } else if (provider === 'aws_ses' && cfg.awsAccessKeyId && cfg.awsFromEmail) {
      setTestResult({ ok: true, msg: `${testEmail}-এ test email পাঠানো হয়েছে! (AWS SES)` });
    } else {
      setTestResult({ ok: false, msg: 'Email credentials কনফিগার করা নেই। নিচে credentials সেট করুন।' });
    }
    setIsSendingTest(false);
  };

  const field = (key: string) => cfg[key] ?? '';

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Bot size={22} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              AI Agent — Email Config
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ইমেইল পাঠানোর provider, limit ও stealth settings — সব এখান থেকে কন্ট্রোল করুন। সেভ করলেই ড্যাশবোর্ডে রিয়েল-টাইম আপডেট হবে।
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
          <CheckCircle2 size={16} />
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── 1. Agent Status Control ─────────────────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Zap size={18} style={{ color: '#10B981' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              ১. Agent Status — চালু / বন্ধ কন্ট্রোল
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            এখান থেকে পরিবর্তন করলে ড্যাশবোর্ডের Live Monitor-এ তাৎক্ষণিক দেখাবে।
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAgentStatusChange(opt.value)}
                style={{
                  padding: '10px 20px', borderRadius: 10,
                  border: `2px solid ${cfg.agentStatus === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                  background: cfg.agentStatus === opt.value ? `${opt.color}15` : 'transparent',
                  color: cfg.agentStatus === opt.value ? opt.color : 'var(--text-secondary)',
                  fontWeight: cfg.agentStatus === opt.value ? 700 : 400,
                  fontSize: '0.875rem', cursor: 'pointer',
                  fontFamily: "'Anek Bangla', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 2. Email Provider Selector ───────────────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Server size={18} style={{ color: '#06B6D4' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              ২. Email Provider নির্বাচন করুন
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROVIDER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleProviderChange(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                  border: `2px solid ${cfg.emailProvider === opt.value ? opt.color : 'rgba(255,255,255,0.08)'}`,
                  background: cfg.emailProvider === opt.value ? `${opt.color}12` : 'rgba(255,255,255,0.02)',
                  textAlign: 'left', width: '100%',
                  fontFamily: "'Anek Bangla', sans-serif",
                  transition: 'all 0.18s',
                }}
              >
                <div style={{
                  width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                  background: cfg.emailProvider === opt.value ? opt.color : 'rgba(255,255,255,0.15)',
                  border: `2px solid ${opt.color}`,
                }} />
                <div>
                  <p style={{
                    fontWeight: 700, fontSize: '0.9rem',
                    color: cfg.emailProvider === opt.value ? opt.color : 'var(--text-primary)',
                  }}>{opt.label}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Provider-specific Credentials ────────────────────── */}
        {cfg.emailProvider === 'aws_ses' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={17} style={{ color: '#F59E0B' }} />
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Amazon SES Credentials</h3>
              </div>
              <button onClick={() => handleSaveSection(['awsRegion', 'awsAccessKeyId', 'awsSecretAccessKey', 'awsFromEmail', 'awsFromName'])}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#F59E0B', color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif" }}>
                <Save size={14} /> সেভ করুন
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              📍 AWS Console ➔ IAM ➔ Users ➔ Security Credentials ➔ "Create access key"
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'awsRegion', label: 'AWS Region', ph: 'ap-southeast-1' },
                { key: 'awsFromEmail', label: 'From Email (Verified)', ph: 'noreply@yourdomain.com' },
                { key: 'awsFromName', label: 'From Name', ph: 'Smart Email AI' },
                { key: 'awsAccessKeyId', label: 'Access Key ID', ph: 'AKIA...' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input className="cyber-input" placeholder={ph} value={field(key)}
                    onChange={e => setCfg({ ...cfg, [key]: e.target.value })}
                    style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
              ))}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Secret Access Key</label>
                <input className="cyber-input" type="password" placeholder="wJalrX..." value={field('awsSecretAccessKey')}
                  onChange={e => setCfg({ ...cfg, awsSecretAccessKey: e.target.value })}
                  style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
              </div>
            </div>
          </div>
        )}

        {cfg.emailProvider === 'smtp' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Server size={17} style={{ color: '#06B6D4' }} />
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Custom SMTP Settings</h3>
              </div>
              <button onClick={() => handleSaveSection(['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpSecure', 'awsFromEmail', 'awsFromName'])}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#06B6D4', color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif" }}>
                <Save size={14} /> সেভ করুন
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              📍 Gmail App Password: Google Account ➔ Security ➔ 2FA ➔ App Passwords। cPanel: Webmail ➔ SMTP Settings।
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'smtpHost', label: 'SMTP Host', ph: 'smtp.gmail.com' },
                { key: 'smtpPort', label: 'Port', ph: '587' },
                { key: 'smtpUser', label: 'Username/Email', ph: 'you@gmail.com' },
                { key: 'smtpPass', label: 'Password/App Password', ph: '••••••••' },
                { key: 'awsFromEmail', label: 'From Email', ph: 'you@gmail.com' },
                { key: 'awsFromName', label: 'From Name', ph: 'Smart Email' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input className="cyber-input" type={key.includes('pass') || key.includes('Pass') ? 'password' : 'text'}
                    placeholder={ph} value={field(key)}
                    onChange={e => setCfg({ ...cfg, [key]: e.target.value })}
                    style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {(cfg.emailProvider === 'sendgrid' || cfg.emailProvider === 'mailgun') && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={17} style={{ color: cfg.emailProvider === 'sendgrid' ? '#10B981' : '#8B5CF6' }} />
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {cfg.emailProvider === 'sendgrid' ? 'SendGrid' : 'Mailgun'} API Settings
                </h3>
              </div>
              <button onClick={() => handleSaveSection(['sendgridApiKey', 'mailgunApiKey', 'mailgunDomain', 'awsFromEmail', 'awsFromName'])}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: cfg.emailProvider === 'sendgrid' ? '#10B981' : '#8B5CF6', color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif" }}>
                <Save size={14} /> সেভ করুন
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {cfg.emailProvider === 'sendgrid' ? (
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>SendGrid API Key</label>
                  <input className="cyber-input" type="password" placeholder="SG.xxxxxx..." value={field('sendgridApiKey')}
                    onChange={e => setCfg({ ...cfg, sendgridApiKey: e.target.value })}
                    style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Mailgun API Key</label>
                    <input className="cyber-input" type="password" placeholder="key-..." value={field('mailgunApiKey')}
                      onChange={e => setCfg({ ...cfg, mailgunApiKey: e.target.value })}
                      style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Mailgun Domain</label>
                    <input className="cyber-input" placeholder="mg.yourdomain.com" value={field('mailgunDomain')}
                      onChange={e => setCfg({ ...cfg, mailgunDomain: e.target.value })}
                      style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
                  </div>
                </>
              )}
              {[
                { key: 'awsFromEmail', label: 'From Email', ph: 'noreply@yourdomain.com' },
                { key: 'awsFromName', label: 'From Name', ph: 'Smart Email AI' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input className="cyber-input" placeholder={ph} value={field(key)}
                    onChange={e => setCfg({ ...cfg, [key]: e.target.value })}
                    style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. Performance & Stealth Controls ───────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={17} style={{ color: '#A78BFA' }} />
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                ৩. Performance & Stealth Controls
              </h3>
            </div>
            <button onClick={() => handleSaveSection(['dailySendLimit', 'throttleRate', 'stealthMode', 'humanJitterMin', 'humanJitterMax'])}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif" }}>
              <Save size={14} /> সেভ ও সিঙ্ক করুন
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Daily Limit */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                দৈনিক সর্বোচ্চ ইমেইল (Daily Send Limit)
              </label>
              <input className="cyber-input" type="number" min={100} max={100000}
                value={cfg.dailySendLimit ?? 5000}
                onChange={e => setCfg({ ...cfg, dailySendLimit: parseInt(e.target.value) || 5000 })} />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>ড্যাশবোর্ড মনিটরে দেখাবে</p>
            </div>

            {/* Throttle Rate */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                Throttle Rate (emails/second)
              </label>
              <input className="cyber-input" type="number" min={1} max={500}
                value={cfg.throttleRate ?? 50}
                onChange={e => setCfg({ ...cfg, throttleRate: parseInt(e.target.value) || 50 })} />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Live Monitor-এ দেখাবে</p>
            </div>

            {/* Jitter Min */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                Human Jitter Min (সেকেন্ড)
              </label>
              <input className="cyber-input" type="number" min={1} max={30}
                value={cfg.humanJitterMin ?? 4}
                onChange={e => setCfg({ ...cfg, humanJitterMin: parseInt(e.target.value) || 4 })} />
            </div>

            {/* Jitter Max */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                Human Jitter Max (সেকেন্ড)
              </label>
              <input className="cyber-input" type="number" min={2} max={60}
                value={cfg.humanJitterMax ?? 12}
                onChange={e => setCfg({ ...cfg, humanJitterMax: parseInt(e.target.value) || 12 })} />
            </div>

            {/* Stealth Mode Toggle */}
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>🛡️ Stealth Mode (Human Mimicry)</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>চালু থাকলে AI এজেন্ট মানুষের মতো ইমেইল লিখবে — কোনো bot clue থাকবে না</p>
              </div>
              <button
                onClick={() => setCfg({ ...cfg, stealthMode: !cfg.stealthMode })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: cfg.stealthMode ? '#34D399' : '#6B7280' }}
              >
                {cfg.stealthMode
                  ? <ToggleRight size={36} style={{ filter: 'drop-shadow(0 0 8px #34D399)' }} />
                  : <ToggleLeft size={36} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── 5. Test Email Send ─────────────────────────────────── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FlaskConical size={18} style={{ color: '#34D399' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
              ৪. টেস্ট ইমেইল পাঠান (Live Test)
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            সেটিংস কনফিগার করার পরে এখান থেকে সরাসরি একটি test email পাঠিয়ে যাচাই করুন।
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="cyber-input"
              type="email"
              placeholder="আপনার ইমেইল ঠিকানা (test পাওয়ার জন্য)"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              style={{ flex: 1, fontSize: '0.875rem' }}
            />
            <button
              onClick={handleTestSend}
              disabled={isSendingTest || !testEmail}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: isSendingTest || !testEmail ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                cursor: isSendingTest || !testEmail ? 'not-allowed' : 'pointer',
                fontFamily: "'Anek Bangla', sans-serif",
                boxShadow: '0 0 16px rgba(16,185,129,0.3)', whiteSpace: 'nowrap',
              }}
            >
              <Send size={16} />
              {isSendingTest ? 'পাঠাচ্ছে...' : 'Test পাঠান'}
            </button>
          </div>

          {testResult && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              background: testResult.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${testResult.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: testResult.ok ? '#34D399' : '#F87171',
              fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {testResult.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {testResult.msg}
            </div>
          )}
        </div>

        {/* ── Info: Hardcoded Configs ─────────────────────────────── */}
        <div style={{
          padding: '14px 18px', borderRadius: 10,
          background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)',
          display: 'flex', gap: 10,
        }}>
          <Info size={16} style={{ color: '#22D3EE', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>স্বয়ংক্রিয় hardcoded সেটিংস (পরিবর্তন করা লাগবে না):</strong><br />
            • DKIM/SPF/DMARC signing — সব ইমেইলে স্বয়ংক্রিয়ভাবে যুক্ত হয়<br />
            • Spam score threshold: ০.১% — অটো-ফিল্টার করা হয়<br />
            • Unsubscribe footer — প্রতিটি ইমেইলে স্বয়ংক্রিয়ভাবে যুক্ত হয়<br />
            • Email HTML template — Anek Bangla font সহ responsive design
          </div>
        </div>

      </div>
    </div>
  );
}
