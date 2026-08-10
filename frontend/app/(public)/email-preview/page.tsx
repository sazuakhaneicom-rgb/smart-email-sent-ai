'use client';

import React, { useState } from 'react';

// ─── Sample Email Data ───────────────────────────────────────────
interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  avatar: string;
  avatarBg: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  body: EmailBody;
}

interface EmailBody {
  greeting: string;
  paragraphs: string[];
  highlights?: { label: string; value: string }[];
  cta?: { label: string; url: string };
  closing: string;
  signature: string;
}

const EMAILS: Email[] = [
  {
    id: '1',
    sender: 'Smart Email AI',
    senderEmail: 'hello@smartemail.com',
    avatar: 'SE',
    avatarBg: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
    subject: 'আপনার নতুন শীতকালীন কালেকশন এসে গেছে!',
    preview: 'প্রিয় রাহুল ভাই, আশা করি ভালো আছেন। আমাদের নতুন শীতকালীন...',
    time: '৯:৪৫ AM',
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    body: {
      greeting: 'প্রিয় রাহুল ভাই,',
      paragraphs: [
        'আশা করি ভালো আছেন। আমাদের নতুন শীতকালীন কালেকশন এখন সম্পূর্ণ প্রস্তুত এবং আপনার জন্য বিশেষ অফার নিয়ে এসেছি।',
        'এই সপ্তাহে সমস্ত পোশাকে ২০% বিশেষ ছাড় পাওয়া যাচ্ছে। অফারটি শুধুমাত্র আগামী শুক্রবার রাত ১২টা পর্যন্ত চলবে।',
      ],
      highlights: [
        { label: 'ছাড়ের পরিমাণ', value: '২০% পর্যন্ত' },
        { label: 'অফার শেষ হবে', value: 'শুক্রবার, রাত ১২টা' },
        { label: 'ন্যূনতম অর্ডার', value: '৫০০ টাকা' },
      ],
      cta: { label: 'এখনই কেনাকাটা করুন', url: '#' },
      closing: 'আপনার সুবিধামতো যেকোনো সময় আমাদের স্টোরে আসুন বা অনলাইনে অর্ডার করুন। যেকোনো প্রশ্নে এই ইমেইলে সরাসরি রিপ্লাই করুন।',
      signature: 'ধন্যবাদ ও শুভেচ্ছা,\nরিমা আক্তার\nCustomer Relations, Smart Fashion',
    },
  },
  {
    id: '2',
    sender: 'Dhaka Commerce Hub',
    senderEmail: 'info@dhakahub.com.bd',
    avatar: 'DC',
    avatarBg: 'linear-gradient(135deg, #059669, #0D9488)',
    subject: 'Your Invoice #2024-1189 is Ready',
    preview: 'Dear Valued Client, Please find attached your invoice for the month of...',
    time: 'গতকাল',
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    body: {
      greeting: 'Dear Valued Client,',
      paragraphs: [
        'We are pleased to inform you that your invoice for the month of July 2024 has been generated and is ready for your review.',
        'Please find the billing details below. Kindly ensure payment within the due date to avoid any service interruption.',
      ],
      highlights: [
        { label: 'Invoice No.', value: '#2024-1189' },
        { label: 'Amount Due', value: '৳ 12,500' },
        { label: 'Due Date', value: 'August 15, 2024' },
      ],
      cta: { label: 'View & Download Invoice', url: '#' },
      closing: 'For any queries regarding this invoice, please contact our billing department at billing@dhakahub.com.bd or call 01700-000000.',
      signature: 'Best regards,\nBilling Team\nDhaka Commerce Hub',
    },
  },
  {
    id: '3',
    sender: 'Mehedi Hassan',
    senderEmail: 'mehedi@example.com',
    avatar: 'MH',
    avatarBg: 'linear-gradient(135deg, #D97706, #DC2626)',
    subject: 'আগামীকালের মিটিং নিয়ে একটু কথা বলতে চাই',
    preview: 'ভাই, আগামীকাল বিকাল ৩টার মিটিংটা কি ঠিকই আছে? আমি একটু...',
    time: 'মঙ্গলবার',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    body: {
      greeting: 'ভাই,',
      paragraphs: [
        'আগামীকাল বিকাল ৩টার মিটিংটা নিয়ে একটু জানাতে চাইছিলাম। আমি একটু আগে অফিসে আসতে পারব না।',
        'যদি সম্ভব হয়, মিটিংটা ৪টায় নেওয়া যায় কি? অথবা আপনার সুবিধামতো সময় জানান, সেই অনুযায়ী আমি ঠিক করে নেব।',
      ],
      closing: 'একটু জানাবেন।',
      signature: 'মেহেদী হাসান\n+880 1711-000000',
    },
  },
  {
    id: '4',
    sender: 'Google',
    senderEmail: 'no-reply@accounts.google.com',
    avatar: 'G',
    avatarBg: 'linear-gradient(135deg, #4285F4, #34A853)',
    subject: 'Security alert: New sign-in to your account',
    preview: 'Your Google Account was just used to sign in from a new device. If this was you...',
    time: 'সোমবার',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    body: {
      greeting: 'Hi,',
      paragraphs: [
        'Your Google Account was just used to sign in from a new device. We\'re letting you know so you can keep your account secure.',
        'If you did not sign in, your account may be at risk. Secure your account immediately.',
      ],
      highlights: [
        { label: 'Device', value: 'Windows PC (Chrome)' },
        { label: 'Location', value: 'Dhaka, Bangladesh' },
        { label: 'Time', value: 'Aug 5, 2024, 10:32 AM' },
      ],
      cta: { label: 'Check Activity', url: '#' },
      closing: 'You can also see security activity at myaccount.google.com',
      signature: 'The Google Accounts team',
    },
  },
];

