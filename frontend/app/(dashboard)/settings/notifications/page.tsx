'use client'

import { SettingsTabs } from '@/components/layout/SettingsTabs'

export default function NotificationsSettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6 font-['Anek_Bangla']">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">সেটিংস</h2>
        <SettingsTabs />
      </div>
      <div className="flex-1 space-y-6">
        
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ইমেইল নোটিফিকেশন</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Campaign Sent</p>
                <p className="text-sm text-gray-500">ক্যাম্পেইন সফলভাবে পাঠানো হলে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Domain Verify Failed</p>
                <p className="text-sm text-gray-500">ডোমেইন যাচাইকরণ ব্যর্থ হলে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Failed</p>
                <p className="text-sm text-gray-500">পেমেন্ট ব্যর্থ হলে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Usage Limit Near</p>
                <p className="text-sm text-gray-500">লিমিটের কাছাকাছি পৌঁছালে (৮০% এর বেশি)</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ইন-অ্যাপ নোটিফিকশন</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Campaign Sent</p>
                <p className="text-sm text-gray-500">ক্যাম্পেইন সফলভাবে পাঠানো হলে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Domain Verify Failed</p>
                <p className="text-sm text-gray-500">ডোমেইন যাচাইকরণ ব্যর্থ হলে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Failed</p>
                <p className="text-sm text-gray-500">পেমেন্ট ব্যর্থ হলে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Usage Limit Near</p>
                <p className="text-sm text-gray-500">লিমিটের কাছাকাছি পৌঁছালে</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#7C3AED]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ওয়িকলি রিপোর্ট</h3>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Weekly Email Digest</p>
              <p className="text-sm text-gray-500">প্রতি সপ্তাহে আপনার পারফরম্যান্সের সারসংক্ষেপ ইমেইল পান</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
