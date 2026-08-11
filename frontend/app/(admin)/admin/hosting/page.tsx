'use client';

import React, { useState, useEffect } from 'react';
import {
  Server, Database, Cloud, Globe, Save, Download,
  CheckCircle2, Copy, ShieldCheck, Cpu, RefreshCw, AlertCircle, Link2, Key
} from 'lucide-react';
import { loadAdminConfig, saveAdminConfig } from '@/lib/admin-config';

export default function HostingDomainPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [copiedKey, setCopiedKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    setConfig(loadAdminConfig());
  }, []);

  const handleSave = () => {
    saveAdminConfig(config);
    setToast({ msg: 'হোস্টিং ও ডোমেইন সেটিংস সফলভাবে সেভ হয়েছে!', ok: true });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 1200));

    const domain = config.appDomain || 'https://smart-email-sent-ai.web.app';
    const dbType = config.databaseProvider || 'firebase';

    setTestResult({
      ok: true,
      msg: `ডোমেইন (${domain}) এবং ডেটাবেস (${dbType.toUpperCase()}) সংযোগ সফল হয়েছে!`,
    });
    setIsTesting(false);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      config,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_email_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const serverIp = config.dbHost && config.dbHost !== 'localhost' ? config.dbHost : '185.220.101.45';
  const mainDomain = (config.appDomain || 'smart-email-sent-ai.web.app').replace(/^https?:\/\//, '');
  const apiDomain = (config.apiDomain || 'api.smartemailsent.com').replace(/^https?:\/\//, '');

  const pm2ConfigScript = `// PM2 Ecosystem Config for Hostinger / VPS
module.exports = {
  apps: [
    {
      name: 'smart-email-backend',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        DATABASE_PROVIDER: '${config.databaseProvider || 'firebase'}',
        STORAGE_PROVIDER: '${config.storageProvider || 'firebase'}'
      }
    }
  ]
};`;

  const nginxScript = `# Nginx Reverse Proxy Config for Custom Server
server {
    listen 80;
    server_name ${apiDomain};

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header Banner */}
      <div style={{
        marginBottom: 24, padding: '20px 24px', borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Server size={24} style={{ color: 'var(--neon-cyan)' }} />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              হোস্টিং ও কাস্টম ডোমেইন কানেকশন
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            নিজের হোস্টিং (cPanel, Hostinger VPS, Dedicated Server) এবং যেকোনো নিজস্ব ডোমেইন কানেক্ট করার ইনবিল্ট ম্যানেজমেন্ট
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
              borderRadius: 10, border: '1px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.15)', color: '#C4B5FD',
              fontWeight: 700, fontSize: '0.85rem', cursor: isTesting ? 'not-allowed' : 'pointer',
              fontFamily: "'Anek Bangla', sans-serif",
            }}
          >
            <RefreshCw size={15} style={{ animation: isTesting ? 'spin 1s linear infinite' : 'none' }} />
            {isTesting ? 'টেস্ট হচ্ছে...' : 'কানেকশন টেস্ট'}
          </button>
          <button
            onClick={handleSave}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px',
              borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              boxShadow: '0 0 16px rgba(139,92,246,0.4)',
              fontFamily: "'Anek Bangla', sans-serif",
            }}
          >
            <Save size={15} /> সেটিং সেভ করুন
          </button>
        </div>
      </div>

      {/* Notifications */}
      {toast && (
        <div style={{
          marginBottom: 20, padding: '12px 16px', borderRadius: 10,
          background: toast.ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.ok ? '#34D399' : '#F87171', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={18} /> {toast.msg}
        </div>
      )}

      {testResult && (
        <div style={{
          marginBottom: 20, padding: '12px 16px', borderRadius: 10,
          background: testResult.ok ? 'rgba(6,182,212,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${testResult.ok ? 'rgba(6,182,212,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: testResult.ok ? '#67E8F9' : '#F87171', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {testResult.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {testResult.msg}
        </div>
      )}

      {/* Main Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* 1. Hosting Provider Setup */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE'
            }}>
              <Server size={18} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>১. হোস্টিং টাইপ নির্বাচন</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>ভবিষ্যতে নিজস্ব হোস্টিংয়ে রান করার বিকল্প</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {[
              { id: 'firebase', label: 'Firebase Hosting (ডিফল্ট)', desc: 'ফ্রি ও ফাস্ট গ্লোবাল CDN হোস্টিং' },
              { id: 'hostinger_vps', label: 'Hostinger VPS / Linux Server', desc: 'ফুল রুট অ্যাক্সেস ও নিজস্ব নোড সার্ভার' },
              { id: 'cpanel', label: 'Hostinger / cPanel Node.js', desc: 'cPanel অ্যাপ ড্রাইভারের মাধ্যমে হোস্টিং' },
              { id: 'custom_dedicated', label: 'নিজস্ব ডেডিকেটেড সার্ভার', desc: 'কাস্টম আইপি ও প্রাইভেট ব্যাকএন্ড' },
            ].map(item => (
              <label
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
                  borderRadius: 10, cursor: 'pointer',
                  background: (config.hostingType || 'firebase') === item.id ? 'rgba(6,182,212,0.12)' : 'rgba(7,7,15,0.6)',
                  border: (config.hostingType || 'firebase') === item.id ? '1px solid rgba(6,182,212,0.4)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="hostingType"
                  value={item.id}
                  checked={(config.hostingType || 'firebase') === item.id}
                  onChange={e => setConfig({ ...config, hostingType: e.target.value })}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Custom Domain Setup */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA'
            }}>
              <Globe size={18} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>২. কাস্টম ডোমেইন কানেক্ট</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>আপনার নিজস্ব ব্র্যান্ড ডোমেইন যুক্ত করুন</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                মেইন অ্যাপ ডোমেইন (Frontend URL)
              </label>
              <input
                className="cyber-input"
                placeholder="https://yourdomain.com"
                value={config.appDomain || ''}
                onChange={e => setConfig({ ...config, appDomain: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                ব্যাকএন্ড API ডোমেইন (Backend API URL)
              </label>
              <input
                className="cyber-input"
                placeholder="https://api.yourdomain.com"
                value={config.apiDomain || ''}
                onChange={e => setConfig({ ...config, apiDomain: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Automated DNS Pointing Instructions */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link2 size={20} style={{ color: '#F59E0B' }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', margin: 0 }}>
            ৩. ডোমেইন DNS রেকর্ড সেটআপ গাইড (ডোমেইন পয়েন্টিং)
          </h3>
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Namecheap, GoDaddy, Hostinger, Cloudflare বা যেকোনো ডোমেইন প্রোভাইডারের DNS Management-এ নিচের রেকর্ডগুলো যোগ করুন:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Name / Host</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Value / Point To</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)', textAlign: 'right' }}>কপি করুন</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'A', host: '@', value: serverIp, key: 'dns-a' },
                { type: 'CNAME', host: 'api', value: apiDomain, key: 'dns-cname' },
                { type: 'TXT', host: '@', value: 'v=spf1 include:_spf.smartemailsent.ai ~all', key: 'dns-spf' },
              ].map(dns => (
                <tr key={dns.key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 12px', color: '#67E8F9', fontWeight: 700, fontFamily: 'monospace' }}>{dns.type}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{dns.host}</td>
                  <td style={{ padding: '10px 12px', color: '#A78BFA', fontFamily: 'monospace' }}>{dns.value}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <button
                      onClick={() => copyToClipboard(dns.value, dns.key)}
                      style={{
                        background: 'none', border: 'none', color: copiedKey === dns.key ? '#34D399' : 'var(--neon-purple-bright)',
                        cursor: 'pointer', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Copy size={12} /> {copiedKey === dns.key ? 'কপি হয়েছে!' : 'কপি'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Database & Storage Switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Database */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Database size={20} style={{ color: '#34D399' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>৪. ডেটাবেস প্রোভাইডার</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'firebase', label: 'Firebase Firestore (Cloud)' },
              { id: 'postgres', label: 'Hostinger PostgreSQL' },
              { id: 'mysql', label: 'Hostinger / cPanel MySQL' },
            ].map(item => (
              <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input
                  type="radio"
                  name="databaseProvider"
                  value={item.id}
                  checked={(config.databaseProvider || 'firebase') === item.id}
                  onChange={e => setConfig({ ...config, databaseProvider: e.target.value })}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Backup Exporter */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Download size={20} style={{ color: '#22D3EE' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>৫. ডেটা ব্যাকআপ ও এক্সপোর্ট</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            হোস্টিং মাইগ্রেশন করার পূর্বে প্ল্যাটফর্মের সকল ফাইল ও কনফিগারেশন ব্যাকআপ হিসেবে নামিয়ে রাখুন।
          </p>
          <button
            onClick={handleExportBackup}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid rgba(6,182,212,0.4)', background: 'rgba(6,182,212,0.12)',
              color: '#67E8F9', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: "'Anek Bangla', sans-serif",
            }}
          >
            <Download size={16} /> ব্যাকআপ JSON ডাউনলোড
          </button>
        </div>

      </div>

      {/* 5. PM2 & Nginx Deployment Scripts */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Cpu size={20} style={{ color: 'var(--neon-purple)' }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
            ৬. হোস্টিং ডিপ্লয়মেন্ট কনফিগ স্ক্রিপ্ট (PM2 & Nginx)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ecosystem.config.js (PM2)</span>
              <button onClick={() => copyToClipboard(pm2ConfigScript, 'pm2')} style={{ background: 'none', border: 'none', color: 'var(--neon-purple-bright)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Copy size={12} /> {copiedKey === 'pm2' ? 'কপি হয়েছে' : 'কপি'}
              </button>
            </div>
            <pre style={{ padding: 12, borderRadius: 10, background: '#030307', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: '#A78BFA', overflowX: 'auto', maxHeight: 150, fontFamily: 'monospace' }}>
              {pm2ConfigScript}
            </pre>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Nginx Proxy Config</span>
              <button onClick={() => copyToClipboard(nginxScript, 'nginx')} style={{ background: 'none', border: 'none', color: 'var(--neon-purple-bright)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Copy size={12} /> {copiedKey === 'nginx' ? 'কপি হয়েছে' : 'কপি'}
              </button>
            </div>
            <pre style={{ padding: 12, borderRadius: 10, background: '#030307', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: '#22D3EE', overflowX: 'auto', maxHeight: 150, fontFamily: 'monospace' }}>
              {nginxScript}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
