// Required by static export — returns placeholder so build succeeds
// Actual editing happens at /templates/editor?id=xxx
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

import EditTemplateClient from './EditTemplateClient';

export default function EditTemplatePage() {
  return <EditTemplateClient />;
}
