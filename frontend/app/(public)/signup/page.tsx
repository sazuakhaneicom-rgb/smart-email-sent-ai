'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2, Zap, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authService } from '@/lib/auth-service';

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setWorkspaces, setCurrentWorkspace } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড দুটি মেলেনি!');
      return;
    }

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setIsLoading(true);
    try {
      const { user, workspace } = await authService.signupWithEmail(formData.email, formData.password, formData.name);
      setUser(user);
      setWorkspaces([workspace]);
      setCurrentWorkspace(workspace);
      router.push('/onboarding');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { user, workspace } = await authService.loginWithGoogle();
      setUser(user);
      setWorkspaces([workspace]);
      setCurrentWorkspace(workspace);
      router.push('/onboarding');
    } catch (err: any) {
      if (err.message !== 'Google সাইন-ইন বাতিল করা হয়েছে।') {
        setError(err.message || 'Google দিয়ে রেজিস্ট্রেশন সম্পূর্ণ করা যায়নি।');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const passwordStrength = formData.password.length > 8 ? 4 : formData.password.length > 5 ? 3 : formData.password.length > 2 ? 2 : formData.password.length > 0 ? 1 : 0;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-void)',
      fontFamily: "'Anek Bangla', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Top Glow Orb */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* LEFT PANEL */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 64px',
          borderRight: '1px solid rgba(139,92,246,0.12)',
        }} className="hidden md:flex">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(139,92,246,0.5)',
            }}>
              <Zap size={24} style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E8E8F0', lineHeight: 1.1 }}>Smart Email</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sent AI Platform</p>
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15,
              marginBottom: 16, color: '#E8E8F0',
            }}>
              বিনামূল্যে<br />
              <span style={{
                background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>আজই শুরু করুন</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
              কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। কয়েক সেকেন্ডেই একাউন্ট খুলে ইমেইল ক্যাম্পেইন পাঠানো শুরু করুন।
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '✦', text: '১০০০ ফ্রি ইমেইল প্রতি মাসে', color: '#A78BFA' },
              { icon: '◈', text: 'সহজে ড্র্যাগ অ্যান্ড ড্রপ এডিটর', color: '#22D3EE' },
              { icon: '⬡', text: 'কোনো হিডেন চার্জ নেই', color: '#34D399' },
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
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
        }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div style={{
              background: 'rgba(12,12,26,0.9)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 20,
              padding: '36px 32px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(139,92,246,0.08), 0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E8E8F0', marginBottom: 6 }}>
                  নতুন অ্যাকাউন্ট খুলুন
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  আপনার ব্যবসা বাড়াতে আজই যুক্ত হোন
                </p>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={handleSignupSubmit}>
                {/* Name */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    সম্পূর্ণ নাম
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      className="cyber-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="আপনার নাম"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    ইমেইল ঠিকানা
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      className="cyber-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    পাসওয়ার্ড
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="cyber-input"
                      style={{ paddingLeft: '36px', paddingRight: '36px' }}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {/* Strength meter */}
                  {formData.password && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          style={{
                            height: 3, flex: 1, borderRadius: 2,
                            background: passwordStrength >= level
                              ? level <= 2 ? '#F87171' : level === 3 ? '#F59E0B' : '#10B981'
                              : 'rgba(139,92,246,0.1)',
                            transition: 'all 0.2s',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    পাসওয়ার্ড নিশ্চিত করুন
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="cyber-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Error message */}
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
                    marginTop: 6,
                  }}
                >
                  {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : <>অ্যাকাউন্ট তৈরি করুন <ChevronRight size={18} /></>}
                </button>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
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
                  Google দিয়ে সাইনআপ করুন
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <Link href="/login" style={{ color: 'var(--neon-purple-bright)', textDecoration: 'none', fontWeight: 600 }}>
                  লগইন করুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
