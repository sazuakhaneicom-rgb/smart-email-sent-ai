'use client'

import { SettingsTabs } from '@/components/layout/SettingsTabs'
import { Plus, MoreHorizontal } from 'lucide-react'

export default function TeamSettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6 font-['Anek_Bangla']">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">সেটিংস</h2>
        <SettingsTabs />
      </div>
      <div className="flex-1 space-y-6">
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Phase 2 Feature</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">এই ফিচারটি পরবর্তী আপডেটে আসবে।</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">টিম মেম্বারস</h3>
          <button className="inline-flex items-center px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4 mr-2" />
            মেম্বার যোগ করুন
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">নাম</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">রোল</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">স্ট্যাটাস</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">SA</div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Sazu Akheni</div>
                      <div className="text-sm text-gray-500">sazu@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Owner
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500"><MoreHorizontal className="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
