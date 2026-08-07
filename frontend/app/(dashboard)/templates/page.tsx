'use client';

import { useState } from 'react';
import { mockTemplates } from '@/lib/mock-data';
import { Plus, Copy, X } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('সব');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const tabs = ['সব', 'শুভেচ্ছা', 'প্রচার', 'অফার', 'নিউজলেটার'];

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ইমেইল টেমপ্লেট</h1>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>নতুন তৈরি</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template: any) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
            {/* CSS drawn preview thumbnail */}
            <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-4 relative overflow-hidden flex items-center justify-center">
              <div className="w-full max-w-[200px] bg-white shadow-sm rounded border border-gray-100 p-2 space-y-2 opacity-90 group-hover:scale-105 transition-transform duration-300">
                <div className="w-1/2 h-3 bg-gray-200 rounded mx-auto mb-4"></div>
                <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">Image/Banner</div>
                <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                <div className="w-full h-2 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-2 bg-gray-200 rounded"></div>
                <div className="w-1/3 h-6 bg-[#7C3AED]/80 rounded mx-auto mt-4"></div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                <Link href={`/templates/${template.id}/edit`} className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded hover:bg-gray-100 w-32 text-center shadow-lg">
                  ব্যবহার করুন
                </Link>
                <Link href={`/templates/${template.id}/edit`} className="px-4 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded hover:bg-[#6D28D9] w-32 text-center shadow-lg">
                  সম্পাদন
                </Link>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">{template.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                  {template.category || 'অফার'}
                </span>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded transition-colors" title="ডুপ্লিকেট">
                <Copy size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">নতুন টেমপ্লেট শুরু করুন</h2>
              <button onClick={() => setIsNewModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/templates/new/edit" className="block p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#7C3AED]/20 group-hover:text-[#7C3AED] transition-colors">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Blank Canvas</h3>
                <p className="text-sm text-gray-500">স্ক্র্যাচ থেকে নতুন ডিজাইন শুরু করুন</p>
              </Link>
              
              <div onClick={() => setIsNewModalOpen(false)} className="block p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#7C3AED] shadow-sm hover:shadow-md hover:bg-[#7C3AED]/5 transition-all text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pre-built Template</h3>
                <p className="text-sm text-gray-500">গ্যালারি থেকে একটি ডিজাইন বেছে নিন</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
