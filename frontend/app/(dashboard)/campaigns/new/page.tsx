'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, ArrowLeft, ArrowRight, Calendar, Send, Info,
  Sparkles, FileText, Mail, Eye, Save, AlertCircle, RefreshCw, Upload, Users,
  ClipboardList, FileSpreadsheet, Plus, X, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { sendRealEmail } from '@/lib/email-dispatcher';
import { CelebrationModal } from '@/components/ui/CelebrationModal';
import {
  SYSTEM_STARTER_TEMPLATES,
  CLAUDE_PREMIUM_TEMPLATE,
  CHATGPT_PREMIUM_TEMPLATE,
  GEMINI_PREMIUM_TEMPLATE,
  GROK_PREMIUM_TEMPLATE,
  MIDJOURNEY_PREMIUM_TEMPLATE
} from '@/lib/system-templates';

interface TemplateItem {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt?: string;
}

function extractEmailsFromText(text: string): string[] {
  if (!text) return [];
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(regex) || [];
  return Array.from(new Set(matches.map(e => e.toLowerCase())));
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';

  // Stepper State
  const [step, setStep] = useState(1);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState(CLAUDE_PREMIUM_TEMPLATE.subject);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [body, setBody] = useState(CLAUDE_PREMIUM_TEMPLATE.body);
  const [invitationUrl, setInvitationUrl] = useState('https://claude.ai/login');

  // Real User Contacts & Templates
  const [userContacts, setUserContacts] = useState<any[]>([]);
  const [useSavedContacts, setUseSavedContacts] = useState(true);

  // Manual & File Upload Recipients
  const [recipientTab, setRecipientTab] = useState<'saved' | 'manual' | 'file'>('manual');
  const [manualText, setManualText] = useState('');
  const [manualChips, setManualChips] = useState<string[]>([]);
  const [chipInput, setChipInput] = useState('');
  const [invalidEmailError, setInvalidEmailError] = useState<string | null>(null);
  const [showRawTextarea, setShowRawTextarea] = useState(false);

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileEmails, setUploadedFileEmails] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [userTemplates, setUserTemplates] = useState<TemplateItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(CLAUDE_PREMIUM_TEMPLATE.id);

  // Test Email
  const [testEmailInput, setTestEmailInput] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // AI Generator Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Launch & Celebration Status
  const [isLaunching, setIsLaunching] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Validation helpers for email chips
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const addEmailChip = (value: string) => {
    const trimmed = value.trim().toLowerCase().replace(/[,;\s]+$/, '');
    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      setInvalidEmailError(`❌ "${trimmed}" একটি অকার্যকর ইমেইল ঠিকানা! সঠিক ফরম্যাট দিন (যেমন: name@domain.com)`);
      return;
    }

    setInvalidEmailError(null);
    if (!manualChips.includes(trimmed)) {
      setManualChips(prev => [...prev, trimmed]);
    }
    setChipInput('');
  };

  const handleChipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' ', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addEmailChip(chipInput);
    }
  };

  const handlePasteEmails = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;

    const extracted = extractEmailsFromText(text);
    if (extracted.length > 0) {
      e.preventDefault();
      setManualChips(prev => Array.from(new Set([...prev, ...extracted])));
      setChipInput('');
      setInvalidEmailError(null);
    }
  };

  const removeChip = (emailToRemove: string) => {
    setManualChips(prev => prev.filter(email => email !== emailToRemove));
  };

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

    // Load templates from localStorage + system templates
    try {
      const key = `templates_${userId}`;
      const rawTpls = localStorage.getItem(key);
      const list: TemplateItem[] = rawTpls ? JSON.parse(rawTpls) : [];
      const combined = [...list];
      SYSTEM_STARTER_TEMPLATES.forEach(sysTpl => {
        if (!combined.some(t => t.id === sysTpl.id)) {
          combined.push(sysTpl);
        }
      });
      setUserTemplates(combined);
    } catch (e) {
      setUserTemplates(SYSTEM_STARTER_TEMPLATES);
    }

    // Load user contacts from localStorage
    try {
      const rawCons = localStorage.getItem(`contacts_${userId}`);
      if (rawCons) {
        const parsed = JSON.parse(rawCons);
        const arr = Array.isArray(parsed) ? parsed : [];
        setUserContacts(arr);
        if (arr.length > 0) setRecipientTab('saved');
      }
    } catch (e) {}

    // Check if redirected from /templates with prebuilt ID & link
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTplId = params.get('templateId');
      const urlInvite = params.get('inviteLink');

      if (urlTplId) {
        const found = SYSTEM_STARTER_TEMPLATES.find(t => t.id === urlTplId);
        if (found) {
          setSelectedTemplateId(found.id);
          setSubject(found.subject);
          let b = found.body;
          if (urlInvite) {
            b = b.replace(/href="[^"]*"/g, `href="${urlInvite}"`);
            setInvitationUrl(urlInvite);
          }
          setBody(b);
        }
      }
    }
  }, [userId, user]);

  const parsedManualEmails = Array.from(
    new Set([...manualChips, ...extractEmailsFromText(manualText)])
  );

  // Total calculated unique recipients
  const getAllRecipients = () => {
    const emails = new Set<string>();

    if (useSavedContacts) {
      userContacts.forEach(c => {
        if (c.email) emails.add(c.email.toLowerCase());
      });
    }

    if (recipientTab === 'manual') {
      parsedManualEmails.forEach(e => emails.add(e.toLowerCase()));
    } else if (recipientTab === 'file') {
      uploadedFileEmails.forEach(e => emails.add(e.toLowerCase()));
    }

    return Array.from(emails);
  };

  const allRecipients = getAllRecipients();

  const handleSelectTemplate = (tpl: TemplateItem) => {
    setSelectedTemplateId(tpl.id);
    setSubject(tpl.subject);
    if (!campaignName) setCampaignName(tpl.name);
    let updatedBody = tpl.body;
    if (invitationUrl) {
      updatedBody = updatedBody.replace(/href="[^"]*"/g, `href="${invitationUrl}"`);
    }
    setBody(updatedBody);
  };

  const handleUpdateInvitationUrl = (url: string) => {
    setInvitationUrl(url);
    setBody(prev => {
      if (!prev) return prev;
      return prev.replace(/href="[^"]*"/g, `href="${url}"`);
    });
  };

  // Handle CSV/TXT File Upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const emails = extractEmailsFromText(text);
        setUploadedFileEmails(emails);
      }
    };
    reader.readAsText(file);
  };

  // AI Content Generator
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    await new Promise(r => setTimeout(r, 1200));

    const generatedSubject = `🎉 বিশেষ অফার: ${aiPrompt.trim()}!`;
    const generatedBody = `প্রিয় {{first_name}},\n\n${aiPrompt.trim()}\n\nআমাদের বিশেষ প্রিমিয়াম অফার পেতে নিচের বাটনে চাপ দিন।\n\nধন্যবাদ,\n${senderName || 'স্মার্ট ইমেইল টিম'}`;

    setSubject(generatedSubject);
    setBody(generatedBody);
    setIsAiGenerating(false);
    setShowAiModal(false);
    setAiPrompt('');
  };

  // Handle Test Email Dispatch
  const handleSendTestEmail = async () => {
    if (!testEmailInput || !testEmailInput.includes('@')) {
      setTestResult({ ok: false, msg: 'একটি সঠিক ইমেইল ঠিকানা লিখুন' });
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);

    const testBody = body
      .replace(/\{\{first_name\}\}/g, 'টেস্ট ইউজার')
      .replace(/\{\{last_name\}\}/g, 'আহমেদ')
      .replace(/\{\{email\}\}/g, testEmailInput)
      .replace(/\{\{company\}\}/g, 'স্মার্ট ইমেইল');

    const result = await sendRealEmail({
      to: testEmailInput,
      senderName,
      senderEmail,
      subject: `[TEST] ${subject || 'টেস্ট ইমেইল'}`,
      body: testBody,
    });

    setIsSendingTest(false);
    setTestResult({ ok: result.success, msg: result.message });
  };

  // Final Campaign Launch Dispatch
  const handleLaunchCampaign = async () => {
    setIsLaunching(true);

    const targetEmails = allRecipients.length > 0 ? allRecipients : [senderEmail || user?.email || 'target@example.com'];
    const fromName = senderName || 'স্মার্ট ইমেইল টিম';
    const fromAddr = senderEmail || 'user@example.com';

    for (const recipient of targetEmails.slice(0, 3)) {
      const finalBody = body
        .replace(/\{\{first_name\}\}/g, 'সম্মানিত গ্রাহক')
        .replace(/\{\{email\}\}/g, recipient);

      await sendRealEmail({
        to: recipient,
        senderName: fromName,
        senderEmail: fromAddr,
        subject,
        body: finalBody,
      });
    }

    // Save campaign to localStorage
    try {
      const key = `campaigns_${userId}`;
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];

      const newCampaign = {
        id: `cmp_${Date.now()}`,
        name: campaignName.trim() || subject || 'নতুন ক্যাম্পেইন',
        subject: subject || 'ক্যাম্পেইন বার্তা',
        body: body || '',
        senderName: fromName,
        senderEmail: fromAddr,
        status: 'Sent',
        sentCount: targetEmails.length || 1,
        openRate: '0.0%',
        clickRate: '0.0%',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify([newCampaign, ...existing]));
    } catch (e) {}

    setIsLaunching(false);
    setShowCelebration(true);
  };

  const steps = [
    { id: 1, name: 'টেমপ্লেট ও কন্টেন্ট সেটআপ' },
    { id: 2, name: 'ক্যাম্পেইন ও প্রেরক তথ্য' },
    { id: 3, name: 'প্রাপক নির্বাচন' },
    { id: 4, name: 'রিভিউ ও ডিসপ্যাচ' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/campaigns" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">নতুন AI Email Campaign তৈরি</h1>
            <p className="text-sm text-gray-500">টেমপ্লেট নির্বাচন করুন, ইনভিটেশন লিংক বসান এবং রিয়েল ডেলিভারি সেন্ড করুন</p>
          </div>
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
              <span className={`text-xs font-semibold hidden sm:block ${step >= s.id ? 'text-[#7C3AED]' : 'text-gray-500'}`}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px] flex flex-col">
        <div className="p-6 md:p-8 flex-1">

          {/* ── STEP 1: Template Selection & Invitation Setup ─── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">ধাপ ১: AI টেমপ্লেট ও ইনভিটেশন লিংক কাস্টমাইজেশন</h2>
                  <p className="text-sm text-gray-500">নিচ থেকে প্রিমিয়াম টেমপ্লেট বেছে নিন এবং ইনভিটেশন লিংক ও সাবজেক্ট সেট করুন</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 flex items-center gap-2"
                >
                  <Sparkles size={16} /> AI দিয়ে কন্টেন্ট জেনারেট
                </button>
              </div>

              {/* Template Selector Cards */}
              <div>
                <label className="block text-sm font-bold text-purple-400 mb-3">
                  ১-ক্লিক AI প্রিমিয়াম টেমপ্লেট নির্বাচন করুন ({userTemplates.length}):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {userTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplateId === tpl.id ? 'border-[#7C3AED] bg-purple-500/10 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 bg-gray-50 dark:bg-gray-900'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm truncate">{tpl.name}</p>
                        {selectedTemplateId === tpl.id && <CheckCircle2 size={18} className="text-[#7C3AED]" />}
                      </div>
                      <p className="text-xs text-purple-400 font-semibold truncate mb-1">📧 {tpl.subject}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {tpl.body.replace(/<[^>]*>?/gm, '').substring(0, 80)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dedicated Invitation Link Input Box */}
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <LinkIcon size={16} /> আপনার ইনভিটেশন লিংক (Invitation URL Box):
                  </label>
                  <span className="text-xs text-gray-400 font-medium">ইনপুট দিলে বাটনের লিংক লাইভ বদলে যাবে</span>
                </div>
                <input
                  type="url"
                  value={invitationUrl}
                  onChange={e => handleUpdateInvitationUrl(e.target.value)}
                  placeholder="https://your-custom-invitation-link.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-cyan-500/40 bg-gray-900 text-cyan-300 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Subject Input Field with Quick Dynamic Tags */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold">Email সাবজেক্ট (Subject Line):</label>
                  <span className="text-xs text-gray-500">{subject.length}/150</span>
                </div>

                {/* Quick Dynamic Tags Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-purple-400 font-semibold mr-1">ট্যাগ ইনসার্ট:</span>
                  {[
                    { tag: '{{first_name}}', label: 'গ্রাহকের নাম' },
                    { tag: '{{last_name}}', label: 'শেষ নাম' },
                    { tag: '{{company}}', label: 'কোম্পানি' },
                    { tag: '{{email}}', label: 'ইমেইল' },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => setSubject(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + item.tag)}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1"
                    >
                      + {item.tag}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={150}
                  placeholder="যেমন: {{first_name}}, Welcome to Claude AI Premium!"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-base"
                />
              </div>

              {/* Live Rendered HTML Design Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-cyan-400" />
                  <label className="block text-sm font-bold">লাইভ ডিজাইন প্রিভিউ (Live Rendered Preview):</label>
                </div>
                <div className="border border-gray-700 rounded-xl overflow-hidden shadow-lg bg-black">
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Campaign & Sender Details ──────────────── */}
          {step === 2 && (
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-xl font-bold">ধাপ ২: ক্যাম্পেইনের নাম ও প্রেরক তথ্য</h2>

              <div>
                <label className="block text-sm font-semibold mb-1">ক্যাম্পেইনের নাম (আপনার চেনার জন্য)</label>
                <input
                  type="text"
                  placeholder="যেমন: Claude AI Premium Invite August"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">প্রেরকের নাম (Sender Name)</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="যেমন: Claude AI Team"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">প্রেরকের Email (Sender Email)</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  />
                </div>
              </div>

              {/* Advanced Raw HTML Editor Option */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <label className="block text-xs font-semibold text-gray-400">অ্যাডভান্সড HTML কন্টেন্ট কোড এডিটর:</label>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 font-mono text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Recipients ─────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">ধাপ ৩: প্রাপক নির্বাচন করুন</h2>
                  <p className="text-sm text-gray-500">সেভ করা কন্টাক্টস বেছে নিন, সরাসরি ইমেইল পেস্ট করুন অথবা ফাইল আপলোড করুন</p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold text-xs">
                  মোট প্রাপক: {allRecipients.length} জন
                </div>
              </div>

              {/* Recipient Input Mode Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientTab('saved')}
                  className={`py-2 px-4 font-bold text-sm border-b-2 transition-colors ${recipientTab === 'saved' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  নিবন্ধিত কন্টাক্টস ({userContacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientTab('manual')}
                  className={`py-2 px-4 font-bold text-sm border-b-2 transition-colors ${recipientTab === 'manual' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  ম্যানুয়ালি চিপ পেস্ট ({parsedManualEmails.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientTab('file')}
                  className={`py-2 px-4 font-bold text-sm border-b-2 transition-colors ${recipientTab === 'file' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  ফাইল আপলোড ({uploadedFileEmails.length})
                </button>
              </div>

              {/* TAB 1: Saved Contacts */}
              {recipientTab === 'saved' && (
                <div className="space-y-4">
                  {userContacts.length === 0 ? (
                    <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center space-y-3">
                      <Users size={32} className="mx-auto text-purple-400 opacity-60" />
                      <p className="font-bold text-sm">আপনার একাউন্টে এখনো কোনো কন্টাক্ট সেভ করা নেই</p>
                      <p className="text-xs text-gray-500">পাশে "ম্যানুয়ালি চিপ পেস্ট" বা "ফাইল আপলোড" ট্যাব ব্যবহার করতে পারেন</p>
                    </div>
                  ) : (
                    <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSavedContacts}
                        onChange={e => setUseSavedContacts(e.target.checked)}
                        className="w-5 h-5 text-[#7C3AED] rounded"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-base">আপনার নিবন্ধিত কন্টাক্টস (All Saved Contacts)</p>
                        <p className="text-xs text-gray-500">সকল আপলোডকৃত ও সেভকৃত কন্টাক্টসমূহ</p>
                      </div>
                      <p className="font-bold text-base text-[#7C3AED]">{userContacts.length.toLocaleString()} Contacts</p>
                    </label>
                  )}
                </div>
              )}

              {/* TAB 2: Interactive Smart Email Chips */}
              {recipientTab === 'manual' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <label className="block text-sm font-semibold">
                      ইমেইল টাইপ বা পেস্ট করুন (Enter বা Comma (,) চেপে যোগ করুন):
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400 font-bold px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                        ✔ {parsedManualEmails.length}টি সংগৃহীত বৈধ ইমেইল
                      </span>
                      {manualChips.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { setManualChips([]); setManualText(''); setInvalidEmailError(null); }}
                          className="text-xs text-red-400 hover:underline font-semibold"
                        >
                          সব মুছুন
                        </button>
                      )}
                    </div>
                  </div>

                  {invalidEmailError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center justify-between">
                      <span>{invalidEmailError}</span>
                      <button onClick={() => setInvalidEmailError(null)} className="text-red-400 hover:text-white p-1">
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div className="p-4 rounded-xl border border-purple-500/30 bg-black/60 focus-within:ring-2 focus-within:ring-[#7C3AED] min-h-[140px] flex flex-wrap align-content-start gap-2 transition-all">
                    {manualChips.map((email, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-sm"
                      >
                        <CheckCircle2 size={13} className="text-green-400" />
                        {email}
                        <button
                          type="button"
                          onClick={() => removeChip(email)}
                          className="hover:text-red-400 text-cyan-400/70 p-0.5 ml-1"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={chipInput}
                      onChange={e => { setChipInput(e.target.value); setInvalidEmailError(null); }}
                      onKeyDown={handleChipKeyDown}
                      onBlur={() => { if (chipInput.trim()) addEmailChip(chipInput); }}
                      onPaste={handlePasteEmails}
                      placeholder={manualChips.length === 0 ? "যেমন: rahim@gmail.com টাইপ করে Enter চাপুন অথবা পেস্ট করুন..." : "আরও ইমেইল টাইপ করে Enter চাপুন..."}
                      className="flex-1 min-w-[240px] bg-transparent text-white font-mono text-sm focus:outline-none py-1 px-1 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: File Upload */}
              {recipientTab === 'file' && (
                <div className="space-y-4">
                  <div
                    onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-[#7C3AED] bg-purple-500/10' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}
                  >
                    <Upload size={36} className="mx-auto mb-3 text-purple-400 opacity-80" />
                    <p className="font-bold text-sm mb-1">CSV, TXT বা Excel ফাইল ড্র্যাগ এন্ড ড্রপ করুন</p>
                    <label className="inline-block mt-3 px-4 py-2 bg-[#7C3AED] text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-purple-700">
                      ফাইল ব্রাউজ করুন
                      <input
                        type="file"
                        accept=".csv,.txt,.xlsx"
                        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadedFileName && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-between text-xs text-purple-300">
                      <span>📄 {uploadedFileName} ({uploadedFileEmails.length}টি ইমেইল পাওয়া গেছে)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: Review & Send ──────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">ধাপ ৪: ক্যাম্পেইন রিভিউ ও টেস্ট ডেলিভারি</h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 font-semibold uppercase">ক্যাম্পেইন নাম</p>
                  <p className="font-bold text-base mt-1 text-purple-400">{campaignName || subject}</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 font-semibold uppercase">প্রাপক সংখ্যা</p>
                  <p className="font-bold text-base mt-1 text-green-400">{allRecipients.length} জন</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 font-semibold uppercase">প্রেরক ইমেইল</p>
                  <p className="font-bold text-base mt-1 text-cyan-400">{senderEmail || 'user@example.com'}</p>
                </div>
              </div>

              {/* Test Email Card */}
              <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-purple-300">ইনবক্স টেস্ট ইমেইল পাঠান (Test Delivery):</h3>
                  <span className="text-xs text-gray-400">আসল সেন্ড করার আগে টেস্ট করুন</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmailInput}
                    onChange={e => setTestEmailInput(e.target.value)}
                    placeholder="আপনার নিজের জিমেইল ঠিকানা লিখুন..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={isSendingTest}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg disabled:opacity-50"
                  >
                    {isSendingTest ? 'পাঠানো হচ্ছে...' : 'টেস্ট ইমেইল পাঠান'}
                  </button>
                </div>
                {testResult && (
                  <p className={`text-xs font-semibold ${testResult.ok ? 'text-green-400' : 'text-red-400'}`}>
                    {testResult.msg}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              পিছনে
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-lg shadow-md flex items-center gap-2"
            >
              পরবর্তী ধাপ <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleLaunchCampaign}
              disabled={isLaunching}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-base rounded-lg shadow-lg shadow-green-500/30 flex items-center gap-2"
            >
              <Send size={18} />
              {isLaunching ? 'ক্যাম্পেইন ডিসপ্যাচ হচ্ছে...' : 'ক্যাম্পেইন ডিসপ্যাচ ও সেন্ড করুন'}
            </button>
          )}
        </div>
      </div>

      {/* AI Prompt Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-purple-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={18} /> AI ইমেইল কন্টেন্ট জেনারেটর
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <textarea
              rows={4}
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="যেমন: একটি প্রিমিয়াম ঈদ ডিসকাউন্ট অফারের চমৎকার ইমেইল লিখে দাও..."
              className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white text-sm focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-xs font-bold text-gray-400">
                বাতিল
              </button>
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

      {/* Confetti Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          router.push('/campaigns');
        }}
        campaignName={campaignName || subject}
        recipientCount={allRecipients.length || 1}
      />
    </div>
  );
}
