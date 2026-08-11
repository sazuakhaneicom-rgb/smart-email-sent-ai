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

// 1. CHATGPT — The All-in-One AI
export const CHATGPT_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-chatgpt-plus',
  name: '🤖 CHATGPT — The All-in-One AI Subscription & Invitation',
  subject: 'Welcome to ChatGPT Plus & Team — Your All-in-One AI Partner! 🚀',
  category: 'AI Platform',
  body: `<div style="background-color: #050B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 600px; margin: 0 auto; background: #0D1527; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.65);">
    
    <!-- Top Header -->
    <div style="padding: 36px 24px 22px; text-align: center; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, #06231C 0%, #0D1527 100%);">
      <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #10A37F; letter-spacing: -0.5px;">🤖 CHATGPT</h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #34D399; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        One AI. Endless Possibilities.
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>

      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #10A37F;">ChatGPT Plus & Team Workspace Subscription</strong> has been successfully activated! Enjoy full access to all flagship GPT models, reasoning tools, and creative workspaces.
      </p>

      <!-- Tagline Banner -->
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(16, 163, 127, 0.15); border: 1px solid rgba(16, 163, 127, 0.35); border-radius: 12px; font-size: 14px; font-weight: 800; color: #34D399; text-align: center;">
        🔥 “Chat নয়, আপনার পুরো কাজের AI Partner.”
      </div>

      <!-- Feature Card -->
      <div style="margin: 24px 0; padding: 22px; background: #111C33; border: 1px solid #1E2E4F; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2B3A5A; padding-bottom: 10px;">
          ⚡ ChatGPT Highlighting Capabilities:
        </h3>

        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 8px;">✍️ <strong style="color: #FFFFFF;">Writing & Content:</strong> Article, Caption, Script, Email, Marketing Copy</div>
          <div style="margin-bottom: 8px;">🧠 <strong style="color: #FFFFFF;">Advanced Reasoning:</strong> Complex problem solving, planning & decision making</div>
          <div style="margin-bottom: 8px;">🔎 <strong style="color: #FFFFFF;">Web Search:</strong> Internet থেকে latest information খুঁজে বের করা</div>
          <div style="margin-bottom: 8px;">📚 <strong style="color: #FFFFFF;">Deep Research:</strong> বহু source থেকে research করে documented report তৈরি করা</div>
          <div style="margin-bottom: 8px;">📄 <strong style="color: #FFFFFF;">File & Document Analysis:</strong> PDF, document, data ইত্যাদি নিয়ে কাজ করা</div>
          <div style="margin-bottom: 8px;">💻 <strong style="color: #FFFFFF;">Coding & Debugging:</strong> Code লেখা, bug খোঁজা ও code review</div>
          <div style="margin-bottom: 8px;">🎨 <strong style="color: #FFFFFF;">Canvas:</strong> Writing ও coding project-কে আলাদা workspace-এ edit/refine করা</div>
          <div style="margin-bottom: 8px;">📁 <strong style="color: #FFFFFF;">Projects:</strong> একই project-এর chat, files, instructions ও context একসাথে রাখা</div>
          <div style="margin-bottom: 8px;">⚙️ <strong style="color: #FFFFFF;">Work / Agent-style Tasks:</strong> Multi-step document, spreadsheet, presentation, report তৈরি</div>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://chatgpt.com/" target="_blank" style="display: inline-block; padding: 15px 42px; background: linear-gradient(135deg, #10A37F, #059669); color: #FFFFFF; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 18px rgba(16, 163, 127, 0.45);">
          Accept ChatGPT Team Invitation
        </a>
        <p style="margin: 8px 0 0; font-size: 11px; color: #64748B;">
          (ইনভিটেশন একসেপ্ট করতে ওপরের বাটনে ক্লিক করুন)
        </p>
      </div>

      <!-- Footer Signoff -->
      <div style="margin-top: 24px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 16px; text-align: center;">
        © 2026 OpenAI ChatGPT. All rights reserved.
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 2. CLAUDE — The Deep Work AI
export const CLAUDE_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-claude-ai-premium',
  name: '🧠 CLAUDE — The Deep Work AI Subscription & Team Invitation',
  subject: 'Claude AI Premium Subscription Activated — Think Deeper. Build Better. 🎉',
  category: 'AI Platform',
  body: `<div style="background-color: #0A0D14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 600px; margin: 0 auto; background: #111622; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.65);">
    
    <!-- Top Header -->
    <div style="padding: 36px 24px 22px; text-align: center; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, #161F32 0%, #111622 100%);">
      <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">🧠 CLAUDE</h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #10B981; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        Think Deeper. Build Better.
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>

      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #10B981;">Claude AI Premium Subscription Package</strong> has been successfully activated. Experience superior reasoning, coding agent capabilities, and structured workspace artifacts.
      </p>

      <!-- Tagline Banner -->
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; font-size: 14px; font-weight: 800; color: #34D399; text-align: center;">
        🔥 “Simple answers নয়—Deep Work-এর জন্য Claude.”
      </div>

      <!-- Feature Card -->
      <div style="margin: 24px 0; padding: 22px; background: #172033; border: 1px solid #243049; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2B3954; padding-bottom: 10px;">
          ✨ CLAUDE-এর বিশেষ ফিচারসমূহ:
        </h3>

        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 8px;">💻 <strong style="color: #FFFFFF;">Advanced Coding:</strong> Complex code, debugging & full development</div>
          <div style="margin-bottom: 8px;">🧩 <strong style="color: #FFFFFF;">Claude Code:</strong> Software development-এর জন্য dedicated coding agent</div>
          <div style="margin-bottom: 8px;">📑 <strong style="color: #FFFFFF;">Long Documents:</strong> বড় document পড়ে context ধরে analysis</div>
          <div style="margin-bottom: 8px;">✍️ <strong style="color: #FFFFFF;">Professional Writing:</strong> Natural, polished & structured writing</div>
          <div style="margin-bottom: 8px;">🔬 <strong style="color: #FFFFFF;">Deep Analysis:</strong> Complex বিষয়কে ভেঙে reasoning করা</div>
          <div style="margin-bottom: 8px;">🛠️ <strong style="color: #FFFFFF;">Artifacts:</strong> কাজের output/interactive content তৈরি ও refine করা</div>
          <div style="margin-bottom: 8px;">📂 <strong style="color: #FFFFFF;">Projects:</strong> নির্দিষ্ট কাজের জন্য context ও files নিয়ে structured workspace</div>
          <div style="margin-bottom: 8px;">🧪 <strong style="color: #FFFFFF;">Claude Science:</strong> Scientific workflow, auditable artifacts & computing resources</div>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://claude.ai/login" target="_blank" style="display: inline-block; padding: 15px 42px; background: linear-gradient(135deg, #10B981, #059669); color: #FFFFFF; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 18px rgba(16, 185, 129, 0.45);">
          Accept Claude Team Invitation
        </a>
      </div>

      <!-- Footer Signoff -->
      <div style="margin-top: 24px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 16px; text-align: center;">
        © 2026 Claude AI (Anthropic). All rights reserved.
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 3. GOOGLE GEMINI — The Google-Powered AI
export const GEMINI_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-google-gemini-advanced',
  name: '✨ GOOGLE GEMINI — Connected to Google Ecosystem Invitation',
  subject: 'Your Google Gemini Advanced Subscription is Active! ✨',
  category: 'AI Platform',
  body: `<div style="background-color: #090B10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 600px; margin: 0 auto; background: #121624; border: 1px solid #232B42; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.65);">
    
    <!-- Top Header -->
    <div style="padding: 36px 24px 22px; text-align: center; border-bottom: 1px solid #232B42; background: linear-gradient(135deg, #1E1B4B 0%, #1E293B 50%, #31103F 100%);">
      <h1 style="margin: 0; font-size: 32px; font-weight: 900; background: linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">✨ GOOGLE GEMINI</h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #A78BFA; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        Your AI. Connected to Google.
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>

      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #60A5FA;">Google One AI Premium Package (Gemini Advanced 1.5 Pro)</strong> subscription is officially active and connected to your entire Google Workspace ecosystem!
      </p>

      <!-- Tagline Banner -->
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(96, 165, 250, 0.12); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 12px; font-size: 14px; font-weight: 800; color: #60A5FA; text-align: center;">
        🔥 “Google-এর ecosystem যেখানে, Gemini সেখানে আরও powerful.”
      </div>

      <!-- Feature Card -->
      <div style="margin: 24px 0; padding: 22px; background: #192035; border: 1px solid #283352; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2E3B5E; padding-bottom: 10px;">
          🚀 GEMINI-এর বিশেষ কাজসমূহ:
        </h3>

        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 8px;">🔎 <strong style="color: #FFFFFF;">Deep Research:</strong> Web থেকে research করে detailed report তৈরি</div>
          <div style="margin-bottom: 8px;">📧 <strong style="color: #FFFFFF;">Gmail Integration:</strong> আপনার Gmail-এর information নিয়ে সরাসরি কাজ করা</div>
          <div style="margin-bottom: 8px;">📁 <strong style="color: #FFFFFF;">Google Drive Integration:</strong> Docs, Slides, Sheets, PDFs-এর তথ্য নিয়ে গবেষণা</div>
          <div style="margin-bottom: 8px;">💬 <strong style="color: #FFFFFF;">Google Chat Integration:</strong> Workspace conversation context ব্যবহার করা</div>
          <div style="margin-bottom: 8px;">📄 <strong style="color: #FFFFFF;">Google Docs, Sheets & Slides:</strong> Document, Spreadsheet ও Presentation তৈরিতে সহায়তা</div>
          <div style="margin-bottom: 8px;">🧠 <strong style="color: #FFFFFF;">Gems:</strong> নিজের প্রয়োজন অনুযায়ী custom AI expert তৈরি করা</div>
          <div style="margin-bottom: 8px;">🎨 <strong style="color: #FFFFFF;">Nano Banana:</strong> AI image generation ও image editing</div>
          <div style="margin-bottom: 8px;">🎬 <strong style="color: #FFFFFF;">Veo:</strong> AI video creation</div>
          <div style="margin-bottom: 8px;">🎵 <strong style="color: #FFFFFF;">Lyria:</strong> AI music & audio creation</div>
          <div style="margin-bottom: 8px;">🖥️ <strong style="color: #FFFFFF;">Canvas:</strong> Document, code এবং interactive content তৈরি/edit করার workspace</div>
          <div style="margin-bottom: 8px;">📚 <strong style="color: #FFFFFF;">NotebookLM Integration:</strong> Research ও notes-এর সাথে কাজ করার সুবিধা</div>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://gemini.google.com/" target="_blank" style="display: inline-block; padding: 15px 42px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: #FFFFFF; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 18px rgba(59, 130, 246, 0.45);">
          Accept Gemini Family / Team Invitation
        </a>
      </div>

      <!-- Footer Signoff -->
      <div style="margin-top: 24px; font-size: 12px; color: #64748B; border-top: 1px solid #232B42; padding-top: 16px; text-align: center;">
        © 2026 Google AI. All rights reserved.
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 4. GROK — The Real-Time AI (xAI)
export const GROK_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-grok-ai-premium',
  name: '⚡ GROK — Real-Time X Data & Grok Imagine Invitation',
  subject: 'Grok AI Supercomputer Access Granted — What\'s happening now? ⚡',
  category: 'AI Platform',
  body: `<div style="background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 600px; margin: 0 auto; background: #0A0A0C; border: 1px solid #222226; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.85);">
    
    <!-- Top Header -->
    <div style="padding: 36px 24px 22px; text-align: center; border-bottom: 1px solid #222226; background: linear-gradient(180deg, #18181B 0%, #0A0A0C 100%);">
      <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px;">⚡ GROK</h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #A1A1AA; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        Ask. Explore. Create.
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>

      <p style="font-size: 14px; line-height: 1.6; color: #A1A1AA;">
        Your <strong style="color: #FFFFFF;">Grok 2 AI & xAI Premium Access</strong> is officially active. Access real-time X news stream, uncensored conversational reasoning, and Grok Imagine motion generation.
      </p>

      <!-- Tagline Banner -->
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-size: 14px; font-weight: 800; color: #FFFFFF; text-align: center;">
        🔥 “What's happening now? Ask Grok.”<br/>
        <span style="font-size: 12px; color: #A1A1AA; font-weight: 600;">“From Image to Motion — with Grok Imagine.”</span>
      </div>

      <!-- Feature Card -->
      <div style="margin: 24px 0; padding: 22px; background: #121215; border: 1px solid #27272A; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F4F4F5; border-bottom: 1px solid #27272A; padding-bottom: 10px;">
          ⚡ GROK-এর বিশেষ কাজসমূহ:
        </h3>

        <div style="font-size: 13.5px; color: #D4D4D8; line-height: 2.2;">
          <div style="margin-bottom: 8px;">🌐 <strong style="color: #FFFFFF;">Real-Time Information:</strong> বর্তমান ঘটনা ও নতুন information explore করা</div>
          <div style="margin-bottom: 8px;">🔎 <strong style="color: #FFFFFF;">Web/X Exploration:</strong> latest topics, discussions & trends খোঁজা</div>
          <div style="margin-bottom: 8px;">💬 <strong style="color: #FFFFFF;">Natural Conversation:</strong> direct, conversational interaction</div>
          <div style="margin-bottom: 8px;">🧠 <strong style="color: #FFFFFF;">Brainstorming:</strong> নতুন idea explore করা</div>
          <div style="margin-bottom: 8px;">🖼️ <strong style="color: #FFFFFF;">Image Creation:</strong> AI-generated visuals</div>
          <div style="margin-bottom: 8px;">🎬 <strong style="color: #FFFFFF;">Image → Video:</strong> একটি image থেকে cinematic video তৈরি করা</div>
          <div style="margin-bottom: 8px;">🎞️ <strong style="color: #FFFFFF;">AI Video Generation:</strong> Text/image থেকে video তৈরি</div>
          <div style="margin-bottom: 8px;">✂️ <strong style="color: #FFFFFF;">Video Editing:</strong> scene restyle, object add/remove ও motion control</div>
          <div style="margin-bottom: 8px;">🔊 <strong style="color: #FFFFFF;">Grok Voice:</strong> multilingual voice interaction</div>
          <div style="margin-bottom: 8px;">🤖 <strong style="color: #FFFFFF;">Voice Agent Builder:</strong> no-code দিয়ে personalized voice agent তৈরি</div>
          <div style="margin-bottom: 8px;">📂 <strong style="color: #FFFFFF;">Projects:</strong> creative/work projects organize করা</div>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://x.ai/" target="_blank" style="display: inline-block; padding: 15px 42px; background: #FFFFFF; color: #000000; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 22px rgba(255, 255, 255, 0.3);">
          Accept Grok AI Invitation
        </a>
      </div>

      <!-- Footer Signoff -->
      <div style="margin-top: 24px; font-size: 12px; color: #71717A; border-top: 1px solid #27272A; padding-top: 16px; text-align: center;">
        © 2026 xAI Grok. All rights reserved.
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 5. MIDJOURNEY — The Visual Creation Studio
export const MIDJOURNEY_PREMIUM_TEMPLATE: Template = {
  id: 'tpl-midjourney-pro',
  name: '🎨 MIDJOURNEY — The Visual Creation Studio Invitation',
  subject: 'Midjourney v6 Pro Subscription Activated — Imagine It. Create It. 🎨',
  category: 'AI Platform',
  body: `<div style="background-color: #06050D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 15px; color: #E2E8F0;">
  <div style="max-width: 600px; margin: 0 auto; background: #0E0C1C; border: 1px solid #231E3D; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.75);">
    
    <!-- Top Header -->
    <div style="padding: 36px 24px 22px; text-align: center; border-bottom: 1px solid #231E3D; background: linear-gradient(180deg, #1C173B 0%, #0E0C1C 100%);">
      <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #818CF8; letter-spacing: -0.5px;">🎨 MIDJOURNEY</h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #C084FC; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        Imagine It. Create It.
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; font-weight: 600; color: #F8FAFC; margin-top: 0;">Dear {{first_name}},</p>

      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8;">
        Your <strong style="color: #818CF8;">Midjourney v6 Pro Plan Membership</strong> is now active with full commercial usage rights and high-speed GPU visual generation.
      </p>

      <!-- Tagline Banner -->
      <div style="margin: 20px 0; padding: 14px 18px; background: rgba(129, 140, 248, 0.12); border: 1px solid rgba(129, 140, 248, 0.3); border-radius: 12px; font-size: 14px; font-weight: 800; color: #C084FC; text-align: center;">
        🔥 “Your imagination is the only limit.”
      </div>

      <!-- Feature Card -->
      <div style="margin: 24px 0; padding: 22px; background: #161329; border: 1px solid #2C264F; border-radius: 14px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #F1F5F9; border-bottom: 1px solid #2E2954; padding-bottom: 10px;">
          🎨 MIDJOURNEY-এর বিশেষ কাজসমূহ:
        </h3>

        <div style="font-size: 13.5px; color: #CBD5E1; line-height: 2.2;">
          <div style="margin-bottom: 8px;">🖼️ <strong style="color: #FFFFFF;">AI Image Generation:</strong> Prompt থেকে high-quality visual</div>
          <div style="margin-bottom: 8px;">🎭 <strong style="color: #FFFFFF;">Creative Artwork:</strong> Artistic concepts & visual exploration</div>
          <div style="margin-bottom: 8px;">👤 <strong style="color: #FFFFFF;">Character Creation:</strong> Character concepts & visual development</div>
          <div style="margin-bottom: 8px;">🏙️ <strong style="color: #FFFFFF;">Environment Design:</strong> Scene, location & world building</div>
          <div style="margin-bottom: 8px;">📸 <strong style="color: #FFFFFF;">Concept Visualization:</strong> মাথার idea-কে visual-এ convert করা</div>
          <div style="margin-bottom: 8px;">🔄 <strong style="color: #FFFFFF;">Remix:</strong> Existing visual থেকে নতুন variation তৈরি</div>
          <div style="margin-bottom: 8px;">🖌️ <strong style="color: #FFFFFF;">Vary Region / Inpainting:</strong> ছবির নির্দিষ্ট অংশ পরিবর্তন করা</div>
          <div style="margin-bottom: 8px;">↔️ <strong style="color: #FFFFFF;">Pan & Zoom Out:</strong> Image-এর composition ও surrounding area expand করা</div>
          <div style="margin-bottom: 8px;">✂️ <strong style="color: #FFFFFF;">Web Image Editor:</strong> Remix, Vary Region, Pan ও Zoom Out-এর unified tools</div>
          <div style="margin-bottom: 8px;">🧩 <strong style="color: #FFFFFF;">Image References:</strong> নিজের image ব্যবহার করে নতুন visual direction তৈরি</div>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="https://www.midjourney.com/" target="_blank" style="display: inline-block; padding: 15px 42px; background: linear-gradient(135deg, #6366F1, #A855F7); color: #FFFFFF; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45);">
          Accept Midjourney Team Invitation
        </a>
      </div>

      <!-- Footer Signoff -->
      <div style="margin-top: 24px; font-size: 12px; color: #64748B; border-top: 1px solid #231E3D; padding-top: 16px; text-align: center;">
        © 2026 Midjourney Inc. All rights reserved.
      </div>
    </div>
  </div>
</div>`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SYSTEM_STARTER_TEMPLATES: Template[] = [
  CHATGPT_PREMIUM_TEMPLATE,
  CLAUDE_PREMIUM_TEMPLATE,
  GEMINI_PREMIUM_TEMPLATE,
  GROK_PREMIUM_TEMPLATE,
  MIDJOURNEY_PREMIUM_TEMPLATE,
];
