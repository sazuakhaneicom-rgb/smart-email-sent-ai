'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, EyeOff, FileText, Mail, Type, AlignLeft, CheckCircle2, Link as LinkIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import {
  CLAUDE_PREMIUM_TEMPLATE,
  CHATGPT_PREMIUM_TEMPLATE,
  GEMINI_PREMIUM_TEMPLATE,
  GROK_PREMIUM_TEMPLATE,
  MIDJOURNEY_PREMIUM_TEMPLATE,
  Template as SystemTemplate
} from '@/lib/system-templates';

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

  const loadAiPreset = (tpl: SystemTemplate) => {
    setName(tpl.name);
    setSubject(tpl.subject);
    setBody(tpl.body);
    setShowPreview(true);
  };

  const updateInvitationUrlInBody = (newUrl: string) => {
    setInvitationLink(newUrl);
    setBody(prev => {
      if (!prev) return prev;
      return prev.replace(/href="[^"]*"/g, `href="${newUrl}"`);
    });
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
    <div style={{ fontFamily: "'Anek Bangla', sans-serif", maxWidth: 1150, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
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
              নতুন AI Email Template তৈরি
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campaign-এ ব্যবহারের জন্য প্রিমিয়াম AI ইমেইল টেমপ্লেট</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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

      {/* AI Preset Quick Selector Toolbar */}
      <div style={{
        background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: 16, padding: 16, marginBottom: 24,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#C4B5FD', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} style={{ color: '#F59E0B' }} /> ১-ক্লিক AI প্রিমিয়াম ও ইনভিটেশন টেমপ্লেটসমূহ:
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ইনভিটেশন লিংক ও সাবজেক্ট কাস্টমাইজযোগ্য</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { name: '🤖 Claude AI Premium', tpl: CLAUDE_PREMIUM_TEMPLATE, color: '#34D399' },
            { name: '🚀 ChatGPT Plus & Team', tpl: CHATGPT_PREMIUM_TEMPLATE, color: '#10A37F' },
            { name: '✨ Google Gemini Advanced', tpl: GEMINI_PREMIUM_TEMPLATE, color: '#60A5FA' },
            { name: '⚡ Grok AI (xAI)', tpl: GROK_PREMIUM_TEMPLATE, color: '#E2E8F0' },
            { name: '🎨 Midjourney v6 Pro', tpl: MIDJOURNEY_PREMIUM_TEMPLATE, color: '#C084FC' },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => loadAiPreset(item.tpl)}
              style={{
                padding: '7px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.color}50`,
                color: item.color, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                fontFamily: "'Anek Bangla', sans-serif", transition: 'all 0.2s',
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Dynamic Invitation Link URL Editor Input */}
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67E8F9', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
            <LinkIcon size={14} /> ইনভিটেশন লিংক (Invitation URL):
          </label>
          <input
            type="url"
            value={invitationLink}
            onChange={e => updateInvitationUrlInBody(e.target.value)}
            placeholder="https://your-invitation-link.com"
            style={{
              flex: 1, minWidth: 280, padding: '8px 14px', borderRadius: 8,
              background: 'var(--bg-raised)', border: '1px solid rgba(6,182,212,0.4)',
              color: '#67E8F9', fontSize: '0.85rem', fontFamily: 'monospace',
            }}
          />
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
              placeholder="যেমন: Claude AI, ChatGPT Plus, Gemini Invitation..."
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>এই নামটি শুধু আপনার চেনার জন্য — প্রাপক দেখবে না।</p>
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
              placeholder="যেমন: {{first_name}}, Welcome to ChatGPT Plus!"
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
              <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Email Body / HTML</label>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ট্যাগ:</span>
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
              placeholder="Email Body / HTML কন্টেন্ট..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={16}
              style={{
                width: '100%', padding: '14px', borderRadius: 10,
                background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.6,
                fontFamily: 'monospace',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Live HTML Preview */}
        {showPreview && (
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 20, position: 'sticky', top: 80, alignSelf: 'start',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Eye size={16} style={{ color: 'var(--neon-cyan)' }} />
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Live Design Preview</h3>
            </div>

            {/* Rendered HTML Container */}
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #334155' }}>
              <div dangerouslySetInnerHTML={{ __html: previewBody }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
