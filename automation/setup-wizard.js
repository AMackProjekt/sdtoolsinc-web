#!/usr/bin/env node

/**
 * T.O.O.L.S Inc - Setup Wizard
 * 
 * Interactive setup for social media automation
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🤖 T.O.O.L.S Inc Automation Setup Wizard        ║
║                                                   ║
║   Let's get your social media automation ready!   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

`);

  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n✅ Setup cancelled. Using existing .env file.\n');
      rl.close();
      return;
    }
  }

  console.log(`
📋 Step 1: Meta API Setup (Facebook + Instagram)
─────────────────────────────────────────────────────
To post to Facebook and Instagram, you need a Meta access token.

Quick Setup Guide:
1. Go to https://developers.facebook.com/
2. Create an App (Business type)
3. Add "Instagram" and "Pages" products
4. Generate a long-lived User Access Token
5. Get your Page ID and Instagram Business Account ID

Tutorial: https://developers.facebook.com/docs/instagram-api/getting-started

`);

  const metaToken = await question('Enter your Meta Access Token (or press Enter to skip): ');
  const pageId = metaToken ? await question('Enter your Facebook Page ID: ') : '';
  const instaId = metaToken ? await question('Enter your Instagram Business Account ID: ') : '';

  console.log(`
📋 Step 2: OpenAI API Setup (Content Generation)
─────────────────────────────────────────────────
For AI-powered content generation, you need an OpenAI API key.

Setup:
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy the key (starts with sk-...)

Cost: ~$5/month for 500 generated posts (GPT-4)

`);

  const openaiKey = await question('Enter your OpenAI API Key (or press Enter to skip): ');

  console.log(`
📋 Step 3: News API Setup (Content Discovery)
────────────────────────────────────────────────
For discovering relevant news to share, you need a News API key.

Setup:
1. Go to https://newsapi.org/register
2. Sign up (free tier: 100 requests/day)
3. Copy your API key

`);

  const newsKey = await question('Enter your News API Key (or press Enter to skip): ');

  console.log(`
📋 Step 4: Posting Configuration
─────────────────────────────────────────────
`);

  const timezone = await question('Enter your timezone (default: America/Los_Angeles): ') || 'America/Los_Angeles';
  const postTimes = await question('Enter post times in 24h format, comma-separated (default: 09:00,12:00,18:00): ') || '09:00,12:00,18:00';

  // Create .env file
  const envContent = `# Meta API (Facebook + Instagram)
META_ACCESS_TOKEN=${metaToken || 'your_token_here'}
META_PAGE_ID=${pageId || 'your_page_id_here'}
META_INSTAGRAM_BUSINESS_ID=${instaId || 'your_instagram_id_here'}

# OpenAI API (Content Generation)
OPENAI_API_KEY=${openaiKey || 'sk-proj-...your_key_here'}

# News API (Content Discovery)
NEWS_API_KEY=${newsKey || 'your_news_api_key_here'}

# Configuration
TIMEZONE=${timezone}
AUTO_POST=false
MANUAL_REVIEW=true

# Posting Schedule (24-hour format)
POST_TIMES=${postTimes}

# Keywords for News Crawler
NEWS_KEYWORDS=reentry,criminal justice reform,second chance hiring,rehabilitation,formerly incarcerated,california reentry

# Organization Info
ORG_NAME=T.O.O.L.S Inc
ORG_WEBSITE=https://sdtoolsinc.org
ORG_INSTAGRAM=@sd_t.o.o.ls_inc
ORG_FACEBOOK=TOOLsInc
ORG_TIKTOK=@toolsinc
`;

  fs.writeFileSync(envPath, envContent);

  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   ✅ Setup Complete!                              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

📁 Configuration saved to: .env

🎯 Next Steps:

1. Install dependencies:
   cd automation
   npm install

2. Test your setup:
   node test-connection.js

3. Generate your first post:
   node content-generator.js --single tipTuesday

4. Schedule a week of content:
   node content-generator.js --week
   node post-scheduler.js --schedule-week

5. Set up daily automation (optional):
   - Windows: Use Task Scheduler
   - Mac/Linux: Use cron
   - See README.md for instructions

📚 Full Documentation: automation/README.md

💡 Tips:
   - Start with manual posting to get familiar
   - Review all AI-generated content before posting
   - Monitor engagement and adjust timing
   - Keep posts authentic and human

Happy automating! 🚀

`);

  rl.close();
}

setup().catch(console.error);
