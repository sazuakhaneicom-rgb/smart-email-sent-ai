'use client';
import React, { useState } from 'react';
import { Search, Ban, Eye, ShieldAlert, User as UserIcon } from 'lucide-react';

const mockUsers = [
  { uid: 'USR001', name: 'সাজু আখন্দ', email: 'sazu@akheni.com', workspace: 'Akheni Tech', plan: 'Business', joinedAt: '2024-01-15', status: 'active' },
  { uid: 'USR002', name: 'রহিম মিয়া', email: 'rahim@example.com', workspace: 'Digital BD', plan: 'Pro', joinedAt: '2024-02-10', status: 'active' },
  { uid: 'USR003', name: 'করিম হোসেন', email: 'karim@example.com', workspace: 'Karim Shop', plan: 'Free', joinedAt: '2024-03-05', status: 'blocked' },
  { uid: 'USR004', name: 'আরিফ জামান', email: 'arif@example.com', workspace: 'Tech World', plan: 'Pro', joinedAt: '2024-04-12', status: 'active' },
  { uid: 'USR005', name: 'তাসনিম আলম', email: 'tasnim@example.com', workspace: 'Creative Studio', plan: 'Free', joinedAt: '2024-05-20', status: 'active' },
  { uid: 'USR006', name: 'মাহমুদ হাসান', email: 'mahmud@example.com', workspace: 'E-commerce BD', plan: 'Business', joinedAt: '2024-06-08', status: 'active' },
  { uid: 'USR007', name: 'সুমন দাশ', email: 'sumon@example.com', workspace: 'Sumon Agency', plan: 'Pro', joinedAt: '2024-07-01', status: 'active' },
  { uid: 'USR008', name: 'নাসির উদ্দিন', email: 'nasir@example.com', workspace: 'Nasir Corp', plan: 'Free', joinedAt: '2024-07-25', status: 'blocked' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filteredUsers = mockUsers.filter(u => 
    u.name.includes(search) || u.email.includes(search) || u.uid.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 600, margin: '0 0 4px 0' }}>ইউজার ম্যানেজমেন্ট</h1>
        <p style={{ color: '#8888A8', margin: 0, fontSize: '0.875rem' }}>প্লাটফর্মের সকল ব্যবহারকারী এবং তাদের অবস্থা</p>
      </div>

      <div style={{ 
        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', 
        padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 12 
      }}>
        <ShieldAlert size={20} color="#F59E0B" />
        <span style={{ color: '#F59E0B', fontSize: '0.875rem' }}>নোট: রেজিস্টার্ড ইউজার তালিকা এবং স্ট্যাটাস নিচে প্রদর্শিত হচ্ছে।</span>
      </div>

      <div style={{ background: 'rgba(7,7,15,0.6)', border: `1px solid rgba(139,92,246,0.15)`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="#8888A8" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.2)', 
                padding: '8px 12px 8px 36px', borderRadius: '6px', color: '#E8E8F0', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <span style={{ color: '#8888A8', fontSize: '0.875rem' }}>Total: {filteredUsers.length}</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>UID</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>User Info</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Workspace</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Plan</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.uid} style={{ borderBottom: '1px solid rgba(139,92,246,0.05)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '12px 16px', color: '#E8E8F0', fontSize: '0.875rem', fontFamily: 'monospace' }}>{user.uid}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserIcon size={16} color="#8B5CF6" />
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#E8E8F0', fontSize: '0.875rem', fontWeight: 500 }}>{user.name}</p>
                        <p style={{ margin: 0, color: '#8888A8', fontSize: '0.75rem' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.875rem' }}>{user.workspace}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: user.plan === 'Business' ? 'rgba(6,182,212,0.1)' : user.plan === 'Pro' ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.05)',
                      color: user.plan === 'Business' ? '#06B6D4' : user.plan === 'Pro' ? '#8B5CF6' : '#8888A8'
                    }}>
                      {user.plan}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: user.status === 'active' ? '#10B981' : '#EF4444' }} />
                      <span style={{ color: user.status === 'active' ? '#10B981' : '#EF4444', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: 'rgba(139,92,246,0.1)', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#8B5CF6' }} title="View">
                        <Eye size={16} />
                      </button>
                      <button style={{ background: 'rgba(239,68,68,0.1)', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#EF4444' }} title={user.status === 'active' ? "Block" : "Unblock"}>
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8888A8' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
