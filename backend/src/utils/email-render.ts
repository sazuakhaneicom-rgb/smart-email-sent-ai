export interface TemplateBlock {
  type: 'text' | 'image' | 'button' | 'divider' | 'social';
  content?: string;
  url?: string;
  src?: string;
  alt?: string;
  label?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  styles?: Record<string, string>;
}

export interface TemplateDesignJson {
  blocks: TemplateBlock[];
  settings?: {
    backgroundColor?: string;
    contentWidth?: string;
    fontFamily?: string;
  };
}

const replaceMergeTags = (
  html: string,
  contact: Record<string, string>
): string => {
  return html
    .replace(/\{\{first_name\}\}/g, contact.firstName || '')
    .replace(/\{\{last_name\}\}/g, contact.lastName || '')
    .replace(/\{\{email\}\}/g, contact.email || '')
    .replace(/\{\{([a-zA-Z_]+)\}\}/g, (_, key) => contact[key] || '');
};

export const renderTemplate = (
  designJson: TemplateDesignJson,
  contact: Record<string, string>,
  unsubscribeUrl: string
): string => {
  const settings = designJson.settings || {};
  const bgColor = settings.backgroundColor || '#F9FAFB';
  const contentWidth = settings.contentWidth || '600px';
  const fontFamily = settings.fontFamily || "'Anek Bangla', 'Hind Siliguri', sans-serif";

  const blocksHtml = designJson.blocks
    .map((block) => {
      switch (block.type) {
        case 'text':
          return `<div style="padding:16px 24px;font-family:${fontFamily};font-size:16px;line-height:1.6;color:#111827;">${replaceMergeTags(block.content || '', contact)}</div>`;
        case 'image':
          return `<div style="text-align:${block.align || 'center'};padding:16px 24px;"><img src="${block.src}" alt="${block.alt || ''}" style="max-width:100%;height:auto;border-radius:8px;"/></div>`;
        case 'button':
          return `<div style="text-align:${block.align || 'center'};padding:16px 24px;"><a href="${block.url}" style="display:inline-block;background:${block.color || '#7C3AED'};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-family:${fontFamily};font-weight:600;">${block.label || 'Click here'}</a></div>`;
        case 'divider':
          return `<div style="padding:8px 24px;"><hr style="border:none;border-top:1px solid #E5E7EB;"/></div>`;
        default:
          return '';
      }
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="bn">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${bgColor};">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 0;">
<table width="${contentWidth}" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
<tr><td>${blocksHtml}</td></tr>
<tr><td style="padding:20px 24px;background:#F9FAFB;text-align:center;font-family:${fontFamily};font-size:12px;color:#6B7280;">
আপনি আর এই ইমেইল পেতে না চাইলে <a href="${unsubscribeUrl}" style="color:#7C3AED;">এখানে ক্লিক করুন</a> আনসাবস্ক্রাইব করতে।
</td></tr>
</table>
</td></tr></table>
</body>
</html>`;
};
