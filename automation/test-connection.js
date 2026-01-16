#!/usr/bin/env node

/**
 * T.O.O.L.S Inc - Test Connection
 * 
 * Verify API credentials are working
 */

require('dotenv').config();
const axios = require('axios');

async function testMetaAPI() {
  const token = process.env.META_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;

  if (!token || token === 'your_token_here') {
    console.log('⚠️  Meta API: No token configured');
    return false;
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      {
        params: {
          fields: 'name,followers_count',
          access_token: token
        }
      }
    );

    console.log('✅ Meta API: Connected');
    console.log(`   Page: ${response.data.name}`);
    if (response.data.followers_count) {
      console.log(`   Followers: ${response.data.followers_count}`);
    }
    return true;
  } catch (error) {
    console.log('❌ Meta API: Connection failed');
    console.log(`   Error: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.startsWith('sk-proj-...')) {
    console.log('⚠️  OpenAI API: No key configured');
    return false;
  }

  try {
    const response = await axios.get(
      'https://api.openai.com/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('✅ OpenAI API: Connected');
    console.log(`   Models available: ${response.data.data.length}`);
    return true;
  } catch (error) {
    console.log('❌ OpenAI API: Connection failed');
    console.log(`   Error: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testNewsAPI() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || apiKey === 'your_news_api_key_here') {
    console.log('⚠️  News API: No key configured');
    return false;
  }

  try {
    const response = await axios.get(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          country: 'us',
          pageSize: 1,
          apiKey: apiKey
        }
      }
    );

    console.log('✅ News API: Connected');
    console.log(`   Status: ${response.data.status}`);
    return true;
  } catch (error) {
    console.log('❌ News API: Connection failed');
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🔍 Testing API Connections                      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

`);

  const results = {
    meta: await testMetaAPI(),
    openai: await testOpenAI(),
    news: await testNewsAPI()
  };

  console.log(`
─────────────────────────────────────────────────────

📊 Summary:
   Meta API (Social Posting): ${results.meta ? '✅' : '❌'}
   OpenAI API (Content Gen): ${results.openai ? '✅' : '❌'}
   News API (Content Discovery): ${results.news ? '✅' : '❌'}

`);

  const allWorking = Object.values(results).every(r => r === true);

  if (allWorking) {
    console.log('🎉 All systems operational! You\'re ready to automate.\n');
    console.log('Next step: node content-generator.js --single tipTuesday\n');
  } else {
    console.log('⚠️  Some APIs need configuration. Run setup-wizard.js to fix.\n');
    console.log('   node setup-wizard.js\n');
  }
}

main().catch(console.error);
