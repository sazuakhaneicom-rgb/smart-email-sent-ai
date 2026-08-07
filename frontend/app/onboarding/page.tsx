'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  const [workspaceName, setWorkspaceName] = useState('');
  const [businessType, setBusinessType] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* Stepper */}
        <div className="bg-purple-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-purple-600 transition-all duration-500 z-0" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            
            {[1, 2, 3].map(num => (
              <div key={num} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8 md:p-12 transition-all duration-500 min-h-[400px] flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">আপনার ওয়ার্কস্পেস সেটআপ করুন</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">কয়েকটি সহজ ধাপে শুরু করুন</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ওয়ার্কস্পেস নাম</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="যেমন: Acme Corp"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ব্যবসার ধরন</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    >
                      <option value="" disabled>চিহ্নিত করুন</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="education">Education</option>
                      <option value="agency">Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!workspaceName || !businessType}
                  className="w-full bg-purple-600 disabled:bg-purple-400 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors mt-6 flex items-center justify-center space-x-2"
                >
                  <span>পরবর্তী ধাপ</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">কন্টাক্ট ইম্পোর্ট করুন (ঐচ্ছিক)</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">আপনার প্রথম Contact List আপলোড করুন</p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                <UploadCloud className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">CSV ফাইল ড্র্যাগ ও ড্রপ করুন</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">অথবা ব্রাউজ করতে ক্লিক করুন</p>
                <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                  ফাইল নির্বাচন করুন
                </button>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl transition-colors"
                >
                  এড়িয়ে যান
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <span>সম্পন্ন করুন</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-700 text-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
              
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">সব প্রস্তুত!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 relative z-10 text-lg">
                আপনার ওয়ার্কস্পেস সফলভাবে তৈরি করা হয়েছে।
              </p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full max-w-sm mx-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 rounded-xl transition-all hover:scale-105 shadow-xl shadow-purple-500/30 relative z-10 text-lg"
              >
                ড্যাশবোর্ডে যান
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
