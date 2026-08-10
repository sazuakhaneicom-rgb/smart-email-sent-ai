'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, Shield, Mail, TrendingUp, AlertTriangle, Server } from 'lucide-react';
import { onConfigSync, getAgentConfig, type ConfigSyncMessage } from '@/lib/config-sync';

type AgentStatus = 'active' | 'paused' | 'stopped';

interface MonitorState {
  agentStatus: AgentStatus;
  emailProvider: string;
  throttleRate: number;
  dailySendLimit: number;
  stealthMode: boolean;
  sentToday: number;
  deliveryRate: number;
}

const PROVIDER_LABELS: Record<string, string> = {
  demo: 'Demo Mode',
  aws_ses: 'Amazon SES',
  smtp: 'Custom SMTP',
  sendgrid: 'SendGrid',
  mailgun: 'Mailgun',
};

const STATUS_STYLES: Record<AgentStatus, { color: string; bg: string; label: string; dot: string }> = {
  active:  { color: '#34D399', bg: 'rgba(16,185,129,0.12)', label: '● চালু (Active)',   dot: '#10B981' },
  paused:  { color: '#FCD34D', bg: 'rgba(245,158,11,0.12)',  label: '⏸ বিরতি (Paused)', dot: '#F59E0B' },
  stopped: { color: '#F87171', bg: 'rgba(239,68,68,0.12)',   label: '⏹ বন্ধ (Stopped)',  dot: '#EF4444' },
};

export default function LiveMonitor() {
  const [state, setState] = useState<MonitorState>(() => {
    const cfg = getAgentConfig();
    return {
      agentStatus: (cfg.agentStatus as AgentStatus) || 'active',
      emailProvider: cfg.emailProvider || 'demo',
      throttleRate: cfg.throttleRate || 50,
      dailySendLimit: cfg.dailySendLimit || 5000,
      stealthMode: cfg.stealthMode !== false,
      sentToday: 0,
      deliveryRate: 99.4,
    };
  });

  // Simulate live sent count tick when agent is active
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.agentStatus === 'active' && state.emailProvider !== 'demo') {
      tickRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          sentToday: Math.min(prev.sentToday + Math.floor(Math.random() * 3) + 1, prev.dailySendLimit),
          deliveryRate: parseFloat((99.2 + Math.random() * 0.7).toFixed(1)),
        }));
      }, 3000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [state.agentStatus, state.emailProvider]);

  // Listen for BroadcastChannel sync from Admin Panel
  useEffect(() => {
    const unsub = onConfigSync((msg: ConfigSyncMessage) => {
      if (msg.type === 'CONFIG_UPDATED') {
        const p = msg.payload;
        setState(prev => ({
          ...prev,
          agentStatus: p.agentStatus ?? prev.agentStatus,
          emailProvider: p.emailProvider ?? prev.emailProvider,
          throttleRate: p.throttleRate ?? prev.throttleRate,
          dailySendLimit: p.dailySendLimit ?? prev.dailySendLimit,
          stealthMode: p.stealthMode !== undefined ? p.stealthMode : prev.stealthMode,
        }));
      } else if (msg.type === 'AGENT_STATUS_CHANGED') {
        setState(prev => ({ ...prev, agentStatus: msg.payload.status }));
      }
    });
    return unsub;
  }, []);

  const ss = STATUS_STYLES[state.agentStatus];
  const progress = Math.round((state.sentToday / state.dailySendLimit) * 100);

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(139,92,246,0.5)',
          }}>
            <Activity size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Agent Monitor</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Admin থেকে পরিবর্তন হলে সাথে সাথে আপডেট হয়</p>
          </div>
        </div>
        {/* Status Badge */}
        <span style={{
          padding: '5px 12px', borderRadius: 999,
          background: ss.bg, color: ss.color,
          fontSize: '0.72rem', fontWeight: 700,
          border: `1px solid ${ss.color}30`,
          animation: state.agentStatus === 'active' ? 'pulse-soft 2s infinite' : 'none',
        }}>
          {ss.label}
        </span>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {/* Provider */}
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <Server size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Provider</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: state.emailProvider === 'demo' ? '#9CA3AF' : '#34D399' }}>
            {PROVIDER_LABELS[state.emailProvider] || state.emailProvider}
          </p>
        </div>

        {/* Throttle Rate */}
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <Zap size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Throttle</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>
            {state.throttleRate}/sec
          </p>
        </div>

        {/* Delivery Rate */}
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <TrendingUp size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34D399' }}>{state.deliveryRate}%</p>
        </div>

        {/* Stealth */}
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <Shield size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stealth</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: state.stealthMode ? '#A78BFA' : '#6B7280' }}>
            {state.stealthMode ? 'ON ✓' : 'OFF'}
          </p>
        </div>
      </div>

      {/* Daily Send Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Mail size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>আজকের পাঠানো</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {state.sentToday.toLocaleString('bn-BD')} / {state.dailySendLimit.toLocaleString('bn-BD')}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 999,
            background: progress > 80
              ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
              : 'linear-gradient(90deg, #7C3AED, #06B6D4)',
            transition: 'width 0.5s ease',
          }} />
        </div>
        {state.emailProvider === 'demo' && (
          <p style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: 6 }}>
            ⚠ ডেমো মোড — Admin ➔ AI Agent Config থেকে email provider সেট করুন
          </p>
        )}
      </div>
    </div>
  );
}
