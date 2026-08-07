import { ReactNode } from 'react';

export const metadata = {
  title: 'Smart Email Sent AI',
  description: 'বাংলাদেশের প্রথম AI Email Marketing',
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30">
      {children}
    </div>
  );
}
