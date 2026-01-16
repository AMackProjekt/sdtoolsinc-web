#!/usr/bin/env node

/**
 * T.O.O.L.S Inc - News Crawler
 * 
 * Discovers relevant reentry/justice reform news
 * Curates shareable content
 * Generates daily digest
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const CURATED_DIR = path.join(__dirname, 'curated');

// Ensure directory exists
if (!fs.existsSync(CURATED_DIR)) fs.mkdirSync(CURATED_DIR, { recursive: true });

// Keywords for news search
const KEYWORDS = [
  'reentry programs',
  'criminal justice reform',
  'second chance hiring',
  'formerly incarcerated',
  'rehabilitation programs',
  'California reentry',
  'ban the box',
  'fair chance act',
  'prison reform',
  'restorative justice'
];

/**
 * Fetch news articles
 */
async function fetchNews(keyword, days = 7) {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const params = {
      q: keyword,
      apiKey: NEWS_API_KEY,
      language: 'en',
      sortBy: 'relevancy',
      from: fromDate.toISOString().split('T')[0],
      pageSize: 10
    };

    const response = await axios.get(NEWS_API_URL, { params });
    return response.data.articles || [];
  } catch (error) {
    console.error(`Error fetching news for "${keyword}":`, error.message);
    return [];
  }
}

/**
 * Filter and score articles
 */
function scoreArticle(article) {
  let score = 0;

  // Positive keywords
  const positiveKeywords = [
    'success', 'reform', 'program', 'training', 'employment',
    'education', 'support', 'rehabilitation', 'california',
    'opportunity', 'policy', 'initiative', 'nonprofit'
  ];

  // Negative keywords (avoid overly negative news)
  const negativeKeywords = [
    'murder', 'rape', 'violent', 'death', 'arrest', 'crime spree'
  ];

  const text = (article.title + ' ' + article.description).toLowerCase();

  // Check positive keywords
  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 1;
  });

  // Penalize negative keywords
  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) score -= 3;
  });

  // Bonus for recent articles
  const daysSincePublished = Math.floor(
    (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60 * 24)
  );
  if (daysSincePublished <= 3) score += 2;

  return score;
}

/**
 * Generate social media post from article
 */
function generateSocialPost(article) {
  const title = article.title;
  const source = article.source.name;
  const url = article.url;

  // Instagram/Facebook version (with emojis)
  const instagramPost = `📰 Important News: ${title}

This is why our work matters. Change is happening, but there's still so much to do.

Source: ${source}

Read more (link in bio) or DM us for the article link.

What are your thoughts on this? Drop a comment below 👇

#CriminalJusticeReform #ReentryNews #SystemicChange #SecondChances`;

  // Twitter/Threads version (concise)
  const twitterPost = `📰 ${title}

This highlights why reentry support is crucial.

via ${source}
${url}

#CriminalJusticeReform #ReentryPrograms`;

  // LinkedIn version (professional)
  const linkedInPost = `Important update in criminal justice reform:

${title}

As a reentry services organization, we see firsthand how policy changes and community support can transform lives. This news underscores the importance of:

✓ Evidence-based programs
✓ Second-chance employment
✓ Comprehensive case management
✓ Community partnerships

We're committed to supporting justice-involved individuals as they navigate these systems.

Source: ${source}
Read more: ${url}

#CriminalJusticeReform #ReentryServices #SecondChances #SocialImpact`;

  return {
    article,
    posts: {
      instagram: instagramPost,
      facebook: instagramPost,
      twitter: twitterPost,
      linkedin: linkedInPost
    },
    metadata: {
      title: article.title,
      source: source,
      url: url,
      publishedAt: article.publishedAt,
      curatedAt: new Date().toISOString()
    }
  };
}

/**
 * Daily news digest
 */
