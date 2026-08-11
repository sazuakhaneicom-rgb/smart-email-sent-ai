export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: 'draft' }];
}

import AnalyticsClient from './AnalyticsClient';

export default async function CampaignReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AnalyticsClient params={resolvedParams} />;
}
