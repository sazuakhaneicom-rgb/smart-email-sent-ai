// ============================================
// Mock Data — Smart Email Sent AI
// ============================================

// Dashboard Stats
export const mockDashboardStats = {
  contacts: 12450,
  contactsTrend: { value: '12%', positive: true },
  campaigns: 48,
  openRate: 28.4,
  openRateTrend: { value: '3.2%', positive: true },
  clickRate: 6.8,
  clickRateTrend: { value: '1.1%', positive: true },
};

// Trend Chart Data (30 days)
export const mockTrendData = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  open_rate: Math.floor(Math.random() * 20) + 15,
  click_rate: Math.floor(Math.random() * 5) + 3,
}));

// Recent Campaigns
export const mockRecentCampaigns = [
  { id: '1', name: 'বৈশাখী অফার - ২০২৬', status: 'Sent', sent: 12400, openRate: 32.5, date: '2026-04-14T10:00:00Z' },
  { id: '2', name: 'নতুন প্রোডাক্ট লঞ্চ', status: 'Draft', sent: 0, openRate: 0, date: '2026-08-10T10:00:00Z' },
  { id: '3', name: 'সাপ্তাহিক নিউজলেটার #৪৫', status: 'Sent', sent: 11200, openRate: 28.4, date: '2026-08-01T09:00:00Z' },
  { id: '4', name: 'ঈদ স্পেশাল ডিসকাউন্ট', status: 'Scheduled', sent: 0, openRate: 0, date: '2026-08-15T08:00:00Z' },
  { id: '5', name: 'সিস্টেম আপডেট নোটিশ', status: 'Sent', sent: 12500, openRate: 45.2, date: '2026-07-28T14:30:00Z' },
];

// Contacts
export const mockContactsData = [
  { id: '1', name: 'রাহেলা বেগম', email: 'rahela@example.com', status: 'subscribed', tags: ['গ্রাহক', 'প্রিমিয়াম'], createdAt: '2026-01-15T10:00:00Z' },
  { id: '2', name: 'করিম সাহেব', email: 'karim@shop.com', status: 'subscribed', tags: ['ব্যবসায়ী'], createdAt: '2026-02-20T10:00:00Z' },
  { id: '3', name: 'সুমাইয়া খানম', email: 'sumaiya@gmail.com', status: 'unsubscribed', tags: ['পুরনো গ্রাহক'], createdAt: '2025-11-05T10:00:00Z' },
  { id: '4', name: 'আরিফ হোসেন', email: 'arif.hossain@biz.com', status: 'subscribed', tags: ['নতুন', 'অফার'], createdAt: '2026-07-01T10:00:00Z' },
  { id: '5', name: 'নাজমা আক্তার', email: 'nazma@edu.ac.bd', status: 'bounced', tags: ['শিক্ষার্থী'], createdAt: '2026-03-10T10:00:00Z' },
  { id: '6', name: 'তানভীর আহমেদ', email: 'tanvir@agency.com', status: 'subscribed', tags: ['এজেন্সি', 'প্রিমিয়াম'], createdAt: '2026-04-22T10:00:00Z' },
  { id: '7', name: 'ফাতেমা খাতুন', email: 'fatema@store.com', status: 'subscribed', tags: ['গ্রাহক'], createdAt: '2026-05-18T10:00:00Z' },
  { id: '8', name: 'মিজানুর রহমান', email: 'mizan@corp.com', status: 'subscribed', tags: ['কর্পোরেট'], createdAt: '2026-06-30T10:00:00Z' },
];

// Contact Lists/Segments
export const mockLists = [
  { id: '1', name: 'সব সাবস্ক্রাইবার', type: 'static', contactCount: 9240, updatedAt: '2026-08-01T10:00:00Z' },
  { id: '2', name: 'প্রিমিয়াম গ্রাহক', type: 'static', contactCount: 1850, updatedAt: '2026-07-15T10:00:00Z' },
  { id: '3', name: 'সক্রিয় ব্যবহারকারী', type: 'dynamic', contactCount: 4320, updatedAt: '2026-08-05T10:00:00Z' },
  { id: '4', name: 'নতুন সাইনআপ (৩০ দিন)', type: 'dynamic', contactCount: 892, updatedAt: '2026-08-07T10:00:00Z' },
  { id: '5', name: 'ঢাকার গ্রাহক', type: 'static', contactCount: 2100, updatedAt: '2026-06-20T10:00:00Z' },
];

