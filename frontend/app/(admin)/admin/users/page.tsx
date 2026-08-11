'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Search, ShieldAlert, UserCheck, Ban, Plus, Trash2,
  Edit2, CheckCircle2, X, Shield, Lock, Activity, Sparkles, Filter,
} from 'lucide-react';
import {
  PlatformUser, getPlatformUsers, toggleUserStatus,
  deleteUser, addUser, updateUserRolePlan,
} from '@/lib/user-management';
import { useAuthStore } from '@/store';

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<PlatformUser | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWorkspace, setNewWorkspace] = useState('');
  const [newPlan, setNewPlan] = useState<'Free' | 'Pro' | 'Business'>('Free');
  const [newRole, setNewRole] = useState<'User' | 'Admin'>('User');

  // Edit user state
  const [editPlan, setEditPlan] = useState<'Free' | 'Pro' | 'Business'>('Free');
  const [editRole, setEditRole] = useState<'User' | 'Admin'>('User');

  useEffect(() => {
    let list = getPlatformUsers();
    // Auto sync current logged in user if not present
    if (currentUser && currentUser.email) {
      const exists = list.some(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (!exists) {
        const syncUser: PlatformUser = {
          uid: currentUser.uid || `USR-${Date.now().toString(36)}`,
          name: currentUser.name || currentUser.email.split('@')[0],
          email: currentUser.email,
          workspace: `${currentUser.name || 'ইউজার'}-এর ওয়ার্কস্পেস`,
          plan: 'Pro',
          role: 'Admin',
          status: 'active',
          joinedAt: new Date().toISOString().split('T')[0],
        };
        list = [syncUser, ...list];
      }
    }
    setUsers(list);
  }, [currentUser]);

  const showNotification = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (uid: string, currentStatus: string) => {
    const updated = toggleUserStatus(uid);
    setUsers(updated);
    showNotification(currentStatus === 'active' ? 'ইউজার ব্লক করা হয়েছে!' : 'ইউজার আনব্লক করা হয়েছে!');
  };

  const handleDelete = (uid: string, name: string) => {
    if (!confirm(`আপনি কি সত্যিই "${name}" ইউজারকে মুছে ফেলতে চান?`)) return;
    const updated = deleteUser(uid);
    setUsers(updated);
    showNotification('ইউজার সফলভাবে মুছে ফেলা হয়েছে।');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showNotification('ইউজারের নাম ও ইমেইল আবশ্যক।', false);
      return;
    }
    const updated = addUser({
      name: newName.trim(),
      email: newEmail.trim(),
      workspace: newWorkspace.trim() || `${newName.trim()}-এর ওয়ার্কস্পেস`,
      plan: newPlan,
      role: newRole,
      status: 'active',
    });
    setUsers(updated);
    setShowAddModal(false);
    setNewName(''); setNewEmail(''); setNewWorkspace('');
    showNotification('নতুন ইউজার সফলভাবে যোগ করা হয়েছে!');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    const updated = updateUserRolePlan(editUser.uid, editRole, editPlan);
    setUsers(updated);
    setEditUser(null);
    showNotification('ইউজার রোল ও প্ল্যান আপডেট করা হয়েছে!');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.uid.toLowerCase().includes(search.toLowerCase()) ||
      u.workspace.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const blockedCount = users.filter(u => u.status === 'blocked').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users color="#8B5CF6" size={24} />
            ইউজার ম্যানেজমেন্ট
          </h1>
          <p style={{ color: '#8888A8', margin: 0, fontSize: '0.875rem' }}>
            রেজিস্টার্ড সকল ব্যবহারকারীর অ্যাকাউন্ট, রোল ও অ্যাক্সেস কন্ট্রোল
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          }}
        >
          <Plus size={16} /> নতুন ইউজার যোগ করুন
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          padding: '12px 18px', borderRadius: 10,
          background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.ok ? '#34D399' : '#F87171',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'মোট ইউজার', value: totalUsers, icon: Users, color: '#8B5CF6' },
          { label: 'সক্রিয় ইউজার', value: activeCount, icon: UserCheck, color: '#10B981' },
          { label: 'ব্লকড ইউজার', value: blockedCount, icon: Ban, color: '#EF4444' },
          { label: 'অ্যাডমিন', value: adminCount, icon: Shield, color: '#06B6D4' },
        ].map((m, idx) => (
          <div key={idx} style={{
            background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ color: '#8888A8', fontSize: '0.78rem', margin: '0 0 4px 0' }}>{m.label}</p>
              <h3 style={{ color: '#E8E8F0', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{m.value}</h3>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <m.icon size={18} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div style={{ background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 14, overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{
          padding: 16, borderBottom: '1px solid rgba(139,92,246,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} color="#8888A8" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              placeholder="ইউজার খুঁজুন (নাম, ইমেইল, UID)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(139,92,246,0.2)',
                padding: '8px 12px 8px 36px', borderRadius: 8,
                color: '#E8E8F0', fontSize: '0.85rem', outline: 'none',
                fontFamily: "'Anek Bangla', sans-serif", boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all' as const, label: `সব (${users.length})` },
              { id: 'active' as const, label: `সক্রিয় (${activeCount})` },
              { id: 'blocked' as const, label: `ব্লকড (${blockedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
                  background: statusFilter === tab.id ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.03)',
                  color: statusFilter === tab.id ? '#C4B5FD' : '#8888A8',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>UID / তারিখ</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>ব্যবহারকারী</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>ওয়ার্কস্পেস</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>প্ল্যান / রোল</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>স্ট্যাটাস</th>
                <th style={{ padding: '12px 16px', color: '#8888A8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr key={u.uid} style={{
                  borderBottom: '1px solid rgba(139,92,246,0.05)',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}>
                  {/* UID */}
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ margin: 0, color: '#E8E8F0', fontSize: '0.8rem', fontFamily: 'monospace' }}>{u.uid}</p>
                    <p style={{ margin: '2px 0 0', color: '#8888A8', fontSize: '0.7rem' }}>{u.joinedAt}</p>
                  </td>

                  {/* User info */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.8rem', fontWeight: 700,
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#E8E8F0', fontSize: '0.875rem', fontWeight: 600 }}>
                          {u.name}
                          {u.email === currentUser?.email && (
                            <span style={{ marginLeft: 6, fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(6,182,212,0.2)', color: '#67E8F9' }}>
                              আপনি
                            </span>
                          )}
                        </p>
                        <p style={{ margin: '2px 0 0', color: '#8888A8', fontSize: '0.75rem' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Workspace */}
                  <td style={{ padding: '12px 16px', color: '#C4B5FD', fontSize: '0.85rem' }}>
                    {u.workspace}
                  </td>

                  {/* Plan & Role */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700,
                        background: u.plan === 'Business' ? 'rgba(6,182,212,0.15)' : u.plan === 'Pro' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                        color: u.plan === 'Business' ? '#22D3EE' : u.plan === 'Pro' ? '#A78BFA' : '#8888A8',
                        border: `1px solid ${u.plan === 'Business' ? 'rgba(6,182,212,0.3)' : u.plan === 'Pro' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                        {u.plan}
                      </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700,
                        background: u.role === 'Admin' ? 'rgba(16,185,129,0.15)' : 'transparent',
                        color: u.role === 'Admin' ? '#34D399' : '#8888A8',
                      }}>
                        {u.role}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: u.status === 'active' ? '#10B981' : '#EF4444',
                        boxShadow: `0 0 8px ${u.status === 'active' ? '#10B981' : '#EF4444'}`,
                      }} />
                      <span style={{ color: u.status === 'active' ? '#34D399' : '#F87171', fontSize: '0.78rem', fontWeight: 600 }}>
                        {u.status === 'active' ? 'সক্রিয়' : 'ব্লকড'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {/* Edit Role/Plan */}
                      <button
                        onClick={() => { setEditUser(u); setEditPlan(u.plan); setEditRole(u.role); }}
                        style={{
                          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                          padding: 6, borderRadius: 6, cursor: 'pointer', color: '#A78BFA',
                        }}
                        title="রোল/প্ল্যান পরিবর্তন করুন"
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Block / Unblock */}
                      <button
                        onClick={() => handleToggleStatus(u.uid, u.status)}
                        style={{
                          background: u.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          border: `1px solid ${u.status === 'active' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                          padding: 6, borderRadius: 6, cursor: 'pointer',
                          color: u.status === 'active' ? '#F87171' : '#34D399',
                        }}
                        title={u.status === 'active' ? 'ব্লক করুন' : 'আনব্লক করুন'}
                      >
                        <Ban size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(u.uid, u.name)}
                        style={{
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                          padding: 6, borderRadius: 6, cursor: 'pointer', color: '#8888A8',
                        }}
                        title="মুছে ফেলুন"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#8888A8' }}>
                    কোনো ইউজার পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add User Modal ─────────────────────────────────────── */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            width: '100%', maxWidth: 440, background: '#0F0F1E',
            border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16,
            padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#E8E8F0' }}>নতুন ইউজার যোগ করুন</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#8888A8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>ইউজারের নাম *</label>
                <input
                  type="text" required placeholder="যেমন: তারিক ইসলাম"
                  value={newName} onChange={e => setNewName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>ইমেইল ঠিকানা *</label>
                <input
                  type="email" required placeholder="tariq@example.com"
                  value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>ওয়ার্কস্পেস নাম (ঐচ্ছিক)</label>
                <input
                  type="text" placeholder="যেমন: Tariq Tech"
                  value={newWorkspace} onChange={e => setNewWorkspace(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>প্ল্যান</label>
                  <select
                    value={newPlan} onChange={e => setNewPlan(e.target.value as any)}
                    style={{ width: '100%', background: '#18182E', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>রোল</label>
                  <select
                    value={newRole} onChange={e => setNewRole(e.target.value as any)}
                    style={{ width: '100%', background: '#18182E', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#8888A8', cursor: 'pointer' }}>
                  বাতিল
                </button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ─────────────────────────────────────── */}
      {editUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            width: '100%', maxWidth: 400, background: '#0F0F1E',
            border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16,
            padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#E8E8F0' }}>ইউজার এডিট: {editUser.name}</h3>
              <button onClick={() => setEditUser(null)} style={{ background: 'none', border: 'none', color: '#8888A8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>প্ল্যান নির্বাচন করুন</label>
                <select
                  value={editPlan} onChange={e => setEditPlan(e.target.value as any)}
                  style={{ width: '100%', background: '#18182E', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Free">Free Plan</option>
                  <option value="Pro">Pro Plan</option>
                  <option value="Business">Business Plan</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8888A8', display: 'block', marginBottom: 4 }}>রোল নির্বাচন করুন</label>
                <select
                  value={editRole} onChange={e => setEditRole(e.target.value as any)}
                  style={{ width: '100%', background: '#18182E', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 12px', borderRadius: 8, color: '#E8E8F0', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="User">Standard User</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setEditUser(null)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#8888A8', cursor: 'pointer' }}>
                  বাতিল
                </button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