// ─── Inbox List Item ─────────────────────────────────────────────
function InboxItem({ email, onClick }: { email: Email; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        background: email.isRead ? '#fff' : '#F0F4FF',
        border: 'none',
        borderBottom: '1px solid #F1F3F4',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F9FA'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = email.isRead ? '#fff' : '#F0F4FF'; }}
    >
      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: email.avatarBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: '0.875rem',
        fontFamily: "'Anek Bangla', sans-serif",
      }}>
        {email.avatar}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: email.isRead ? 400 : 700,
            color: '#202124',
            fontFamily: "'Anek Bangla', sans-serif",
          }}>
            {email.sender}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {email.isStarred && <span style={{ color: '#F5A623', fontSize: '0.85rem' }}>★</span>}
            <span style={{ fontSize: '0.75rem', color: '#5F6368', whiteSpace: 'nowrap' }}>{email.time}</span>
          </div>
        </div>
        <p style={{
          fontSize: '0.875rem',
          fontWeight: email.isRead ? 400 : 600,
          color: '#202124',
          marginBottom: 2,
          fontFamily: "'Anek Bangla', sans-serif",
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        }}>
          {email.subject}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {email.hasAttachment && (
            <span style={{ fontSize: '0.75rem', color: '#5F6368' }}>📎</span>
          )}
          <p style={{
            fontSize: '0.8rem', color: '#5F6368',
            fontFamily: "'Anek Bangla', sans-serif",
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {email.preview}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Full Email View ─────────────────────────────────────────────
function EmailView({ email, onBack }: { email: Email; onBack: () => void }) {
  const body = email.body;
  return (
    <div style={{ background: '#fff', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid #E8EAED',
        background: '#fff',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#444746', fontSize: '0.875rem', fontFamily: "'Anek Bangla', sans-serif",
            padding: '6px 8px', borderRadius: 6,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ইনবক্স
        </button>
        <div style={{ flex: 1 }} />
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5F6368', padding: 6, borderRadius: 6 }}>
          {email.isStarred ? '★' : '☆'}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5F6368', padding: 6, borderRadius: 6, fontSize: '1.1rem' }}>
          ⋮
        </button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px' }}>

        {/* Subject */}
        <h1 style={{
          fontSize: '1.2rem', fontWeight: 700, color: '#202124',
          marginBottom: 16, lineHeight: 1.4,
          fontFamily: "'Anek Bangla', sans-serif",
        }}>
          {email.subject}
        </h1>

        {/* Sender Info Card */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          marginBottom: 24, padding: '12px 14px',
          background: '#F8F9FA', borderRadius: 10,
          border: '1px solid #E8EAED',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: email.avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1rem',
            fontFamily: "'Anek Bangla', sans-serif",
          }}>
            {email.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{
                  fontWeight: 700, fontSize: '0.9rem', color: '#202124', marginBottom: 2,
                  fontFamily: "'Anek Bangla', sans-serif",
                }}>
                  {email.sender}
                </p>
                <p style={{ fontSize: '0.775rem', color: '#5F6368', fontFamily: 'monospace' }}>
                  &lt;{email.senderEmail}&gt;
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '0.775rem', color: '#5F6368' }}>{email.time}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#5F6368', marginTop: 4 }}>
              To: আমি
            </p>
          </div>
        </div>

        {/* Email Body */}
        <div style={{
          fontSize: '0.9375rem', color: '#202124', lineHeight: 1.7,
          fontFamily: "'Anek Bangla', sans-serif",
        }}>
          {/* Greeting */}
          <p style={{ fontWeight: 600, marginBottom: 16 }}>{body.greeting}</p>

          {/* Paragraphs */}
          {body.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 14, color: '#3C4043' }}>{p}</p>
          ))}

          {/* Highlights Card */}
          {body.highlights && (
            <div style={{
              margin: '20px 0',
              background: '#F8F9FA',
              border: '1px solid #E8EAED',
              borderLeft: '3px solid #7C3AED',
              borderRadius: '0 8px 8px 0',
              overflow: 'hidden',
            }}>
              {body.highlights.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 16px',
                  borderBottom: i < body.highlights!.length - 1 ? '1px solid #E8EAED' : 'none',
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#5F6368' }}>{h.label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#202124' }}>{h.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {body.cta && (
            <div style={{ margin: '24px 0', textAlign: 'center' }}>
              <a
                href={body.cta.url}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: '#fff', padding: '12px 28px',
                  borderRadius: 8, textDecoration: 'none',
                  fontWeight: 700, fontSize: '0.9rem',
                  fontFamily: "'Anek Bangla', sans-serif",
                  boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
                }}
              >
                {body.cta.label}
              </a>
            </div>
          )}

          {/* Closing */}
          <p style={{ marginTop: 20, marginBottom: 16, color: '#3C4043' }}>{body.closing}</p>

          {/* Divider */}
          <hr style={{ border: 'none', borderTop: '1px solid #E8EAED', margin: '16px 0' }} />

          {/* Signature */}
          <p style={{
            fontSize: '0.875rem', color: '#5F6368',
            whiteSpace: 'pre-line', lineHeight: 1.6,
          }}>
            {body.signature}
          </p>
        </div>

        {/* Reply / Forward Bar */}
        <div style={{ marginTop: 32 }}>
          <div style={{
            display: 'flex', gap: 12,
          }}>
            <button style={{
              flex: 1, padding: '10px 16px',
              border: '1px solid #DADCE0', borderRadius: 8,
              background: '#fff', color: '#1A73E8',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Reply
            </button>
            <button style={{
              flex: 1, padding: '10px 16px',
              border: '1px solid #DADCE0', borderRadius: 8,
              background: '#fff', color: '#444746',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gmail Inbox Shell ────────────────────────────────────────────
function GmailShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Gmail-style top bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E8EAED',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Hamburger */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#444746' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Gmail Logo style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6" fill="none" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
          <span style={{
            fontSize: '1rem', fontWeight: 700, color: '#202124',
            fontFamily: "'Anek Bangla', sans-serif",
          }}>
            Mail
          </span>
        </div>
        {/* Account avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '0.75rem', fontWeight: 700,
          cursor: 'pointer',
        }}>
          R
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function EmailPreviewPage() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState(EMAILS);

  const handleOpenEmail = (email: Email) => {
    setSelectedEmail(email);
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
  };

  const unreadCount = emails.filter(e => !e.isRead).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F1F3F4 0%, #E8EAF6 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px',
      fontFamily: "'Anek Bangla', 'Roboto', sans-serif",
    }}>

      {/* Page Header — Presentation Label */}
      <div style={{
        width: '100%', maxWidth: 480, marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#7C3AED',
          }}>
            📱 Gmail-style Email Preview
          </p>
          <h2 style={{
            fontSize: '1.1rem', fontWeight: 800, color: '#202124', marginTop: 2,
          }}>
            প্রাপকের ইনবক্স — এভাবে দেখায়
          </h2>
        </div>
        {unreadCount > 0 && (
          <span style={{
            background: '#7C3AED', color: '#fff',
            borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
            padding: '2px 10px',
          }}>
            {unreadCount} অপঠিত
          </span>
        )}
      </div>

      {/* Mobile Phone Frame */}
      <div style={{
        width: '100%', maxWidth: 400,
        height: 680,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Thin phone border accent */}
        <div style={{
          position: 'absolute', inset: -2, borderRadius: 14,
          background: 'linear-gradient(135deg, #7C3AED22, #06B6D422)',
          border: '1px solid #E0E0E0',
          zIndex: 0,
        }} />

        <GmailShell>
          {selectedEmail ? (
            <EmailView
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
            />
          ) : (
            <>
              {/* Inbox Header */}
              <div style={{
                padding: '12px 16px 8px',
                borderBottom: '1px solid #F1F3F4',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 600, color: '#202124',
                    fontFamily: "'Anek Bangla', sans-serif",
                  }}>
                    Primary
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      background: '#1A73E8', color: '#fff', borderRadius: 999,
                      fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem', color: '#5F6368' }}>
                  <button style={{ background: 'none', border: '1px solid #DADCE0', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', color: '#5F6368', fontSize: '0.75rem' }}>Social</button>
                  <button style={{ background: 'none', border: '1px solid #DADCE0', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', color: '#5F6368', fontSize: '0.75rem' }}>Promotions</button>
                </div>
              </div>

              {/* Email List */}
              {emails.map(email => (
                <InboxItem
                  key={email.id}
                  email={email}
                  onClick={() => handleOpenEmail(email)}
                />
              ))}
            </>
          )}
        </GmailShell>
      </div>

      {/* Desktop Callout — Info section below the phone frame */}
      <div style={{
        marginTop: 28, width: '100%', maxWidth: 480,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
      }}>
        {[
          { icon: '✅', title: 'ইনবক্সে পৌঁছায়', desc: 'Spam folder-এ যায় না' },
          { icon: '👤', title: 'ব্যক্তিগত মনে হয়', desc: 'Human-like sender identity' },
          { icon: '📖', title: 'সহজে পড়া যায়', desc: 'Clean typography & layout' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: '#fff', borderRadius: 10,
            padding: '12px 14px', textAlign: 'center',
            border: '1px solid #E8EAED',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{icon}</div>
            <p style={{ fontSize: '0.775rem', fontWeight: 700, color: '#202124', fontFamily: "'Anek Bangla', sans-serif" }}>{title}</p>
            <p style={{ fontSize: '0.725rem', color: '#5F6368', fontFamily: "'Anek Bangla', sans-serif" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Desktop Wide View hint */}
      <p style={{
        marginTop: 20, fontSize: '0.775rem', color: '#9AA0A6',
        fontFamily: "'Anek Bangla', sans-serif", textAlign: 'center',
      }}>
        ⬆ ইনবক্সের কার্ডে ক্লিক করলে পুরো ইমেইলটি দেখা যাবে
      </p>
    </div>
  );
}
