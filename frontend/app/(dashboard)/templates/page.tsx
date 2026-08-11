'use client';

import { Plus, FileText, InboxIcon, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const templates: any[] = [];

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Email টেমপ্লেট
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            সুন্দর email template ডিজাইন করুন
          </p>
        </div>
        <Link href="/templates/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 10,
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
          boxShadow: '0 0 20px rgba(139,92,246,0.3)',
        }}>
          <Plus size={16} />
          নতুন Template
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Template খুঁজুন..."
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

      {/* Empty State */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: '80px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(124,58,237,0.1))',
          border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={32} style={{ color: '#10B981' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            এখনো কোনো Template নেই
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400 }}>
            আপনার প্রথম email template তৈরি করুন। একটি template দিয়ে বারবার সুন্দর email পাঠান।
          </p>
        </div>
        <Link href="/templates/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 10,
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: '#fff', textDecoration: 'none', fontWeight: 700,
        }}>
          <Plus size={16} />
          প্রথম Template তৈরি করুন
        </Link>
      </div>
    </div>
  );
}
