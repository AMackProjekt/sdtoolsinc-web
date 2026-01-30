#!/usr/bin/env node

/**
 * System Health Check Script
 * Runs comprehensive checks on all services and generates a health report
 * Usage: node scripts/health-check.js
 */

const https = require('https');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Configuration
const CHECKS = {
  deployedSite: 'https://blue-desert-08d808f10.5.azurestaticapps.net',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://witgsjkbxflqlvvgmghu.supabase.co'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get(url, (res) => {
      const duration = Date.now() - startTime;
      resolve({
        status: res.statusCode,
        duration,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    }).on('error', (err) => {
      resolve({
        status: 0,
        duration: 0,
        success: false,
        error: err.message
      });
    });
  });
}

async function checkDependencies() {
  log('\n🔍 Checking Dependencies...', 'cyan');
  
  try {
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    const packages = JSON.parse(outdated || '{}');
    const count = Object.keys(packages).length;
    
    if (count === 0) {
      log('✅ All dependencies up to date', 'green');
    } else {
      log(`⚠️  ${count} packages have updates available`, 'yellow');
      Object.entries(packages).slice(0, 5).forEach(([name, info]) => {
        log(`   ${name}: ${info.current} → ${info.latest}`, 'yellow');
      });
    }
  } catch (error) {
    // npm outdated exits with 1 if updates exist
    log('⚠️  Some packages have updates available', 'yellow');
  }
}

async function checkSecurity() {
  log('\n🔒 Security Audit...', 'cyan');
  
  try {
    const audit = execSync('npm audit --json', { encoding: 'utf8' });
    const results = JSON.parse(audit);
    const vulns = results.metadata?.vulnerabilities || {};
    
    const total = Object.values(vulns).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      log('✅ No vulnerabilities found', 'green');
    } else {
      if (vulns.critical > 0) {
        log(`❌ ${vulns.critical} CRITICAL vulnerabilities found!`, 'red');
      }
      if (vulns.high > 0) {
        log(`⚠️  ${vulns.high} HIGH vulnerabilities found`, 'yellow');
      }
      if (vulns.moderate > 0) {
        log(`⚠️  ${vulns.moderate} MODERATE vulnerabilities`, 'yellow');
      }
      log(`\n   Run 'npm audit fix' to address issues`, 'cyan');
    }
    
    return vulns.critical || 0;
  } catch (error) {
    log('⚠️  Security audit completed with warnings', 'yellow');
    return 0;
  }
}

async function checkDeployedSite() {
  log('\n🌐 Checking Deployed Site...', 'cyan');
  
  const result = await checkUrl(CHECKS.deployedSite);
  
  if (result.success) {
    log(`✅ Site is online (HTTP ${result.status}) - ${result.duration}ms`, 'green');
  } else {
    log(`❌ Site check failed: ${result.error || `HTTP ${result.status}`}`, 'red');
  }
  
  return result.success;
}

async function checkSupabase() {
  log('\n🗄️  Checking Supabase...', 'cyan');
  
  const result = await checkUrl(`${CHECKS.supabaseUrl}/rest/v1/`);
  
  if (result.success) {
    log(`✅ Supabase API responding (${result.duration}ms)`, 'green');
  } else {
    log(`❌ Supabase check failed: ${result.error || `HTTP ${result.status}`}`, 'red');
  }
  
  return result.success;
}

async function checkBuildHealth() {
  log('\n⚡ Checking Build Health...', 'cyan');
  
  try {
    // Check if build artifacts exist
    const fs = require('fs');
    if (fs.existsSync('out')) {
      log('✅ Build artifacts present', 'green');
    } else {
      log('⚠️  No build artifacts found (run npm run build)', 'yellow');
    }
  } catch (error) {
    log('⚠️  Could not check build artifacts', 'yellow');
  }
}

async function main() {
  log('═══════════════════════════════════════════', 'cyan');
  log('  T.O.O.L.S Inc System Health Check', 'cyan');
  log(`  ${new Date().toLocaleString()}`, 'cyan');
  log('═══════════════════════════════════════════', 'cyan');
  
  let criticalIssues = 0;
  
  await checkDependencies();
  const vulnCount = await checkSecurity();
  if (vulnCount > 0) criticalIssues++;
  
  const siteOk = await checkDeployedSite();
  if (!siteOk) criticalIssues++;
  
  const supabaseOk = await checkSupabase();
  if (!supabaseOk) criticalIssues++;
  
  await checkBuildHealth();
  
  log('\n═══════════════════════════════════════════', 'cyan');
  if (criticalIssues === 0) {
    log('✅ All systems operational!', 'green');
  } else {
    log(`⚠️  ${criticalIssues} critical issue(s) detected`, 'yellow');
  }
  log('═══════════════════════════════════════════\n', 'cyan');
  
  process.exit(criticalIssues > 0 ? 1 : 0);
}

main().catch((error) => {
  log(`\n❌ Health check failed: ${error.message}`, 'red');
  process.exit(1);
});
