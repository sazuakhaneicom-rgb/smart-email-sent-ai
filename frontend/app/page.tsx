import { redirect } from 'next/navigation';

// Landing page — আপাতত /login-এ redirect করা হচ্ছে
// Firebase connect হলে এখানে আসল landing page দেখাবে
export default function RootPage() {
  redirect('/login');
}
