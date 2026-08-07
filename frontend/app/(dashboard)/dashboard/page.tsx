'use client';

import React, { useState } from 'react';
import { Users, Send, MousePointerClick, MailOpen, Upload, FileText, BarChart2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { mockDashboardStats, mockTrendData, mockRecentCampaigns } from '@/lib/mock-data';
import { formatNumber, formatPercent, formatDate, cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('৩০ দিন');
  
  const pieData = [
    { name: 'Subscribed', value: 9240 },
    { name: 'Unsubscribed', value: 1890 },
    { name: 'Bounced', value: 420 },
    { name: 'Complained', value: 90 },
  ];
  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 space-x-reverse text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-zinc-600 dark:text-zinc-400">{entry.name}:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="মোট Contact" 
          value={formatNumber(mockDashboardStats.contacts)}
          trend={mockDashboardStats.contactsTrend}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard 
          title="Campaign পাঠানো হয়েছে" 
          value={mockDashboardStats.campaigns}
          icon={<Send className="w-5 h-5" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard 
          title="গড় Open Rate" 
          value={formatPercent(mockDashboardStats.openRate)}
          trend={mockDashboardStats.openRateTrend}
          icon={<MailOpen className="w-5 h-5" />}
          iconBg="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard 
          title="গড় Click Rate" 
          value={formatPercent(mockDashboardStats.clickRate)}
          trend={mockDashboardStats.clickRateTrend}
          icon={<MousePointerClick className="w-5 h-5" />}
          iconBg="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">শেষ ৩০ দিনের Campaign কার্যকলাপ</h3>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              {['৭ দিন', '৩০ দিন', '৯০ দিন'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    timeRange === range 
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => new Date(val).getDate().toString()} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" name="Open Rate" dataKey="open_rate" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Click Rate" dataKey="click_rate" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">সাম্প্রতিক Campaign</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockRecentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mb-1">{campaign.name}</span>
                  <div className="flex items-center space-x-2 space-x-reverse text-xs text-zinc-500">
                    <span>{formatDate(campaign.date)}</span>
                    <span>•</span>
                    <span>{formatNumber(campaign.sent)} পাঠানো হয়েছে</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-medium",
                    campaign.status === 'Sent' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                    campaign.status === 'Draft' && "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
                    campaign.status === 'Scheduled' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    campaign.status === 'Failed' && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                  )}>
                    {campaign.status}
                  </span>
                  {campaign.openRate > 0 && (
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{campaign.openRate}% Open</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Link href="/campaigns" className="block text-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              সব দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">দ্রুত শুরু করুন</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-700 dark:hover:bg-purple-900/20 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 text-zinc-600 dark:text-zinc-400">
                <Send className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">নতুন Campaign</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-700 dark:hover:bg-purple-900/20 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 text-zinc-600 dark:text-zinc-400">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Contact ইমপোর্ট</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-700 dark:hover:bg-purple-900/20 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 text-zinc-600 dark:text-zinc-400">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Template তৈরি</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-700 dark:hover:bg-purple-900/20 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 text-zinc-600 dark:text-zinc-400">
                <BarChart2 className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">রিপোর্ট দেখুন</span>
            </button>
          </div>
        </div>

        {/* List Overview */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">লিস্ট ওভারভিউ</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', backgroundColor: 'var(--tw-bg-opacity, white)' }}
                  itemStyle={{ color: '#18181b', fontSize: '14px', fontWeight: 500 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
