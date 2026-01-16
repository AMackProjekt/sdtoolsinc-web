# T.O.O.L.S Inc - Social Media Automation System

## Overview

This automation system helps you manage social media content efficiently using official APIs and web scraping tools.

**IMPORTANT:** All automation uses official APIs and respects platform Terms of Service.

---

## Components

### 1. **Content Generator** (`content-generator.js`)
- AI-powered post generation
- Template-based content creation
- Hashtag optimization

### 2. **Post Scheduler** (`post-scheduler.js`)
- Schedule posts across platforms
- Optimal timing recommendations
- Batch scheduling

### 3. **News Crawler** (`news-crawler.js`)
- Finds relevant reentry/justice reform news
- Curates content for sharing
- Daily digest

### 4. **Engagement Bot** (`engagement-bot.js`)
- Auto-respond to common questions
- DM automation for inquiries
- Comment monitoring

### 5. **Analytics Dashboard** (`analytics.js`)
- Track performance across platforms
- Generate weekly reports
- Identify best-performing content

---

## Setup Instructions

### Prerequisites

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Navigate to automation folder
cd automation

# Install dependencies
npm install
```

### Required API Keys

1. **Meta (Instagram + Facebook):**
   - Go to https://developers.facebook.com/
   - Create App → Business Type
   - Get Access Token
   - Add to `.env` file

2. **OpenAI (Content Generation):**
   - Go to https://platform.openai.com/
   - Create API key
   - Add to `.env` file

3. **News API (Content Discovery):**
   - Go to https://newsapi.org/
   - Free tier: 100 requests/day
   - Add to `.env` file

### Environment Variables

Create `automation/.env`:

```env
# Meta API (Facebook + Instagram)
META_ACCESS_TOKEN=your_token_here
META_PAGE_ID=your_page_id_here
META_INSTAGRAM_ID=your_instagram_business_id_here

# OpenAI API (Content Generation)
OPENAI_API_KEY=your_openai_key_here

# News API (Content Discovery)
NEWS_API_KEY=your_news_api_key_here

# TikTok (Optional - no official API for posting yet)
# TIKTOK_CLIENT_KEY=your_key_here

# Scheduling
TIMEZONE=America/Los_Angeles
```

---

## Usage

### 1. Generate Content

```bash
# Generate week of posts
node content-generator.js --week

# Generate single post
node content-generator.js --single "success story"

# Generate posts from template
node content-generator.js --template "tip-tuesday"
```

### 2. Schedule Posts

```bash
# Schedule this week's content
node post-scheduler.js --schedule-week

# Schedule specific post
node post-scheduler.js --post "path/to/post.json" --date "2026-01-20 09:00"

# View scheduled posts
node post-scheduler.js --list
```

### 3. Crawl News

```bash
# Daily news digest
node news-crawler.js --daily

# Search specific topic
node news-crawler.js --search "criminal justice reform california"

# Generate share-ready posts from news
node news-crawler.js --create-posts
```

### 4. Run Engagement Bot

```bash
# Monitor comments and respond
node engagement-bot.js --monitor

# Auto-respond to DMs
node engagement-bot.js --dm-responder

# Generate engagement report
node engagement-bot.js --report
```

### 5. View Analytics

```bash
# Weekly report
node analytics.js --weekly

# Compare platforms
node analytics.js --compare

