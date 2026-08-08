'use client';
import React from 'react';
import { Users, Layout, Send, Activity, Clock, Database, Cloud } from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { label: 'মোট ইউজার', value: '১,২৪০', icon: Users, color: '#8B5CF6' },
    { label: 'মোট ওয়ার্কস্পেস', value: '৮৫', icon: Layout, color: '#06B6D4' },
    { label: 'আজকের ইমেইল সেন্ট', value: '১২,৪৫০', icon: Send, color: '#10B981' },
    { label: 'সিস্টেম আপটাইম', value: '99.9%', icon: Activity, color: '#F59E0B' },
  ];

  const services = [
    { name: 'Firebase', status: 'Unknown', icon: Database, color: '#8888A8' },
    { name: 'Amazon SES', status: 'Unknown', icon: Cloud, color: '#8888A8' },
    { name: 'Redis Cache', status: 'Unknown', icon: Activity, color: '#8888A8' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', details: 'sazu@akheni.com created an account', time: '5 mins ago' },
    { id: 2, action: 'Workspace created', details: 'Marketing Team workspace created', time: '12 mins ago' },
    { id: 3, action: 'Campaign completed', details: '"Welcome Series" sent to 450 contacts', time: '1 hour ago' },
    { id: 4, action: 'API Key updated', details: 'Amazon SES credentials modified', time: '3 hours ago' },
    { id: 5, action: 'System reboot', details: 'Automated maintenance completed', time: '1 day ago' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 600, margin: '0 0 4px 0' }}>ড্যাশবোর্ড ওভারভিউ</h1>
        <p style={{ color: '#8888A8', margin: 0, fontSize: '0.875rem' }}>সিস্টেমের বর্তমান অবস্থা এবং পরিসংখ্যান</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ 
            background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, 
            borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <div>
              <p style={{ color: '#8888A8', fontSize: '0.875rem', margin: '0 0 8px 0' }}>{stat.label}</p>
              <h3 style={{ color: '#E8E8F0', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{stat.value}</h3>
            </div>
            <div style={{ 
              width: 40, height: 40, borderRadius: '10px', 
              background: `rgba(${stat.color === '#8B5CF6' ? '139,92,246' : stat.color === '#06B6D4' ? '6,182,212' : stat.color === '#10B981' ? '16,185,129' : '245,158,11'}, 0.1)`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
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
          borderRadius: '12px', padding: '20px'
        }}>
          <h2 style={{ color: '#E8E8F0', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#06B6D4" />
            কুইক স্ট্যাটাস
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.map((svc, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svc.icon size={18} color={svc.color} />
                  <span style={{ color: '#E8E8F0', fontSize: '0.875rem' }}>{svc.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: svc.color }} />
                  <span style={{ color: svc.color, fontSize: '0.75rem', textTransform: 'uppercase' }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ 
          background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(139,92,246,0.15)', 
          borderRadius: '12px', padding: '20px'
        }}>
          <h2 style={{ color: '#E8E8F0', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} color="#8B5CF6" />
            সাম্প্রতিক অ্যাক্টিভিটি
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivity.map((act) => (
              <div key={act.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6', 
                  marginTop: '6px', boxShadow: '0 0 8px #8B5CF6' 
                }} />
                <div>
                  <p style={{ color: '#E8E8F0', fontSize: '0.875rem', margin: '0 0 2px 0' }}>{act.action}</p>
                  <p style={{ color: '#8888A8', fontSize: '0.75rem', margin: '0 0 4px 0' }}>{act.details}</p>
                  <p style={{ color: 'rgba(139,92,246,0.7)', fontSize: '0.65rem', margin: 0 }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
