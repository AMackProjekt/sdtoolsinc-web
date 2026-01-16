#!/usr/bin/env node

/**
 * T.O.O.L.S Inc - Post Scheduler
 * 
 * Schedules and publishes posts to social media platforms
 * Uses Meta API for Instagram and Facebook
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PAGE_ID = process.env.META_PAGE_ID;
const META_INSTAGRAM_ID = process.env.META_INSTAGRAM_BUSINESS_ID;
const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';
const SCHEDULE_FILE = path.join(__dirname, 'schedule.json');
const DRAFTS_DIR = path.join(__dirname, 'drafts');

/**
 * Post to Facebook Page
 */
async function postToFacebook(content, link = null) {
  try {
    const params = {
      message: content,
      access_token: META_ACCESS_TOKEN
    };

    if (link) {
      params.link = link;
    }

    const response = await axios.post(
      `${GRAPH_API_URL}/${META_PAGE_ID}/feed`,
      params
    );

    console.log('✅ Posted to Facebook:', response.data.id);
    return { success: true, id: response.data.id, platform: 'facebook' };
  } catch (error) {
    console.error('❌ Facebook post failed:', error.response?.data || error.message);
    return { success: false, error: error.message, platform: 'facebook' };
  }
}

/**
 * Post to Instagram (via Facebook Graph API)
 */
