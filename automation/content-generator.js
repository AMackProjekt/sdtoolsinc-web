#!/usr/bin/env node

/**
 * T.O.O.L.S Inc - Content Generator
 * 
 * AI-powered social media content generation
 * Creates platform-specific posts using templates and OpenAI
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Configuration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DRAFTS_DIR = path.join(__dirname, 'drafts');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Ensure directories exist
if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(TEMPLATES_DIR)) fs.mkdirSync(TEMPLATES_DIR, { recursive: true });

// Post Templates
const templates = {
  successStory: {
    prompt: `Create an inspiring success story post for T.O.O.L.S Inc (reentry services).
    Format as a 5-slide carousel with:
    1. Hook/Before situation
    2. The challenge they faced
    3. How T.O.O.L.S helped
    4. Current success/outcome
    5. Inspirational takeaway
    
    Keep each slide to 2-3 sentences. Make it authentic and hopeful.
    Include relevant hashtags for reentry/second chances.`,
    
    platforms: ['instagram', 'facebook'],
    hashtags: ['#SuccessStory', '#SecondChances', '#Transformation', '#ReentryPrograms', '#NewBeginnings']
  },

  tipTuesday: {
    prompt: `Create a practical reentry tip for "Tip Tuesday".
    Topic: [TOPIC]
    
    Format:
    - Hook (attention-grabbing opening)
    - The tip (specific, actionable advice)
    - Why it matters (context)
    - What to do (clear action step)
    
    Keep under 200 words. Professional but warm tone.
    Include hashtags for tips and reentry.`,
    
    platforms: ['instagram', 'facebook', 'tiktok'],
    hashtags: ['#TipTuesday', '#ReentryTips', '#JobSearchTips', '#KnowYourRights']
  },

  mythBuster: {
    prompt: `Create a "Myth vs. Reality" post about reentry/criminal records.
    
    Format:
    MYTH: [Common misconception]
    REALITY: [The actual truth]
    
    Then explain in 2-3 sentences with context and California-specific laws if relevant.
    
    End with empowering message.
    Include educational hashtags.`,
    
    platforms: ['instagram', 'facebook'],
    hashtags: ['#MythVsReality', '#KnowTheRules', '#ReentryFacts', '#FairChance']
  },

  partnerSpotlight: {
    prompt: `Create a partner spotlight post for a second-chance employer.
    
    Highlight:
    - Partner name and industry
    - Why they're committed to second chances
    - Impact they've made (number hired, success stories)
    - Call for other employers to join
    
    Grateful and professional tone. 150-200 words.`,
    
    platforms: ['instagram', 'facebook', 'linkedin'],
    hashtags: ['#SecondChanceHiring', '#PartnerSpotlight', '#CommunityPartners', '#InclusiveHiring']
  },

  educationalThread: {
    prompt: `Create an educational thread about: [TOPIC]
    
    Structure (5-7 posts):
    1. Hook with surprising stat
    2-5. Key points (one per post)
    6. Resources/next steps
    7. CTA to website
    
    Each post 100-150 words. Easy to understand.
    Use emojis sparingly for readability.`,
    
    platforms: ['twitter', 'threads'],
    hashtags: ['#ReentryEducation', '#CriminalJusticeReform', '#KnowledgeIsPower']
  }
};

// Content topics for rotation
const contentTopics = {
  tips: [
    'preparing for job interviews with a criminal record',
    'explaining employment gaps on your resume',
    'navigating background checks in California',
    'building professional references',
    'housing options for formerly incarcerated',
    'accessing free job training programs',
    'understanding fair chance hiring laws',
    'managing finances during reentry',
    'rebuilding family relationships',
    'finding transportation assistance'
  ],

  myths: [
    'I can never get a good job with a felony',
    'All employers can see my entire criminal record',
    'I have to disclose my record in every interview',
    'Reentry programs are only for people just released',
    'Background checks always disqualify you',
    'You can\'t go to college with a criminal record',
    'Second chance employers only offer minimum wage jobs',
    'Expungement removes your record completely'
  ],

  educational: [
    'California Fair Chance Act explained',
    'The first 72 hours after release checklist',
    'Understanding Ban the Box laws',
    'How to request a Certificate of Rehabilitation',
    'Types of reentry support services available',
    'Financial assistance programs for formerly incarcerated',
    'Education and training resources',
    'Health insurance options during reentry'
  ]
};

/**
 * Generate content using OpenAI
 */
