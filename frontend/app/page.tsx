'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (isAuth) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