async function dailyDigest() {
  console.log('\n📰 Fetching daily news digest...\n');

  const allArticles = [];

  // Fetch from multiple keywords
  for (const keyword of KEYWORDS.slice(0, 5)) { // Limit to 5 to stay under API limits
    console.log(`Searching: "${keyword}"`);
    const articles = await fetchNews(keyword, 7);
    allArticles.push(...articles);
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Remove duplicates (same URL)
  const unique = Array.from(
    new Map(allArticles.map(a => [a.url, a])).values()
  );

  console.log(`\n📊 Found ${unique.length} unique articles`);

  // Score and sort
  const scored = unique.map(article => ({
    article,
    score: scoreArticle(article)
  }))
  .filter(item => item.score > 0) // Only positive scores
  .sort((a, b) => b.score - a.score);

  console.log(`✅ ${scored.length} relevant articles after filtering\n`);

  // Top 5 articles
  const topArticles = scored.slice(0, 5);

  console.log('🏆 Top Articles:\n');
  topArticles.forEach((item, index) => {
    console.log(`${index + 1}. ${item.article.title}`);
    console.log(`   Score: ${item.score} | ${item.article.source.name}`);
    console.log(`   ${item.article.url}\n`);
  });

  // Save digest
  const digest = {
    date: new Date().toISOString().split('T')[0],
    totalArticles: unique.length,
    relevantArticles: scored.length,
    topArticles: topArticles.map(item => ({
      title: item.article.title,
      source: item.article.source.name,
      url: item.article.url,
      publishedAt: item.article.publishedAt,
      score: item.score
    }))
  };

  const filename = `digest_${digest.date}.json`;
  fs.writeFileSync(
    path.join(CURATED_DIR, filename),
    JSON.stringify(digest, null, 2)
  );

  console.log(`💾 Digest saved: ${filename}`);
  
  return topArticles;
}

/**
 * Generate posts from top news
 */
async function createPostsFromNews() {
  console.log('\n📝 Generating social posts from news...\n');

  const topArticles = await dailyDigest();

  if (topArticles.length === 0) {
    console.log('❌ No articles found to generate posts from');
    return;
  }

  const posts = [];

  topArticles.forEach((item, index) => {
    const postContent = generateSocialPost(item.article);
    posts.push(postContent);

    console.log(`\n=== Post ${index + 1} ===`);
    console.log(`Title: ${postContent.metadata.title}`);
    console.log(`\nInstagram/Facebook:\n${postContent.posts.instagram}\n`);
    console.log(`\nTwitter:\n${postContent.posts.twitter}\n`);
  });

  // Save posts
  const filename = `news_posts_${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(
    path.join(CURATED_DIR, filename),
    JSON.stringify(posts, null, 2)
  );

  console.log(`\n✅ Generated ${posts.length} posts`);
  console.log(`💾 Saved to: ${filename}`);
  console.log(`\n💡 Review posts in ${CURATED_DIR}, then copy to social media or use post-scheduler.js`);
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
📰 T.O.O.L.S Inc News Crawler

Usage:
  node news-crawler.js [options]

Options:
  --daily                   Fetch daily news digest
  --create-posts            Generate social posts from news
  --search <keyword>        Search specific keyword
  --help                    Show this help

Examples:
  node news-crawler.js --daily
  node news-crawler.js --create-posts
  node news-crawler.js --search "second chance hiring"
    `);
    return;
  }

  if (args.includes('--daily')) {
    await dailyDigest();
    return;
  }

  if (args.includes('--create-posts')) {
    await createPostsFromNews();
    return;
  }

  if (args.includes('--search')) {
    const keywordIndex = args.indexOf('--search');
    const keyword = args[keywordIndex + 1];
    
    if (!keyword) {
      console.error('❌ Please provide a search keyword');
      return;
    }

    console.log(`\n🔍 Searching for: "${keyword}"\n`);
    const articles = await fetchNews(keyword, 7);
    
    console.log(`Found ${articles.length} articles:\n`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   ${article.source.name} | ${article.publishedAt}`);
      console.log(`   ${article.url}\n`);
    });
    
    return;
  }

  console.log('❌ Invalid arguments. Use --help for usage information.');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fetchNews, dailyDigest, createPostsFromNews };
