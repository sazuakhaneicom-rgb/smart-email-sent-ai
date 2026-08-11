/**
 * Smart Email Sent AI — Real Nodemailer SMTP Email Dispatcher
 * Sends real emails to recipient's actual inbox via Serverless API & Nodemailer SMTP transport.
 */

export interface EmailPayload {
  to: string;
  senderName?: string;
  senderEmail?: string;
  subject: string;
  body: string;
  smtpPass?: string;
  smtpUser?: string;
  smtpHost?: string;
  smtpPort?: string | number;
}

export interface DispatchResult {
  success: boolean;
  message: string;
  deliveryId?: string;
  timestamp: string;
}

export async function sendRealEmail(payload: EmailPayload): Promise<DispatchResult> {
  const { to, senderName, senderEmail, subject, body, smtpPass, smtpUser, smtpHost, smtpPort } = payload;

  if (!to || !to.includes('@')) {
    return {
      success: false,
      message: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।',
      timestamp: new Date().toISOString(),
    };
  }

  // Load user configuration from localStorage if missing in payload
  let configSmtpUser = smtpUser || '';
  let configSmtpPass = smtpPass || '';
  let configSenderName = senderName || '';
  let configSenderEmail = senderEmail || '';
  let configSmtpHost = smtpHost || 'smtp.gmail.com';
  let configSmtpPort = smtpPort || 587;

  if (typeof window !== 'undefined') {
    try {
      const rawUser = localStorage.getItem('auth-storage');
      const userId = rawUser ? JSON.parse(rawUser)?.state?.user?.uid || 'guest' : 'guest';
      const rawCfg = localStorage.getItem(`user_email_cfg_${userId}`);
      if (rawCfg) {
        const parsed = JSON.parse(rawCfg);
        if (!configSmtpUser && parsed.smtpUser) configSmtpUser = parsed.smtpUser;
        if (!configSmtpPass && parsed.smtpPass) configSmtpPass = parsed.smtpPass;
        if (!configSenderName && parsed.senderName) configSenderName = parsed.senderName;
        if (!configSenderEmail && parsed.senderEmail) configSenderEmail = parsed.senderEmail;
        if (parsed.smtpHost) configSmtpHost = parsed.smtpHost;
        if (parsed.smtpPort) configSmtpPort = parsed.smtpPort;
      }
    } catch (e) {}
  }

  // Dispatch via /api/send-email endpoint
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to.trim(),
        senderName: configSenderName,
        senderEmail: configSenderEmail,
        subject: subject || 'ক্যাম্পেইন বার্তা',
        body: body || '',
        smtpHost: configSmtpHost,
        smtpPort: configSmtpPort,
        smtpUser: configSmtpUser,
        smtpPass: configSmtpPass,
      }),
    });

    const data = await res.json();

    return {
      success: data.success,
      message: data.message || (data.success ? `✅ ইমেইলটি সফলভাবে [${to}] ইনবক্সে পৌঁছানো হয়েছে!` : '❌ ইমেইল পাঠাতে সমস্যা হয়েছে।'),
      deliveryId: data.messageId || `DEL-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Email dispatcher network error:', err);
    return {
      success: false,
      message: `❌ সেন্ডার প্রসেস ত্রুটি: ${err.message || 'ইমেইল সেন্ড সার্ভারে কানেক্ট হওয়া যায়নি।'}`,
      timestamp: new Date().toISOString(),
    };
  }
}
