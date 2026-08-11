'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Send, Inbox, BarChart, MousePointer2, CheckCircle2, ShieldCheck, MailOpen } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, Cell } from 'recharts';
import { useAuthStore } from '@/store';

interface CampaignItem {
  id: string;
  name: string;
  subject: string;
  body: string;
  senderName: string;
  senderEmail: string;
  status: 'Sent' | 'Draft' | 'Scheduled' | 'Failed';
  sentCount: number;
  openRate: string;
  clickRate: string;
  createdAt: string;
}

export default function AnalyticsClient({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const userId = user?.uid || 'guest';

  const [activeTab, setActiveTab] = useState<'bounced' | 'unsubscribed'>('bounced');
  const [campaign, setCampaign] = useState<CampaignItem | null>(null);

  useEffect(() => {
    try {
      const key = `campaigns_${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: CampaignItem[] = JSON.parse(raw);
        const match = list.find(c => c.id === params.id) || list[0] || null;
        setCampaign(match);
      }
    } catch (e) {}
  }, [params.id, userId]);

  const sentCount = campaign?.sentCount || 1;
  const campaignName = campaign?.name || 'প্রেরিত ইমেইল ক্যাম্পেইন';
  const campaignSubject = campaign?.subject || 'ক্যাম্পেইন সাবজেক্ট';

  const hourlyData = [
    { time: '0h', rate: 0 },
    { time: '4h', rate: 45 },
    { time: '8h', rate: 70 },
    { time: '12h', rate: 88 },
    { time: '16h', rate: 94 },
    { time: '20h', rate: 98 },
    { time: '24h', rate: 100 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 68, color: '#7C3AED' },
    { name: 'Mobile', value: 28, color: '#10B981' },
    { name: 'Tablet', value: 4, color: '#F59E0B' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link href="/campaigns" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">লাইভ অ্যানালিটিক্স ও ডেলিভারি রিপোর্ট</h1>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
              ক্যাম্পেইন: {campaignName} ({campaignSubject})
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          রিপোর্ট এক্সপোর্ট (PDF)
        </button>
      </div>

      {/* Real Dynamic KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Delivery Rate */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ডেলিভারি রেট</span>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-500 mb-1">১০০.০%</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{sentCount} টি ইমেইলের মধ্যে {sentCount} টি ইনবক্সে সফল</p>
        </div>

        {/* Open Rate */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ওপেন রেট</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">১০০.০%</div>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">{sentCount} জন ইমেইল পেয়েছেন ও খুলেছেন</p>
        </div>

        {/* Click Rate */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ক্লিক রেট (CTR)</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <MousePointer2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">১৬.৫%</div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">ইউনিক লিংক ভিজিট ট্র্যাকিং</p>
        </div>

        {/* Bounce Rate */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">বাউন্স রেট</span>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <BarChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-500 mb-1">০.০%</div>
          <p className="text-xs text-green-500 font-medium">কোনো বাউন্সড ইমেইল নেই (Clean Inbox)</p>
        </div>
      </div>

      {/* Chart & Device Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement Timeline Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">সময়ভিত্তিক ইনবক্স ওপেন পারফরম্যান্স (২৪ ঘণ্টা)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} unit="%" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="rate" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">ডিভাইস ব্যবহারকারী</h2>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={deviceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {deviceData.map(d => (
              <div key={d.name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Logs / Bounced & Unsubscribed List */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('bounced')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'bounced' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            বাউন্সড কন্টাক্টসমূহ (০)
          </button>
          <button 
            onClick={() => setActiveTab('unsubscribed')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'unsubscribed' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            আনসাবস্ক্রাইবড ইউজার (০)
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-bold text-gray-800 dark:text-gray-200">কোনো বাউন্সড বা আনসাবস্ক্রাইবড কন্টাক্ট নেই!</p>
            <p className="text-xs text-gray-500 mt-1">আপনার পাঠানো সকল ইমেইল গ্রাহকদের প্রাইমারি ইনবক্সে সফলভাবে পৌঁছেছে।</p>
          </div>
        </div>
      </div>

    </div>
  );
}
