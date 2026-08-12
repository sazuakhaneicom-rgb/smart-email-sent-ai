import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      to,
      senderName,
      senderEmail,
      subject,
      body: emailContent,
      smtpHost = 'smtp.gmail.com',
      smtpPort = 587,
      smtpUser,
      smtpPass,
    } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।' },
        { status: 400 }
      );
    }

    const fromName = senderName || 'Smart Email Team';
    const fromAddr = senderEmail || smtpUser || 'noreply@smartemail.com';

    // 1. Determine SMTP Transporter Configuration
    let transporter: nodemailer.Transporter;

    if (smtpUser && smtpPass) {
      // User-configured SMTP / Gmail App Password
      transporter = nodemailer.createTransport({
        host: smtpHost || 'smtp.gmail.com',
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser.trim(),
          pass: smtpPass.trim().replace(/\s+/g, ''), // Remove spaces from Gmail App Passwords
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // Direct Web SMTP Relay / System Default
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        } : undefined,
        tls: {
          rejectUnauthorized: false,
        },
      });
    }

    // 2. Dispatch real email via nodemailer
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddr}>`,
      to: to.trim(),
      subject: subject || 'নতুন ইমেইল বার্তা',
      text: emailContent || 'স্মার্ট ইমেইল সেন্ট এআই থেকে প্রেরিত বার্তা',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #7C3AED, #06B6D4); padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">${subject || 'ক্যাম্পেইন বার্তা'}</h2>
            </div>
            <div style="padding: 24px;">
              <p style="white-space: pre-wrap; font-size: 15px; color: #222;">${(emailContent || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee;">
              প্রেরক: ${fromName} &lt;${fromAddr}&gt; | Powered by Smart Email Sent AI
            </div>
          </div>
        </div>
      `,
    });

    console.log('✅ Nodemailer Email Sent Successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      message: `✅ ইমেইলটি আসল ইনবক্সে সফলভাবে ডেলিভার করা হয়েছে! (${to})`,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Nodemailer Email Error:', error);

    let userFriendlyMessage = error?.message || 'ইমেইল পাঠানো যায়নি।';
    if (error?.code === 'EAUTH' || userFriendlyMessage.includes('Invalid login') || userFriendlyMessage.includes('Username and Password not accepted')) {
      userFriendlyMessage = `❌ SMTP অথেনটিকেশন ব্যর্থ: আপনার Gmail App Password বা Email আইডি সঠিক নয়। অনুগ্রহ করে /settings/email-config পেজে ১৬ অক্ষরের সঠিক App Password প্রদান করুন।`;
    } else if (error?.code === 'ESOCKET' || error?.code === 'ETIMEDOUT') {
      userFriendlyMessage = `❌ নেটওয়ার্ক কানেকশন ব্যর্থ: SMTP সার্ভারের সাথে যুক্ত হতে পারেনি। পোর্ট এবং হোস্ট চেক করুন।`;
    }

    return NextResponse.json(
      { success: false, message: userFriendlyMessage, error: error?.message },
      { status: 500 }
    );
  }
}
