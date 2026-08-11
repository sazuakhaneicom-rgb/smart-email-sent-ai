'use client';

import React, { useState } from 'react';
import { SettingsNavHeader } from '@/components/layout/SettingsNavHeader';
import { Plus, CheckCircle2, AlertCircle, XCircle, Copy, ChevronDown, Globe, Check } from 'lucide-react';

interface DomainItem {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'failed';
  spf: 'verified' | 'pending' | 'failed';
  dkim: 'verified' | 'pending' | 'failed';
  dmarc: 'verified' | 'pending' | 'failed';
}

const INITIAL_DOMAINS: DomainItem[] = [
  { id: '1', name: 'smartemailsent.com', status: 'verified', spf: 'verified', dkim: 'verified', dmarc: 'verified' },
];

export default function DomainsSettingsPage() {
  const [domains, setDomains] = useState<DomainItem[]>(INITIAL_DOMAINS);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleAddDomain = () => {
    if (!newDomainInput.trim()) return;
    const item: DomainItem = {
      id: Date.now().toString(),
      name: newDomainInput.trim().toLowerCase().replace(/^https?:\/\//, ''),
      status: 'pending',
      spf: 'verified',
      dkim: 'pending',
      dmarc: 'pending',
    };
    setDomains([...domains, item]);
    setNewDomainInput('');
    setShowAddDomain(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getBadge = (st: string) => {
    if (st === 'verified') {
      return (
        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle2 size={12} /> Verified
        </span>
      );
    }
    return (
      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <AlertCircle size={12} /> Pending
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      <SettingsNavHeader />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
            সেন্ডার ডোমেইন
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            আপনার কাস্টম ডোমেইন ডিক্লেয়ার ও SPF, DKIM, DMARC অথেনটিকেশন
          </p>
        </div>
        <button
          onClick={() => setShowAddDomain(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            boxShadow: '0 0 16px rgba(139,92,246,0.3)',
          }}
        >
          <Plus size={16} /> ডোমেইন যোগ করুন
        </button>
      </div>

      {showAddDomain && (
        <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            নতুন ডোমেইন ইনপুট দিন
          </h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              className="cyber-input"
              placeholder="যেমন: mybrand.com"
              value={newDomainInput}
              onChange={e => setNewDomainInput(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <button
              onClick={handleAddDomain}
              style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              যোগ করুন
            </button>
            <button
              onClick={() => setShowAddDomain(false)}
              style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              বাতিল
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {domains.map(d => (
          <div key={d.id} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe size={18} style={{ color: 'var(--neon-cyan)' }} />
                  {d.name}
                </h3>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SPF: {getBadge(d.spf)}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DKIM: {getBadge(d.dkim)}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DMARC: {getBadge(d.dmarc)}</span>
                </div>
              </div>
              <div>
                {getBadge(d.status)}
              </div>
            </div>

            <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setExpandedDomain(expandedDomain === d.id ? null : d.id)}
                style={{
                  background: 'none', border: 'none', color: 'var(--neon-purple-bright)',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, padding: 0,
                }}
              >
                <ChevronDown size={14} style={{ transform: expandedDomain === d.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                DNS রেকর্ড দেখুন (SPF / DKIM TXT Records)
              </button>

              {expandedDomain === d.id && (
                <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TXT Record (SPF)</span>
                    <button
                      onClick={() => handleCopy('v=spf1 include:_spf.smartemailsent.ai ~all', `spf-${d.id}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {copiedIndex === `spf-${d.id}` ? <Check size={12} /> : <Copy size={12} />}
                      {copiedIndex === `spf-${d.id}` ? 'Copied' : 'Copy Value'}
                    </button>
                  </div>
                  <code style={{ fontSize: '0.78rem', color: '#A78BFA', fontFamily: 'monospace', display: 'block', wordBreak: 'break-all' }}>
                    v=spf1 include:_spf.smartemailsent.ai ~all
                  </code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
