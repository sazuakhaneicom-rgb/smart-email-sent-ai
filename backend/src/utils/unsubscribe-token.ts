import crypto from 'crypto';
import { config } from '../config';

export const generateUnsubscribeToken = (
  workspaceId: string,
  contactId: string,
  campaignId: string
): string => {
  const payload = `${workspaceId}:${contactId}:${campaignId}`;
  const hmac = crypto
    .createHmac('sha256', config.unsubscribeSecret)
    .update(payload)
    .digest('hex');
  const encoded = Buffer.from(payload).toString('base64url');
  return `${encoded}.${hmac.substring(0, 32)}`;
};

export const verifyUnsubscribeToken = (
  token: string
): { workspaceId: string; contactId: string; campaignId: string } | null => {
  try {
    const [encoded, hash] = token.split('.');
    const payload = Buffer.from(encoded, 'base64url').toString();
    const expectedHmac = crypto
      .createHmac('sha256', config.unsubscribeSecret)
      .update(payload)
      .digest('hex')
      .substring(0, 32);
    if (hash !== expectedHmac) return null;
    const [workspaceId, contactId, campaignId] = payload.split(':');
    if (!workspaceId || !contactId || !campaignId) return null;
    return { workspaceId, contactId, campaignId };
  } catch {
    return null;
  }
};
