# Smart Email Sent AI

> Bengali-first Email Marketing SaaS — সহজে Campaign তৈরি করুন, পাঠান এবং ট্র্যাক করুন।

---

## প্রজেক্ট স্ট্রাকচার

```
Smart Email Sent AI/
├── frontend/          # Next.js 15 (App Router) — React + TypeScript + Tailwind
└── backend/           # Express.js + TypeScript + BullMQ
```

---

## শুরু করার নির্দেশিকা

### Frontend

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000 এ চলবে
```

### Backend

```bash
cd backend
npm install
# .env ফাইল তৈরি করুন (দেখুন .env.example)
npm run dev
# http://localhost:5000 এ চলবে
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Font | Anek Bangla (Variable Font — Bengali + Latin) |
| State | Zustand |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Backend | Node.js, Express.js 5, TypeScript |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Queue | BullMQ + Redis |
| Email | Amazon SES |
| Payment | SSLCommerz + Stripe |

---

## Phase 1 Features (MVP)

- ✅ Authentication & Onboarding
- ✅ Dashboard
- ✅ Contact Management + CSV Import
- ✅ Email Template Builder (Drag & Drop)
- ✅ Campaign Create/Send/Schedule
- ✅ Analytics & Reports
- ✅ Domain Authentication (SPF/DKIM/DMARC)
- ✅ Billing & Subscription
- ✅ Settings (Account/Security/Notifications)

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

### Backend (`backend/.env`)
```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## Pending (Firebase ও SES credentials পেলে)

1. `frontend/.env.local` এ Firebase config যোগ করুন
2. `backend/.env` এ Firebase Admin + SES config যোগ করুন
3. Redis চালু করুন (Docker: `docker run -p 6379:6379 redis`)
4. `backend/src/config/firebase-admin.ts` এ credentials দিন

---

## Development Notes

- সব UI Mock Data দিয়ে কাজ করে — Firebase ছাড়াও দেখা যাবে
- Backend dev mode-এ `dev-token` দিয়ে auth bypass করা যাবে
- Dark Mode: `dark:` class দিয়ে সব component তৈরি

---

*Smart Email Sent AI — Version 1.0 | Phase 1 (MVP)*
