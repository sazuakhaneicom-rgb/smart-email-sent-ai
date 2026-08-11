'use client';
import React from 'react';
import { Users, Layout, Send, Activity, Clock, Database, Cloud, InboxIcon } from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { label: 'মোট ইউজার', value: '০', icon: Users, color: '#8B5CF6' },
    { label: 'মোট ওয়ার্কস্পেস', value: '০', icon: Layout, color: '#06B6D4' },
    { label: 'আজকের ইমেইল সেন্ট', value: '০', icon: Send, color: '#10B981' },
    { label: 'সিস্টেম আপটাইম', value: '—', icon: Activity, color: '#F59E0B' },
  ];

  const services = [
    { name: 'Firebase Auth', icon: Database, status: 'সংযুক্ত', color: '#34D399', connected: true },
    { name: 'Amazon SES', icon: Cloud, status: 'কনফিগার করুন', color: '#F59E0B', connected: false },
    { name: 'Redis Cache', icon: Activity, status: 'কনফিগার করুন', color: '#F59E0B', connected: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Anek Bangla', sans-serif" }}>
      <div>
        <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px 0' }}>অ্যাডমিন ড্যাশবোর্ড</h1>
        <p style={{ color: '#8888A8', margin: 0, fontSize: '0.875rem' }}>সিস্টেমের বর্তমান অবস্থা ও পরিসংখ্যান</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ color: '#8888A8', fontSize: '0.8rem', margin: '0 0 8px 0' }}>{stat.label}</p>
              <h3 style={{ color: '#E8E8F0', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{stat.value}</h3>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: '10px',
              background: `${stat.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <stat.icon size={20} color={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Service Status */}
        <div style={{
          background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: '12px', padding: '20px',
        }}>
          <h2 style={{ color: '#E8E8F0', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#06B6D4" />
            সার্ভিস স্ট্যাটাস
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {services.map((svc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svc.icon size={18} color={svc.color} />
                  <span style={{ color: '#E8E8F0', fontSize: '0.875rem' }}>{svc.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: svc.color, boxShadow: svc.connected ? `0 0 8px ${svc.color}` : 'none' }} />
                  <span style={{ color: svc.color, fontSize: '0.75rem' }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity — empty state */}
        <div style={{
          background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: '12px', padding: '20px',
        }}>
          <h2 style={{ color: '#E8E8F0', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} color="#8B5CF6" />
            সাম্প্রতিক অ্যাক্টিভিটি
          </h2>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '32px 16px', gap: 12, textAlign: 'center',
          }}>
            <InboxIcon size={28} style={{ color: 'rgba(139,92,246,0.4)' }} />
            <p style={{ color: '#8888A8', fontSize: '0.875rem', margin: 0 }}>এখনো কোনো অ্যাক্টিভিটি নেই</p>
          </div>
        </div>
      </div>
    </div>
  );
}
