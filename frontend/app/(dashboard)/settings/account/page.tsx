'use client'

import { SettingsTabs } from '@/components/layout/SettingsTabs'

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6 font-['Anek_Bangla']">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">সেটিংস</h2>
        <SettingsTabs />
      </div>
      <div className="flex-1 space-y-6">
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">অ্যাকাউন্ট সেটিংস</h3>
          
          <div className="mb-6 flex items-center">
            <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xl mr-4">
              SA
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
              আপলোড ফটো
            </button>
          </div>

          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নাম</label>
              <input type="text" defaultValue="Sazu Akheni" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ইমেইল</label>
              <input type="email" defaultValue="sazu@example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent dark:text-white mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">পরিবর্তন করতে Email প্রয়োজন</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ভাষা</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent dark:text-white">
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="pt-2">
              <button type="button" className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">
                পরিবর্তন সেভ করুন
              </button>
            </div>
          </form>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">অ্যাকাউন্ট মুছে ফেলুন</h3>
          <p className="text-sm text-red-600 dark:text-red-400/80 mb-4">
            একবার আপনি আপনার অ্যাকাউন্ট মুছে ফেললে, এটি আর ফিরে পাওয়া যাবে না। অনুগ্রহ করে নিশ্চিত হোন।
          </p>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors">
            মুছে ফেলুন
          </button>
        </div>
      </div>
    </div>
  )
}
