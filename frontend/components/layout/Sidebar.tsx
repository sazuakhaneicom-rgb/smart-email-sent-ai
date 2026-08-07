'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Send, Users, FileText, BarChart2, Settings, ChevronDown, LogOut, Cpu } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: 'ড্যাশবোর্ড', href: '/dashboard', icon: LayoutDashboard },
    { name: 'ক্যাম্পেইন', href: '/campaigns', icon: Send },
    { name: 'কন্টাক্টস', href: '/contacts', icon: Users },
    { name: 'টেমপ্লেট', href: '/templates', icon: FileText },
  ];

  const analyticsNav = [
    { name: 'বিশ্লেষণ', href: '/analytics', icon: BarChart2 },
  ];
  
  const comingSoonNav = [
    { name: 'অটোমেশন', href: '#', icon: Cpu, badge: 'শীঘ্রই' },
  ];

  const adminNav = [
    { name: 'সেটিংস', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col hidden md:flex sticky top-0">
      {/* Top */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2 space-x-reverse mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Smart Email AI</span>
        </div>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs">M</div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">My Workspace</span>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">মূল</h4>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={cn(
                  "flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">বিশ্লেষণ</h4>
          <div className="space-y-1">
            {analyticsNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={cn(
                  "flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">এরপর</h4>
          <div className="space-y-1">
            {comingSoonNav.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{item.badge}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">প্রশাসন</h4>
          <div className="space-y-1">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={cn(
                  "flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
              <Users className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">ইউজার নেম</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">user@email.com</p>
            </div>
          </div>
        </div>
        <button className="w-full flex items-center justify-center space-x-2 space-x-reverse py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          <span>লগ আউট</span>
        </button>
      </div>
    </aside>
  );
}
