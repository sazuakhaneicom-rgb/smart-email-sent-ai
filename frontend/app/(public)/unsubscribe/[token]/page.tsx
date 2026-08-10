export function generateStaticParams() {
  return [{ token: 'sample-token' }];
}

import UnsubscribeClient from './UnsubscribeClient';

export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const unwrappedParams = await params;
  return <UnsubscribeClient token={unwrappedParams.token} />;
}
