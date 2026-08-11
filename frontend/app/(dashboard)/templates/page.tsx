'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Pencil, Trash2, Search, Clock, Eye, X, Send, Link as LinkIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { SYSTEM_STARTER_TEMPLATES } from '@/lib/system-templates';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

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
  if (typeof window === 'undefined') {
    localStorage.setItem(`templates_${userId}`, JSON.stringify(updated));
  }
  return updated;
}

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [customInviteLink, setCustomInviteLink] = useState('https://your-custom-link.com');
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

  const getRenderedBodyHtml = (rawBody: string, link: string) => {
    if (!rawBody) return '';
    return rawBody.replace(/href="[^"]*"/g, `href="${link}"`);
  };

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif", maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            AI Email Template কালেকশন
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            সকল প্রিমিয়াম AI টেমপ্লেটের লাইভ ভিজ্যুয়াল প্রিভিউ দেখুন ও ইনভিটেশন লিংক কাস্টমাইজ করুন
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
          নতুন Template তৈরি
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="AI Template খুঁজুন (যেমন: Claude, ChatGPT, Gemini)..."
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
              {search ? 'অন্য শব্দে খোঁজ করুন।' : 'আপনার প্রথম email template তৈরি করুন।'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 18,
        }}>
          {filtered.map(template => (
            <div key={template.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(139,92,246,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                  color: '#34D399', fontSize: '0.72rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Sparkles size={12} /> AI Template
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', borderRadius: 8,
                      background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                      color: '#67E8F9', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                    }}
                    title="টেমপ্লেটের ফুল ডিজাইন প্রিভিউ দেখুন"
                  >
                    <Eye size={13} /> প্রিভিউ
                  </button>
                  <Link href={`/templates/editor?id=${template.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                    color: 'var(--neon-purple-bright)', textDecoration: 'none',
                  }}>
                    <Pencil size={13} />
                  </Link>
                  {!template.id.startsWith('tpl-') && (
                    <button
                      onClick={() => handleDelete(template.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#F87171', cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 4 }}>
                  {template.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#C4B5FD', marginBottom: 8, fontWeight: 600 }}>
                  📧 Subject: {template.subject}
                </p>
                <div style={{
                  fontSize: '0.78rem', color: 'var(--text-muted)',
                  background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)',
                  maxHeight: 60, overflow: 'hidden',
                }}>
                  {template.body.replace(/<[^>]*>?/gm, '').substring(0, 110)}...
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {formatDate(template.updatedAt)}
                </span>
                <button
                  onClick={() => router.push(`/campaigns/new?templateId=${template.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Anek Bangla', sans-serif",
                  }}
                >
                  <Send size={12} /> Campaign-এ ব্যবহার করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Visual Template Preview Modal ───────────────────────── */}
      {previewTemplate && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(3, 3, 7, 0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            width: '100%', maxWidth: 720, background: '#0F0F1E',
            border: '1px solid rgba(139,92,246,0.35)', borderRadius: 20,
            padding: 24, boxShadow: '0 0 50px rgba(139,92,246,0.25)',
            maxHeight: '92vh', overflowY: 'auto',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  👁️ {previewTemplate.name} — ভিজ্যুয়াল প্রিভিউ
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#C4B5FD', margin: '4px 0 0' }}>
                  Subject: <strong>{previewTemplate.subject}</strong>
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Custom Invitation Link Bar */}
            <div style={{
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.3)',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67E8F9', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                <LinkIcon size={14} /> ইনভিটেশন লিংক লাইভ আপডেট:
              </label>
              <input
                type="url"
                value={customInviteLink}
                onChange={e => setCustomInviteLink(e.target.value)}
                placeholder="https://your-invitation-link.com"
                style={{
                  flex: 1, minWidth: 260, padding: '7px 12px', borderRadius: 8,
                  background: '#090B10', border: '1px solid rgba(6,182,212,0.4)',
                  color: '#67E8F9', fontSize: '0.82rem', fontFamily: 'monospace',
                }}
              />
            </div>

            {/* Rendered HTML Container */}
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #1E293B', marginBottom: 20 }}>
              <div dangerouslySetInnerHTML={{ __html: getRenderedBodyHtml(previewTemplate.body, customInviteLink) }} />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-raised)', color: 'var(--text-muted)', cursor: 'pointer',
                  fontFamily: "'Anek Bangla', sans-serif", fontWeight: 600, fontSize: '0.85rem',
                }}
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  const id = previewTemplate.id;
                  setPreviewTemplate(null);
                  router.push(`/campaigns/new?templateId=${id}&inviteLink=${encodeURIComponent(customInviteLink)}`);
                }}
                style={{
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer',
                  fontFamily: "'Anek Bangla', sans-serif", boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Send size={15} /> এই টেমপ্লেট নিয়ে Campaign শুরু করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
