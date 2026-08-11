export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  invitationUrl?: string;
}

export const CLAUDE_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-claude-ai-premium',
  name: 'Claude AI — Premium Subscription & Team Invitation',
  subject: 'Claude AI Premium Subscription Activated Successfully! 🎉',
  body: `<div style="background-color: #0A0D14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 580px; margin: 0 auto; background: #111622; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Top Header / Logo -->
    <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, #161F32 0%, #111622 100%);">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">Claude AI</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #10B981; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Premium Subscription Activated Successfully
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>

      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        We are pleased to inform you that your <strong style="color: #10B981;">1-Year Premium Subscription Package</strong> has been successfully activated on your account.
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your account now has full access to all premium features, enhanced performance, and priority services included in the annual subscription package.
      </p>

      <!-- Status Green Banner -->
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; font-size: 14px; font-weight: 700; color: #34D399; text-align: center;">
        ✅ Subscription Status: Successfully Activated
      </div>

      <!-- Subscription Benefits Card -->
      <div style="margin: 24px 0; padding: 22px; background: #172033; border: 1px solid #243049; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2B3954; padding-bottom: 10px;">
          Subscription Benefits:
        </h3>

        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 6px;">🚀 <strong style="color: #FFFFFF;">Choose 5x or 10x more usage than Free</strong></div>
          <div style="margin-bottom: 6px;">📈 <strong style="color: #FFFFFF;">Higher output limits for all models</strong></div>
          <div style="margin-bottom: 6px;">⚡ <strong style="color: #FFFFFF;">Early access to advanced Claude features</strong></div>
          <div style="margin-bottom: 6px;">⭐ <strong style="color: #FFFFFF;">Priority access in high traffic times</strong></div>
          <div style="margin-bottom: 6px;">💻 <strong style="color: #FFFFFF;">Includes Claude Code CLI</strong></div>
          <div style="margin-bottom: 6px;">🎨 <strong style="color: #FFFFFF;">Artifacts & visuals creation</strong></div>
          <div style="margin-bottom: 6px;">⚡ <strong style="color: #FFFFFF;">Ability to use more Claude models</strong></div>
          <div style="margin-bottom: 6px;">🟩 <strong style="color: #FFFFFF;">Claude for Microsoft 365</strong></div>
          <div style="margin-bottom: 6px;">🟦 <strong style="color: #FFFFFF;">Claude for Microsoft Outlook</strong></div>
        </div>
      </div>

      <!-- Action Button (Accept Invitation) -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://claude.ai/login" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #10B981, #059669); color: #FFFFFF; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
          Accept Invitation
        </a>
        <p style="margin: 8px 0 0; font-size: 11px; color: #64748B;">
          (আপনার ইনভিটেশন গ্রহণ করতে উপরোক্ত বাটনে ক্লিক করুন)
        </p>
      </div>

      <!-- Need Assistance Support Box -->
      <div style="margin: 24px 0 16px; padding: 16px; background: #0E131F; border: 1px solid #1E293B; border-radius: 12px; font-size: 12px; color: #94A3B8;">
        <p style="margin: 0 0 6px; font-weight: 700; color: #E2E8F0; font-size: 13px;">Need Assistance?</p>
        <p style="margin: 2px 0;">Email: <a href="mailto:support@anthropic.com" style="color: #38BDF8; text-decoration: none;">support@anthropic.com</a></p>
        <p style="margin: 2px 0;">24/7 Premium Support Available</p>
        <p style="margin: 2px 0; color: #10B981; font-weight: 600;">Status: Subscription Activated & Verified</p>
      </div>

      <!-- Closing Signoff -->
      <div style="margin-top: 24px; font-size: 13px; color: #94A3B8; line-height: 1.5;">
        <p style="margin: 0;">Thank you for choosing <strong>Claude AI Premium</strong>.</p>
        <p style="margin: 8px 0 0; font-weight: 700; color: #E2E8F0;">Best Regards,</p>
        <p style="margin: 2px 0; color: #10B981; font-weight: 600;">Claude AI Support Team</p>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background: #0B0E17; border-top: 1px solid #1E293B; text-align: center; font-size: 11px; color: #64748B;">
      © 2026 Claude AI. All rights reserved.<br/>
      Privacy • Terms • Security • Account Settings
    </div>

  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SYSTEM_STARTER_TEMPLATES: Template[] = [
  CLAUDE_PREMIUM_TEMPLATE,
];
