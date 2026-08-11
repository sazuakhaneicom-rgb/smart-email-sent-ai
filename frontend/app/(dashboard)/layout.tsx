'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, setWorkspaces, setCurrentWorkspace } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Validate session against Firebase Auth if active
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
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
        }
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      fontFamily: "'Anek Bangla', sans-serif",
    }}>
      {/* Sidebar handles both Desktop and Mobile Drawer */}
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
