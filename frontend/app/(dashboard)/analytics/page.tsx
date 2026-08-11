'use client'

import { BarChart3, Users, MousePointerClick, AlertTriangle, InboxIcon } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsOverviewPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">বিশ্লেষণ ও রিপোর্ট</h1>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white">Last 7d</button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">30d</button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">90d</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">মোট Email পাঠানো</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">০</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED]">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">গড় Open Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">০%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">গড় Click Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">০%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bounce Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">০%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-16 overflow-hidden mt-6">
        <div className="p-20 flex flex-col items-center justify-center text-center gap-5 min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/20 dark:to-cyan-900/20 border border-purple-200 dark:border-purple-800/30 flex items-center justify-center">
            <BarChart3 size={32} className="text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              এখনো কোনো Analytics data নেই
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
              Campaign পাঠালে এখানে analytics দেখাবে
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            <Link href="/campaigns/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white font-bold text-sm">
              প্রথম Campaign তৈরি করুন
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  )
}
