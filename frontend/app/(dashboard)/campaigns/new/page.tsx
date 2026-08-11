'use client';

import { useState } from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight, Calendar, Send, Info } from 'lucide-react';
import Link from 'next/link';

export default function NewCampaignPage() {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);

  const steps = [
    { id: 1, name: 'বিস্তারিতি' },
    { id: 2, name: 'কন্টেন্ট' },
    { id: 3, name: 'প্রাপক' },
    { id: 4, name: 'রিভিউ ও পাঠান' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/campaigns" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">নতুন Campaign</h1>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded hidden sm:block"></div>
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#111827] px-2 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.id ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 border border-gray-300 dark:border-gray-700'}`}>
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-[#7C3AED]' : 'text-gray-500'}`}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px] flex flex-col">
        <div className="p-8 flex-1">
          {step === 1 && (
            <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6">ক্যাম্পেইনের বিস্তারিত তথ্য</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign নাম (শুধুমাত্র আপনার জন্য)</label>
                  <input type="text" placeholder="e.g. Summer Sale 2023" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium">Email সাবজেক্ট</label>
                    <span className="text-xs text-gray-500">{subject.length}/150</span>
                  </div>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={150}
                    placeholder="e.g. 🔥 আপনার জন্য বিশেষ অফার!" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-lg" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">প্রেরকের নাম</label>
                    <input type="text" defaultValue="Smart Email Team" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">প্রেরকের Email</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none">
                      <option>hello@smartemail.com</option>
                      <option>marketing@smartemail.com</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Reply-To email (ঐচ্ছিক)</label>
                  <input type="email" placeholder="support@smartemail.com" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-2">কন্টেন্ট ডিজাইন</h2>
              <p className="text-gray-500 mb-6">একটি টেমপ্লেট নির্বাচন করুন</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {([] as any[]).map((template: any) => (
                  <div 
                    key={template.id} 
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedTemplate === template.id ? 'border-[#7C3AED] ring-4 ring-[#7C3AED]/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-[#7C3AED]/50'}`}
                  >
                    <div className="h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                      <div className="w-16 h-20 bg-white shadow rounded flex flex-col p-1 gap-1">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-indigo-500 rounded w-1/2 mt-auto mx-auto"></div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-[#7C3AED] text-white rounded-full p-1">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 text-center border-t border-gray-100 dark:border-gray-700">
                      <p className="font-bold text-sm">{template.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTemplate && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[#7C3AED]">টেম্পলেট নির্বাচিত হয়েছে</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">আপনি চাইলে টেমপ্লেটটি এডিট করতে পারেন</p>
                  </div>
                  <Link href={`/templates/${selectedTemplate}/edit`} target="_blank" className="px-4 py-2 bg-white dark:bg-gray-800 text-[#7C3AED] border border-[#7C3AED] rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 text-sm font-bold transition-colors">
                    টেমপ্লেট সম্পাদন করুন
                  </Link>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-2">প্রাপক নির্বাচন করুন</h2>
              <p className="text-gray-500 mb-6">কার কাছে এই ইমেইল পাঠাতে চান?</p>
              
              <div className="space-y-3">
                {([] as any[]).map((list: any) => (
                  <label key={list.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedLists.includes(list.id) ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <input 
                      type="checkbox" 
                      checked={selectedLists.includes(list.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLists([...selectedLists, list.id]);
                        } else {
                          setSelectedLists(selectedLists.filter(id => id !== list.id));
                        }
                      }}
                      className="w-5 h-5 text-[#7C3AED] rounded border-gray-300 focus:ring-[#7C3AED]"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-lg">{list.name}</p>
                      <p className="text-sm text-gray-500">{list.type} List</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{list.count.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Contacts</p>
                    </div>
                  </label>
                ))}
              </div>
              
              {selectedLists.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-3">
                  <Info size={20} />
                  <p className="font-medium text-lg">প্রায় ৩,৪৫৬ জনকে Email পাঠানো হবে</p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6 text-center">সবকিছু ঠিক আছে?</h2>
              
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <dl className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-500 font-medium">সাবজেক্ট</dt>
                    <dd className="col-span-2 font-bold">{subject || '🔥 আপনার জন্য বিশেষ অফার!'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-500 font-medium">প্রেরক</dt>
                    <dd className="col-span-2">Smart Email Team <span className="text-gray-400">&lt;hello@smartemail.com&gt;</span></dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-500 font-medium">প্রাপক</dt>
                    <dd className="col-span-2 font-bold text-[#7C3AED]">৩,৪৫৬ জন (২টি লিস্ট)</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">টেমপ্লেট</dt>
                    <dd className="col-span-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div> 
                      Summer Special Template
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Send size={18} /> টেস্ট ইমেইল পাঠান</h3>
                <div className="flex gap-2">
                  <input type="email" placeholder="your-email@example.com" className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                    পরীক্ষামূরক Email পাঠান
                  </button>
                </div>
              </div>

              <div className="flex gap-4 max-w-2xl mx-auto">
                <button className="flex-1 py-4 border-2 border-[#7C3AED] text-[#7C3AED] rounded-xl font-bold text-lg hover:bg-[#7C3AED]/5 transition-colors flex items-center justify-center gap-2">
                  <Calendar size={24} /> সিডিউল করুন
                </button>
                <button className="flex-1 py-4 bg-[#7C3AED] text-white rounded-xl font-bold text-lg hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/30">
                  <Send size={24} /> এখনই পাঠান
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} /> পিছনে
          </button>
          
          {step < 4 && (
            <button 
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              পরবর্তী ধাপ <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
