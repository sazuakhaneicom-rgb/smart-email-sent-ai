'use client';

import { useState } from 'react';
import { Plus, Users, Eye, Edit2, X } from 'lucide-react';

const mockLists = [
  { id: 1, name: 'All Customers', type: 'Static', count: 12450, lastUpdated: '12 Aug, 2023' },
  { id: 2, name: 'Active Users (30 days)', type: 'Dynamic', count: 4320, lastUpdated: '2 hours ago' },
  { id: 3, name: 'VIP Clients', type: 'Static', count: 125, lastUpdated: '15 Aug, 2023' },
  { id: 4, name: 'Bounced Emails', type: 'Dynamic', count: 89, lastUpdated: '1 min ago' },
  { id: 5, name: 'Newsletter Subscribers', type: 'Static', count: 8540, lastUpdated: '10 Aug, 2023' },
];

export default function ListsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listType, setListType] = useState('static');

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">লিস্ট ও সেগমেন্ট</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">আপনার কনট্যাক্টগুলো সহজে পরিচালনা করুন</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>নতুন লিস্ট</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLists.map(list => (
          <div key={list.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:border-[#7C3AED] dark:hover:border-[#7C3AED] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{list.name}</h3>
              <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${list.type === 'Dynamic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                {list.type}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6">
              <Users size={18} className="text-[#7C3AED]" />
              <span className="font-semibold text-xl">{list.count.toLocaleString()}</span>
              <span className="text-sm">কনট্যাক্টস</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">আপডেট: {list.lastUpdated}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-gray-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded transition-colors" title="দেখুন">
                  <Eye size={16} />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded transition-colors" title="সম্পাদন">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">নতুন লিস্ট তৈরি করুন</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">লিস্টের নাম</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" placeholder="e.g. Summer Campaign Users" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">লিস্টের ধরন</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${listType === 'static' ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <input type="radio" name="listType" checked={listType === 'static'} onChange={() => setListType('static')} className="text-[#7C3AED] focus:ring-[#7C3AED]" />
                    <div>
                      <p className="font-semibold">Static List</p>
                      <p className="text-xs text-gray-500">Manual add/remove</p>
                    </div>
                  </label>
                  <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${listType === 'dynamic' ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <input type="radio" name="listType" checked={listType === 'dynamic'} onChange={() => setListType('dynamic')} className="text-[#7C3AED] focus:ring-[#7C3AED]" />
                    <div>
                      <p className="font-semibold">Dynamic Segment</p>
                      <p className="text-xs text-gray-500">Auto-updates via rules</p>
                    </div>
                  </label>
                </div>
              </div>

              {listType === 'dynamic' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <p className="text-sm font-medium mb-2">নিয়ম সেট করুন (Rule Builder)</p>
                  <div className="flex gap-2 items-center">
                    <select className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]">
                      <option>Field</option>
                      <option>Tag</option>
                      <option>Status</option>
                      <option>Sign Up Date</option>
                    </select>
                    <select className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]">
                      <option>Operator</option>
                      <option>Equals</option>
                      <option>Contains</option>
                    </select>
                    <input type="text" placeholder="Value" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                  </div>
                  <button className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1 mt-2">
                    <Plus size={14} /> আরও নিয়ম যোগ করুন
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                বাতিল
              </button>
              <button className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors">
                তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
