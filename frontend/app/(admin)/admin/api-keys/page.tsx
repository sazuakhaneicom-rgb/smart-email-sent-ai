'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApiKeysRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/hosting');
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#8888A8', fontFamily: "'Anek Bangla', sans-serif" }}>
      হোস্টিং ও ডোমেইন সেটিংস পেজে রিডাইরেক্ট করা হচ্ছে...
    </div>
  );
}
