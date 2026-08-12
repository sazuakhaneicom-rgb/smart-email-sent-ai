'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Only execute redirect if browser is strictly on the root '/' route
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const isAuth = useAuthStore.getState().isAuthenticated;
      if (isAuth) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [router]);

  return null;
}
