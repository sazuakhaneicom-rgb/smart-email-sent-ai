'use client';

import { useState } from 'react';
import { UserPlus, Upload, Search, Users, InboxIcon } from 'lucide-react';
import Link from 'next/link';

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const contacts: any[] = [];

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            কন্টাক্টসমূহ
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            আপনার সব contact এক জায়গায়
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/contacts/import" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 10,
            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
            color: 'var(--neon-cyan)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
          }}>
            <Upload size={16} />
            CSV ইমপোর্ট
          </Link>
          <Link href="/contacts" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
          }}>
            <UserPlus size={16} />
            Contact যোগ করুন
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Contact খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', paddingLeft: 38, paddingRight: 16, height: 42,
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.875rem',
            fontFamily: "'Anek Bangla', sans-serif",
          }}
        />
      </div>

      {/* Stat row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        {[
          { label: 'মোট Contact', value: '০', color: '#8B5CF6' },
          { label: 'সাবস্ক্রাইব', value: '০', color: '#10B981' },
          { label: 'আনসাবস্ক্রাইব', value: '০', color: '#F59E0B' },
          { label: 'বাউন্সড', value: '০', color: '#F87171' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 12, padding: '16px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color, marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        <div style={{
          padding: '80px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', gap: 20,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(124,58,237,0.1))',
            border: '1px solid rgba(6,182,212,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={32} style={{ color: 'var(--neon-cyan)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              এখনো কোনো Contact নেই
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400 }}>
              CSV file থেকে contact import করুন অথবা manually যোগ করুন।
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/contacts/import" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', textDecoration: 'none', fontWeight: 700,
            }}>
              <Upload size={16} />
              CSV ইমপোর্ট করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
