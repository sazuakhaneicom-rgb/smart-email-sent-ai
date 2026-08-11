'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authService } from '@/lib/auth-service';


export default function LoginPage() {
  const router = useRouter();
  const { setUser, setWorkspaces, setCurrentWorkspace } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { user, workspace } = await authService.loginWithEmail(email, password);
      setUser(user);
      setWorkspaces([workspace]);
      setCurrentWorkspace(workspace);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়। দয়া করে সঠিক তথ্য দিন।');
    } finally {
      setIsLoading(false);
    }
  };



  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { user, workspace } = await authService.loginWithGoogle();
      setUser(user);
      setWorkspaces([workspace]);
      setCurrentWorkspace(workspace);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Google সাইন-ইন সম্পন্ন করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-void)',
      fontFamily: "'Anek Bangla', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Top glow orb */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom-right glow */}
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '500px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* LEFT PANEL */}
      <div style={{
        display: 'none',
        flex: '0 0 50%',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
      }}
        className="md-left-panel"
      >
        {/* Use CSS for responsive */}
      </div>

      {/* Full width flex layout */}
      <div style={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* ── LEFT PANEL (desktop) */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 64px',
          borderRight: '1px solid rgba(139,92,246,0.12)',
        }} className="hidden md:flex">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.15)',
            }}>
              <Zap size={24} style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E8E8F0', lineHeight: 1.1 }}>Smart Email</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sent AI Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15,
              marginBottom: 16, color: '#E8E8F0',
            }}>
              Email Marketing<br />
              <span style={{
                background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>এখন সহজ, বাংলায়</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
              বাংলাদেশের প্রথম AI-চালিত ইমেইল মার্কেটিং প্ল্যাটফর্ম।
              সহজে campaign তৈরি করুন, পাঠান এবং ট্র্যাক করুন।
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '✦', text: 'বাংলা ইন্টারফেস ও সহজে ব্যবহারযোগ্য', color: '#A78BFA' },
              { icon: '◈', text: 'AI দিয়ে আকর্ষণীয় ইমেইল কন্টেন্ট তৈরি', color: '#22D3EE' },
              { icon: '⬡', text: 'Real-time অ্যানালিটিক্স ও বিস্তারিত রিপোর্ট', color: '#34D399' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10,
                background: 'rgba(139,92,246,0.05)',
                border: '1px solid rgba(139,92,246,0.12)',
              }}>
                <span style={{ color: f.color, fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Decorative scan line */}
          <div style={{
            marginTop: 48, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent)',
          }} />
          <p style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            POWERED BY AMAZON SES · FIREBASE · REDIS
          </p>
        </div>

        {/* ── RIGHT PANEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
        }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>



            {/* Card */}
            <div style={{
              background: 'rgba(12,12,26,0.9)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 20,
              padding: '36px 32px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(139,92,246,0.08), 0 20px 60px rgba(0,0,0,0.5)',
            }}>
              {/* Mobile logo */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28 }} className="md:hidden">
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(139,92,246,0.5)',
                }}>
                  <Zap size={18} style={{ color: '#fff' }} />
                </div>
                <span style={{ fontWeight: 800, color: '#E8E8F0', fontSize: '1.1rem' }}>Smart Email</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E8E8F0', marginBottom: 6 }}>লগইন করুন</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>আপনার ড্যাশবোর্ডে ফিরে যান</p>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleLogin}>
                {/* Email */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    ইমেইল ঠিকানা
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      className="cyber-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>পাসওয়ার্ড</label>
                    <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--neon-purple-bright)', textDecoration: 'none' }}>
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="cyber-input"
                      style={{ paddingLeft: '36px', paddingRight: '36px' }}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.25)',
                    color: '#F87171', fontSize: '0.825rem',
                  }}>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%', height: '48px',
                    background: isLoading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                    border: '1px solid rgba(139,92,246,0.5)',
                    borderRadius: 12, color: '#fff',
                    fontWeight: 700, fontSize: '1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: isLoading ? 'none' : '0 0 20px rgba(139,92,246,0.4)',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Anek Bangla', sans-serif",
                    marginTop: 4,
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin" style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      লগইন হচ্ছে...
                    </>
                  ) : (
                    <>লগইন করুন <ChevronRight size={18} /></>
                  )}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>অথবা</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  style={{
                    width: '100%', height: '44px',
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    borderRadius: 12, color: 'var(--text-primary)',
                    fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'all 0.2s ease',
                    fontFamily: "'Anek Bangla', sans-serif",
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google দিয়ে সাইনইন করুন
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                অ্যাকাউন্ট নেই?{' '}
                <Link href="/signup" style={{ color: 'var(--neon-purple-bright)', textDecoration: 'none', fontWeight: 600 }}>
                  নতুন অ্যাকাউন্ট খুলুন
                </Link>
              </div>
            </div>

            {/* Admin link */}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link href="/admin/login" style={{
                fontSize: '0.75rem', color: 'var(--text-muted)',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Shield size={12} />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
