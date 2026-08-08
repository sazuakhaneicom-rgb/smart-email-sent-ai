export const DEFAULT_ADMIN_CONFIG = {
  // Firebase Configuration
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCL3976YduCH6P1qNnqmwbx3lzx7guIacg",
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "smart-email-sent-ai.firebaseapp.com",
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "smart-email-sent-ai",
  firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "smart-email-sent-ai.firebasestorage.app",
  firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "850948404150",
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:850948404150:web:46d2e847a095c76faa8717",
  firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MZQB16YB4F",

  // Hosting & Database Provider Configuration
  databaseProvider: "firebase", // 'firebase' | 'postgres' | 'mysql' | 'mongodb' | 'sqlite'
  dbHost: "localhost",
  dbPort: "5432",
  dbName: "smart_email_db",
  dbUser: "postgres",
  dbPassword: "",
  dbSsl: false,
  mongoUri: "",

  // File Storage Provider
  storageProvider: "firebase", // 'firebase' | 's3_hostinger' | 'local_disk'
  s3Endpoint: "https://s3.hostinger.com",
  s3Bucket: "smart-email-bucket",
  s3Region: "us-east-1",
  s3AccessKey: "",
  s3SecretKey: "",
  localUploadPath: "./public/uploads",

  // Domain & Server Ports
  appDomain: "http://localhost:3000",
  apiDomain: "http://localhost:5000",
  corsOrigins: "http://localhost:3000,https://smartemail.com",
  hostingType: "hostinger_vps", // 'hostinger_vps' | 'hostinger_nodejs' | 'cpanel' | 'docker' | 'firebase'

  // AWS SES Email Provider
  awsRegion: "ap-southeast-1",
  awsAccessKeyId: "",
  awsSecretAccessKey: "",
  awsFromEmail: "",
  awsFromName: "Smart Email",

  // Payment Credentials
  sslcommerzStoreId: "",
  sslcommerzStorePass: "",
  sslcommerzSandbox: true,
  stripeSecretKey: "",
  stripeWebhookSecret: "",

  // JWT & Security
  jwtSecret: "dev-jwt-secret-key-32-chars-minimum",
  unsubscribeSecret: "dev-unsubscribe-secret-key-32-chars",
  adminPassword: "admin123",
};

export const loadAdminConfig = (): typeof DEFAULT_ADMIN_CONFIG => {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_CONFIG;
  try {
    const data = localStorage.getItem('admin_config');
    return data ? { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(data) } : DEFAULT_ADMIN_CONFIG;
  } catch (e) {
    return DEFAULT_ADMIN_CONFIG;
  }
};

export const saveAdminConfig = (data: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadAdminConfig();
    localStorage.setItem('admin_config', JSON.stringify({ ...current, ...data }));
  } catch (e) {
    console.error('Failed to save admin config', e);
  }
};
