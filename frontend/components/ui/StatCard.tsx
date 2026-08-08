import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  iconBg?: string; // kept for API compat
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  trend,
  icon,
  accentColor = '#8B5CF6',
}: StatCardProps) {
  const glow = accentColor + '33';

  return (
    <div className="stat-card" style={{ fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 16, right: 16, height: 2,
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        borderRadius: 999,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: glow,
          border: `1px solid ${accentColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 12px ${accentColor}30`,
          color: accentColor,
        }}>
          {icon}
        </div>

        {trend && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: '0.7rem', fontWeight: 600,
            padding: '3px 8px', borderRadius: 999,
            background: trend.positive ? 'rgba(16,185,129,0.10)' : 'rgba(248,113,113,0.10)',
            color: trend.positive ? '#34D399' : '#F87171',
          }}>
            {trend.positive
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />}
            {trend.value}
          </span>
        )}
      </div>

      <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{title}</p>
    </div>
  );
}
