export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  invitationUrl?: string;
  category?: string;
}

// 1. Claude AI Premium
export const CLAUDE_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-claude-ai-premium',
  name: 'Claude AI — Premium Subscription & Team Invitation',
  subject: 'Claude AI Premium Subscription Activated Successfully! 🎉',
  category: 'AI Platform',
  body: `<div style="background-color: #0A0D14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 580px; margin: 0 auto; background: #111622; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, #161F32 0%, #111622 100%);">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">Claude AI</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #10B981; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Premium Subscription Activated Successfully
      </p>
    </div>
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        We are pleased to inform you that your <strong style="color: #10B981;">1-Year Premium Subscription Package</strong> has been successfully activated.
      </p>
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; font-size: 14px; font-weight: 700; color: #34D399; text-align: center;">
        ✅ Subscription Status: Successfully Activated
      </div>
      <div style="margin: 24px 0; padding: 22px; background: #172033; border: 1px solid #243049; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2B3954; padding-bottom: 10px;">Subscription Benefits:</h3>
        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 6px;">🚀 <strong style="color: #FFFFFF;">Choose 5x or 10x more usage than Free</strong></div>
          <div style="margin-bottom: 6px;">📈 <strong style="color: #FFFFFF;">Higher output limits for all models</strong></div>
          <div style="margin-bottom: 6px;">⚡ <strong style="color: #FFFFFF;">Early access to advanced Claude features</strong></div>
          <div style="margin-bottom: 6px;">⭐ <strong style="color: #FFFFFF;">Priority access in high traffic times</strong></div>
          <div style="margin-bottom: 6px;">💻 <strong style="color: #FFFFFF;">Includes Claude Code CLI</strong></div>
          <div style="margin-bottom: 6px;">🎨 <strong style="color: #FFFFFF;">Artifacts & visuals creation</strong></div>
          <div style="margin-bottom: 6px;">🟩 <strong style="color: #FFFFFF;">Claude for Microsoft 365 & Outlook</strong></div>
        </div>
      </div>
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://claude.ai/login" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #10B981, #059669); color: #FFFFFF; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
          Accept Invitation
        </a>
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 2. ChatGPT Plus & Team (OpenAI)
export const CHATGPT_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-chatgpt-plus',
  name: 'ChatGPT Plus & Team — Subscription & Invitation Template',
  subject: 'Welcome to ChatGPT Plus & Team Subscription! 🚀',
  category: 'AI Platform',
  body: `<div style="background-color: #050B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 580px; margin: 0 auto; background: #0D1527; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
    <!-- Header -->
    <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, #09251E 0%, #0D1527 100%);">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #10A37F; letter-spacing: -0.5px;">ChatGPT Plus & Team</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #34D399; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        OpenAI Premium Plan Activated
      </p>
    </div>
    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #10A37F;">ChatGPT Plus & Team Workspace Subscription</strong> has been successfully activated for your account!
      </p>
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(16, 163, 127, 0.15); border: 1px solid rgba(16, 163, 127, 0.35); border-radius: 12px; font-size: 14px; font-weight: 700; color: #10A37F; text-align: center;">
        ⚡ ChatGPT Plus & GPT-4o Access Granted
      </div>
      <!-- Benefits -->
      <div style="margin: 24px 0; padding: 22px; background: #111C33; border: 1px solid #1E2E4F; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2B3A5A; padding-bottom: 10px;">ChatGPT Plus Features Included:</h3>
        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 6px;">🤖 <strong style="color: #FFFFFF;">Unlimited GPT-4o & GPT-4o mini Access</strong></div>
          <div style="margin-bottom: 6px;">🎨 <strong style="color: #FFFFFF;">DALL-E 3 Ultra HD Image Generation</strong></div>
          <div style="margin-bottom: 6px;">📊 <strong style="color: #FFFFFF;">Advanced Data Analysis & Python Interpreter</strong></div>
          <div style="margin-bottom: 6px;">🎙️ <strong style="color: #FFFFFF;">Advanced Real-time Voice Mode</strong></div>
          <div style="margin-bottom: 6px;">🌐 <strong style="color: #FFFFFF;">Web Browsing with Real-Time Search</strong></div>
          <div style="margin-bottom: 6px;">🧩 <strong style="color: #FFFFFF;">Custom GPTs & OpenAI Store Access</strong></div>
        </div>
      </div>
      <!-- Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://chatgpt.com/" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #10A37F, #059669); color: #FFFFFF; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 163, 127, 0.4);">
          Accept ChatGPT Team Invitation
        </a>
        <p style="margin: 8px 0 0; font-size: 11px; color: #64748B;">(নিচের লিংকে ক্লিক করে টিমে জয়েন করুন)</p>
      </div>
    </div>
    <!-- Footer -->
    <div style="padding: 16px 24px; background: #070C16; border-top: 1px solid #1E293B; text-align: center; font-size: 11px; color: #64748B;">
      © 2026 OpenAI ChatGPT. All rights reserved.
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 3. Google Gemini Advanced
export const GEMINI_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-google-gemini-advanced',
  name: 'Google Gemini Advanced — 1-Year Subscription Invitation',
  subject: 'Your Google Gemini Advanced Subscription is Active! ✨',
  category: 'AI Platform',
  body: `<div style="background-color: #090B10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 580px; margin: 0 auto; background: #121624; border: 1px solid #232B42; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
    <!-- Header -->
    <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #232B42; background: linear-gradient(135deg, #1E1B4B 0%, #1E293B 50%, #31103F 100%);">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; background: linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Google Gemini</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #A78BFA; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Gemini Advanced & 2TB AI Premium
      </p>
    </div>
    <!-- Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #60A5FA;">Google One AI Premium Package (Gemini Advanced 1.5 Pro)</strong> subscription has been successfully enabled!
      </p>
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(96, 165, 250, 0.12); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 12px; font-size: 14px; font-weight: 700; color: #60A5FA; text-align: center;">
        ✨ Gemini 1.5 Pro 1 Million Token Window Activated
      </div>
      <!-- Features -->
      <div style="margin: 24px 0; padding: 22px; background: #192035; border: 1px solid #283352; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2E3B5E; padding-bottom: 10px;">Gemini Advanced Plan Highlights:</h3>
        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 6px;">🔮 <strong style="color: #FFFFFF;">Gemini 1.5 Pro Ultra-Long Context Model</strong></div>
          <div style="margin-bottom: 6px;">☁️ <strong style="color: #FFFFFF;">2 TB Google One Cloud Storage Included</strong></div>
          <div style="margin-bottom: 6px;">📝 <strong style="color: #FFFFFF;">Gemini Integration in Google Docs, Gmail & Drive</strong></div>
          <div style="margin-bottom: 6px;">⚡ <strong style="color: #FFFFFF;">1,000,000+ Token Context Window (PDF & Video Analysis)</strong></div>
          <div style="margin-bottom: 6px;">🎨 <strong style="color: #FFFFFF;">Imagen 3 Ultra-Realistic Image Generation</strong></div>
        </div>
      </div>
      <!-- Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://gemini.google.com/" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: #FFFFFF; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">
          Accept Gemini AI Invitation
        </a>
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 4. Grok AI (xAI)
export const GROK_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-grok-ai-premium',
  name: 'Grok AI (xAI) — Premium Subscription & Access Invitation',
  subject: 'Grok AI Supercomputer Access Granted! ⚡',
  category: 'AI Platform',
  body: `<div style="background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 580px; margin: 0 auto; background: #0A0A0C; border: 1px solid #222226; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
    <!-- Header -->
    <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #222226; background: linear-gradient(180deg, #18181B 0%, #0A0A0C 100%);">
      <h1 style="margin: 0; font-size: 30px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px;">Grok AI (xAI)</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #A1A1AA; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        xAI Heavy Duty Supercomputer Unlocked
      </p>
    </div>
    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #A1A1AA;">
        Your subscription to <strong style="color: #FFFFFF;">Grok 2 AI & xAI Premium Access</strong> is officially active.
      </p>
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-align: center;">
        ⚡ Grok 2 Vision & Uncensored Search Enabled
      </div>
      <!-- Features -->
      <div style="margin: 24px 0; padding: 22px; background: #121215; border: 1px solid #27272A; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F4F4F5; border-bottom: 1px solid #27272A; padding-bottom: 10px;">Grok AI Core Capabilities:</h3>
        <div style="font-size: 13.5px; color: #D4D4D8; line-height: 2.2;">
          <div style="margin-bottom: 6px;">🌐 <strong style="color: #FFFFFF;">Real-time X (Twitter) Data Stream & News Analysis</strong></div>
          <div style="margin-bottom: 6px;">⚡ <strong style="color: #FFFFFF;">Grok 2 Multimodal Vision & Image Processing</strong></div>
          <div style="margin-bottom: 6px;">🎨 <strong style="color: #FFFFFF;">FLUX.1 Photorealistic Image Generation</strong></div>
          <div style="margin-bottom: 6px;">🔥 <strong style="color: #FFFFFF;">Fun & Uncensored Real-Time Reasoning Engine</strong></div>
        </div>
      </div>
      <!-- Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://x.ai/" target="_blank" style="display: inline-block; padding: 14px 40px; background: #FFFFFF; color: #000000; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25);">
          Accept Grok AI Invitation
        </a>
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 5. Midjourney v6 Pro
export const MIDJOURNEY_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-midjourney-pro',
  name: 'Midjourney v6 Pro — Unlimited Generation & Team Access',
  subject: 'Midjourney v6 Pro Subscription Activated! 🎨',
  category: 'AI Platform',
  body: `<div style="background-color: #06050D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 580px; margin: 0 auto; background: #0E0C1C; border: 1px solid #231E3D; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
    <!-- Header -->
    <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #231E3D; background: linear-gradient(180deg, #1C173B 0%, #0E0C1C 100%);">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #818CF8; letter-spacing: -0.5px;">Midjourney v6 Pro</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #C084FC; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Pro Plan Unlimited Fast Hours Active
      </p>
    </div>
    <!-- Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #818CF8;">Midjourney v6 Pro Plan Membership</strong> is now active with full commercial usage rights!
      </p>
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(129, 140, 248, 0.12); border: 1px solid rgba(129, 140, 248, 0.3); border-radius: 12px; font-size: 14px; font-weight: 700; color: #818CF8; text-align: center;">
        🎨 30 Fast GPU Hours & Stealth Mode Enabled
      </div>
      <!-- Features -->
      <div style="margin: 24px 0; padding: 22px; background: #161329; border: 1px solid #2C264F; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2E2954; padding-bottom: 10px;">Pro Plan Benefits:</h3>
        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 6px;">🎨 <strong style="color: #FFFFFF;">Unlimited Relax GPU Generations</strong></div>
          <div style="margin-bottom: 6px;">🔒 <strong style="color: #FFFFFF;">Stealth Generation (Private Images)</strong></div>
          <div style="margin-bottom: 6px;">⚡ <strong style="color: #FFFFFF;">12 Concurrent Fast GPU Render Jobs</strong></div>
          <div style="margin-bottom: 6px;">💼 <strong style="color: #FFFFFF;">Full Commercial Rights Included</strong></div>
        </div>
      </div>
      <!-- Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://www.midjourney.com/" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #6366F1, #A855F7); color: #FFFFFF; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
          Accept Midjourney Invitation
        </a>
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SYSTEM_STARTER_TEMPLATES: Template[] = [
  CLAUDE_PREMIUM_TEMPLATE,
  CHATGPT_PREMIUM_TEMPLATE,
  GEMINI_PREMIUM_TEMPLATE,
  GROK_PREMIUM_TEMPLATE,
  MIDJOURNEY_PREMIUM_TEMPLATE,
];
