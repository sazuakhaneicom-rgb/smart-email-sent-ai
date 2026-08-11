'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, setUser, setWorkspaces, setCurrentWorkspace, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If Firebase Auth is configured, listen for auth state
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          // Real Firebase user — sync
          const freshUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'ব্যবহারকারী',
            photoURL: fbUser.photoURL || '',
          };
          const freshWorkspace = {
            id: `ws-${fbUser.uid.slice(0, 8)}`,
            name: `${fbUser.displayName || 'ইউজার'}-এর ওয়ার্কস্পেস`,
            plan: 'free' as const,
            role: 'owner' as const,
          };
          setUser(freshUser);
          setWorkspaces([freshWorkspace]);
          setCurrentWorkspace(freshWorkspace);
          setReady(true);
        } else {
          // No Firebase session — check if user logged in via email/password stored in Zustand
          const storedUser = useAuthStore.getState().user;
          if (!storedUser) {
            logout();
            router.replace('/login');
          } else {
            setReady(true);
          }
        }
      });
      return () => unsubscribe();
    } else {
      // Firebase not configured — check Zustand store
      if (!isAuthenticated || !user) {
        router.replace('/login');
      } else {
        setReady(true);
      }
    }
  }, []);

  // While checking auth, show nothing (no flash)
  if (!ready) return null;

  // Not authenticated — render nothing while redirect fires
  if (!isAuthenticated || !user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      fontFamily: "'Anek Bangla', sans-serif",
    }}>
      <Sidebar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="main-content-area"
          style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
