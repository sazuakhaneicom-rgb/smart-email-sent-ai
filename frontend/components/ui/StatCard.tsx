import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  iconBg?: string;
}

export function StatCard({ title, value, trend, icon, iconBg = 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
        <div className={cn("p-2 rounded-full", iconBg)}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline space-x-2 space-x-reverse">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</h2>
        {trend && (
          <span className={cn(
            "flex items-center text-xs font-medium",
            trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            {trend.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
