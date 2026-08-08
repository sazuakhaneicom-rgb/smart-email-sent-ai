'use client';
import React, { useState, useEffect } from 'react';
import { Settings, Globe, Mail, ToggleLeft, Shield, Save, CheckCircle2 } from 'lucide-react';
import { loadAdminConfig, saveAdminConfig } from '@/lib/admin-config';

export default function SettingsPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    setConfig(loadAdminConfig());
  }, []);

  const handleSave = (keys: string[]) => {
    const dataToSave = keys.reduce((acc, key) => ({ ...acc, [key]: config[key] }), {});
    saveAdminConfig(dataToSave);
    setToast('গ্লোবাল সেটিংস সেভ করা হয়েছে!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.1)' }}>
      <span style={{ color: '#E8E8F0', fontSize: '0.9rem' }}>{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        style={{ 
          background: checked ? '#06B6D4' : 'rgba(139,92,246,0.2)', border: 'none', 
          borderRadius: '12px', width: '40px', height: '24px', position: 'relative', 
          cursor: 'pointer', transition: 'all 0.3s'
        }}
      >
        <div style={{ 
          width: '18px', height: '18px', background: '#fff', borderRadius: '50%', 
          position: 'absolute', top: '3px', left: checked ? '19px' : '3px', transition: 'all 0.3s' 
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, background: 'rgba(16,185,129,0.9)', 
          color: '#fff', padding: '12px 20px', borderRadius: '8px', display: 'flex', 
          alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(16,185,129,0.3)', zIndex: 100
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.875rem' }}>{toast}</span>
        </div>
      )}

      <div>
        <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 600, margin: '0 0 4px 0' }}>গ্লোবাল সেটিংস</h1>
        <p style={{ color: '#8888A8', margin: 0, fontSize: '0.875rem' }}>সিস্টেমের সাধারণ কনফিগারেশন এবং প্ল্যান লিমিট</p>
      </div>

      {/* Site Configuration */}
      <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
          <Globe size={20} color="#06B6D4" />
          <h2 style={{ color: '#06B6D4', fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Site Configuration</h2>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {['siteName', 'siteUrl', 'apiBaseUrl', 'supportEmail'].map(key => (
            <div key={key}>
              <label style={{ display: 'block', color: '#8888A8', fontSize: '0.8rem', marginBottom: '6px' }}>{key}</label>
              <input
                type="text" value={config[key] || ''} onChange={(e) => handleChange(key, e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: '6px', color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => handleSave(['siteName', 'siteUrl', 'apiBaseUrl', 'supportEmail'])} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#E8E8F0', borderRadius: '6px', cursor: 'pointer' }}>
              <Save size={14} /> সেভ করুন
            </button>
          </div>
        </div>
      </div>

      {/* Email Defaults & Features */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
            <Mail size={20} color="#8B5CF6" />
            <h2 style={{ color: '#8B5CF6', fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Email Defaults</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['defaultFromName', 'defaultFromEmail'].map(key => (
              <div key={key}>
                <label style={{ display: 'block', color: '#8888A8', fontSize: '0.8rem', marginBottom: '6px' }}>{key}</label>
                <input type="text" value={config[key] || ''} onChange={(e) => handleChange(key, e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: '6px', color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => handleSave(['defaultFromName', 'defaultFromEmail'])} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#E8E8F0', borderRadius: '6px', cursor: 'pointer' }}>
                <Save size={14} /> সেভ
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
            <ToggleLeft size={20} color="#10B981" />
            <h2 style={{ color: '#10B981', fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Feature Flags</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toggle label="Enable New Signups" checked={config.signupEnabled !== false} onChange={(v) => handleChange('signupEnabled', v)} />
            <Toggle label="Maintenance Mode" checked={config.maintenanceMode === true} onChange={(v) => handleChange('maintenanceMode', v)} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => handleSave(['signupEnabled', 'maintenanceMode'])} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#E8E8F0', borderRadius: '6px', cursor: 'pointer' }}>
                <Save size={14} /> সেভ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Limits */}
      <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
          <Shield size={20} color="#F59E0B" />
          <h2 style={{ color: '#F59E0B', fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Plan Limits</h2>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {['free', 'pro', 'business'].map(plan => (
            <div key={plan} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.1)' }}>
              <h3 style={{ color: '#E8E8F0', margin: '0 0 16px 0', textTransform: 'capitalize', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{plan} Plan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['emailsPerMonth', 'contactsLimit', 'workspaceMembersLimit'].map(limitKey => (
                  <div key={limitKey}>
                    <label style={{ display: 'block', color: '#8888A8', fontSize: '0.75rem', marginBottom: '4px' }}>{limitKey}</label>
                    <input type="number" value={config[`${plan}_${limitKey}`] || ''} onChange={(e) => handleChange(`${plan}_${limitKey}`, e.target.value)} style={{ width: '100%', background: 'rgba(7,7,15,0.8)', border: '1px solid rgba(139,92,246,0.3)', padding: '8px', borderRadius: '4px', color: '#E8E8F0', outline: 'none', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => {
              const keysToSave = ['free', 'pro', 'business'].flatMap(p => ['emailsPerMonth', 'contactsLimit', 'workspaceMembersLimit'].map(l => `${p}_${l}`));
              handleSave(keysToSave);
            }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#E8E8F0', borderRadius: '6px', cursor: 'pointer' }}>
              <Save size={14} /> সেভ লিমিটস
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
