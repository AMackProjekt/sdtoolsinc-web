#!/usr/bin/env node

/**
 * Link Validation Script
 * Validates external URLs referenced in the codebase
 * Generates a report of broken, redirected, or problematic links
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface LinkCheckResult {
  url: string;
  status: number;
  category: string;
  valid: boolean;
  redirectUrl?: string;
  error?: string;
}

const EXTERNAL_RESOURCES = [
  // Core site
  { url: 'https://sdtoolsinc.org', category: 'main' },
  
  // Portal URLs
  { url: 'https://toolsinc-client-portal.azurestaticapps.net', category: 'portal' },
  { url: 'https://toolsinc-casemgr-portal.azurestaticapps.net', category: 'portal' },
  { url: 'https://toolsinc-admin-portal.azurestaticapps.net', category: 'portal' },
  
  // Custom domains (planned)
  { url: 'https://client.sdtoolsinc.org', category: 'portal-custom', optional: true },
  { url: 'https://staff.sdtoolsinc.org', category: 'portal-custom', optional: true },
  { url: 'https://admin.sdtoolsinc.org', category: 'portal-custom', optional: true },
  
  // Forms
  { url: 'https://forms.cloud.microsoft/r/G0kkRW4F7q', category: 'form' },
  
  // API
  { url: 'https://blue-desert-08d808f10.azurestaticapps.net/api', category: 'api' },
  
  // Social
  { url: 'https://www.instagram.com/sd_t.o.o.ls_inc', category: 'social' },
  { url: 'https://www.facebook.com/TOOLsInc', category: 'social' },
  { url: 'https://www.tiktok.com/@toolsinc', category: 'social' },
  
  // Analytics
  { url: 'https://www.googletagmanager.com/gtag/js?id=G-CLEPBVEEFX', category: 'analytics' },
];

const REENTRY_RESOURCES = [
  { url: 'https://www.211sandiego.org', category: 'support' },
  { url: 'https://www.sandiegocounty.gov/hhsa', category: 'government' },
  { url: 'https://www.sdmts.com/fares-passes/reduced-fare', category: 'transportation' },
  { url: 'https://www.ymcasd.org', category: 'community' },
  { url: 'https://www.sdhc.org', category: 'housing' },
  { url: 'https://www.khanacademy.org', category: 'education' },
  { url: 'https://www.linkedin.com/learning/', category: 'education' },
  { url: 'https://www.amazon.com/Navigating-Spiritual-Warfare-UNDERSTANDING-OVERCOMING/dp/B0CX5JB7BL', category: 'book' },
];

async function checkLink(url: string, timeout = 5000): Promise<LinkCheckResult> {
  try {
    const result = execSync(
      `curl -s -o /dev/null -w "%{http_code}" -L --connect-timeout 5 "${url}"`,
      { timeout, encoding: 'utf-8' }
    ).trim();

    const status = parseInt(result, 10);
    const valid = status >= 200 && status < 400;

    return {
      url,
      status,
      category: 'unknown',
      valid,
    };
  } catch (error) {
    return {
      url,
      status: 0,
      category: 'unknown',
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function validateLinks(resources: typeof EXTERNAL_RESOURCES) {
  console.log(`\n📋 Validating ${resources.length} links...\n`);

  const results: LinkCheckResult[] = [];

  for (const resource of resources) {
    process.stdout.write(`Checking ${resource.url.padEnd(60)}... `);
    
    const result = await checkLink(resource.url);
    result.category = resource.category;
    results.push(result);

    if (result.valid) {
      console.log('✅');
    } else if (resource.optional) {
      console.log('⚠️  (optional)');
    } else {
      console.log('❌');
    }
  }

  return results;
}

function generateReport(results: LinkCheckResult[], title: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${title} Report`);
  console.log(`${'='.repeat(60)}\n`);

  const grouped = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, LinkCheckResult[]>);

  let totalValid = 0;
  let totalBroken = 0;

  for (const [category, links] of Object.entries(grouped)) {
    console.log(`\n📍 ${category.toUpperCase()}`);
    console.log('-'.repeat(60));

    for (const link of links) {
      const status = link.valid ? '✅' : '❌';
      const httpCode = link.status > 0 ? ` [HTTP ${link.status}]` : '';
      const error = link.error ? ` - ${link.error}` : '';

      console.log(`${status} ${link.url}${httpCode}${error}`);

      if (link.valid) totalValid++;
      else totalBroken++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Summary: ${totalValid} valid, ${totalBroken} broken`);
  console.log(`Success Rate: ${((totalValid / (totalValid + totalBroken)) * 100).toFixed(1)}%`);
  console.log(`${'='.repeat(60)}\n`);

  return { totalValid, totalBroken };
}

async function main() {
  console.log('🔗 T.O.O.L.S Inc - Link Validation Tool');
  console.log('━'.repeat(60));

  // Check external resources
  const externalResults = await validateLinks(EXTERNAL_RESOURCES);
  generateReport(externalResults, 'External Resources');

  // Check reentry resource sample (subset to avoid rate limiting)
  const resampleResults = await validateLinks(REENTRY_RESOURCES.slice(0, 5));
  generateReport(resampleResults, 'Reentry Resources (Sample)');

  // Portal domain mismatch alert
  console.log('\n⚠️  PORTAL DOMAIN CONFIGURATION NOTICE\n');
  console.log('Current .env.example references custom domains:');
  console.log('  - https://client.sdtoolsinc.org');
  console.log('  - https://staff.sdtoolsinc.org');
  console.log('  - https://admin.sdtoolsinc.org\n');
  console.log('But actual Azure SWA URLs are:');
  console.log('  - https://toolsinc-client-portal.azurestaticapps.net');
  console.log('  - https://toolsinc-casemgr-portal.azurestaticapps.net');
  console.log('  - https://toolsinc-admin-portal.azurestaticapps.net\n');
  console.log('ACTIONS TO TAKE:');
  console.log('1. Set up custom domains with Azure DNS (CNAME records)');
  console.log('2. Or update .env.example to use SWA URLs directly');
  console.log('3. Or use custom domain routing at CDN layer\n');
}

main().catch(console.error);
