'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, ArrowLeft, ArrowRight, Calendar, Send, Info,
  Sparkles, FileText, Mail, Eye, Save, AlertCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';

interface TemplateItem {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';

  const [step, setStep] = useState(1);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [body, setBody] = useState('');

  // Templates
  const [userTemplates, setUserTemplates] = useState<TemplateItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Test Email
  const [testEmailInput, setTestEmailInput] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // AI Generator Modal in Step 2
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Launch Status
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    // Load Sender info from email-config storage
    try {
      const rawCfg = localStorage.getItem(`user_email_cfg_${userId}`);
      if (rawCfg) {
        const cfg = JSON.parse(rawCfg);
        if (cfg.senderName) setSenderName(cfg.senderName);
        if (cfg.senderEmail) setSenderEmail(cfg.senderEmail);
      } else if (user) {
        setSenderName(user.name || 'স্মার্ট ইমেইল টিম');
        setSenderEmail(user.email || 'user@example.com');
      }
    } catch (e) {}

    // Load templates from localStorage
    try {
      const key = `templates_${userId}`;
      const rawTpls = localStorage.getItem(key);
      const list: TemplateItem[] = rawTpls ? JSON.parse(rawTpls) : [];
      setUserTemplates(list);
    } catch (e) {}

    // Check if redirected from AI Agent with pre-filled content
    try {
      const rawAi = sessionStorage.getItem('ai_draft_content');
      if (rawAi) {
        const parsed = JSON.parse(rawAi);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.body) setBody(parsed.body);
        sessionStorage.removeItem('ai_draft_content');
      }
    } catch (e) {}
  }, [userId, user]);

  const handleSelectTemplate = (tpl: TemplateItem) => {
    setSelectedTemplateId(tpl.id);
    setSubject(tpl.subject || subject);
    setBody(tpl.body || body);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    await new Promise(r => setTimeout(r, 1200));

    const genSubject = aiPrompt.includes('অফার')
      ? `বিশেষ উপহার! আপনার জন্য দুর্দান্ত সুযোগ`
      : `প্রিয় {{first_name}}, আপনার জন্য একটি বিশেষ ইমেইল`;

    const genBody = `আসসালামু আলাইকুম {{first_name}} ভাই/আপু,\n\n${aiPrompt}\n\nধন্যবাদ ও শুভেচ্ছা,\n${senderName || 'আপনার প্রিয় ব্র্যান্ড'}`;

    setSubject(genSubject);
    setBody(genBody);
    setIsAiGenerating(false);
    setShowAiModal(false);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailInput.trim()) return;
    setIsSendingTest(true);
    setTestResult(null);

    await new Promise(r => setTimeout(r, 1400));

    const fromName = senderName || user?.name || 'Smart Email';
    const fromAddr = senderEmail || user?.email || 'noreply@smartemail.com';

    setTestResult({
      ok: true,
      msg: `পরীক্ষামূলক ইমেইল সফলভাবে [${testEmailInput}] ঠিকানায় পাঠানো হয়েছে! (From: ${fromName} <${fromAddr}>)`,
    });
    setIsSendingTest(false);
  };

  const handleLaunchCampaign = async () => {
    setIsLaunching(true);
    await new Promise(r => setTimeout(r, 1500));

    // Save campaign to localStorage
    try {
      const key = `campaigns_${userId}`;
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];

      const newCampaign = {
        id: `cmp_${Date.now()}`,
        name: campaignName.trim() || subject || 'নতুন ক্যাম্পেইন',
        subject,
        body,
        senderName: senderName || 'Smart Email Team',
        senderEmail: senderEmail || 'user@example.com',
        status: 'Sent',
        sentCount: 3456,
        openRate: '32.4%',
        clickRate: '8.1%',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify([newCampaign, ...existing]));
    } catch (e) {}

    setIsLaunching(false);
    router.push('/campaigns');
  };

  const steps = [
    { id: 1, name: 'বিস্তারিত' },
    { id: 2, name: 'কন্টেন্ট ও টেমপ্লেট' },
    { id: 3, name: 'প্রাপক নির্বাচন' },
    { id: 4, name: 'রিভিউ ও ডিসপ্যাচ' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/campaigns" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">নতুন Email Campaign</h1>
          <p className="text-sm text-gray-500">আপনার গ্রাহকদের কাছে আকর্ষণীয় ইমেইল পাঠান</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded hidden sm:block"></div>
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#111827] px-2 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.id ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 border border-gray-300 dark:border-gray-700'}`}>
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-[#7C3AED]' : 'text-gray-500'}`}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[480px] flex flex-col">
        <div className="p-8 flex-1">

          {/* ── STEP 1: Details ───────────────────────────────── */}
          {step === 1 && (
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-xl font-bold">ক্যাম্পেইনের নাম ও বিষয়</h2>

              <div>
                <label className="block text-sm font-semibold mb-1">ক্যাম্পেইনের নাম (আপনার চেনার জন্য)</label>
                <input
                  type="text"
                  placeholder="যেমন: বৈশাখী ডিসকাউন্ট অফার ২০২৬"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-semibold">Email সাবজেক্ট (ইনবক্সে যা দেখাবে)</label>
                  <span className="text-xs text-gray-500">{subject.length}/150</span>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={150}
                  placeholder="যেমন: {{first_name}}, আপনার জন্য বিশেষ উপহার!"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">প্রেরকের নাম</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="যেমন: রাহুল ফ্যাশন"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">প্রেরকের Email</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Content & Templates ───────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">ইমেইল কন্টেন্ট ও টেমপ্লেট নির্বাচন</h2>
                  <p className="text-sm text-gray-500">তৈরি করা টেমপ্লেট বেছে নিন অথবা AI দিয়ে নতুন লেখা জেনারেট করুন</p>
                </div>
                <button
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 flex items-center gap-2"
                >
                  <Sparkles size={16} /> AI দিয়ে কন্টেন্ট লিখুন
                </button>
              </div>

              {/* Saved Templates Grid */}
              <div>
                <p className="text-sm font-semibold mb-3 text-purple-600 dark:text-purple-400">আপনার সেভ করা টেমপ্লেটসমূহ ({userTemplates.length}):</p>
                {userTemplates.length === 0 ? (
                  <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
                    <p className="text-sm text-gray-500 mb-2">আপনার কোনো সেভ করা টেমপ্লেট নেই।</p>
                    <Link href="/templates/new" target="_blank" className="text-xs text-[#7C3AED] underline font-bold">
                      + নতুন টেমপ্লেট তৈরি করুন
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplateId === tpl.id ? 'border-[#7C3AED] bg-purple-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{tpl.name}</p>
                          {selectedTemplateId === tpl.id && <CheckCircle2 size={16} className="text-[#7C3AED]" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{tpl.subject || tpl.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Body Text Area */}
              <div>
                <label className="block text-sm font-semibold mb-2">ইমেইল কন্টেন্ট (Body):</label>
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="প্রিয় {{first_name}},\n\nআপনার কন্টেন্ট লিখুন..."
                  className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Recipients ─────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">প্রাপক লিস্ট নির্বাচন করুন</h2>
                <p className="text-sm text-gray-500">যাদের কাছে এই ইমেইল পাঠাতে চান</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 1, name: 'সক্রিয় গ্রাহক তালিকা', count: 9240, type: 'Customer' },
                  { id: 2, name: 'নতুন নিবন্ধিত ইউজারগণ', count: 1890, type: 'Leads' },
                ].map((list) => (
                  <label key={list.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-[#7C3AED] rounded" />
                    <div className="flex-1">
                      <p className="font-bold text-base">{list.name}</p>
                      <p className="text-xs text-gray-500">{list.type} Segment</p>
                    </div>
                    <p className="font-bold text-base text-[#7C3AED]">{list.count.toLocaleString()} Contacts</p>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Review & Dispatch ─────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">ক্যাম্পেইন রিভিউ ও ডিসপ্যাচ</h2>

              {/* Review Summary */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-gray-500 font-medium">ক্যাম্পেইন নাম:</span>
                  <span className="font-bold">{campaignName || subject || 'নতুন ক্যাম্পেইন'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-gray-500 font-medium">ইমেইল সাবজেক্ট:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{subject || 'বিশেষ অফার'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-gray-500 font-medium">প্রেরক পরিচয়:</span>
                  <span className="font-bold">{senderName || 'Smart Email'} &lt;{senderEmail || 'user@email.com'}&gt;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">প্রাপক সংখ্যা:</span>
                  <span className="font-bold text-green-500">১১,১৩০ জন কন্টাক্ট</span>
                </div>
              </div>

              {/* Test Email Box */}
              <div className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-sm flex items-center gap-2"><Send size={16} className="text-[#7C3AED]" /> টেস্ট ইমেইল পাঠান</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="আপনার নিজের ইমেইল দিন (যেমন: you@gmail.com)"
                    value={testEmailInput}
                    onChange={(e) => setTestEmailInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-sm"
                  />
                  <button
                    onClick={handleSendTestEmail}
                    disabled={isSendingTest || !testEmailInput}
                    className="px-5 py-2 bg-[#7C3AED] text-white rounded-lg font-bold text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {isSendingTest ? 'পাঠাচ্ছে...' : 'টেস্ট পাঠান'}
                  </button>
                </div>
                {testResult && (
                  <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${testResult.ok ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    <CheckCircle2 size={14} /> {testResult.msg}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleLaunchCampaign}
                  disabled={isLaunching}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:opacity-90 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  {isLaunching ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" /> ক্যাম্পেইন ডিসপ্যাচ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send size={20} /> ক্যাম্পেইন এখনই পাঠোন
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} /> পিছনে
          </button>

          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              পরবর্তী ধাপ <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── AI Generator Modal inside Step 2 ───────────────── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F1E] border border-purple-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" /> AI কন্টেন্ট রাইটার
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>
            <p className="text-xs text-gray-400">আপনার অফার বা বার্তা সংক্ষেপে বলুন, AI চমৎকার ইমেইল লিখে দিবে:</p>
            <textarea
              rows={3}
              placeholder="যেমন: আমাদের ফাল্গুন কালেকশনে ১৫% অফার শুরু হয়েছে..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-3 rounded-lg border border-purple-500/20 bg-black/50 text-white text-sm focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white">বাতিল</button>
              <button
                onClick={handleAiGenerate}
                disabled={isAiGenerating || !aiPrompt.trim()}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold rounded-lg shadow-md disabled:opacity-50"
              >
                {isAiGenerating ? 'জেনারেট হচ্ছে...' : 'জেনারেট করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
