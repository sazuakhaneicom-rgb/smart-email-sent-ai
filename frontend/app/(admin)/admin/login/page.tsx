'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      router.replace('/admin');
    } else {
      setError('Invalid access code. Authorization denied.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#030307', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Anek Bangla', sans-serif" 
    }}>
      <div style={{ maxWidth: 400, width: '100%', padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, 
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', 
            border: '1px solid rgba(139,92,246,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            marginBottom: 16, boxShadow: '0 0 20px rgba(139,92,246,0.2)' 
          }}>
            <Terminal size={24} color="#06B6D4" />
          </div>
          <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 600, margin: 0, letterSpacing: '0.05em' }}>SYSTEM ACCESS</h1>
          <p style={{ color: '#8888A8', fontSize: '0.875rem', marginTop: 4 }}>Authorize to continue</p>
        </div>

        <div style={{ 
          background: 'rgba(248,113,113,0.05)', 
          border: '1px solid rgba(248,113,113,0.2)', 
          padding: '12px 16px', borderRadius: 8, 
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 
        }}>
          <ShieldAlert size={20} color="#F87171" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ color: '#F87171', fontSize: '0.875rem', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Restricted Access</p>
            <p style={{ color: 'rgba(248,113,113,0.8)', fontSize: '0.75rem', margin: 0 }}>Unauthorized attempts will be logged.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              style={{ 
                width: '100%', background: 'rgba(7,7,15,0.8)', 
                border: '1px solid rgba(139,92,246,0.3)', padding: '12px 16px', 
                borderRadius: 8, color: '#E8E8F0', fontSize: '1rem', 
                outline: 'none', fontFamily: 'monospace', 
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
          </div>
          {error && (
            <p style={{ color: '#F87171', fontSize: '0.875rem', margin: 0, textAlign: 'center', fontFamily: 'monospace' }}>
              {error}
            </p>
          )}
          <button type="submit" style={{ 
            width: '100%', padding: '12px', 
            background: 'linear-gradient(90deg, rgba(139,92,246,0.9), rgba(6,182,212,0.9))', 
            border: 'none', borderRadius: 8, color: '#fff', 
            fontSize: '1rem', fontWeight: 600, cursor: 'pointer', 
            textTransform: 'uppercase', letterSpacing: '0.1em', 
            boxShadow: '0 0 15px rgba(139,92,246,0.4)' 
          }}>
            Initialize
          </button>
        </form>
      </div>
    </div>
  );
}
