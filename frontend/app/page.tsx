'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from './(dashboard)/layout';
import DashboardPage from './(dashboard)/dashboard/page';

// Route components for SPA fallback hydration
import TemplatesPage from './(dashboard)/templates/page';
import CampaignsPage from './(dashboard)/campaigns/page';
import ContactsPage from './(dashboard)/contacts/page';
import AnalyticsPage from './(dashboard)/analytics/page';
import AiAgentPage from './(dashboard)/ai-agent/page';
import EmailConfigPage from './(dashboard)/settings/email-config/page';
import AccountPage from './(dashboard)/settings/account/page';
import SecurityPage from './(dashboard)/settings/security/page';
import DomainsPage from './(dashboard)/settings/domains/page';
import BillingPage from './(dashboard)/settings/billing/page';
import NotificationsPage from './(dashboard)/settings/notifications/page';
import TeamPage from './(dashboard)/settings/team/page';
import LoginPage from './(public)/login/page';
import SignupPage from './(public)/signup/page';

export default function RootPage() {
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  if (!currentPath) {
    return (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    );
  }

  const cleanPath = currentPath.replace(/\/$/, '') || '/';

  if (cleanPath === '/login') return <LoginPage />;
  if (cleanPath === '/signup') return <SignupPage />;

  let content = <DashboardPage />;
  if (cleanPath === '/templates') {
    content = <TemplatesPage />;
  } else if (cleanPath === '/campaigns' || cleanPath.startsWith('/campaigns/')) {
    content = <CampaignsPage />;
  } else if (cleanPath === '/contacts' || cleanPath.startsWith('/contacts/')) {
    content = <ContactsPage />;
  } else if (cleanPath === '/analytics' || cleanPath.startsWith('/analytics/')) {
    content = <AnalyticsPage />;
  } else if (cleanPath === '/ai-agent') {
    content = <AiAgentPage />;
  } else if (cleanPath === '/settings/email-config') {
    content = <EmailConfigPage />;
  } else if (cleanPath === '/settings/account') {
    content = <AccountPage />;
  } else if (cleanPath === '/settings/security') {
    content = <SecurityPage />;
  } else if (cleanPath === '/settings/domains') {
    content = <DomainsPage />;
  } else if (cleanPath === '/settings/billing') {
    content = <BillingPage />;
  } else if (cleanPath === '/settings/notifications') {
    content = <NotificationsPage />;
  } else if (cleanPath === '/settings/team') {
    content = <TeamPage />;
  }

  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
}
