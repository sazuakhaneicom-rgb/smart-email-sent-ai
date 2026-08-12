'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authService } from '@/lib/auth-service';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setWorkspaces, setCurrentWorkspace, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('ইমেইল এবং পাসওয়ার্ড দিন।');
      return;
    }
    setIsLoading(true);
    try {
      const { user, workspace } = await authService.loginWithEmail(email, password);
      setUser(user);
      setWorkspaces([workspace]);
      setCurrentWorkspace(workspace);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
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
      if (err.message !== 'Google সাইন-ইন বাতিল করা হয়েছে।') {
        setError(err.message || 'Google সাইন-ইন সম্পন্ন করতে ব্যর্থ হয়েছে।');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--bg-void)] font-['Anek_Bangla'] relative overflow-x-hidden">
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
        width: '100%', maxWidth: '800px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom-right glow */}
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '100%', maxWidth: '500px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Full width flex layout */}
      <div className="flex w-full min-h-screen relative z-10">

        {/* ── LEFT PANEL (Desktop only) */}
        <div className="hidden md:flex flex-col justify-center flex-1 p-12 lg:p-16 border-r border-purple-500/10">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-10">
            <img
              src="/logo.jpg"
              alt="Smart Email Sent AI"
              className="w-12 h-12 rounded-xl object-cover border border-purple-400/40 shadow-[0_0_24px_rgba(139,92,246,0.5)] flex-shrink-0"
            />
            <div>
              <p className="text-xl font-extrabold text-gray-100 leading-tight">Smart Email</p>
              <p className="text-[11px] color-[var(--neon-cyan)] tracking-widest uppercase font-bold">Sent AI Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-100">
              Email Marketing<br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                এখন সহজ, বাংলায়
              </span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              বাংলাদেশের প্রথম AI-চালিত ইমেইল মার্কেটিং প্ল্যাটফর্ম।
              সহজে campaign তৈরি করুন, পাঠান এবং ট্র্যাক করুন।
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 max-w-lg">
            {[
              { icon: '✦', text: 'বাংলা ইন্টারফেস ও সহজে ব্যবহারযোগ্য', color: '#A78BFA' },
              { icon: '◈', text: 'AI দিয়ে আকর্ষণীয় ইমেইল কন্টেন্ট তৈরি', color: '#22D3EE' },
              { icon: '⬡', text: 'Real-time অ্যানালিটিক্স ও বিস্তারিত রিপোর্ট', color: '#34D399' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <span style={{ color: f.color }} className="text-base font-bold flex-shrink-0">{f.icon}</span>
                <span className="text-gray-200 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Decorative scan line */}
          <div className="mt-12 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <p className="mt-4 text-xs text-gray-500 tracking-widest">
            POWERED BY AMAZON SES · FIREBASE · REDIS
          </p>
        </div>

        {/* ── RIGHT PANEL (Mobile & Desktop Responsive) */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 w-full min-h-screen">
          <div className="w-full max-w-md my-auto py-6">

            {/* Mobile Header Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-6 md:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-gray-100 text-xl">Smart Email Sent AI</span>
            </div>

            {/* Mobile Responsive Login Card */}
            <div className="bg-[#0C0C1A]/95 border border-purple-500/20 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.1)] w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-1">লগইন করুন</h2>
                <p className="text-gray-400 text-sm">আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন</p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                {/* Email Input */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    ইমেইল ঠিকানা
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="email"
                      className="w-full h-12 pl-10 pr-3 rounded-xl bg-black/60 border border-purple-500/25 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-gray-300">পাসওয়ার্ড</label>
                    <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-12 pl-10 pr-10 rounded-xl bg-black/60 border border-purple-500/25 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold text-base rounded-xl shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      লগইন হচ্ছে...
                    </>
                  ) : (
                    <>লগইন করুন <ChevronRight size={18} /></>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-xs text-gray-500">অথবা</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-11 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-gray-200 font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google দিয়ে সাইনইন করুন
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-gray-400">
                অ্যাকাউন্ট নেই?{' '}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-bold">
                  নতুন অ্যাকাউন্ট খুলুন
                </Link>
              </div>
            </div>

            {/* Admin link */}
            <div className="mt-4 text-center">
              <Link href="/admin/login" className="text-xs text-gray-500 hover:text-purple-400 inline-flex items-center gap-1.5">
                <Shield size={13} />
                Admin Panel Login
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
