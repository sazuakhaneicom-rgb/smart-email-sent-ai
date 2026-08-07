// Environment configuration
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  ses: {
    region: process.env.AWS_REGION || 'ap-southeast-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  payment: {
    sslcommerzStoreId: process.env.SSLCOMMERZ_STORE_ID || '',
    sslcommerzStorePass: process.env.SSLCOMMERZ_STORE_PASS || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  },
  unsubscribeSecret: process.env.UNSUBSCRIBE_SECRET || 'unsubscribe-secret-dev',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
};
