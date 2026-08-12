'use client';

import React, { useEffect, useState } from 'react';
import { Rocket, ArrowRight, Sparkles, Send, CheckCircle2, Zap } from 'lucide-react';

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
      const colors = ['#A78BFA', '#22D3EE', '#34D399', '#F59E0B', '#EC4899', '#60A5FA', '#F43F5E'];
      const p = Array.from({ length: 55 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 9) + 5,
      }));
      setParticles(p);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(3, 3, 10, 0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
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
              height: p.size * (Math.random() > 0.5 ? 1.2 : 2.8),
              borderRadius: Math.random() > 0.4 ? '50%' : '2px',
              backgroundColor: p.color,
              boxShadow: `0 0 12px ${p.color}`,
              animation: `confetti-fall 3.5s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
              animationDelay: `${p.delay}s`,
              opacity: 0.95,
            }}
          />
        ))}
      </div>

      {/* Animated Aura Glow Behind Card */}
      <div style={{
        position: 'absolute', width: '480px', height: '480px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(6, 182, 212, 0.2) 45%, transparent 70%)',
        animation: 'aura-pulse 4s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }} />

      {/* Main Celebration Card */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 520,
        background: 'linear-gradient(145deg, rgba(16, 16, 36, 0.96), rgba(8, 8, 20, 0.98))',
        border: '1px solid rgba(167, 139, 250, 0.45)',
        borderRadius: 28, padding: '40px 32px 32px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(139, 92, 246, 0.3), 0 0 90px rgba(6, 182, 212, 0.2)',
        overflow: 'hidden', animation: 'cardPopIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Shimmering Top Border Light */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #22D3EE, #A78BFA, transparent)',
          animation: 'border-shimmer 3s ease-in-out infinite',
        }} />

        {/* Light Beam Sweep Overlay */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '160px',
          background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.25), rgba(167, 139, 250, 0.3), transparent)',
          transform: 'skewX(-25deg)',
          animation: 'light-beam-sweep 2.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Floating 3D Rocket Icon Circle */}
        <div style={{
          position: 'relative', width: 92, height: 92, borderRadius: '50%', margin: '0 auto 22px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(6, 182, 212, 0.5)',
          animation: 'rocket-bounce 3s ease-in-out infinite',
        }}>
          {/* Energy Ring */}
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '2px dashed rgba(34, 211, 238, 0.6)',
            animation: 'spin-slow 12s linear infinite',
          }} />
          <Rocket size={46} style={{ color: '#ffffff', transform: 'rotate(-45deg)', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }} />
        </div>

        {/* Launch Tag Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 16px', borderRadius: 999,
          background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)',
          marginBottom: 16, boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)',
        }}>
          <Sparkles size={14} style={{ color: '#34D399' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', letterSpacing: '0.08em' }}>
            CAMPAIGN LAUNCH SUCCESSFUL
          </span>
        </div>

        {/* Headline — NO "ডিসপ্যাচ" word */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.35, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
          🚀 অভিনন্দন! ক্যাম্পেইন সফলভাবে পাঠানো হয়েছে!
        </h2>
        <p style={{ color: '#A78BFA', fontSize: '0.95rem', marginBottom: 26, fontWeight: 600 }}>
          "{campaignName || 'নতুন ক্যাম্পেইন'}" গ্রাহকদের ইনবক্সে পৌঁছানো শুরু করেছে।
        </p>

        {/* Stats Summary Card Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          padding: '18px 20px', borderRadius: 20,
          background: 'rgba(6, 6, 18, 0.8)',
          border: '1px solid rgba(167, 139, 250, 0.25)', marginBottom: 28,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}>
          <div style={{ textAlign: 'center', padding: '4px' }}>
            <p style={{ fontSize: '0.75rem', color: '#8888A8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 600 }}>মোট প্রাপক</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#67E8F9', margin: '4px 0 0', textShadow: '0 0 12px rgba(103,232,249,0.5)' }}>
              {recipientCount.toLocaleString()} জন
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '4px', borderLeft: '1px solid rgba(167, 139, 250, 0.18)' }}>
            <p style={{ fontSize: '0.75rem', color: '#8888A8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 600 }}>ডেলিভারি স্ট্যাটাস</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399', margin: '4px 0 0', textShadow: '0 0 12px rgba(52,211,153,0.5)' }}>
              ১০০% ইনপ্রোগ্রেস
            </p>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '15px 24px', borderRadius: 14,
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            border: '1px solid rgba(167, 139, 250, 0.5)', color: '#ffffff',
            fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 0 25px rgba(124, 58, 237, 0.5), 0 4px 15px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: "'Anek Bangla', sans-serif",
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-2px) scale(1.02)';
            el.style.boxShadow = '0 0 35px rgba(139, 92, 246, 0.7)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'none';
            el.style.boxShadow = '0 0 25px rgba(124, 58, 237, 0.5), 0 4px 15px rgba(0,0,0,0.4)';
          }}
        >
          <span>ক্যাম্পেইন লিস্টে যান</span>
          <ArrowRight size={20} />
        </button>

      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes light-beam-sweep {
          0% { left: -160px; opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes rocket-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aura-pulse {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.15); opacity: 0.85; }
        }
        @keyframes border-shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @keyframes cardPopIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
