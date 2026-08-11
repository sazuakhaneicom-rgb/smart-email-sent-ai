'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Rocket, ArrowRight, Sparkles, Send, Award } from 'lucide-react';
import Link from 'next/link';

interface CelebrationModalProps {
  isOpen: boolean;
  campaignName: string;
  recipientCount: number;
  onClose: () => void;
}

export function CelebrationModal({ isOpen, campaignName, recipientCount, onClose }: CelebrationModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ['#7C3AED', '#06B6D4', '#34D399', '#F59E0B', '#EC4899', '#60A5FA'];
      const p = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 10) + 6,
      }));
      setParticles(p);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(3, 3, 7, 0.88)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      fontFamily: "'Anek Bangla', sans-serif",
    }}>

      {/* Falling Confetti Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: '-5%',
              left: `${p.left}%`,
              width: p.size,
              height: p.size * (Math.random() > 0.5 ? 1 : 2.5),
              borderRadius: Math.random() > 0.5 ? '50%' : '3px',
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animation: `confetti-fall 3.2s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* Main Celebration Card */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 540,
        background: 'linear-gradient(145deg, rgba(15, 15, 30, 0.95), rgba(7, 7, 15, 0.98))',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: 24, padding: '36px 28px', textAlign: 'center',
        boxShadow: '0 0 50px rgba(139, 92, 246, 0.25), 0 0 100px rgba(6, 182, 212, 0.15)',
        overflow: 'hidden', animation: 'zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Light Beam Sweep Overlay (ডান থেকে বামে আলোর রোশনাই) */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '150px',
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.35), rgba(139, 92, 246, 0.4), transparent)',
          transform: 'skewX(-25deg)',
          animation: 'light-beam-sweep 2.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Animated Rocket Badge */}
        <div style={{
          width: 84, height: 84, borderRadius: '50%', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.7), 0 0 70px rgba(6, 182, 212, 0.4)',
          animation: 'pulse-glow 2s infinite',
        }}>
          <Rocket size={42} style={{ color: '#fff', transform: 'rotate(-45deg)' }} />
        </div>

        {/* Victory Title */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: 12 }}>
          <Sparkles size={14} style={{ color: '#34D399' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', letterSpacing: '0.05em' }}>
            CAMPAIGN LAUNCH SUCCESSFUL
          </span>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>
          🎉 অভিনন্দন! ক্যাম্পেইন সফলভাবে ডিসপ্যাচ করা হয়েছে!
        </h2>
        <p style={{ color: '#A78BFA', fontSize: '0.95rem', marginBottom: 24, fontWeight: 600 }}>
          "{campaignName || 'নতুন ক্যাম্পেইন'}" গ্রাহকদের ইনবক্সে পৌঁছানো শুরু করেছে।
        </p>

        {/* Stats Summary Box */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          padding: 16, borderRadius: 16, background: 'rgba(7, 7, 15, 0.7)',
          border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: 28,
        }}>
          <div style={{ padding: 8 }}>
            <p style={{ fontSize: '0.72rem', color: '#8888A8', textTransform: 'uppercase', margin: 0 }}>মোট প্রাপক</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#67E8F9', margin: '4px 0 0' }}>
              {recipientCount.toLocaleString()} জন
            </p>
          </div>
          <div style={{ padding: 8, borderLeft: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <p style={{ fontSize: '0.72rem', color: '#8888A8', textTransform: 'uppercase', margin: 0 }}>ডেলিভারি স্ট্যাটাস</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34D399', margin: '4px 0 0' }}>
              ১০০% ইনপ্রোগ্রেস
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px 18px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', boxShadow: '0 0 20px rgba(139,92,246,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'Anek Bangla', sans-serif",
            }}
          >
            ক্যাম্পেইন লিস্টে যান <ArrowRight size={18} />
          </button>
        </div>

      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes light-beam-sweep {
          0% { left: -150px; opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); boxShadow: 0 0 35px rgba(139, 92, 246, 0.7); }
          50% { transform: scale(1.06); boxShadow: 0 0 60px rgba(6, 182, 212, 0.9); }
        }
      `}</style>
    </div>
  );
}
