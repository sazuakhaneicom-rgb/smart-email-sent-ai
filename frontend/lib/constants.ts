// ============================================
// App Constants — Smart Email Sent AI
// ============================================

export const APP_NAME = 'Smart Email Sent AI';
export const APP_TAGLINE = 'বাংলায় Email Marketing — সহজে, দ্রুতে';

export const ROUTES = {
  // Public
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  UNSUBSCRIBE: (token: string) => `/unsubscribe/${token}`,

  // Onboarding
  ONBOARDING: '/onboarding',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Contacts
  CONTACTS: '/contacts',
  CONTACT_LISTS: '/contacts/lists',
  CONTACT_IMPORT: '/contacts/import',

  // Templates
  TEMPLATES: '/templates',
  TEMPLATE_EDIT: (id: string) => `/templates/${id}/edit`,

  // Campaigns
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_NEW: '/campaigns/new',
  CAMPAIGN_DETAIL: (id: string) => `/campaigns/${id}`,

  // Analytics
  ANALYTICS: '/analytics',
  CAMPAIGN_ANALYTICS: (id: string) => `/analytics/campaigns/${id}`,

  // Settings
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_DOMAINS: '/settings/domains',
  SETTINGS_BILLING: '/settings/billing',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_TEAM: '/settings/team',
} as const;

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENDING: 'sending',
  SENT: 'sent',
  PAUSED: 'paused',
  FAILED: 'failed',
} as const;

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  draft: 'ড্রাফট',
  scheduled: 'নির্ধারিত',
  sending: 'পাঠানো হচ্ছে',
  sent: 'পাঠানো হয়েছে',
  paused: 'বিরতি',
  failed: 'ব্যর্থ',
};

export const CONTACT_STATUS = {
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  BOUNCED: 'bounced',
  COMPLAINED: 'complained',
} as const;

export const CONTACT_STATUS_LABELS: Record<string, string> = {
  subscribed: 'সক্রিয়',
  unsubscribed: 'আনসাবস্ক্রাইব',
  bounced: 'বাউন্স',
  complained: 'অভিযোগ',
};

export const DOMAIN_STATUS_LABELS: Record<string, string> = {
  verified: 'যাচাই হয়েছে',
  pending: 'অপেক্ষমাণ',
  failed: 'ব্যর্থ',
};

export const PLANS = [
  {
    id: 'free',
    name: 'বিনামূল্যে',
    price: 0,
    currency: 'BDT',
    contacts: 500,
    emailsPerMonth: 1000,
    features: ['৫০০ কনট্যাক্ট', '১,০০০ ইমেইল/মাস', '৩টি টেমপ্লেট', 'বেসিক অ্যানালিটিক্স'],
    notIncluded: ['কাস্টম ডোমেইন', 'A/B টেস্টিং', 'অটোমেশন', 'প্রায়রিটি সাপোর্ট'],
  },
  {
    id: 'pro',
    name: 'প্রো',
    price: 1490,
    currency: 'BDT',
    contacts: 10000,
    emailsPerMonth: 50000,
    popular: true,
    features: ['১০,০০০ কনট্যাক্ট', '৫০,০০০ ইমেইল/মাস', 'সীমাহীন টেমপ্লেট', 'বিস্তারিত অ্যানালিটিক্স', 'কাস্টম ডোমেইন', 'প্রায়রিটি সাপোর্ট'],
    notIncluded: ['A/B টেস্টিং', 'অটোমেশন'],
  },
  {
    id: 'business',
    name: 'বিজনেস',
    price: 4990,
    currency: 'BDT',
    contacts: -1, // unlimited
    emailsPerMonth: 200000,
    features: ['সীমাহীন কনট্যাক্ট', '২,০০,০০০ ইমেইল/মাস', 'সব প্রো ফিচার', 'A/B টেস্টিং', 'অটোমেশন', 'টিম অ্যাক্সেস', 'ডেডিকেটেড সাপোর্ট'],
    notIncluded: [],
  },
] as const;

export const MERGE_TAGS = [
  { label: '{{first_name}}', description: 'প্রথম নাম' },
  { label: '{{last_name}}', description: 'শেষ নাম' },
  { label: '{{email}}', description: 'ইমেইল ঠিকানা' },
  { label: '{{company}}', description: 'কোম্পানির নাম' },
  { label: '{{unsubscribe_url}}', description: 'আনসাবস্ক্রাইব লিঙ্ক' },
] as const;

export const DATE_RANGE_OPTIONS = [
  { label: '৭ দিন', value: '7d' },
  { label: '৩০ দিন', value: '30d' },
  { label: '৯০ দিন', value: '90d' },
] as const;

export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;

export const CSV_MAX_SIZE_MB = 10;
export const CSV_MAX_ROWS = 50000;
export const TAG_MAX_CHARS = 30;
export const SUBJECT_MAX_CHARS = 150;
export const TEMPLATE_NAME_MAX_CHARS = 100;
