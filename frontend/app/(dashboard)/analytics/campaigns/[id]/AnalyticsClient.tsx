'use client'

import { ArrowLeft, Download, Send, Inbox, BarChart, MousePointer2 } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, Cell } from 'recharts'
import { useState } from 'react'

const hourlyData = [
  { time: '0h', rate: 0 }, { time: '4h', rate: 12 }, { time: '8h', rate: 22 }, 
  { time: '12h', rate: 25 }, { time: '16h', rate: 27 }, { time: '20h', rate: 28 }, { time: '24h', rate: 28.5 }
]

const deviceData = [
  { name: 'Desktop', value: 64, color: '#7C3AED' },
  { name: 'Mobile', value: 29, color: '#10B981' },
  { name: 'Tablet', value: 7, color: '#F59E0B' }
]

export default function AnalyticsClient({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'bounced' | 'unsubscribed'>('bounced')

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link href={`/campaigns/${params.id}`} className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">অ্যানালিটিক্স ও রিপোর্ট</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Campaign: Q3 Newsletter update (ID: {params.id})</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          রিপোর্ট ডাউনলোডের এক্সপোর্ট (PDF)
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ডেলিভারি রেট</span>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">৯৯.২%</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">১০,৮৫০ টি মেইলের মধ্যে ১০,৭৬৩ টি সফল</p>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ওপেন রেট</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">২৮.৫%</div>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">৩,০৬৮ জন ইমেইল খুলেছেন</p>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ক্লিক রেট (CTR)</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <MousePointer2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">৬.৮%</div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">৭৩২ টি লিংকে ইউনিক ক্লিক</p>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">বাউন্স রেট</span>
            <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <BarChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">০.৮%</div>
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">৮৭ টি বাউন্সড ইমেইল</p>
        </div>
      </div>

      {/* Chart & Device Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement Timeline Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">সময়ভিত্তিক ওপেন পারফরম্যান্স (২৪ ঘণ্টা)</h2>
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
            বাউন্সড কন্টাক্টসমূহ (৮৭)
          </button>
          <button 
            onClick={() => setActiveTab('unsubscribed')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'unsubscribed' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            আনসাবস্ক্রাইবড ইউজার (১২)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">ইমেইল ঠিকানা</th>
                <th className="px-4 py-3">কারণ / স্ট্যাটাস</th>
                <th className="px-4 py-3">সময়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {activeTab === 'bounced' ? (
                <>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">user123@invalid-domain.com</td>
                    <td className="px-4 py-3 text-red-500">Hard Bounce (Address not found)</td>
                    <td className="px-4 py-3">১০ আগস্ট, ২০২৬ - ১০:১৫ AM</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">hello@fullmailbox.net</td>
                    <td className="px-4 py-3 text-yellow-600 dark:text-yellow-400">Soft Bounce (Mailbox Full)</td>
                    <td className="px-4 py-3">১০ আগস্ট, ২০২৬ - ১০:১৮ AM</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">jamal.hossain@gmail.com</td>
                    <td className="px-4 py-3 text-gray-500">User opted out via link</td>
                    <td className="px-4 py-3">১০ আগস্ট, ২০২৬ - ১১:০২ AM</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">ruma.akter@yahoo.com</td>
                    <td className="px-4 py-3 text-gray-500">Not interested in offers</td>
                    <td className="px-4 py-3">১০ আগস্ট, ২০২৬ - ১১:৪৫ AM</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