// Templates
export const mockTemplates = [
  { id: '1', name: 'বৈশাখী শুভেচ্ছা', category: 'শুভেচ্ছা', thumbnail: null, updatedAt: '2026-04-01T10:00:00Z', colors: ['#7C3AED', '#6366F1'] },
  { id: '2', name: 'প্রোডাক্ট লঞ্চ', category: 'প্রচার', thumbnail: null, updatedAt: '2026-07-15T10:00:00Z', colors: ['#059669', '#10B981'] },
  { id: '3', name: 'সাপ্তাহিক নিউজলেটার', category: 'নিউজলেটার', thumbnail: null, updatedAt: '2026-08-01T10:00:00Z', colors: ['#1D4ED8', '#3B82F6'] },
  { id: '4', name: 'ঈদ স্পেশাল অফার', category: 'অফার', thumbnail: null, updatedAt: '2026-06-20T10:00:00Z', colors: ['#DC2626', '#EF4444'] },
  { id: '5', name: 'স্বাগত ইমেইল', category: 'শুভেচ্ছা', thumbnail: null, updatedAt: '2026-03-10T10:00:00Z', colors: ['#7C3AED', '#A78BFA'] },
  { id: '6', name: 'ফ্ল্যাশ সেল', category: 'অফার', thumbnail: null, updatedAt: '2026-07-25T10:00:00Z', colors: ['#F59E0B', '#FBBF24'] },
];

// Campaigns
export const mockCampaigns = [
  { id: '1', name: 'বৈশাখী অফার', subject: 'বিশেষ বৈশাখী ছাড় পাচ্ছেন আপনি!', status: 'sent', recipients: 12400, openRate: 32.5, clickRate: 8.2, sentAt: '2026-04-14T10:00:00Z', fromEmail: 'hello@mystore.com', templateName: 'বৈশাখী শুভেচ্ছা' },
  { id: '2', name: 'নতুন প্রোডাক্ট লঞ্চ', subject: 'নতুন পণ্য এসেছে!', status: 'draft', recipients: 0, openRate: 0, clickRate: 0, sentAt: null, fromEmail: 'hello@mystore.com', templateName: null },
  { id: '3', name: 'সাপ্তাহিক নিউজলেটার #৪৫', subject: 'এই সপ্তাহের সেরা খবর', status: 'sent', recipients: 11200, openRate: 28.4, clickRate: 6.8, sentAt: '2026-08-01T09:00:00Z', fromEmail: 'newsletter@mystore.com', templateName: 'সাপ্তাহিক নিউজলেটার' },
  { id: '4', name: 'ঈদ স্পেশাল ডিসকাউন্ট', subject: 'ঈদে ৩০% ছাড়!', status: 'scheduled', recipients: 9240, openRate: 0, clickRate: 0, sentAt: '2026-08-15T08:00:00Z', fromEmail: 'hello@mystore.com', templateName: 'ঈদ স্পেশাল অফার' },
  { id: '5', name: 'সিস্টেম আপডেট নোটিশ', subject: 'গুরুত্বপূর্ণ সিস্টেম আপডেট', status: 'sent', recipients: 12500, openRate: 45.2, clickRate: 12.1, sentAt: '2026-07-28T14:30:00Z', fromEmail: 'noreply@mystore.com', templateName: 'সাপ্তাহিক নিউজলেটার' },
];

