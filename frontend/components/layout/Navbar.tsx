'use client';

import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive title from pathname
  let title = 'ড্যাশবোর্ড';
  if (pathname.includes('/campaigns')) title = 'ক্যাম্পেইন';
  else if (pathname.includes('/contacts')) title = 'কন্টাক্টস';
  else if (pathname.includes('/templates')) title = 'টেমপ্লেট';
  else if (pathname.includes('/analytics')) title = 'বিশ্লেষণ';
  else if (pathname.includes('/settings')) title = 'সেটিংস';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-4 space-x-reverse">
        <button className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
      </div>

      <div className="flex items-center space-x-3 space-x-reverse">
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <button 
            className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">নোটিফিকেশন (৩)</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-800 dark:text-zinc-200">আপনার <span className="font-medium">বৈশাখী অফার</span> ক্যাম্পেইন সফলভাবে পাঠানো হয়েছে।</p>
                  <span className="text-xs text-zinc-500">১০ মিনিট আগে</span>
                </div>
                <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-800 dark:text-zinc-200">৫০০ নতুন কন্টাক্ট ইমপোর্ট করা হয়েছে।</p>
                  <span className="text-xs text-zinc-500">২ ঘন্টা আগে</span>
                </div>
                <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <p className="text-sm text-zinc-800 dark:text-zinc-200">সিস্টেম মেইনটেন্যান্স আজ রাত ১২টায়।</p>
                  <span className="text-xs text-zinc-500">১ দিন আগে</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Free Plan</span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-medium text-sm cursor-pointer ml-2">
          U
        </div>
      </div>
    </header>
  );
}
