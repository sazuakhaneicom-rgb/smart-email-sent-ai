'use client'

import { SettingsTabs } from '@/components/layout/SettingsTabs'
import { Smartphone, Monitor, Globe } from 'lucide-react'

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6 font-['Anek_Bangla']">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">সেটিংস</h2>
        <SettingsTabs />
      </div>
      <div className="flex-1 space-y-6">
        
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">পাসওয়ার্ড পরিবর্তন</h3>
          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">বর্তমান পাসওয়ার্ড</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-transparent dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নতুন পাসওয়ার্ড</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-transparent dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-transparent dark:text-white" />
            </div>
            <div className="pt-2">
              <button type="button" className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">
                সেভ করুন
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">টু-ফ্যাক্টর অথেনটিকেশন (2FA)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">আপনার অ্যাকাউন্টের নিরাপত্তা বাড়াতে 2FA চালু করুন।</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hidden">
            {/* QR Code placeholder when enabled */}
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center text-xs text-gray-500">QR Code</div>
            <p className="text-center text-sm font-mono text-gray-700 dark:text-gray-300 mb-4">ABCD EFGH IJKL MNOP</p>
            <div className="flex justify-center">
              <button className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">
                সেভ করুন
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">সক্রিয় সেশনসমূহ</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <Monitor className="h-8 w-8 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Windows • Chrome</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">192.168.1.1 • Dhaka, BD (বর্তমান সেশন)</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <Smartphone className="h-8 w-8 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">iPhone 13 • Safari</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">10.0.0.1 • Dhaka, BD (২ ঘন্টা আগে)</p>
                </div>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium">বাতিল</button>
            </div>
          </div>
          <div className="mt-6">
            <button className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-md text-sm font-medium transition-colors border border-red-200 dark:border-red-900/50">
              সব ডিভাইস থেকে লগ আউট
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