async function generateContent(templateName, customTopic = null) {
  const template = templates[templateName];
  if (!template) {
    console.error(`Template "${templateName}" not found`);
    return null;
  }

  // Replace [TOPIC] in prompt if provided
  let prompt = template.prompt;
  if (customTopic) {
    prompt = prompt.replace('[TOPIC]', customTopic);
  } else if (templateName === 'tipTuesday') {
    // Random topic for tips
    const randomTip = contentTopics.tips[Math.floor(Math.random() * contentTopics.tips.length)];
    prompt = prompt.replace('[TOPIC]', randomTip);
  } else if (templateName === 'mythBuster') {
    // Random myth
    const randomMyth = contentTopics.myths[Math.floor(Math.random() * contentTopics.myths.length)];
    prompt = prompt.replace('[TOPIC]', randomMyth);
  } else if (templateName === 'educationalThread') {
    // Random educational topic
    const randomTopic = contentTopics.educational[Math.floor(Math.random() * contentTopics.educational.length)];
    prompt = prompt.replace('[TOPIC]', randomTopic);
  }

  try {
    console.log(`\n🤖 Generating ${templateName} content...`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media content creator for T.O.O.L.S Inc, a nonprofit providing reentry services for justice-involved individuals in California. 
          Create authentic, empowering, professional content that:
          - Uses a warm, supportive tone
          - Focuses on hope and second chances
          - Provides practical value
          - Respects client privacy/anonymity
          - Incorporates California-specific information when relevant
          - Avoids jargon
          - Includes clear calls-to-action`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content;

    // Create post object
    const post = {
      id: `${templateName}_${Date.now()}`,
      template: templateName,
      content: content,
      hashtags: template.hashtags,
      platforms: template.platforms,
      createdAt: new Date().toISOString(),
      status: 'draft',
      customTopic: customTopic
    };

    // Save to drafts
    const filename = `${post.id}.json`;
    fs.writeFileSync(
      path.join(DRAFTS_DIR, filename),
      JSON.stringify(post, null, 2)
    );

    console.log(`✅ Content generated and saved: ${filename}`);
    console.log(`\n📝 Preview:\n${content}\n`);
    console.log(`🏷️  Hashtags: ${template.hashtags.join(' ')}`);
    console.log(`📱 Platforms: ${template.platforms.join(', ')}`);

    return post;
  } catch (error) {
    console.error('❌ Error generating content:', error.message);
    return null;
  }
}

/**
 * Generate a full week of content
 */
async function generateWeek() {
  console.log('\n📅 Generating week of content...\n');

  const weekSchedule = [
    { day: 'Monday', template: 'successStory' },
    { day: 'Tuesday', template: 'tipTuesday' },
    { day: 'Wednesday', template: 'partnerSpotlight' },
    { day: 'Thursday', template: 'educationalThread' },
    { day: 'Friday', template: 'mythBuster' },
    { day: 'Saturday', template: 'successStory' },
    { day: 'Sunday', template: 'tipTuesday' }
  ];

  const posts = [];

  for (const schedule of weekSchedule) {
    console.log(`\n=== ${schedule.day} ===`);
    const post = await generateContent(schedule.template);
    if (post) {
      post.scheduledDay = schedule.day;
      posts.push(post);
    }
    // Wait 2 seconds between API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save week summary
  const summary = {
    generated: new Date().toISOString(),
    posts: posts.map(p => ({
      id: p.id,
      day: p.scheduledDay,
      template: p.template,
      platforms: p.platforms
    }))
  };

  fs.writeFileSync(
    path.join(DRAFTS_DIR, 'week_summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log(`\n\n✅ Week generated successfully!`);
  console.log(`📁 Drafts saved to: ${DRAFTS_DIR}`);
  console.log(`📊 Total posts: ${posts.length}`);
  console.log(`\n💡 Next step: Review drafts, then run post-scheduler.js`);
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    console.log(`
🤖 T.O.O.L.S Inc Content Generator

Usage:
  node content-generator.js [options]

Options:
  --week                    Generate full week of content
  --single <template>       Generate single post
  --topic "<text>"          Custom topic for generation
  --list                    List available templates
  --help                    Show this help

Templates:
  - successStory            Inspiring transformation story
  - tipTuesday              Practical reentry tip
  - mythBuster              Myth vs Reality post
  - partnerSpotlight        Partner/employer highlight
  - educationalThread       Multi-post educational content

Examples:
  node content-generator.js --week
  node content-generator.js --single tipTuesday
  node content-generator.js --single mythBuster --topic "employment gaps"
  node content-generator.js --list
    `);
    return;
  }

  if (args.includes('--list')) {
    console.log('\n📋 Available Templates:\n');
    Object.keys(templates).forEach(name => {
      console.log(`  ${name}`);
      console.log(`    Platforms: ${templates[name].platforms.join(', ')}`);
      console.log(`    Hashtags: ${templates[name].hashtags.slice(0, 3).join(', ')}...\n`);
    });
    return;
  }

  if (args.includes('--week')) {
    await generateWeek();
    return;
  }

  if (args.includes('--single')) {
    const templateIndex = args.indexOf('--single');
    const templateName = args[templateIndex + 1];
    
    let customTopic = null;
    if (args.includes('--topic')) {
      const topicIndex = args.indexOf('--topic');
      customTopic = args[topicIndex + 1];
    }

    await generateContent(templateName, customTopic);
    return;
  }

  console.log('❌ Invalid arguments. Use --help for usage information.');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateContent, generateWeek, templates };
