import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalRateLimit } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';
import nodemailer from 'nodemailer';

// Import routers
import authRouter from './modules/auth/routes';
import workspacesRouter from './modules/workspaces/routes';
import contactsRouter from './modules/contacts/routes';
import templatesRouter from './modules/templates/routes';
import campaignsRouter from './modules/campaigns/routes';
import analyticsRouter from './modules/analytics/routes';
import domainsRouter from './modules/domains/routes';
import billingRouter from './modules/billing/routes';
import dashboardRouter from './modules/dashboard/routes';
import settingsRouter from './modules/settings/routes';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing — preserve rawBody for webhook signature verification
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
app.use(generalRateLimit);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workspaces', workspacesRouter);
app.use('/api/v1/workspaces/:wid/contacts', contactsRouter);
app.use('/api/v1/workspaces/:wid/templates', templatesRouter);
app.use('/api/v1/workspaces/:wid/campaigns', campaignsRouter);
app.use('/api/v1/workspaces/:wid/analytics', analyticsRouter);
app.use('/api/v1/workspaces/:wid/domains', domainsRouter);
app.use('/api/v1/workspaces/:wid/billing', billingRouter);
app.use('/api/v1/workspaces/:wid/dashboard', dashboardRouter);
app.use('/api/v1/settings', settingsRouter);

// Real Nodemailer SMTP Email Dispatch Endpoint
app.post('/api/v1/send-email', async (req, res) => {
  try {
    const {
      to,
      senderName,
      senderEmail,
      subject,
      body,
      smtpHost = 'smtp.gmail.com',
      smtpPort = 587,
      smtpUser,
      smtpPass,
    } = req.body;

    if (!to || !to.includes('@')) {
      return res.status(400).json({ success: false, message: 'একটি ভ্যালিড ইমেইল প্রদান করুন।' });
    }

    const fromName = senderName || 'Smart Email Team';
    const fromAddr = senderEmail || smtpUser || 'noreply@smartemail.com';

    let transporter: nodemailer.Transporter;

    if (smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost || 'smtp.gmail.com',
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser.trim(),
          pass: smtpPass.trim().replace(/\s+/g, ''),
        },
        tls: { rejectUnauthorized: false },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        } : undefined,
        tls: { rejectUnauthorized: false },
      });
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddr}>`,
      to: to.trim(),
      subject: subject || 'ক্যাম্পেইন বার্তা',
      text: body || 'স্মার্ট ইমেইল সেন্ট এআই থেকে প্রেরিত বার্তা',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #7C3AED, #06B6D4); padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">${subject || 'ক্যাম্পেইন বার্তা'}</h2>
            </div>
            <div style="padding: 24px;">
              <p style="white-space: pre-wrap; font-size: 15px; color: #222;">${(body || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee;">
              প্রেরক: ${fromName} &lt;${fromAddr}&gt; | Powered by Smart Email Sent AI
            </div>
          </div>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: `✅ ইমেইলটি আসল ইনবক্সে সফলভাবে ডেলিভার করা হয়েছে! (${to})`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    let msg = error?.message || 'ইমেইল ডিসপ্যাচ করা যায়নি।';
    if (error?.code === 'EAUTH' || msg.includes('Invalid login') || msg.includes('Username and Password not accepted')) {
      msg = `❌ SMTP অথেনটিকেশন ব্যর্থ: আপনার Gmail App Password বা Email আইডি সঠিক নয়। /settings/email-config পেজে ১৬ অক্ষরের সঠিক App Password প্রদান করুন।`;
    }
    return res.status(500).json({ success: false, message: msg, error: error?.message });
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
