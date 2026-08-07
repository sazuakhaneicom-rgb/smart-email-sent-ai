'use client'

import { SettingsTabs } from '@/components/layout/SettingsTabs'
import { Check, Download, Zap } from 'lucide-react'

const mockInvoices = [
  { id: 'INV-001', date: 'Aug 01, 2026', amount: '$0.00', plan: 'বিনামূল্যে (Free)', status: 'Paid' },
]

export default function BillingSettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6 font-['Anek_Bangla']">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">সেটিংস</h2>
        <SettingsTabs />
      </div>
      <div className="flex-1 space-y-8">
        
        {/* Current Plan & Usage */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                বর্তমান প্ল্যান <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#7C3AED] text-white">বিনামূল্যে (Free)</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">পরবর্তী নবায়ন: Sep 01, 2026</p>
            </div>
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
              আপগ্রড করুন
            </button>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">ইমেইল পাঠানো</span>
                <span className="text-gray-500">8,200 / 10,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">কনট্যাক্টস</span>
                <span className="text-gray-500">3,450 / 5,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '69%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">প্ল্যান পরিবর্তন</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-[#7C3AED] relative">
              <div className="absolute top-0 right-0 bg-[#7C3AED] text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-md font-medium">বর্তমান</div>
              <h4 className="text-xl font-bold mb-2">Free</h4>
              <p className="text-3xl font-bold mb-6">$0<span className="text-base font-normal text-gray-500">/mo</span></p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> 10,000 Emails/mo</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> 5,000 Contacts</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Basic Templates</li>
              </ul>
              <button className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-500 cursor-not-allowed" disabled>
                বর্তমান প্ল্যান
              </button>
            </div>
            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h4 className="text-xl font-bold mb-2 flex items-center">Pro <Zap className="w-4 h-4 ml-2 text-yellow-500" /></h4>
              <p className="text-3xl font-bold mb-6">$29<span className="text-base font-normal text-gray-500">/mo</span></p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> 50,000 Emails/mo</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Unlimited Contacts</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Premium Templates</li>
              </ul>
              <button className="w-full py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">
                আপগ্রড
              </button>
            </div>
            {/* Business Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h4 className="text-xl font-bold mb-2">Business</h4>
              <p className="text-3xl font-bold mb-6">$99<span className="text-base font-normal text-gray-500">/mo</span></p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> 250,000 Emails/mo</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Dedicated IP</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Priority Support</li>
              </ul>
              <button className="w-full py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">
                আপগ্রড
              </button>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ইনভয়েস ইতিহাস</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-medium">তারিখ</th>
                  <th className="pb-3 font-medium">পরিমাণ</th>
                  <th className="pb-3 font-medium">প্ল্যান</th>
                  <th className="pb-3 font-medium">স্ট্যাটাস</th>
                  <th className="pb-3 font-medium text-right">ডাউনলোড</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="py-3 text-gray-900 dark:text-white">{invoice.date}</td>
                    <td className="py-3 text-gray-900 dark:text-white">{invoice.amount}</td>
                    <td className="py-3 text-gray-900 dark:text-white">{invoice.plan}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-gray-500 hover:text-[#7C3AED] transition-colors inline-flex justify-end">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
