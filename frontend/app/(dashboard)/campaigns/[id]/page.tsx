export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: 'draft' }];
}

import { ArrowLeft, Play, Copy, ExternalLink, Calendar, Users, Mail, LayoutTemplate, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const isDraft = false;
  
  return (
    <div className="p-6 max-w-5xl mx-auto font-['Anek_Bangla'] space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Link href="/campaigns" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Q3 Newsletter update</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDraft ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {isDraft ? 'Draft' : 'Sent'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Campaign ID: {resolvedParams.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isDraft && (
            <button className="inline-flex items-center px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
              <Play className="w-4 h-4 mr-2" />
              সম্পাদন করুন (Edit)
            </button>
          )}
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <Copy className="w-4 h-4 mr-2 text-gray-500" />
            Duplicate
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-sm">
            <Mail className="w-4 h-4 mr-2" /> Subject
          </div>
          <p className="font-medium text-gray-900 dark:text-white">Exciting updates for Q3!</p>
        </div>
        <div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-sm">
            <Users className="w-4 h-4 mr-2" /> Recipients
          </div>
          <p className="font-medium text-gray-900 dark:text-white">All Subscribers (12,500)</p>
        </div>
        <div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-sm">
            <LayoutTemplate className="w-4 h-4 mr-2" /> Template
          </div>
          <p className="font-medium text-gray-900 dark:text-white">Newsletter Minimal</p>
        </div>
        <div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-sm">
            <Calendar className="w-4 h-4 mr-2" /> Sent At
          </div>
          <p className="font-medium text-gray-900 dark:text-white">{isDraft ? '-' : 'Aug 01, 2026 10:00 AM'}</p>
        </div>
      </div>

      {!isDraft && (
        <>
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#7C3AED]" /> Quick Stats
              </h3>
              <Link href={`/analytics/campaigns/${resolvedParams.id}`} className="text-sm font-medium text-[#7C3AED] hover:text-purple-700 flex items-center">
                View Full Report <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Open Rate (28.5%)</span>
                  <span className="text-gray-500">3,562 Opens</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-[#7C3AED] h-2.5 rounded-full" style={{ width: '28.5%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Click Rate (7.2%)</span>
                  <span className="text-gray-500">900 Clicks</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '7.2%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Bounces</span>
                  <span className="text-gray-500">100 (0.8%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Unsubscribes</span>
                  <span className="text-gray-500">25 (0.2%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '1%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
              
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-900"></div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Final stats recorded</p>
                <p className="text-xs text-gray-500 mt-1">Aug 03, 2026 10:00 AM (48h after send)</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-purple-200 dark:bg-purple-900 rounded-full border-2 border-white dark:border-gray-900"></div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Peak activity reached</p>
                <p className="text-xs text-gray-500 mt-1">Aug 01, 2026 02:00 PM (1,200 opens per hour)</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[#7C3AED] rounded-full border-2 border-white dark:border-gray-900"></div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">First open recorded</p>
                <p className="text-xs text-gray-500 mt-1">Aug 01, 2026 10:02 AM</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Campaign completely sent</p>
                <p className="text-xs text-gray-500 mt-1">Aug 01, 2026 10:00 AM (12,500 recipients)</p>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  )
}
