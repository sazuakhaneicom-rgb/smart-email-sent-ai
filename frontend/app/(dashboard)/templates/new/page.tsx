'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, EyeOff, FileText, Mail, Type, AlignLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

function loadTemplates(userId: string): Template[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`templates_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTemplates(userId: string, templates: Template[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`templates_${userId}`, JSON.stringify(templates));
}

import { CLAUDE_PREMIUM_TEMPLATE } from '@/lib/system-templates';

export default function NewTemplatePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [invitationLink, setInvitationLink] = useState('https://claude.ai/login');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleLoadClaudeTemplate = () => {
    setName(CLAUDE_PREMIUM_TEMPLATE.name);
    setSubject(CLAUDE_PREMIUM_TEMPLATE.subject);
    setBody(CLAUDE_PREMIUM_TEMPLATE.body);
    setShowPreview(true);
  };

  const insertMergeTag = (tag: string) => {
    setBody(prev => prev + `{{${tag}}}`);
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('Template-এর নাম দিন।'); return; }
    if (!subject.trim()) { setError('Subject line দিন।'); return; }
    if (!body.trim()) { setError('Email body লিখুন।'); return; }
    setError('');
    setIsSaving(true);

    const newTemplate: Template = {
      id: `tpl-${Date.now().toString(36)}`,
      name: name.trim(),
      subject: subject.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = loadTemplates(userId);
    saveTemplates(userId, [...existing, newTemplate]);

    setSaved(true);
    setTimeout(() => {
      router.push('/templates');
    }, 1000);
  };

  const mergeTags = ['first_name', 'last_name', 'email', 'company'];

  const previewBody = body
    .replace(/\{\{first_name\}\}/g, 'রাহুল')
    .replace(/\{\{last_name\}\}/g, 'আহমেদ')
    .replace(/\{\{email\}\}/g, 'rahul@example.com')
    .replace(/\{\{company\}\}/g, 'আপনার কোম্পানি');

  return (
    <div style={{ fontFamily: "'Anek Bangla', sans-serif", maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 28, flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/templates" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
            color: 'var(--neon-purple-bright)', textDecoration: 'none',
          }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
              নতুন Template তৈরি
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campaign-এ ব্যবহারের জন্য email template</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleLoadClaudeTemplate}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(16,185,129,0.4)',
              color: '#34D399', cursor: 'pointer',
              fontFamily: "'Anek Bangla', sans-serif", fontWeight: 700, fontSize: '0.875rem',
            }}
            title="Claude AI Premium & Invitation Template ১-ক্লিকে লোড করুন"
          >
            🤖 Claude AI Template লোড করুন
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 16px', borderRadius: 10,
              background: showPreview ? 'rgba(6,182,212,0.15)' : 'rgba(139,92,246,0.1)',
              border: `1px solid ${showPreview ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.2)'}`,
              color: showPreview ? 'var(--neon-cyan)' : 'var(--neon-purple-bright)',
              cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", fontWeight: 600, fontSize: '0.875rem',
            }}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Preview লুকান' : 'Preview দেখুন'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || saved}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 20px', borderRadius: 10, border: 'none',
              background: saved ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', cursor: isSaving || saved ? 'not-allowed' : 'pointer',
              fontFamily: "'Anek Bangla', sans-serif", fontWeight: 700, fontSize: '0.9rem',
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {saved ? <><CheckCircle2 size={16} /> সেভ হয়েছে!</> : <><Save size={16} /> {isSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          marginBottom: 16, padding: '10px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#F87171', fontSize: '0.875rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <FileText size={16} style={{ color: 'var(--neon-purple)' }} />
              <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Template নাম</label>
            </div>
            <input
              type="text"
              placeholder="যেমন: স্বাগত ইমেইল, ঈদ অফার, নতুন পণ্য..."
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontSize: '0.95rem',
                fontFamily: "'Anek Bangla', sans-serif",
                boxSizing: 'border-box',
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>এই নামটি শুধু আপনার জন্য — প্রাপক দেখবে না।</p>
          </div>

          {/* Subject */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Mail size={16} style={{ color: 'var(--neon-cyan)' }} />
              <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Subject Line</label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>(প্রাপকের inbox-এ দেখাবে)</span>
            </div>
            <input
              type="text"
              placeholder="যেমন: {{first_name}}, আপনার জন্য বিশেষ অফার!"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontSize: '0.95rem',
                fontFamily: "'Anek Bangla', sans-serif",
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Body */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <AlignLeft size={16} style={{ color: '#10B981' }} />
              <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Email Body</label>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>মার্জ ট্যাগ:</span>
                {mergeTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => insertMergeTag(tag)}
                    style={{
                      padding: '2px 8px', borderRadius: 5, fontSize: '0.7rem',
                      background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                      color: 'var(--neon-purple-bright)', cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    {`{{${tag}}}`}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder={`প্রিয় {{first_name}},\n\nআপনার জন্য একটি বিশেষ বার্তা...\n\nধন্যবাদ,\nআপনার দল`}
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={14}
              style={{
                width: '100%', padding: '14px', borderRadius: 10,
                background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.7,
                fontFamily: "'Anek Bangla', sans-serif",
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
              💡 {'{{first_name}}'} ব্যবহার করলে প্রতিটি প্রাপকের নাম স্বয়ংক্রিয়ভাবে বসে যাবে।
            </p>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 20, position: 'sticky', top: 80, alignSelf: 'start',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Eye size={16} style={{ color: 'var(--neon-cyan)' }} />
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Live Preview</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 4 }}>(রাহুল আহমেদ হিসেবে দেখছেন)</span>
            </div>

            {/* Email preview card */}
            <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              {/* Email header */}
              <div style={{ background: '#F8F9FA', padding: '12px 16px', borderBottom: '1px solid #E8EAED' }}>
                <p style={{ fontSize: '0.75rem', color: '#5F6368', margin: '0 0 4px 0' }}>From: <strong style={{ color: '#202124' }}>আপনার নাম &lt;you@email.com&gt;</strong></p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124', margin: 0, fontFamily: "'Anek Bangla', sans-serif" }}>
                  {subject || '(Subject Line)'}
                </p>
              </div>
              {/* Email body */}
              <div style={{ padding: '20px 16px', minHeight: 200 }}>
                <div style={{
                  fontSize: '0.875rem', lineHeight: 1.8, color: '#202124',
                  fontFamily: "'Anek Bangla', sans-serif",
                  whiteSpace: 'pre-wrap',
                }}>
                  {previewBody || <span style={{ color: '#9AA0A6', fontStyle: 'italic' }}>Email body এখানে দেখাবে...</span>}
                </div>
              </div>
              {/* Unsubscribe footer */}
              <div style={{ background: '#F8F9FA', padding: '10px 16px', borderTop: '1px solid #E8EAED', textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: '#9AA0A6', margin: 0, fontFamily: "'Anek Bangla', sans-serif" }}>
                  আর ইমেইল পেতে না চাইলে <span style={{ color: '#7C3AED', textDecoration: 'underline' }}>আনসাবস্ক্রাইব করুন</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
