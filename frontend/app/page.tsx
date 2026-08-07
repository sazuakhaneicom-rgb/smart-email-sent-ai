'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, ChevronRight, BarChart3, Users, Zap, Shield, Image as ImageIcon } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Smart Email</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">ফিচার</a>
            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">মূল্য</Link>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">সম্পর্কে</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden md:block text-gray-900 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">লগইন</Link>
            <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 flex items-center">
              শুরু করুন <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm mb-8 border border-purple-200 dark:border-purple-800">
            🚀 বাংলাদেশের প্রথম AI Email Marketing
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Email Marketing <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">এখন সহজ, বাংলায়</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            ছোট-বড় ব্যবসার জন্য সবচেয়ে আধুনিক ও সহজে ব্যবহারযোগ্য ইমেইল মার্কেটিং টুল। আজই শুরু করুন বিনামূল্যে।
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link href="/signup" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-xl shadow-purple-500/30 hover:-translate-y-1 flex items-center justify-center">
              বিনামূল্যে শুরু করুন <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="w-full sm:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-medium text-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700">
              Demo দেখুন
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex -space-x-3 mb-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-400 to-blue-500 text-white shadow-sm">
                  {['S','M','A','R','T'][i-1]}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">ইতিমধ্যে <span className="font-bold text-purple-600 dark:text-purple-400">২০০+ ব্যবসা</span> ব্যবহার করছে</p>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-5xl mx-auto mt-20 relative z-10 perspective-1000">
          <div className="w-full h-64 md:h-[500px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6 transform rotate-x-12 hover:rotate-0 transition-transform duration-700 overflow-hidden">
             {/* Mockup UI drawn with CSS */}
             <div className="w-full h-full flex flex-col">
               <div className="flex space-x-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <div className="flex flex-1 space-x-4">
                 <div className="hidden md:block w-48 bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                   <div className="space-y-3">
                     <div className="h-8 bg-purple-100 dark:bg-purple-900/30 rounded w-full"></div>
                     <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                     <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                   </div>
                 </div>
                 <div className="flex-1 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-inner">
                    <div className="flex justify-between items-center mb-8">
                       <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                       <div className="h-8 bg-purple-600 rounded-lg w-24"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-xl p-4 flex flex-col justify-between">
                          <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-1/2"></div>
                          <div className="h-6 bg-purple-400 dark:bg-purple-600 rounded w-3/4 mt-auto"></div>
                        </div>
                      ))}
                    </div>
                    <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"></div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">৯৮%</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Delivery Rate</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">৫মিনিট</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Setup Time</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">২০০+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">৫০+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">কেন Smart Email?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              সবকিছু যা আপনার প্রয়োজন একটি আধুনিক ইমেইল মার্কেটিং প্ল্যাটফর্মে
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ImageIcon, title: 'Drag-Drop Editor', desc: 'কোনো কোডিং ছাড়াই সুন্দর ইমেইল ডিজাইন করুন।' },
              { icon: CheckCircle2, title: 'Bengali Interface', desc: 'সম্পূর্ণ বাংলা ইন্টারফেস, যা ব্যবহার করা খুবই সহজ।' },
              { icon: BarChart3, title: 'Smart Analytics', desc: 'ওপেন রেট, ক্লিক রেট সহ রিয়েল-টাইম রিপোর্ট দেখুন।' },
              { icon: Shield, title: 'Domain Authentication', desc: 'স্প্যাম এড়াতে কাস্টম ডোমেইন দিয়ে ইমেইল পাঠান।' },
              { icon: Users, title: 'Contact Management', desc: 'সহজে কন্টাক্ট আপলোড, সেগমেন্ট ও ম্যানেজ করুন।' },
              { icon: Zap, title: 'Automation (Phase 2)', desc: 'স্বয়ংক্রিয় ইমেইল ফ্লো সেটআপ করে সময় বাঁচান।' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white dark:bg-gray-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-4">কিভাবে কাজ করে?</h2>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-8">
              {[
                { step: '১', title: 'অ্যাকাউন্ট তৈরি করুন', desc: 'ইমেইল দিয়ে সাইন আপ করুন।' },
                { step: '২', title: 'কন্টাক্ট ইম্পোর্ট করুন', desc: 'আপনার লিস্ট সহজে আপলোড করুন।' },
                { step: '৩', title: 'ক্যাম্পেইন পাঠান', desc: 'টেমপ্লেট বেছে নিয়ে ইমেইল পাঠান।' }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 text-center relative w-full">
                  <div className="w-20 h-20 bg-purple-600 text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                  
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
                  )}
                </div>
              ))}
           </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-purple-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">গ্রাহকরা যা বলছেন</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">রাহুল আহমেদ</h4>
                    <p className="text-sm text-gray-500">CEO, E-shop</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"Smart Email ব্যবহার করে আমাদের বিক্রি ৩০% বৃদ্ধি পেয়েছে। এর বাংলা ইন্টারফেস আমার দলের জন্য খুবই সুবিধাজনক।"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-600 to-blue-700 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">আপনার ব্যবসাকে এগিয়ে নিন</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto relative z-10">আজই বিনামূল্যে শুরু করুন এবং আপনার প্রথম ক্যাম্পেইন পাঠান.</p>
          <Link href="/signup" className="inline-flex items-center bg-white text-purple-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105 relative z-10">
            আজই শুরু করুন <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Mail className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold">Smart Email</span>
          </div>
          
          <div className="flex space-x-6 mb-6 md:mb-0">
            <Link href="/terms" className="text-gray-500 hover:text-purple-600 transition-colors">শর্তাবলী</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-purple-600 transition-colors">গোপনীয়তা</Link>
            <Link href="/contact" className="text-gray-500 hover:text-purple-600 transition-colors">যোগাযোগ</Link>
          </div>
          
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Smart Email. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
