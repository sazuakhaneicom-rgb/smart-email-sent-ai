'use client';
import React, { useState, useEffect } from 'react';
import { Activity, Database, Cloud, AlertCircle, PlayCircle, Server, Code, Terminal, Clock } from 'lucide-react';
import { loadAdminConfig } from '@/lib/admin-config';

export default function SystemHealthPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    setConfig(loadAdminConfig());
  }, []);

  const handleTest = (service: string) => {
    setTesting(service);
    setTimeout(() => {
      setTesting(null);
      alert(`${service} connection test complete (Simulation)`);
    }, 1500);
  };

  const services = [
    { id: 'firebase', name: 'Firebase Services', icon: Database, color: '#F59E0B', status: 'unknown', lastChecked: 'Never' },
    { id: 'ses', name: 'Amazon SES', icon: Cloud, color: '#06B6D4', status: 'unknown', lastChecked: 'Never' },
    { id: 'redis', name: 'Redis Cache', icon: Server, color: '#DC2626', status: 'unknown', lastChecked: 'Never' }
  ];

  const crons = [
    { name: 'Campaign Dispatcher', schedule: 'Every minute', lastRun: '2 mins ago', status: 'Active' },
    { name: 'Domain Verification Check', schedule: 'Every 6 hours', lastRun: '4 hours ago', status: 'Active' },
    { name: 'Usage Alert Monitor', schedule: 'Hourly', lastRun: '15 mins ago', status: 'Active' },
    { name: 'Daily Stats Aggregation', schedule: 'Midnight (00:00)', lastRun: '12 hours ago', status: 'Active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <div>
        <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 600, margin: '0 0 4px 0' }}>সিস্টেম হেলথ</h1>
        <p style={{ color: '#8888A8', margin: 0, fontSize: '0.875rem' }}>সার্ভিস স্ট্যাটাস, ক্রন জবস এবং এনভায়রনমেন্ট</p>
      </div>

      {/* Service Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {services.map(svc => (
          <div key={svc.id} style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '16px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '8px', background: `rgba(${svc.color === '#F59E0B' ? '245,158,11' : svc.color === '#06B6D4' ? '6,182,212' : '220,38,38'}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svc.icon size={20} color={svc.color} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#E8E8F0', fontSize: '1rem' }}>{svc.name}</h3>
                <p style={{ margin: 0, color: '#8888A8', fontSize: '0.75rem' }}>Last checked: {svc.lastChecked}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={14} color="#8888A8" />
                <span style={{ color: '#8888A8', fontSize: '0.85rem', textTransform: 'uppercase' }}>{svc.status}</span>
              </div>
              <button 
                onClick={() => handleTest(svc.id)}
                disabled={testing === svc.id}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', 
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', 
                  color: '#8B5CF6', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' 
                }}
              >
                {testing === svc.id ? <div style={{ width: 12, height: 12, border: '2px solid #8B5CF6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <PlayCircle size={14} />}
                {testing === svc.id ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Cron Jobs */}
        <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
            <Clock size={20} color="#8B5CF6" />
            <h2 style={{ color: '#8B5CF6', fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Background Cron Jobs</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                <th style={{ padding: '12px 20px', color: '#8888A8', fontSize: '0.75rem', fontWeight: 600 }}>Job Name</th>
                <th style={{ padding: '12px 20px', color: '#8888A8', fontSize: '0.75rem', fontWeight: 600 }}>Schedule</th>
                <th style={{ padding: '12px 20px', color: '#8888A8', fontSize: '0.75rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {crons.map((cron, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(139,92,246,0.05)' }}>
                  <td style={{ padding: '12px 20px', color: '#E8E8F0', fontSize: '0.85rem' }}>
                    {cron.name}
                    <div style={{ color: '#8888A8', fontSize: '0.65rem', marginTop: 2 }}>Last: {cron.lastRun}</div>
                  </td>
                  <td style={{ padding: '12px 20px', color: '#06B6D4', fontSize: '0.75rem', fontFamily: 'monospace' }}>{cron.schedule}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: '4px', fontSize: '0.7rem' }}>{cron.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Env Vars Checklist */}
        <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
            <Code size={20} color="#06B6D4" />
            <h2 style={{ color: '#06B6D4', fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Environment Variables</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['firebaseApiKey', 'awsAccessKeyId', 'jwtSecret', 'redisUrl'].map(key => {
              const isSet = !!config[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#E8E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{key}</span>
                  <span style={{ color: isSet ? '#10B981' : '#EF4444', fontSize: '0.75rem' }}>{isSet ? 'SET' : 'MISSING'}</span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid rgba(139,92,246,0.1)' }}>
            <h3 style={{ color: '#E8E8F0', fontSize: '0.9rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={16} /> System Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#8888A8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <div>Node.js Version: v18.17.0 (Mock)</div>
              <div>Next.js Version: 14.1.0 (Mock)</div>
              <div>OS: Windows Server / Vercel Edge</div>
              <div>Build Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
