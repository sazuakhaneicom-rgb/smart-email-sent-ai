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
    <div className="min-h-screen w-full flex bg-[var(--bg-void)] font-['Anek_Bangla'] relative overflow-x-hidden">
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
        width: '100%', maxWidth: '800px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="flex w-full min-h-screen relative z-10">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center flex-1 p-12 lg:p-16 border-r border-purple-500/10">
          <div className="flex items-center gap-3.5 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.5)]">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-gray-100 leading-tight">Smart Email</p>
              <p className="text-[11px] color-[var(--neon-cyan)] tracking-widest uppercase font-bold">Sent AI Platform</p>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-100">
              বিনামূল্যে<br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                আজই শুরু করুন
              </span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। কয়েক সেকেন্ডেই একাউন্ট খুলে ইমেইল ক্যাম্পেইন পাঠানো শুরু করুন।
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-lg">
            {[
              { icon: '✦', text: '১০০০ ফ্রি ইমেইল প্রতি মাসে', color: '#A78BFA' },
              { icon: '◈', text: 'সহজে ড্র্যাগ অ্যান্ড ড্রপ এডিটর', color: '#22D3EE' },
              { icon: '⬡', text: 'কোনো হিডেন চার্জ নেই', color: '#34D399' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <span style={{ color: f.color }} className="text-base font-bold flex-shrink-0">{f.icon}</span>
                <span className="text-gray-200 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (Mobile & Desktop Responsive) */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 w-full min-h-screen">
          <div className="w-full max-w-md my-auto py-6">

            {/* Mobile Header Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-6 md:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-gray-100 text-xl">Smart Email Sent AI</span>
            </div>

            {/* Signup Card */}
            <div className="bg-[#0C0C1A]/95 border border-purple-500/20 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.1)] w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-1">
                  নতুন অ্যাকাউন্ট খুলুন
                </h2>
                <p className="text-gray-400 text-sm">
                  আপনার ব্যবসা বাড়াতে আজই ফ্রি রেজিস্টার করুন
                </p>
              </div>

              <form className="flex flex-col gap-3.5" onSubmit={handleSignupSubmit}>
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    সম্পূর্ণ নাম
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-black/60 border border-purple-500/25 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="আপনার নাম"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    ইমেইল ঠিকানা
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="email"
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-black/60 border border-purple-500/25 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-black/60 border border-purple-500/25 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {/* Strength meter */}
                  {formData.password && (
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all"
                          style={{
                            background: passwordStrength >= level
                              ? level <= 2 ? '#F87171' : level === 3 ? '#F59E0B' : '#10B981'
                              : 'rgba(139,92,246,0.1)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-black/60 border border-purple-500/25 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold text-base rounded-xl shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : <>অ্যাকাউন্ট তৈরি করুন <ChevronRight size={18} /></>}
                </button>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full h-11 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-gray-200 font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google দিয়ে সাইনআপ করুন
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-gray-400">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold">
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
