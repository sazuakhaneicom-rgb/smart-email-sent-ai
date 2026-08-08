'use client';

import React, { useState } from 'react';
import {
  Bot, Sparkles, Send, ShieldCheck, Zap, ArrowRight,
  TrendingUp, RefreshCw, CheckCircle2, MessageSquare, Flame, Check,
  EyeOff, UserCheck, ShieldAlert, Lock, Cpu
} from 'lucide-react';
import { useAuthStore } from '@/store';

export default function AIAgentPage() {
  const { currentWorkspace } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const [stealthMode, setStealthMode] = useState(true);
  const [randomDelay, setRandomDelay] = useState(true);
  const [antiSpamSanitizer, setAntiSpamSanitizer] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<null | {
    subject: string;
    body: string;
    targetSegment: string;
    spamScore: string;
    deliveryRate: string;
    stealthRating: string;
  }>(null);
  const [isSent, setIsSent] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedEmail(null);
    setIsSent(false);

    // Simulate AI generation process with Stealth Mimicry Engine
    await new Promise((r) => setTimeout(r, 1500));

    setGeneratedEmail({
      subject: prompt.includes('অফার')
        ? `শুভকামনা রইল! আপনার জন্য বিশেষ উপহার ও দারুণ নিউজ`
        : `হাই {{first_name}}, আপনার সাথে একটি বিষয় শেয়ার করার ছিল`,
      body: `আসসালামু আলাইকুম {{first_name}} ভাই/আপু,\n\nআশা করি ভালো আছেন। ${prompt}\n\nআপনার যদি কোনো প্রশ্ন থাকে, এই ইমেইলের রিপ্লাই দিলেই আমি সরাসরি উত্তর দিব।\n\nধন্যবাদ ও শুভেচ্ছা,\n${currentWorkspace?.name || 'স্মার্ট ইমেইল টিম'}`,
      targetSegment: 'সক্রিয় গ্রাহকগণ (৯,২৪০ কন্টাক্ট)',
      spamScore: '০.০৫% (মানবিক টোন certified)',
      deliveryRate: '৯৯.৮% (inbox guaranteed)',
      stealthRating: '১০০% মানুষের তৈরি ইমেইলের মতো (Undetectable Bot Footprint)',
    });
    setIsGenerating(false);
  };

  const handleDispatch = async () => {
    setIsSent(true);
  };

  return (
    <div style={{ maxWidth: 1150, margin: '0 auto', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Top Banner — AI Stealth Agent Highlight */}
      <div style={{
        marginBottom: 24, padding: '24px 28px', borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.12) 100%)',
        border: '1px solid rgba(139,92,246,0.35)',
        boxShadow: '0 0 30px rgba(139,92,246,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated Scan Line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)',
          top: '30%', animation: 'scan-line 3s linear infinite', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(139,92,246,0.6)', flexShrink: 0,
          }}>
            <Bot size={28} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E8E8F0', margin: 0 }}>
                🤖 AI Stealth Email Agent
              </h1>
              <span style={{
                fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                background: 'rgba(16,185,129,0.15)', color: '#34D399',
                border: '1px solid rgba(16,185,129,0.3)', letterSpacing: '0.1em',
              }}>
                ● STEALTH BOT ACTIVE (UNDETECTABLE)
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              উন্নত মানবীয় টোন ও স্টেলথ টেকনোলজির মাধ্যমে এমনভাবে ইমেইল তৈরি ও ডিসপ্যাচ করে যা গ্রাহক বা কোনো স্প্যাম ফিল্টার অটোমেটেড বট হিসেবে ধরতে পারে না।
            </p>
          </div>
        </div>

        {/* Live AI Stealth Badges */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>বট সিক্রেসি</p>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399' }}>১০০% মানবীয়</p>
          </div>
          <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(6,182,212,0.3)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ইনবক্স ডেলিভারি</p>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neon-cyan)' }}>৯৯.৮%</p>
          </div>
        </div>
      </div>

      {/* Stealth Protection Controls Bar */}
      <div className="glass-card" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={20} style={{ color: '#34D399' }} />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
            স্টেলথ ফিল্টার ও সিকিউরিটি প্রোটোকল:
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={stealthMode}
              onChange={(e) => setStealthMode(e.target.checked)}
            />
            <span>হিউম্যান রাইটিং টোন (No AI Clues)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={randomDelay}
              onChange={(e) => setRandomDelay(e.target.checked)}
            />
            <span>র্যান্ডম হিউম্যান ইন্টারভাল (৪-১২ সে. বিলম্ব)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={antiSpamSanitizer}
              onChange={(e) => setAntiSpamSanitizer(e.target.checked)}
            />
            <span>স্প্যাম ওয়ার্ড ক্লিনআপ</span>
          </label>
        </div>
      </div>

      {/* Main Grid: Left Prompt & Control / Right Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Left: AI Prompt Form */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Sparkles size={20} style={{ color: 'var(--neon-purple-bright)' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              ১. AI এজেন্টকে বার্তা বা অফার নির্দেশ দিন
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            আপনি যে বার্তা বা অফারটি কাস্টমারকে পাঠাতে চান তা সাধারণ বাংলায় লিখুন। AI এজেন্ট এটিকে সম্পূর্ণ প্রাকৃতিক ও সরাসরি ১-অন-১ মানুষের ইমেইলে রূপান্তর করবে:
          </p>

          {/* Prompt presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {[
              '🎉 নতুন প্রমোশনাল ডিসকাউন্ট',
              '🛍️ ঈদ ও বৈশাখী অফার',
              '📢 ক্লায়েন্ট ফলো-আপ ও বিজনেস আপডেট',
              '👋 নতুন কাস্টমার পার্সোনাল ওয়েলকাম'
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setPrompt(preset)}
                style={{
                  padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.2)',
                  background: 'rgba(139,92,246,0.06)', color: 'var(--text-secondary)',
                  fontSize: '0.775rem', cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {preset}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            className="cyber-input"
            style={{ marginBottom: 16, fontSize: '0.9rem' }}
            placeholder="উদাহরণ: আমাদের নতুন শীতকালীন কালেকশনে সব পোশাকে ২০% ছাড় দেওয়া হচ্ছে। অফারটি আগামী শুক্রবার পর্যন্ত চলবে।..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              width: '100%', height: '46px',
              background: isGenerating ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              border: '1px solid rgba(139,92,246,0.5)',
              borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              fontFamily: "'Anek Bangla', sans-serif",
            }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                AI এজেন্ট স্টেলথ কন্টেন্ট তৈরি করছে...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                AI এজেন্ট দিয়ে ইমেইল জেনারেট করুন
              </>
            )}
          </button>
        </div>

        {/* Right: AI Output & Dispatch Center */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Zap size={20} style={{ color: 'var(--neon-cyan)' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              ২. স্টেলথ ইমেইল প্রিভিউ ও ডিসপ্যাচ
            </h3>
          </div>

          {!generatedEmail ? (
            <div style={{
              flex: 1, minHeight: 220, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              border: '1px dashed rgba(139,92,246,0.2)', borderRadius: 12, padding: 20,
            }}>
              <Bot size={40} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                বামপাশে বার্তা লিখে "AI এজেন্ট দিয়ে ইমেইল জেনারেট করুন" বাটনে ক্লিক করুন।
              </p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Subject */}
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(7,7,15,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>সাবজেক্ট লাইন (প্রাকৃতিক ও হিউম্যান টোন)</p>
                  <span style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 600 }}>✔ No Bot Clues</span>
                </div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{generatedEmail.subject}</p>
              </div>

              {/* Body */}
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(7,7,15,0.8)', border: '1px solid rgba(139,92,246,0.2)', flex: 1 }}>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>ইমেইল কন্টেন্ট (১-অন-১ মানুষের লেখার ন্যায়)</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                  {generatedEmail.body}
                </p>
              </div>

              {/* Meta stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>🎯 প্রাপক: <strong style={{ color: 'var(--neon-purple-bright)' }}>{generatedEmail.targetSegment}</strong></span>
                <span>🛡️ স্টেলথ রেটিং: <strong style={{ color: '#34D399' }}>১০০% Undetectable</strong></span>
              </div>

              {/* Send Button */}
              {isSent ? (
                <div style={{
                  padding: '12px', borderRadius: 12, background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.4)', color: '#34D399',
                  textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <CheckCircle2 size={18} />
                  AI এজেন্ট স্টেলথ মোডে র্যান্ডম হিউম্যান বিহেভিয়ারে ইমেইল পাঠানো শুরু করেছে!
                </div>
              ) : (
                <button
                  onClick={handleDispatch}
                  style={{
                    width: '100%', height: '46px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: '1px solid rgba(16,185,129,0.5)',
                    borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                    fontFamily: "'Anek Bangla', sans-serif",
                  }}
                >
                  <Send size={18} />
                  AI এজেন্ট দিয়ে স্টেলথ মোডে ইমেইল ডিসপ্যাচ করুন
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* 4 Pillars of Stealth AI Agent */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { title: '🤖 Human Mimicry', desc: 'কোনো মেকানিক্যাল AI শব্দ ব্যবহার করে না, স্বাভাবিক ১-অন-১ টোনে লেখে।', icon: UserCheck, color: '#8B5CF6' },
          { title: '⏱️ Jitter Interval', desc: 'একসাথে সব না পাঠিয়ে মানুষের মতো ৪-১২ সেকেন্ড র্যান্ডম বিরতি দিয়ে পাঠায়।', icon: Zap, color: '#06B6D4' },
          { title: '🛡️ Footprint Eraser', desc: 'অটো-বট হেডার ও স্প্যাম সিগন্যাল মুছে আসল ব্যক্তির ডোমেইন থেকে ইমেইল দেখায়।', icon: EyeOff, color: '#10B981' },
          { title: '🔒 Certified DKIM/SPF', desc: 'জিফমেইল ও আউটলুক ইনবক্সে সরাসরি প্রাইমারি ইনবক্সে পৌঁছানো নিশ্চিত করে।', icon: ShieldCheck, color: '#F59E0B' },
        ].map(({ title, desc, icon: Icon, color }) => (
          <div key={title} className="glass-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: `${color}15`,
              border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color, flexShrink: 0,
            }}>
              <Icon size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
