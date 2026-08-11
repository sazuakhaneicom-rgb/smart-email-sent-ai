'use client';

// Root page — simply redirect to login.
// Login page will redirect to /dashboard if user is already authenticated.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
