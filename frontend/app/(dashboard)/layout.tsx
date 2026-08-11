'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Zap } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, setUser, setWorkspaces, setCurrentWorkspace, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [firebaseChecked, setFirebaseChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Validate session against Firebase Auth
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          // Firebase session valid — sync user info
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
        } else {
          // No Firebase session → clear everything and redirect
          logout();
          router.replace('/login');
        }
        setFirebaseChecked(true);
      });
      return () => unsubscribe();
    } else {
      // Firebase not available — rely on stored state
      setFirebaseChecked(true);
    }
  }, []);

  // Guard: redirect if not authenticated after check
  useEffect(() => {
    if (mounted && firebaseChecked && !isAuthenticated && !user) {
      router.replace('/login');
    }
  }, [mounted, firebaseChecked, isAuthenticated, user, router]);

  if (!mounted || !firebaseChecked) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-void)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Anek Bangla', sans-serif",
        backgroundImage:
          'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(139,92,246,0.5)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}>
            <Zap size={24} style={{ color: '#fff' }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--neon-purple)',
                animation: `bounce 1s ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(-8px); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) return null;

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
