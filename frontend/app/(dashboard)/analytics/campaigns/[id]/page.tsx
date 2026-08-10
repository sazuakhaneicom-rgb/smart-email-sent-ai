export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

import AnalyticsClient from './AnalyticsClient';

export default function CampaignReportPage({ params }: { params: { id: string } }) {
  return <AnalyticsClient params={params} />;
}
