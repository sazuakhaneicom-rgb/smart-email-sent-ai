'use client';

import React, { useState, use } from 'react';
import { MailOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const unwrappedParams = use(params);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUnsubscribe = () => {
    // In a real app, you would make an API call using unwrappedParams.token here
    setStatus('success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
        
        {status === 'idle' && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailOff className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">আনসাবস্ক্রাইব নিশ্চিত করুন</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              আপনি কি নিশ্চিত যে আপনি <strong>Smart Email</strong> থেকে আর কোনো ইমেইল পেতে চান না?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleUnsubscribe}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-red-500/30"
              >
                হ্যাঁ, আনসাবস্ক্রাইব করুন
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl transition-colors"
              >
                না, থাকতে চাই
              </button>
            </div>
          </>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">সফলভাবে আনসাবস্ক্রাইব করা হয়েছে</h1>
            <p className="text-gray-500 dark:text-gray-400">
              আপনি সফলভাবে আমাদের মেইলিং লিস্ট থেকে আনসাবস্ক্রাইব হয়েছেন। আপনি চাইলে যে কোনো সময় আবার যুক্ত হতে পারেন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
