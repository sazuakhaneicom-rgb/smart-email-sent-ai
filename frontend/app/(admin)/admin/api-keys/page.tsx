'use client';

import React, { useState, useEffect } from 'react';
import { Key, Database, Cloud, CreditCard, Lock, Eye, EyeOff, Save, Download, CheckCircle2, HelpCircle } from 'lucide-react';
import { loadAdminConfig, saveAdminConfig } from '@/lib/admin-config';

type SectionProps = {
  title: string;
  icon: React.ElementType;
  description: string;
  fields: { key: string; label: string; placeholder?: string; type?: string; isTextArea?: boolean; note?: string }[];
  color: string;
};

export default function ApiKeysPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    setConfig(loadAdminConfig());
  }, []);

  const handleSave = (sectionKeys: string[]) => {
    const dataToSave = sectionKeys.reduce((acc, key) => ({ ...acc, [key]: config[key] }), {});
    saveAdminConfig(dataToSave);
    setToast('সেটিংস সফলভাবে সেভ হয়েছে!');
    setTimeout(() => setToast(''), 3000);
  };

  const exportEnv = () => {
    let envContent = '';
    Object.entries(config).forEach(([key, value]) => {
      envContent += `${key.toUpperCase()}=${value || ''}\n`;
    });
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.local';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections: SectionProps[] = [
    {
      title: 'Firebase Client Configuration',
      icon: Database,
      color: '#F59E0B',
      description: '📍 কোথা থেকে পাবেন: Firebase Console ➔ Project Settings ➔ General ➔ "Your apps" (Web App SDK Setup)',
      fields: [
        { key: 'firebaseApiKey', label: 'API Key', placeholder: 'AIzaSyCL3976Ydu...' },
        { key: 'firebaseAuthDomain', label: 'Auth Domain', placeholder: 'your-app.firebaseapp.com' },
        { key: 'firebaseProjectId', label: 'Project ID', placeholder: 'your-app-id' },
        { key: 'firebaseStorageBucket', label: 'Storage Bucket', placeholder: 'your-app.appspot.com' },
        { key: 'firebaseMessagingSenderId', label: 'Messaging Sender ID', placeholder: '850948404150' },
        { key: 'firebaseAppId', label: 'App ID', placeholder: '1:850948404150:web:...' },
      ]
    },
    {
      title: 'Firebase Admin SDK',
      icon: Lock,
      color: '#EF4444',
      description: '📍 কোথা থেকে পাবেন: Firebase Console ➔ Project Settings ➔ Service Accounts ➔ "Generate new private key" এ ক্লিক করে ডাউনলোডকৃত JSON ফাইল খুলুন।',
      fields: [
        { key: 'firebaseAdminProjectId', label: 'Project ID', placeholder: 'smart-email-sent-ai' },
        { key: 'firebaseAdminClientEmail', label: 'Client Email', placeholder: 'firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com' },
        { key: 'firebaseAdminPrivateKey', label: 'Private Key', isTextArea: true, placeholder: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----' },
        { key: 'firebaseAdminStorageBucket', label: 'Storage Bucket', placeholder: 'smart-email-sent-ai.firebasestorage.app' },
      ]
    },
    {
      title: 'Amazon SES (Email Dispatch)',
      icon: Cloud,
      color: '#06B6D4',
      description: '📍 কোথা থেকে পাবেন: AWS Console ➔ IAM ➔ Users ➔ Security Credentials ➔ "Create access key" এ ক্লিক করুন।',
      fields: [
        { key: 'awsRegion', label: 'AWS Region', placeholder: 'ap-southeast-1 (Singapore) / us-east-1' },
        { key: 'awsAccessKeyId', label: 'Access Key ID', placeholder: 'AKIAIOSFODNN7EXAMPLE' },
        { key: 'awsSecretAccessKey', label: 'Secret Access Key', placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' },
        { key: 'awsFromEmail', label: 'Default Sender Email', placeholder: 'noreply@yourdomain.com' },
        { key: 'awsFromName', label: 'Default Sender Name', placeholder: 'Smart Email AI' },
      ]
    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            API Keys & সিক্রেট ম্যানেজমেন্ট
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            সিস্টেমের গুরুত্বপূর্ণ ইন্টিগ্রেশন এবং থার্ড-পার্টি সার্ভিস ক্রডেনশিয়ালসমূহ
          </p>
        </div>
        <button
          onClick={exportEnv}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
            borderRadius: 10, border: '1px solid rgba(139,92,246,0.3)',
            background: 'rgba(139,92,246,0.1)', color: 'var(--neon-purple-bright)',
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s', fontFamily: "'Anek Bangla', sans-serif",
          }}
        >
          <Download size={16} /> .env.local এক্সপোর্ট
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

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sections.map(({ title, icon: Icon, description, fields, color }) => {
          const sectionKeys = fields.map(f => f.key);
          return (
            <div key={title} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                  }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{title}</h3>
                </div>
                <button
                  onClick={() => handleSave(sectionKeys)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    borderRadius: 8, border: 'none', background: color, color: '#fff',
                    fontWeight: 600, fontSize: '0.825rem', cursor: 'pointer',
                    boxShadow: `0 0 12px ${color}40`, fontFamily: "'Anek Bangla', sans-serif",
                  }}
                >
                  <Save size={14} /> সেভ করুন
                </button>
              </div>

              {/* Note / Description */}
              <div style={{
                marginBottom: 16, padding: '8px 12px', borderRadius: 8,
                background: 'rgba(7,7,15,0.6)', border: '1px solid var(--border-subtle)',
                fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <HelpCircle size={14} style={{ flexShrink: 0, color }} />
                <span>{description}</span>
              </div>

              {/* Input Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {fields.map(({ key, label, placeholder, isTextArea }) => (
                  <div key={key} style={{ gridColumn: isTextArea ? 'span 2' : 'span 1' }}>
                    <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                      {label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      {isTextArea ? (
                        <textarea
                          rows={3}
                          className="cyber-input"
                          style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}
                          placeholder={placeholder}
                          value={config[key] || ''}
                          onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                        />
                      ) : (
                        <>
                          <input
                            type={showValues[key] ? 'text' : 'password'}
                            className="cyber-input"
                            style={{ paddingRight: 36, fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}
                            placeholder={placeholder}
                            value={config[key] || ''}
                            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowValues({ ...showValues, [key]: !showValues[key] })}
                            style={{
                              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0
                            }}
                          >
                            {showValues[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
