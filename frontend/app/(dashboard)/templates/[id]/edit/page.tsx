export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

import EditTemplateClient from './EditTemplateClient';

export default function EditTemplatePage() {
  return <EditTemplateClient />;
}
