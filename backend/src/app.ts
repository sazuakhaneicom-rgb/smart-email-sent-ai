import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalRateLimit } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

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
