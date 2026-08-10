export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

import EditTemplateClient from './EditTemplateClient';

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  return <EditTemplateClient params={params} />;
}
