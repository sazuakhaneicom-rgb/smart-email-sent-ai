'use client';

import { useState } from 'react';
import { mockCampaigns } from '@/lib/mock-data';
import { Plus, Search, Play, Copy, Trash2, BarChart2, MailOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('সব');
  const tabs = ['সব', 'ড্রাফ্ট', 'নির্ধারিত', 'পাঠানো', 'পাঠানো হয়েছে'];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
      case 'পাঠানো হয়েছে':
        return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Sent</span>;
      case 'draft':
      case 'ড্রাফ্ট':
        return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Draft</span>;
      case 'scheduled':
      case 'নির্ধারিত':
        return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</span>;
      case 'sending':
      case 'পাঠানো':
        return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 flex items-center gap-1"><Play size={10} className="animate-pulse" /> Sending</span>;
      default:
        return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ক্যাম্পেইনসমূহ</h1>
        <Link 
          href="/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          <span>নতুন Campaign</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 flex gap-4 items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ক্যাম্পেইন খুঁজুন..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
            />
          </div>
        </div>

        {mockCampaigns.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <MailOpen size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">কোনো ক্যাম্পেইন নেই</h3>
            <p className="text-gray-500 mb-6 max-w-sm">আপনার গ্রাহকদের কাছে ইমেইল পাঠানো শুরু করতে একটি নতুন ক্যাম্পেইন তৈরি করুন।</p>
            <Link href="/campaigns/new" className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] font-medium transition-colors">
              প্রথম Campaign তৈরি করুন
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4">ক্যাম্পেইন নাম</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4">প্রাপক</th>
                  <th className="p-4 text-center">Open Rate</th>
                  <th className="p-4 text-center">Click Rate</th>
                  <th className="p-4">তারিখ</th>
                  <th className="p-4 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockCampaigns.map((campaign: any) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="p-4">
                      <Link href={`/campaigns/${campaign.id}`} className="font-bold text-gray-900 dark:text-white hover:text-[#7C3AED] transition-colors block">
                        {campaign.name}
                      </Link>
                      <span className="text-sm text-gray-500 truncate max-w-[200px] block" title={campaign.subject}>{campaign.subject}</span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <Users size={16} /> <span>{campaign.recipients?.toLocaleString() || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{campaign.openRate ? `${campaign.openRate}%` : '-'}</span>
                        {campaign.openRate && <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${campaign.openRate}%` }}></div></div>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{campaign.clickRate ? `${campaign.clickRate}%` : '-'}</span>
                        {campaign.clickRate && <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${campaign.clickRate}%` }}></div></div>}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {campaign.sentDate || 'Not sent yet'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-500 hover:text-[#7C3AED] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors" title="View Report">
                          <BarChart2 size={18} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Duplicate">
                          <Copy size={18} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
