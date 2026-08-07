'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, X } from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      priceMonthly: 0,
      priceAnnual: 0,
      contacts: '500',
      emails: '1000',
      features: ['বেসিক টেমপ্লেট', 'বাংলা ইন্টারফেস', 'ইমেইল সাপোর্ট', 'ড্র্যাগ-ড্রপ এডিটর'],
      missing: ['অ্যাডভান্সড অ্যানালিটিক্স', 'কাস্টম ডোমেইন', 'অটোমেশন'],
      popular: false,
      cta: 'বিনামূল্যে শুরু করুন'
    },
    {
      name: 'Pro',
      priceMonthly: 1490,
      priceAnnual: 1192, // 20% off
      contacts: '10,000',
      emails: '50,000',
      features: ['সব প্রিমিয়াম টেমপ্লেট', 'অ্যাডভান্সড অ্যানালিটিক্স', 'কাস্টম ডোমেইন', 'প্রায়োরিটি সাপোর্ট', 'অটোমেশন'],
      missing: ['ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার'],
      popular: true,
      cta: 'বিনামূল্যে শুরু করুন'
    },
    {
      name: 'Business',
      priceMonthly: 4990,
      priceAnnual: 3992,
      contacts: 'Unlimited',
      emails: '200,000',
      features: ['সব ফিচার অন্তর্ভুক্ত', 'আনলিমিটেড কন্টাক্টস', 'ডেডিকেটেড আইপি', 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার', 'কাস্টম ইন্টিগ্রেশন'],
      missing: [],
      popular: false,
      cta: 'যোগাযোগ করুন'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Smart Email</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">লগইন</Link>
            <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">শুরু করুন</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">সঠিক প্ল্যান বেছে নিন</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          আপনার ব্যবসার আকার অনুযায়ী আমাদের প্ল্যানগুলো সাজানো হয়েছে। কোনো লুকানো চার্জ নেই।
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>মাসিক</span>
          <button
            className="w-16 h-8 bg-purple-600 rounded-full relative p-1 transition-colors"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isAnnual ? 'translate-x-8' : ''}`}></div>
          </button>
          <span className={`text-sm font-medium flex items-center ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            বার্ষিক <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs rounded-full font-bold">২০% ছাড়</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl border ${plan.popular ? 'border-purple-500 dark:border-purple-500 transform md:-translate-y-4' : 'border-gray-200 dark:border-gray-800'} p-8 flex flex-col transition-all duration-300 hover:shadow-2xl`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">৳ {isAnnual ? plan.priceAnnual : plan.priceMonthly}</span>
                <span className="text-gray-500 dark:text-gray-400">/মাস</span>
              </div>

              <div className="space-y-4 mb-8 flex-1 text-left">
                <p className="font-medium text-purple-600 dark:text-purple-400 border-b border-gray-100 dark:border-gray-800 pb-4">
                  {plan.contacts} Contacts & {plan.emails} Emails/mo
                </p>
                
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                
                {plan.missing.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 opacity-50">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className={`w-full py-3 rounded-xl font-medium text-center transition-colors ${plan.popular ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30' : 'bg-purple-50 dark:bg-gray-800 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-gray-700'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">সাধারণ প্রশ্নাবলী</h2>
        <div className="space-y-6">
          {[
            { q: 'আমি কি পরে প্ল্যান আপগ্রেড বা ডাউনগ্রেড করতে পারব?', a: 'হ্যাঁ, আপনি যেকোনো সময় আপনার প্ল্যান পরিবর্তন করতে পারবেন। আপগ্রেড করলে নতুন ফিচারগুলো সাথে সাথে চালু হয়ে যাবে।' },
            { q: 'ফ্রি প্ল্যানে কি কোনো সময়সীমা আছে?', a: 'না, ফ্রি প্ল্যান আজীবন ফ্রি। তবে প্রতি মাসে আপনি সর্বোচ্চ ১০০০ ইমেইল পাঠাতে পারবেন।' },
            { q: 'কীভাবে পেমেন্ট করব?', a: 'আমরা বিকাশ, নগদ, রকেট সহ সব ধরণের কার্ড (ভিসা, মাস্টারকার্ড) গ্রহণ করি।' }
          ].map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