# Export data
node analytics.js --export
```

---

## Automation Workflows

### Daily Workflow (Automated via Cron/Task Scheduler)

**8:00 AM:**
```bash
node news-crawler.js --daily
# Finds trending reentry news
```

**9:00 AM:**
```bash
node post-scheduler.js --auto-post
# Posts scheduled content for the day
```

**Throughout Day:**
```bash
node engagement-bot.js --monitor
# Responds to comments/DMs every 30 minutes
```

**6:00 PM:**
```bash
node analytics.js --daily-snapshot
# Generates performance snapshot
```

### Weekly Workflow

**Sunday 10:00 AM:**
```bash
node content-generator.js --week
node post-scheduler.js --schedule-week
# Generates and schedules entire week
```

**Friday 5:00 PM:**
```bash
node analytics.js --weekly
# Generates performance report
```

---

## Windows Task Scheduler Setup

1. **Open Task Scheduler:**
   - Press `Win + R`, type `taskschd.msc`, press Enter

2. **Create Daily Post Task:**
   - Action → Create Basic Task
   - Name: "T.O.O.L.S Social Media - Daily Posts"
   - Trigger: Daily at 9:00 AM
   - Action: Start a program
   - Program: `C:\Program Files\nodejs\node.exe`
   - Arguments: `C:\Users\donyalemack\sdtoolsinc-web\automation\post-scheduler.js --auto-post`

3. **Create Engagement Monitor:**
   - Same steps but run every 30 minutes
   - Use `engagement-bot.js --monitor`

4. **Create Weekly Analytics:**
   - Same steps but weekly on Friday
   - Use `analytics.js --weekly`

---

## Content Templates

### Template Library

**Success Story Template:**
```json
{
  "type": "success_story",
  "format": "carousel",
  "slides": [
    "Before: [Situation]",
    "Challenge: [What they faced]",
    "T.O.O.L.S Support: [How we helped]",
    "After: [Current success]",
    "Takeaway: [Inspirational message]"
  ],
  "hashtags": ["#SuccessStory", "#SecondChances", "#Transformation"],
  "cta": "Your story could be next. Link in bio."
}
```

**Tip Tuesday Template:**
```json
{
  "type": "tip",
  "format": "image_with_text",
  "structure": {
    "hook": "Quick reentry tip 💡",
    "tip": "[Actionable advice]",
    "why": "[Why it matters]",
    "action": "[What to do next]"
  },
  "hashtags": ["#TipTuesday", "#ReentryTips", "#KnowYourRights"],
  "cta": "Save this for later!"
}
```

**Myth Buster Template:**
```json
{
  "type": "education",
  "format": "text_on_color",
  "structure": {
    "myth": "MYTH: [Common misconception]",
    "reality": "REALITY: [The truth]",
    "context": "[Additional info]",
    "resources": "[Where to learn more]"
  },
  "hashtags": ["#MythVsReality", "#KnowTheRules", "#ReentryFacts"],
  "cta": "Share to spread awareness"
}
```

---

## API Rate Limits

**Instagram (Meta API):**
- 25 posts per day
- 200 comments per hour
- Best practice: Space posts 2+ hours apart

**Facebook (Meta API):**
- 50 posts per day
- Unlimited comments (within reason)
- Best practice: 3-5 posts per day max

**TikTok:**
- No official posting API (manual upload required)
- Content generation still useful

**News API:**
- 100 requests/day (free tier)
- 1 request every 15 minutes

---

## Content Calendar Integration

### Auto-populate from Website Blog

When you publish a blog post on your website, automatically:
1. Generate social snippets
2. Create platform-specific versions
3. Schedule across all platforms
4. Track performance

```bash
# Monitor website for new blog posts
node content-generator.js --watch-blog
```

---

## Compliance & Best Practices

### ✅ DO:
- Use official APIs
- Respect rate limits
- Disclose automation (where required)
- Monitor bot responses
- Keep human oversight

### ❌ DON'T:
- Use third-party scraping tools (ToS violation)
- Auto-follow/unfollow (spam)
- Buy followers/engagement
- Post identical content everywhere
- Over-automate (lose authenticity)

---

## Safety Features

### Built-in Safeguards:

1. **Content Review:**
   - All generated content saved to `/drafts` first
   - Manual approval required before posting
   - Flag potentially sensitive content

2. **Rate Limiting:**
   - Automatic delays between posts
   - Prevents hitting API limits
   - Mimics human posting patterns

3. **Error Handling:**
   - Logs all errors
   - Notification on failures
   - Automatic retry with backoff

4. **Engagement Filtering:**
   - Only responds to appropriate comments
   - Escalates complex inquiries to human
   - Never engages with spam/trolls

---

## Troubleshooting

### "Access Token Expired"
- Refresh token via Meta Developer Console
- Update `.env` file

### "Rate Limit Exceeded"
- Check `logs/rate-limits.log`
- Adjust schedule spacing

### "Posts Not Appearing"
- Verify page permissions
- Check Meta Business Manager setup

### "News Crawler Not Finding Content"
- Update search keywords in config
- Check News API quota

---

## Cost Breakdown

### Free Tier (Recommended to Start):
- **Meta API:** FREE
- **News API:** FREE (100/day)
- **OpenAI:** $5/month (~500 posts)
- **Total:** ~$5/month

### Paid Tier (Scale):
- **News API Pro:** $449/month (unlimited)
- **OpenAI:** $20/month (unlimited)
- **Automation Server:** $5/month (DigitalOcean)
- **Total:** ~$25-50/month

---

## Next Steps

1. **Week 1:** Set up Meta API access
2. **Week 2:** Test content generation
3. **Week 3:** Schedule first week of posts
4. **Week 4:** Enable engagement bot
5. **Ongoing:** Monitor and optimize

---

## Support

For issues or questions:
- Check logs: `automation/logs/`
- Review documentation: [Meta API Docs](https://developers.facebook.com/docs/graph-api)
- Contact: [Your email]

---

**Remember:** Automation amplifies your content, but authenticity drives engagement. Keep 20-30% of posts manual and spontaneous.
