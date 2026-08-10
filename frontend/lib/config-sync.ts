/**
 * config-sync.ts
 * BroadcastChannel-based real-time sync between Admin Panel and Dashboard.
 * When admin saves settings, all open tabs on the same origin get notified instantly.
 * No backend, no polling — zero infrastructure cost.
 */

const CHANNEL_NAME = 'smart_email_config_sync';
const STORAGE_KEY = 'admin_config';

export type ConfigSyncMessage =
  | { type: 'CONFIG_UPDATED'; payload: Record<string, any> }
  | { type: 'AGENT_STATUS_CHANGED'; payload: { status: 'active' | 'paused' | 'stopped' } };

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return channel;
}

/**
 * Broadcast a config update to all other tabs.
 * Call this after saveAdminConfig().
 */
export function broadcastConfigUpdate(config: Record<string, any>) {
  const ch = getChannel();
  if (!ch) return;
  const msg: ConfigSyncMessage = { type: 'CONFIG_UPDATED', payload: config };
  try {
    ch.postMessage(msg);
  } catch (e) {
    console.warn('BroadcastChannel postMessage failed:', e);
  }
}

/**
 * Broadcast agent status change.
 */
export function broadcastAgentStatus(status: 'active' | 'paused' | 'stopped') {
  const ch = getChannel();
  if (!ch) return;
  const msg: ConfigSyncMessage = { type: 'AGENT_STATUS_CHANGED', payload: { status } };
  try {
    ch.postMessage(msg);
  } catch {}
}

/**
 * Subscribe to config updates from other tabs.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function onConfigSync(callback: (msg: ConfigSyncMessage) => void): () => void {
  const ch = getChannel();
  if (!ch) return () => {};
  const handler = (event: MessageEvent) => {
    try {
      callback(event.data as ConfigSyncMessage);
    } catch {}
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}

/**
 * Read agent runtime config from localStorage.
 * Falls back to sensible defaults if not set.
 */
export function getAgentConfig() {
  if (typeof window === 'undefined') return getAgentDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const cfg = raw ? JSON.parse(raw) : {};
    return { ...getAgentDefaults(), ...cfg };
  } catch {
    return getAgentDefaults();
  }
}

function getAgentDefaults() {
  return {
    agentStatus: 'active' as 'active' | 'paused' | 'stopped',
    emailProvider: 'smtp' as 'aws_ses' | 'smtp' | 'sendgrid' | 'mailgun',
    awsFromEmail: '',
    awsFromName: 'Smart Email AI',
    dailySendLimit: 5000,
    throttleRate: 50,            // emails per second
    stealthMode: true,
    humanJitterMin: 4,           // seconds
    humanJitterMax: 12,
    spamScoreThreshold: 0.1,
    dkimEnabled: true,
    spfEnabled: true,
    dmarcEnabled: true,
  };
}
