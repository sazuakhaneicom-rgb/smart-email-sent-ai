'use client';

import { useState } from 'react';
import { mockContactsData } from '@/lib/mock-data';
import { Search, Filter, Plus, Upload, Trash2, Tag, X, ChevronUp, ChevronDown, Edit, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(mockContactsData.map((c: any) => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">কনট্যাক্টসমূহ</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">মোট {mockContactsData.length} কনট্যাক্ট</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Upload size={18} />
            <span>ইমপোর্ট</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>যোগ করুন</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Subscribed', count: 1245, color: 'bg-green-500' },
          { label: 'Unsubscribed', count: 45, color: 'bg-gray-500' },
          { label: 'Bounced', count: 12, color: 'bg-red-500' },
          { label: 'Complained', count: 2, color: 'bg-orange-500' },
        ].map(stat => (
          <div key={stat.label} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="নাম বা ইমেইল খুঁজুন..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]">
              <option>All Status</option>
              <option>Subscribed</option>
              <option>Unsubscribed</option>
              <option>Bounced</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Filter size={18} />
              <span>ফিল্টার</span>
            </button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <span className="font-medium text-[#7C3AED]">{selected.length}টি নির্বাচিত</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1">
                <Tag size={14} /> ট্যাগ
              </button>
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1">
                <AlertCircle size={14} /> Unsubscribe
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4 w-12">
                  <input type="checkbox" onChange={handleSelectAll} checked={selected.length === mockContactsData.length && mockContactsData.length > 0} className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4" />
                </th>
                <th className="p-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"><div className="flex items-center gap-1">নাম (ইমেইল সহ) <ChevronDown size={14} /></div></th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4">ট্যাগ</th>
                <th className="p-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"><div className="flex items-center gap-1">যোগ দেওয়ার তারিখ <ChevronUp size={14} /></div></th>
                <th className="p-4 w-20 text-center">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockContactsData.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selected.includes(contact.id)}
                      onChange={() => handleSelect(contact.id)}
                      className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4" 
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{contact.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 size={12} /> {contact.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags?.slice(0, 2).map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">
                          {tag}
                        </span>
                      ))}
                      {contact.tags?.length > 2 && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
                          +{contact.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{contact.dateAdded}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#7C3AED] rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <span>প্রতি পৃষ্ঠায়:</span>
            <select className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">পূর্ববর্তী</button>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#7C3AED] text-white">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700">3</button>
            </div>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">পরবর্তী</button>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">নতুন কনট্যাক্ট যোগ করুন</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">নাম</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ইমেইল</label>
                <input type="email" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ফোন (ঐচ্ছিক)</label>
                <input type="tel" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" placeholder="+880..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ট্যাগ (কমা দিয়ে আলাদা করুন)</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" placeholder="VIP, Customer" />
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                বাতিল
              </button>
              <button className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors">
                যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
