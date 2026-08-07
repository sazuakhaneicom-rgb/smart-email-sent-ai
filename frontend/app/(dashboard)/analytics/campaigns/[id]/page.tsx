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

export default function CampaignReportPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'bounced' | 'unsubscribed'>('bounced')

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link href="/analytics" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Q3 Newsletter</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Completed
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sent on: Aug 01, 2026 at 10:00 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]">
            CSV
            <Download className="w-4 h-4 ml-2 text-gray-500" />
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]">
            PDF
            <Download className="w-4 h-4 ml-2 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sent</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">12,500</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <Send className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">12,400</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <Inbox className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Open Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">28.5%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED]">
            <BarChart className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Click Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">7.2%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600">
            <MousePointer2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">সময়ের সাথে Open Rate (24 hours)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-800" />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rate" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">ডিভাইস বিভাজন</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={deviceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-gray-800" />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Link Performance Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Link Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Click Count</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Clicks</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">https://example.com/features</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">650</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">510</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">4.1%</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">https://example.com/pricing</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">320</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">280</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">2.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bounced/Unsubscribed Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 flex">
          <button 
            onClick={() => setActiveTab('bounced')}
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'bounced' ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Bounced (100)
          </button>
          <button 
            onClick={() => setActiveTab('unsubscribed')}
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'unsubscribed' ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Unsubscribed (25)
          </button>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {activeTab === 'bounced' ? (
              <>
                <li className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-900 dark:text-white">user1@invalid.com</span>
                  <span className="text-gray-500">Hard Bounce - Mailbox does not exist</span>
                </li>
                <li className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-900 dark:text-white">user2@full-inbox.com</span>
                  <span className="text-gray-500">Soft Bounce - Mailbox full</span>
                </li>
              </>
            ) : (
              <>
                <li className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-900 dark:text-white">unhappy@customer.com</span>
                  <span className="text-gray-500">No longer interested</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

    </div>
  )
}