async function postToInstagram(caption, imageUrl = null) {
  try {
    // Step 1: Create media container
    const containerParams = {
      caption: caption,
      access_token: META_ACCESS_TOKEN
    };

    if (imageUrl) {
      containerParams.image_url = imageUrl;
    }

    const containerResponse = await axios.post(
      `${GRAPH_API_URL}/${META_INSTAGRAM_ID}/media`,
      containerParams
    );

    const creationId = containerResponse.data.id;

    // Step 2: Publish the container
    const publishResponse = await axios.post(
      `${GRAPH_API_URL}/${META_INSTAGRAM_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: META_ACCESS_TOKEN
      }
    );

    console.log('✅ Posted to Instagram:', publishResponse.data.id);
    return { success: true, id: publishResponse.data.id, platform: 'instagram' };
  } catch (error) {
    console.error('❌ Instagram post failed:', error.response?.data || error.message);
    return { success: false, error: error.message, platform: 'instagram' };
  }
}

/**
 * Load schedule
 */
function loadSchedule() {
  if (!fs.existsSync(SCHEDULE_FILE)) {
    return { posts: [] };
  }
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
}

/**
 * Save schedule
 */
function saveSchedule(schedule) {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedule, null, 2));
}

/**
 * Schedule a post
 */
function schedulePost(draftId, datetime, platforms) {
  const schedule = loadSchedule();
  
  // Load draft
  const draftPath = path.join(DRAFTS_DIR, `${draftId}.json`);
  if (!fs.existsSync(draftPath)) {
    console.error(`❌ Draft not found: ${draftId}`);
    return false;
  }

  const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));

  const scheduledPost = {
    id: `scheduled_${Date.now()}`,
    draftId: draftId,
    content: draft.content,
    hashtags: draft.hashtags,
    platforms: platforms || draft.platforms,
    scheduledFor: datetime,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };

  schedule.posts.push(scheduledPost);
  saveSchedule(schedule);

  console.log(`✅ Post scheduled for ${datetime}`);
  console.log(`📱 Platforms: ${scheduledPost.platforms.join(', ')}`);
  return true;
}

/**
 * Schedule entire week
 */
function scheduleWeek() {
  const weekSummaryPath = path.join(DRAFTS_DIR, 'week_summary.json');
  if (!fs.existsSync(weekSummaryPath)) {
    console.error('❌ No week summary found. Run content-generator.js --week first');
    return;
  }

  const weekSummary = JSON.parse(fs.readFileSync(weekSummaryPath, 'utf8'));
  const postTimes = (process.env.POST_TIMES || '09:00,12:00,18:00').split(',');

  const schedule = loadSchedule();
  const now = new Date();
  
  weekSummary.posts.forEach((post, index) => {
    const postDate = new Date(now);
    postDate.setDate(postDate.getDate() + index);
    
    // Assign time based on index
    const timeIndex = index % postTimes.length;
    const [hours, minutes] = postTimes[timeIndex].split(':');
    postDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const scheduledPost = {
      id: `scheduled_${Date.now()}_${index}`,
      draftId: post.id,
      platforms: post.platforms,
      scheduledFor: postDate.toISOString(),
      status: 'scheduled',
      day: post.day,
      template: post.template,
      createdAt: new Date().toISOString()
    };

    schedule.posts.push(scheduledPost);
    console.log(`✅ ${post.day} (${post.template}) → ${postDate.toLocaleString()}`);
  });

  saveSchedule(schedule);
  console.log(`\n📅 Scheduled ${weekSummary.posts.length} posts for the week`);
}

/**
 * List scheduled posts
 */
function listScheduled() {
  const schedule = loadSchedule();
  const pending = schedule.posts.filter(p => p.status === 'scheduled');

  if (pending.length === 0) {
    console.log('\n📭 No posts scheduled\n');
    return;
  }

  console.log(`\n📅 Scheduled Posts (${pending.length}):\n`);
  pending.forEach((post, index) => {
    const date = new Date(post.scheduledFor);
    console.log(`${index + 1}. ${date.toLocaleString()}`);
    console.log(`   ID: ${post.id}`);
    console.log(`   Platforms: ${post.platforms.join(', ')}`);
    if (post.day) console.log(`   Day: ${post.day} (${post.template})`);
    console.log();
  });
}

/**
 * Post now (manual)
 */
async function postNow(draftId, platforms = null) {
  const draftPath = path.join(DRAFTS_DIR, `${draftId}.json`);
  if (!fs.existsSync(draftPath)) {
    console.error(`❌ Draft not found: ${draftId}`);
    return;
  }

  const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
  const targetPlatforms = platforms || draft.platforms;

  console.log(`\n📤 Posting to: ${targetPlatforms.join(', ')}\n`);

  // Add hashtags to content
  const fullContent = `${draft.content}\n\n${draft.hashtags.join(' ')}`;

  const results = [];

  for (const platform of targetPlatforms) {
    if (platform === 'facebook') {
      const result = await postToFacebook(fullContent, process.env.ORG_WEBSITE);
      results.push(result);
    } else if (platform === 'instagram') {
      // Instagram requires image URL - for now just show message
      console.log('⚠️  Instagram requires image upload. Use Meta Business Suite for manual posting.');
      console.log(`   Caption ready:\n${fullContent}\n`);
    } else if (platform === 'tiktok') {
      console.log('⚠️  TikTok requires manual upload. No posting API available yet.');
      console.log(`   Caption ready:\n${fullContent}\n`);
    } else {
      console.log(`⚠️  Platform "${platform}" not yet supported for auto-posting`);
    }

    // Wait 2 seconds between posts
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Log results
  const posted = {
    draftId: draftId,
    postedAt: new Date().toISOString(),
    platforms: results,
    content: fullContent
  };

  const logPath = path.join(__dirname, 'logs');
  if (!fs.existsSync(logPath)) fs.mkdirSync(logPath, { recursive: true });
  
  fs.appendFileSync(
    path.join(logPath, 'posted.jsonl'),
    JSON.stringify(posted) + '\n'
  );

  console.log('\n✅ Posting complete! Check logs/posted.jsonl for details.');
}

/**
 * Auto-post scheduled content (run via cron)
 */
async function autoPost() {
  const schedule = loadSchedule();
  const now = new Date();

  const toPost = schedule.posts.filter(post => {
    if (post.status !== 'scheduled') return false;
    const scheduledTime = new Date(post.scheduledFor);
    // Post if within 5 minutes of scheduled time
    const diff = scheduledTime - now;
    return diff > 0 && diff < 5 * 60 * 1000;
  });

  if (toPost.length === 0) {
    console.log('✅ No posts scheduled for now');
    return;
  }

  console.log(`\n📤 Auto-posting ${toPost.length} scheduled post(s)...\n`);

  for (const post of toPost) {
    await postNow(post.draftId, post.platforms);
    
    // Update status
    post.status = 'posted';
    post.postedAt = new Date().toISOString();
  }

  saveSchedule(schedule);
  console.log('\n✅ Auto-post complete');
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
📅 T.O.O.L.S Inc Post Scheduler

Usage:
  node post-scheduler.js [options]

Options:
  --schedule <draftId> <datetime> [platforms]  Schedule a post
  --schedule-week                               Schedule entire week from drafts
  --list                                        List scheduled posts
  --post-now <draftId> [platforms]              Post immediately
  --auto-post                                   Post scheduled content (use in cron)
  --help                                        Show this help

Examples:
  node post-scheduler.js --schedule tipTuesday_123456 "2026-01-20 09:00" instagram,facebook
  node post-scheduler.js --schedule-week
  node post-scheduler.js --list
  node post-scheduler.js --post-now tipTuesday_123456
  node post-scheduler.js --auto-post

Notes:
  - Datetime format: "YYYY-MM-DD HH:MM"
  - Platforms: instagram, facebook, tiktok (comma-separated, no spaces)
  - For auto-posting, set up Windows Task Scheduler or cron job
    `);
    return;
  }

  if (args.includes('--list')) {
    listScheduled();
    return;
  }

  if (args.includes('--schedule-week')) {
    scheduleWeek();
    return;
  }

  if (args.includes('--schedule')) {
    const scheduleIndex = args.indexOf('--schedule');
    const draftId = args[scheduleIndex + 1];
    const datetime = args[scheduleIndex + 2];
    const platforms = args[scheduleIndex + 3]?.split(',');

    if (!draftId || !datetime) {
      console.error('❌ Missing draftId or datetime');
      return;
    }

    schedulePost(draftId, datetime, platforms);
    return;
  }

  if (args.includes('--post-now')) {
    const postIndex = args.indexOf('--post-now');
    const draftId = args[postIndex + 1];
    const platforms = args[postIndex + 2]?.split(',');

    if (!draftId) {
      console.error('❌ Missing draftId');
      return;
    }

    await postNow(draftId, platforms);
    return;
  }

  if (args.includes('--auto-post')) {
    await autoPost();
    return;
  }

  console.log('❌ Invalid arguments. Use --help for usage information.');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { postToFacebook, postToInstagram, schedulePost, autoPost };
