#!/usr/bin/env node

/**
 * Monorepo Dependency Manager
 * Ensures consistent versions across all packages in the workspace
 * Run: node scripts/manage-dependencies.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_ROOT = path.resolve(__dirname, '..');

const PACKAGES = [
  { name: 'Root', path: WORKSPACE_ROOT },
  { name: 'Client Portal', path: path.join(WORKSPACE_ROOT, 'apps/client-portal') },
  { name: 'Case Manager Portal', path: path.join(WORKSPACE_ROOT, 'apps/casemgr-portal') },
  { name: 'Admin Portal', path: path.join(WORKSPACE_ROOT, 'apps/admin-portal') },
  { name: 'Portal Hub', path: path.join(WORKSPACE_ROOT, 'apps/portal-hub') },
  { name: 'API', path: path.join(WORKSPACE_ROOT, 'api') }
];

// Key dependencies to keep in sync across monorepo
const CRITICAL_DEPS = {
  'next': '^16.1.3',           // Latest stable
  'react': '^19.2.3',          // Latest stable
  'react-dom': '^19.2.3',      // Must match React
  'typescript': '^5.7.2',      // Latest stable
  'tailwindcss': '^3.4.10',    // LTS version
  'framer-motion': '^11.0.0'   // Latest stable
};

console.log('🔍 Monorepo Dependency Analysis\n');

const versionMap = {};

// Check all packages
PACKAGES.forEach(pkg => {
  const pkgJsonPath = path.join(pkg.path, 'package.json');
  
  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`⚠️  ${pkg.name}: package.json not found`);
    return;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };

  console.log(`\n📦 ${pkg.name} (${pkg.path})`);
  console.log('─'.repeat(60));

  Object.entries(CRITICAL_DEPS).forEach(([dep, recommendedVersion]) => {
    const currentVersion = deps[dep] || 'NOT INSTALLED';
    const status = currentVersion === 'NOT INSTALLED' ? '❌' : 
                   currentVersion === recommendedVersion ? '✅' : '⚠️ ';
    
    console.log(`  ${status} ${dep}: ${currentVersion} (recommended: ${recommendedVersion})`);

    if (!versionMap[dep]) versionMap[dep] = {};
    versionMap[dep][pkg.name] = currentVersion;
  });
});

// Summary
console.log('\n\n📊 Version Consistency Report\n');
console.log('─'.repeat(60));

let hasInconsistencies = false;
Object.entries(versionMap).forEach(([dep, versions]) => {
  const uniqueVersions = [...new Set(Object.values(versions))];
  if (uniqueVersions.length > 1) {
    hasInconsistencies = true;
    console.log(`\n⚠️  ${dep} - INCONSISTENT versions:`);
    Object.entries(versions).forEach(([pkg, version]) => {
      console.log(`   • ${pkg}: ${version}`);
    });
  }
});

if (!hasInconsistencies) {
  console.log('✅ All critical dependencies are consistent across monorepo!');
}

// Commands reference
console.log('\n\n📋 Update Commands Reference\n');
console.log('─'.repeat(60));
console.log('Update all packages to latest stable:');
console.log('  npm run update:all');
console.log('\nUpdate specific package:');
console.log('  cd apps/client-portal && npm update next');
console.log('\nCheck for security vulnerabilities:');
console.log('  npm audit');
console.log('\nAudit all packages in monorepo:');
console.log('  npm run audit:all\n');

process.exit(hasInconsistencies ? 1 : 0);
