'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { sendRealEmail } from '@/lib/email-dispatcher';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('একটি সঠি ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Try Firebase Auth Password Reset if configured
      if (auth) {
        try {
          await sendPasswordResetEmail(auth, email.trim());
        } catch (e) {
          // If user doesn't exist in Firebase Auth yet, fallback to direct email dispatch
        }
      }

      // 2. Dispatch real password reset email to inbox via Nodemailer SMTP API
      const resetLink = `https://smart-email-sent-ai.web.app/login?reset=true&email=${encodeURIComponent(email.trim())}`;
      
      const emailBody = `
        <div style="background-color: #0A0D14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
          <div style="max-width: 560px; margin: 0 auto; background: #111622; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding: 32px 24px; text-align: center; background: linear-gradient(180deg, #1D1536 0%, #111622 100%); border-bottom: 1px solid #1E293B;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #A78BFA;">🔐 পাসওয়ার্ড রিসেট সিস্টেম</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8;">Smart Email Sent AI Account Security</p>
            </div>
            <div style="padding: 28px 24px;">
              <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">প্রিয় ব্যবহারকারী,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
                আপনার <strong>Smart Email Sent AI</strong> অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার একটি অনুরোধ পাওয়া গেছে। পাসওয়ার্ড নতুন করে পরিবর্তন করতে নিচের রিসেট বাটনে ক্লিক করুন:
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 38px; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #FFFFFF; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.45);">
                  পাসওয়ার্ড রিসেট করুন (Reset Password)
                </a>
              </div>
              <p style="font-size: 12px; color: #64748B; line-height: 1.5; text-align: center;">
                যদি আপনি এই অনুরোধ না করে থাকেন, তবে এই ইমেইলটি নিরাপদে উপেক্ষা করুন। আপনার অ্যাকাউন্ট সুরক্ষিত থাকবে।
              </p>
              <div style="margin-top: 24px; border-top: 1px solid #1E293B; padding-top: 16px; text-align: center; font-size: 11px; color: #64748B;">
                © 2026 Smart Email Sent AI. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      `;

      const res = await sendRealEmail({
        to: email.trim(),
        senderName: 'Smart Email Security Team',
        senderEmail: 'support@smart-email-sent-ai.web.app',
        subject: '🔐 [Smart Email AI] আপনার পাসওয়ার্ড রিসেট লিংক',
        body: emailBody,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.message || 'ইমেইল সেন্ড হতে পারেনি। আপনার নেটওয়ার্ক চেক করুন।');
      }
    } catch (err: any) {
      setError(err.message || 'ইমেইল পাঠাতে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-950 relative overflow-hidden font-['Anek_Bangla']">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-8 z-10">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">পাসওয়ার্ড ভুলে গেছেন?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                আপনার ইমেইল দিন। আমরা সরাসরি আপনার ইনবক্সে রিসেট লিঙ্ক পাঠিয়ে দিচ্ছি।
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ইমেইল ঠিকানা</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    রিসেট ইমেইল পাঠানো হচ্ছে...
                  </>
                ) : (
                  'রিসেট লিঙ্ক পাঠান'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">রিসেট ইমেইল পাঠানো হয়েছে!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              আমরা আপনার <strong>{email}</strong> ইনবক্সে একটি পাসওয়ার্ড রিসেট লিঙ্ক সফলভাবে পাঠিয়েছি। অনুগ্রহ করে আপনার ইমেইল ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline text-sm"
            >
              পুনরায় ইমেইল পাঠাতে চান?
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
