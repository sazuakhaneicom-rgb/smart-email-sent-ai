'use client';

import React, { useState, useEffect } from 'react';
import {
  Server, Database, Cloud, Globe, Save, Download, Upload,
  CheckCircle2, Copy, FileText, ArrowRight, ShieldCheck, Cpu
} from 'lucide-react';
import { loadAdminConfig, saveAdminConfig } from '@/lib/admin-config';

export default function HostingMigrationPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [toast, setToast] = useState('');
  const [copiedScript, setCopiedScript] = useState('');

  useEffect(() => {
    setConfig(loadAdminConfig());
  }, []);

  const handleSave = () => {
    saveAdminConfig(config);
    setToast('হোস্টিং কনফিগারেশন সফলভাবে সেভ হয়েছে!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleExportData = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      config,
      contacts: [
        { id: '1', name: 'রহিম চৌধুরী', email: 'rahim@example.com', status: 'Subscribed' },
        { id: '2', name: 'করিম আহমেদ', email: 'karim@example.com', status: 'Subscribed' },
      ],
      campaigns: [
        { id: '1', name: 'বৈশাখী অফার - ২০২৬', subject: 'বৈশাখী স্পেশাল ডিসকাউন্ট!', status: 'Sent' }
      ],
      templates: [
        { id: '1', name: 'স্বাগতম টেমপ্লেট', category: 'Welcome' }
      ]
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_email_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pm2ConfigScript = `// PM2 Ecosystem Config for Hostinger VPS / cPanel Node.js App
module.exports = {
  apps: [
    {
      name: 'smart-email-backend',
      script: 'dist/index.js',
      cwd: '${config.apiDomain || 'http://localhost:5000'}',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        DATABASE_PROVIDER: '${config.databaseProvider || 'postgres'}',
        STORAGE_PROVIDER: '${config.storageProvider || 's3_hostinger'}'
      }
    }
  ]
};`;

  const nginxScript = `# Nginx Reverse Proxy Config for Hostinger VPS
server {
    listen 80;
    server_name ${config.apiDomain ? config.apiDomain.replace('http://', '').replace('https://', '') : 'api.yourdomain.com'};

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(type);
    setTimeout(() => setCopiedScript(''), 2500);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header */}
      <div style={{
        marginBottom: 24, padding: '20px 24px', borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Server size={22} style={{ color: 'var(--neon-cyan)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Hostinger & কাস্টম হোস্টিং মাইগ্রেশন হাব
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Firebase থেকে Hostinger VPS / cPanel / PostgreSQL / MySQL অথবা যেকোনো নিজস্ব সার্ভারে শিফট করার ওয়ান-স্টপ সুইচ।
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            borderRadius: 12, border: '1px solid rgba(6,182,212,0.5)',
            background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
            color: '#fff', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 0 15px rgba(6,182,212,0.3)', transition: 'all 0.2s',
            fontFamily: "'Anek Bangla', sans-serif",
          }}
        >
          <Save size={16} /> সেভ করুন
        </button>
      </div>

      {toast && (
        <div style={{
          marginBottom: 20, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          color: '#34D399', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* 1. Database Switcher */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA'
            }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>১. ডেটাবেস প্রোভাইডার নির্বাচন</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Firebase থেকে Hostinger PostgreSQL/MySQL এ সুইচ</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              { id: 'firebase', label: 'Firebase Firestore (Cloud NoSQL)', desc: 'বর্তমান ডিফল্ট ডেটাবেস' },
              { id: 'postgres', label: 'Hostinger / VPS PostgreSQL', desc: 'হাই-পারফর্মেন্স রিলেশনাল ডেটাবেস' },
              { id: 'mysql', label: 'Hostinger / cPanel MySQL / MariaDB', desc: 'কমন cPanel ও হোস্টিং ডেটাবেস' },
              { id: 'mongodb', label: 'MongoDB Atlas / Local Mongo', desc: 'NoSQL ফাইল ডেটাবেস' },
            ].map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
                  borderRadius: 10, cursor: 'pointer',
                  background: (config.databaseProvider || 'firebase') === item.id ? 'rgba(139,92,246,0.12)' : 'rgba(7,7,15,0.6)',
                  border: (config.databaseProvider || 'firebase') === item.id ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="databaseProvider"
                  value={item.id}
                  checked={(config.databaseProvider || 'firebase') === item.id}
                  onChange={(e) => setConfig({ ...config, databaseProvider: e.target.value })}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Conditional DB Inputs for Postgres / MySQL */}
          {(config.databaseProvider === 'postgres' || config.databaseProvider === 'mysql') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 10, background: 'rgba(7,7,15,0.8)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hostinger Host / IP</label>
                <input
                  className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  placeholder="localhost অথবা sql.hostinger.com"
                  value={config.dbHost || ''} onChange={(e) => setConfig({ ...config, dbHost: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Port</label>
                  <input
                    className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    placeholder="5432 / 3306"
                    value={config.dbPort || ''} onChange={(e) => setConfig({ ...config, dbPort: e.target.value })}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DB Name</label>
                  <input
                    className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    placeholder="smart_email_db"
                    value={config.dbName || ''} onChange={(e) => setConfig({ ...config, dbName: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>User</label>
                  <input
                    className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    placeholder="db_user"
                    value={config.dbUser || ''} onChange={(e) => setConfig({ ...config, dbUser: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Password</label>
                  <input
                    type="password"
                    className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    placeholder="••••••••"
                    value={config.dbPassword || ''} onChange={(e) => setConfig({ ...config, dbPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. File Storage Switcher */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE'
            }}>
              <Cloud size={18} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>২. ফাইল স্টোরেজ প্রোভাইডার</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ইমেইল ইমেজ ও অ্যাটাচমেন্ট সেভ করার স্থান</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              { id: 'firebase', label: 'Firebase Cloud Storage', desc: 'Firebase default bucket' },
              { id: 's3_hostinger', label: 'Hostinger Object Storage / S3 / DO Spaces', desc: 'Hostinger/S3 Compatible Bucket' },
              { id: 'local_disk', label: 'Server Local Disk Storage', desc: 'Hostinger Server-এর নিজস্ব লোকাল ফোল্ডার' },
            ].map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
                  borderRadius: 10, cursor: 'pointer',
                  background: (config.storageProvider || 'firebase') === item.id ? 'rgba(6,182,212,0.12)' : 'rgba(7,7,15,0.6)',
                  border: (config.storageProvider || 'firebase') === item.id ? '1px solid rgba(6,182,212,0.4)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="storageProvider"
                  value={item.id}
                  checked={(config.storageProvider || 'firebase') === item.id}
                  onChange={(e) => setConfig({ ...config, storageProvider: e.target.value })}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* S3 Settings */}
          {config.storageProvider === 's3_hostinger' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 10, background: 'rgba(7,7,15,0.8)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>S3 Endpoint URL</label>
                <input
                  className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  placeholder="https://s3.hostinger.com"
                  value={config.s3Endpoint || ''} onChange={(e) => setConfig({ ...config, s3Endpoint: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bucket Name</label>
                  <input
                    className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    placeholder="my-email-bucket"
                    value={config.s3Bucket || ''} onChange={(e) => setConfig({ ...config, s3Bucket: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Access Key</label>
                  <input
                    className="cyber-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    placeholder="Access Key"
                    value={config.s3AccessKey || ''} onChange={(e) => setConfig({ ...config, s3AccessKey: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Domain & Backup Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Custom Domains */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Globe size={20} style={{ color: '#F59E0B' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>৩. কাস্টম ডোমেইন ও API লিঙ্ক</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Frontend Domain / App URL
              </label>
              <input
                className="cyber-input"
                placeholder="https://yourdomain.com"
                value={config.appDomain || ''}
                onChange={(e) => setConfig({ ...config, appDomain: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Backend API URL
              </label>
              <input
                className="cyber-input"
                placeholder="https://api.yourdomain.com"
                value={config.apiDomain || ''}
                onChange={(e) => setConfig({ ...config, apiDomain: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 4. One-Click Backup */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Download size={20} style={{ color: '#10B981' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>৪. ওয়ান-ক্লিক ডেটা ব্যাকআপ ও এক্সপোর্ট</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Firebase ছেড়ে যেকোনো নতুন Hostinger বা নিজস্ব সার্ভারে শিফট করার আগে সব কন্টাক্ট, টেমপ্লেট ও ক্যাম্পেইন এক ক্লিকে ডাউনলোড করুন।
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleExportData}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(16,185,129,0.4)',
                background: 'rgba(16,185,129,0.12)', color: '#34D399', fontWeight: 600, fontSize: '0.85rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              <Download size={16} /> ব্যাকআপ প্যাকেজ এক্সপোর্ট
            </button>
          </div>
        </div>
      </div>

      {/* 5. Hostinger Auto-Generated Scripts */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Cpu size={20} style={{ color: 'var(--neon-purple-bright)' }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
            ৫. Hostinger VPS / cPanel ডিওপ্লয়মেন্ট স্ক্রিপ্টস
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* PM2 Script */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PM2 Config (ecosystem.config.js)</span>
              <button
                onClick={() => copyToClipboard(pm2ConfigScript, 'pm2')}
                style={{ background: 'none', border: 'none', color: copiedScript === 'pm2' ? '#34D399' : 'var(--neon-purple-bright)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Copy size={12} /> {copiedScript === 'pm2' ? 'কপি হয়েছে!' : 'কপি স্ক্রিপ্ট'}
              </button>
            </div>
            <pre style={{
              padding: 12, borderRadius: 10, background: '#030307', border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem', color: '#A78BFA', overflowX: 'auto', maxHeight: 180, fontFamily: 'JetBrains Mono, monospace'
            }}>
              {pm2ConfigScript}
            </pre>
          </div>

          {/* Nginx Script */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Nginx Proxy Config</span>
              <button
                onClick={() => copyToClipboard(nginxScript, 'nginx')}
                style={{ background: 'none', border: 'none', color: copiedScript === 'nginx' ? '#34D399' : 'var(--neon-purple-bright)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Copy size={12} /> {copiedScript === 'nginx' ? 'কপি হয়েছে!' : 'কপি স্ক্রিপ্ট'}
              </button>
            </div>
            <pre style={{
              padding: 12, borderRadius: 10, background: '#030307', border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem', color: '#22D3EE', overflowX: 'auto', maxHeight: 180, fontFamily: 'JetBrains Mono, monospace'
            }}>
              {nginxScript}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
