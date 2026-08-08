import type { Metadata } from "next";
import { Anek_Bangla } from "next/font/google";
import "./globals.css";

const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-anek",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Smart Email Sent AI — বাংলা Email Marketing",
    template: "%s | Smart Email Sent AI",
  },
  description:
    "Bengali-first Email Marketing SaaS — সহজে Campaign তৈরি করুন, পাঠান এবং ট্র্যাক করুন।",
  keywords: ["email marketing", "bangla", "campaign", "newsletter", "bangladesh"],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "Smart Email Sent AI",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={anekBangla.variable}
        style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
