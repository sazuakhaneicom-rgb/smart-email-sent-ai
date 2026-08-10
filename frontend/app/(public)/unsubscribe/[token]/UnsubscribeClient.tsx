'use client';

import React, { useState } from 'react';
import { MailX, CheckCircle } from 'lucide-react';

export default function UnsubscribeClient({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUnsubscribe = () => {
    setStatus('success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 font-['Anek_Bangla']">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
        
        {status === 'idle' && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailX className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">আনসাবস্ক্রাইব নিশ্চিত করুন</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              আপনি কি নিশ্চিত যে আপনি <strong>Smart Email</strong> থেকে আর কোনো ইমেইল পেতে চান না?
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleUnsubscribe}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200"
              >
                হ্যাঁ, আনসাবস্ক্রাইব করুন
              </button>
              <a 
                href="/"
                className="block w-full py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 text-center"
              >
                না, সাবস্ক্রাইব রাখতে চাই
              </a>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">আনসাবস্ক্রাইব সম্পন্ন হয়েছে</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              আপনাকে আমাদের কন্টাক্ট লিস্ট থেকে সফলভাবে সরিয়ে দেওয়া হয়েছে। আপনি আর কোনো আপডেট ইমেইল পাবেন না।
            </p>
            <a 
              href="/"
              className="inline-block px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-200"
            >
              হোমপেজে ফিরে যান
            </a>
          </>
        )}

      </div>
    </div>
  );
}
