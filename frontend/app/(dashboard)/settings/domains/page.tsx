'use client'

import { SettingsTabs } from '@/components/layout/SettingsTabs'
import { Plus, CheckCircle2, AlertCircle, XCircle, Copy, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const mockDomains = [
  { id: '1', name: 'example.com', status: 'verified', spf: 'verified', dkim: 'verified', dmarc: 'verified' },
  { id: '2', name: 'newsletter.example.com', status: 'pending', spf: 'verified', dkim: 'pending', dmarc: 'failed' },
]

export default function DomainsSettingsPage() {
  const [showAddDomain, setShowAddDomain] = useState(false)
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    if (status === 'verified') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</span>
    if (status === 'pending') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3 mr-1" /> Failed</span>
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6 font-['Anek_Bangla']">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">সেটিংস</h2>
        <SettingsTabs />
      </div>
      <div className="flex-1 space-y-6">
        
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">সেন্ডার ডোমেইন</h3>
          <button 
            onClick={() => setShowAddDomain(true)}
            className="inline-flex items-center px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            ডোমইন যোগ করুন
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">ইমেইল ডেলিভারি নিশ্চিত করুন</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            আপনার ডোমেইন থেকে ইমেইল পাঠাতে হলে স্প্যাম ফোল্ডার এড়াতে DNS রেকর্ডগুলো যোগ করা বাধ্যতামূলক।
          </p>
        </div>

        {showAddDomain && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">নতুন ডোমেইন যোগ করুন</h4>
            <div className="flex gap-4">
              <input type="text" placeholder="e.g. example.com" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-transparent dark:text-white" />
              <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-md text-sm font-medium">যোগ করুন</button>
              <button onClick={() => setShowAddDomain(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium">বাতিল</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {mockDomains.map(domain => (
            <div key={domain.id} className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{domain.name}</h4>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center text-sm"><span className="text-gray-500 mr-2">SPF:</span> {getStatusBadge(domain.spf)}</div>
                      <div className="flex items-center text-sm"><span className="text-gray-500 mr-2">DKIM:</span> {getStatusBadge(domain.dkim)}</div>
                      <div className="flex items-center text-sm"><span className="text-gray-500 mr-2">DMARC:</span> {getStatusBadge(domain.dmarc)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      যাচাই করুন
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-md hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20">
                      বাতিল
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button 
                    onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#7C3AED] dark:hover:text-[#7C3AED]"
                  >
                    <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${expandedDomain === domain.id ? 'rotate-180' : ''}`} />
                    ডিএনএস রেকর্ড (DNS Records)
                  </button>
                  
                  {expandedDomain === domain.id && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-4 gap-4 text-sm mb-2 font-medium text-gray-500">
                          <div>Type</div>
                          <div>Host</div>
                          <div className="col-span-2">Value</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm items-center py-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="font-mono">TXT</div>
                          <div className="font-mono truncate">@</div>
                          <div className="col-span-2 font-mono truncate flex justify-between items-center">
                            <span className="truncate mr-2">v=spf1 include:_spf.smartemailsent.ai ~all</span>
                            <button className="text-gray-400 hover:text-gray-600"><Copy className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
