'use client';

import React from 'react';
import { SettingsNavHeader } from '@/components/layout/SettingsNavHeader';
import { Users, Plus, Shield, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function TeamSettingsPage() {
  const { user } = useAuthStore();
  const userName = user?.name || 'ব্যবহারকারী';
  const userEmail = user?.email || 'user@example.com';
  const initials = userName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      <SettingsNavHeader />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
            টিম মেম্বারস
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ওয়ার্কস্পেসে সদস্য ও তাদের রোল ম্যানেজমেন্ট
          </p>
        </div>
        <button
          disabled
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: 'rgba(139,92,246,0.3)',
            color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.875rem', cursor: 'not-allowed',
          }}
        >
          <Plus size={16} /> টিম সদস্য যোগ করুন (Pro)
        </button>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
          সদস্য তালিকা
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>সদস্য</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>রোল</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{userName}</p>
                      <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>{userEmail}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.15)', color: '#A78BFA' }}>
                    Owner
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34D399', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} /> Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
