'use client';

import { useState } from 'react';
import { UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImportPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  const startImport = () => {
    setStep(4);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 150);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-['Anek_Bangla'] text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">কনট্যাক্ট ইমপোর্ট</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">CSV ফাইল থেকে আপনার কনট্যাক্ট যোগ করুন</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded"></div>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-gray-900 ${step >= s ? 'bg-[#7C3AED] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
            {s < step ? <CheckCircle2 size={20} /> : s}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[400px]">
        {step === 1 && (
          <div className="text-center h-full flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold mb-6">ফাইল আপলোড করুন</h2>
            <div className="w-full max-w-lg border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer group">
              <UploadCloud size={48} className="mx-auto text-gray-400 group-hover:text-[#7C3AED] mb-4 transition-colors" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">ফাইল টেনে দিন অথবা ক্লিক করুন</p>
              <p className="text-sm text-gray-500 mt-2">Max: 10MB, 50,000 rows. CSV format only.</p>
            </div>
            
            {/* Mock file selected state */}
            <div className="mt-6 flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-lg">
              <FileSpreadsheet className="text-green-500" size={24} />
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">contacts_2023.csv</p>
                <p className="text-xs text-gray-500">2.4 MB • ~5,234 rows</p>
              </div>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors text-sm">
                পরবর্তী <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">কলাম ম্যাপ করুন</h2>
            <p className="text-gray-500 text-sm mb-6">আপনার ফাইলের কলামগুলোর সাথে আমাদের সিস্টেমের ফিল্ড মেলাুন</p>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 text-sm">
                  <tr>
                    <th className="p-4">CSV কলাম</th>
                    <th className="p-4">আমাদের ফিল্ড</th>
                    <th className="p-4 text-gray-500">নমুনা ডেটা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <tr>
                    <td className="p-4 font-medium">first_name</td>
                    <td className="p-4">
                      <select className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]">
                        <option>Name (First)</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-500 italic">Rahim, Karim, Jabbar</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium flex items-center gap-2">email_address <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Required</span></td>
                    <td className="p-4">
                      <select className="w-full p-2 rounded border border-[#7C3AED] bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]">
                        <option>Email</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-500 italic">rahim@example.com</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">phone_num</td>
                    <td className="p-4">
                      <select className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]">
                        <option>Phone Number</option>
                        <option>Ignore</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-500 italic">+8801712345678</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                পিছনে
              </button>
              <button onClick={() => setStep(3)} className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors">
                পরবর্তী ধাপ
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-2">প্রিভিউ</h2>
            <p className="text-gray-500 text-sm mb-6">নিশ্চিত করুন সবকিছু ঠিক আছে কিনা। প্রথম ৫টি সারি দেখানো হচ্ছে।</p>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr><td className="p-3">Rahim</td><td className="p-3">rahim@example.com</td><td className="p-3">+8801712345678</td></tr>
                  <tr><td className="p-3">Karim</td><td className="p-3">karim@example.com</td><td className="p-3">+8801812345678</td></tr>
                  <tr><td className="p-3">Jabbar</td><td className="p-3">jabbar@example.com</td><td className="p-3">+8801912345678</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg flex gap-3 text-sm">
              <AlertCircle size={20} className="shrink-0" />
              <p>আপনি ৫,২৩৪ টি নতুন কনট্যাক্ট ইমপোর্ট করতে যাচ্ছেন। অবৈধ ইমেইলগুলো স্বয়ংক্রিয়ভাবে বাদ দেওয়া হবে।</p>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                পিছনে
              </button>
              <button onClick={startImport} className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-bold shadow-md shadow-[#7C3AED]/30">
                ইমপোর্ট শুরু করুন
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center flex flex-col justify-center items-center h-full py-12">
            {progress < 100 ? (
              <>
                <div className="w-20 h-20 border-4 border-gray-200 border-t-[#7C3AED] rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-bold mb-2">ইমপোর্ট চলছে...</h2>
                <p className="text-gray-500 mb-6">দয়া করে এই পেজটি বন্ধ করবেন না</p>
                
                <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-[#7C3AED] h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm font-bold text-[#7C3AED]">{progress}%</p>
              </>
            ) : (
              <div className="animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">সফলভাবে ইমপোর্ট হয়েছে!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 font-medium">৫,২৩৪ তে ৪,১৯২ যোগ হয়েছে। (১০৪২টি অবৈধ বা ডুপ্লিকেট)</p>
                <button onClick={() => window.location.href = '/contacts'} className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors">
                  কনট্যাক্ট লিস্টে যান
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
