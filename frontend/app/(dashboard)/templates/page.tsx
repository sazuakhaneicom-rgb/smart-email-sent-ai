'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Pencil, Trash2, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

import { SYSTEM_STARTER_TEMPLATES } from '@/lib/system-templates';

function loadTemplates(userId: string): Template[] {
  if (typeof window === 'undefined') return SYSTEM_STARTER_TEMPLATES;
  try {
    const raw = localStorage.getItem(`templates_${userId}`);
    const userList: Template[] = raw ? JSON.parse(raw) : [];
    
    const combined = [...userList];
    SYSTEM_STARTER_TEMPLATES.forEach(sysTpl => {
      if (!combined.some(t => t.id === sysTpl.id)) {
        combined.push(sysTpl);
      }
    });
    return combined;
  } catch { return SYSTEM_STARTER_TEMPLATES; }
}

function deleteTemplate(userId: string, id: string): Template[] {
  const existing = loadTemplates(userId);
  const updated = existing.filter(t => t.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(`templates_${userId}`, JSON.stringify(updated));
  }
  return updated;
}

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';
  const router = useRouter();

  useEffect(() => {
    setTemplates(loadTemplates(userId));
  }, [userId]);

  const handleDelete = (id: string) => {
    if (!confirm('এই template মুছে ফেলবেন?')) return;
    const updated = deleteTemplate(userId, id);
    setTemplates(updated);
  };

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Email Template</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>সুন্দর email template ডিজাইন করুন</p>
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
            fontFamily: "'Anek Bangla', sans-serif", boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Templates Grid or Empty */}
      {filtered.length === 0 ? (
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
              {search ? 'কোনো Template পাওয়া যায়নি' : 'এখনো কোনো Template নেই'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400 }}>
              {search ? 'অন্য শব্দে খোঁজ করুন।' : 'আপনার প্রথম email template তৈরি করুন। একটি template দিয়ে বারবার সুন্দর email পাঠান।'}
            </p>
          </div>
          {!search && (
            <Link href="/templates/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', textDecoration: 'none', fontWeight: 700,
            }}>
              <Plus size={16} />
              প্রথম Template তৈরি করুন
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(template => (
            <div key={template.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.3)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(139,92,246,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={18} style={{ color: '#10B981' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href={`/templates/editor?id=${template.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                    color: 'var(--neon-purple-bright)', textDecoration: 'none',
                  }}>
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#F87171', cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 4 }}>{template.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>📧 {template.subject}</p>
                <p style={{
                  fontSize: '0.78rem', color: 'var(--text-muted)',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {template.body}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatDate(template.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