// Domains
export const mockDomains = [
  {
    id: '1',
    domain: 'mystore.com',
    spfVerified: true,
    dkimVerified: true,
    dmarcVerified: false,
    addedAt: '2026-06-01T10:00:00Z',
    dnsRecords: {
      spf: { type: 'TXT', host: '@', value: 'v=spf1 include:amazonses.com ~all' },
      dkim: { type: 'CNAME', host: 'smartemail._domainkey', value: 'smartemail.dkim.amazonses.com' },
      dmarc: { type: 'TXT', host: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@mystore.com' },
    },
  },
  {
    id: '2',
    domain: 'newsletter.mystore.com',
    spfVerified: false,
    dkimVerified: false,
    dmarcVerified: false,
    addedAt: '2026-08-05T10:00:00Z',
    dnsRecords: {
      spf: { type: 'TXT', host: '@', value: 'v=spf1 include:amazonses.com ~all' },
      dkim: { type: 'CNAME', host: 'smartemail._domainkey', value: 'smartemail.dkim.amazonses.com' },
      dmarc: { type: 'TXT', host: '_dmarc', value: 'v=DMARC1; p=none; rua=mailto:dmarc@mystore.com' },
    },
  },
];

// Invoices
export const mockInvoices = [
  { id: 'INV-001', date: '2026-07-01T00:00:00Z', amount: 1490, plan: 'প্রো', status: 'paid', pdfUrl: '#' },
  { id: 'INV-002', date: '2026-06-01T00:00:00Z', amount: 1490, plan: 'প্রো', status: 'paid', pdfUrl: '#' },
  { id: 'INV-003', date: '2026-05-01T00:00:00Z', amount: 1490, plan: 'প্রো', status: 'paid', pdfUrl: '#' },
];

// Activity Feed
export const mockActivityFeed = [
  { id: '1', type: 'campaign_sent', message: '"বৈশাখী অফার" ক্যাম্পেইন পাঠানো হয়েছে', timestamp: '2026-08-07T10:00:00Z', icon: 'send' },
  { id: '2', type: 'contact_import', message: '৫২৩ টি নতুন কনট্যাক্ট ইমপোর্ট হয়েছে', timestamp: '2026-08-06T15:30:00Z', icon: 'upload' },
  { id: '3', type: 'domain_verified', message: 'mystore.com ডোমেইন DKIM যাচাই হয়েছে', timestamp: '2026-08-05T09:00:00Z', icon: 'check' },
  { id: '4', type: 'plan_upgraded', message: 'বিনামূল্যে থেকে প্রো প্ল্যানে আপগ্রেড করা হয়েছে', timestamp: '2026-08-01T00:00:00Z', icon: 'star' },
  { id: '5', type: 'campaign_scheduled', message: '"ঈদ স্পেশাল" ক্যাম্পেইন শিডিউল করা হয়েছে', timestamp: '2026-07-30T14:00:00Z', icon: 'calendar' },
];

// Analytics Overview
export const mockAnalyticsOverview = {
  totalEmailsSent: 284560,
  avgOpenRate: 28.4,
  avgClickRate: 6.8,
  bounceRate: 2.1,
  chartData: Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    opened: Math.floor(Math.random() * 2000) + 500,
    clicked: Math.floor(Math.random() * 500) + 100,
    bounced: Math.floor(Math.random() * 50) + 10,
  })),
};

// Sessions
export const mockSessions = [
  { id: '1', device: 'Chrome — Windows 11', ip: '103.x.x.x', location: 'ঢাকা, বাংলাদেশ', lastActive: '2026-08-07T18:00:00Z', isCurrent: true },
  { id: '2', device: 'Safari — iPhone 15', ip: '192.x.x.x', location: 'চট্টগ্রাম, বাংলাদেশ', lastActive: '2026-08-06T22:30:00Z', isCurrent: false },
];

// Team Members
export const mockTeamMembers = [
  { id: '1', name: 'আপনি (Owner)', email: 'you@mystore.com', role: 'owner', status: 'active', avatarColor: '#7C3AED' },
  { id: '2', name: 'সহকারী ম্যানেজার', email: 'manager@mystore.com', role: 'editor', status: 'active', avatarColor: '#059669' },
  { id: '3', name: 'মার্কেটিং টিম', email: 'marketing@mystore.com', role: 'viewer', status: 'pending', avatarColor: '#F59E0B' },
];
