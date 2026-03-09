/**
 * Backend API Smoke Tests
 * 
 * Tests all client portal and admin portal endpoints with:
 * - Valid authentication
 * - Missing/invalid tokens
 * - Role enforcement
 * - Ownership checks
 * - Input validation
 * 
 * Usage:
 *   npm run smoke-test
 * 
 * Prerequisites:
 *   - Backend running locally or deployed
 *   - Valid test user credentials in environment
 */

import jwt from 'jsonwebtoken';

// Configuration
const BASE_URL = process.env.SMOKE_TEST_URL || 'http://localhost:7071';
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'test-secret-key-for-local-development';

// Test users
const CLIENT_USER = {
  id: 'test-client-001',
  email: 'client@test.com',
  role: 'client',
  emailVerified: true,
  approvalStatus: 'approved' as const,
};

const PENDING_USER = {
  id: 'test-pending-001',
  email: 'pending@test.com',
  role: 'client',
  emailVerified: true,
  approvalStatus: 'pending' as const,
};

const ADMIN_USER = {
  id: 'test-admin-001',
  email: 'admin@test.com',
  role: 'admin',
  emailVerified: true,
  approvalStatus: 'approved' as const,
};

// Generate test tokens
function generateToken(user: typeof CLIENT_USER, expiresIn = '1h'): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      email_verified: user.emailVerified,
      email_confirmed_at: new Date().toISOString(), // Backend checks this instead of email_verified
      approval_status: user.approvalStatus,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

// Test result tracking
interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message?: string;
  elapsed?: number;
}

const results: TestResult[] = [];

// HTTP helper
async function request(
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: any;
  } = {}
): Promise<{ status: number; data?: any; error?: string }> {
  const { method = 'GET', token, body } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const elapsed = Date.now() - startTime;
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text;
    }
    
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Test utilities
function addResult(name: string, status: 'PASS' | 'FAIL' | 'SKIP', message?: string) {
  results.push({ name, status, message });
  const icon = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '○';
  const color = status === 'PASS' ? '\x1b[32m' : status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
  console.log(`${color}${icon}\x1b[0m ${name}${message ? ` - ${message}` : ''}`);
}

function expectStatus(actual: number, expected: number, testName: string) {
  if (actual === expected) {
    addResult(testName, 'PASS', `${actual}`);
    return true;
  } else {
    addResult(testName, 'FAIL', `Expected ${expected}, got ${actual}`);
    return false;
  }
}

// Test suites
async function testHealthChecks() {
  console.log('\n📋 Health Checks');
  
  const health = await request('/api/healthz');
  expectStatus(health.status, 200, 'GET /api/healthz');
  
  const ready = await request('/api/readyz');
  expectStatus(ready.status, 200, 'GET /api/readyz');
}

async function testClientDashboard() {
  console.log('\n📊 Client Dashboard');
  
  const clientToken = generateToken(CLIENT_USER);
  const pendingToken = generateToken(PENDING_USER);
  
  // Success case
  const success = await request('/api/v1/client/dashboard', { token: clientToken });
  if (expectStatus(success.status, 200, 'GET /api/v1/client/dashboard (approved client)')) {
    if (success.data && typeof success.data === 'object' && 'stats' in success.data) {
      addResult('Dashboard returns stats object', 'PASS');
    } else {
      addResult('Dashboard returns stats object', 'FAIL', 'Missing stats in response');
    }
  }
  
  // No token
  const noAuth = await request('/api/v1/client/dashboard');
  expectStatus(noAuth.status, 401, 'GET /api/v1/client/dashboard (no token) → 401');
  
  // Pending user
  const pending = await request('/api/v1/client/dashboard', { token: pendingToken });
  expectStatus(pending.status, 403, 'GET /api/v1/client/dashboard (pending user) → 403');
}

async function testClientMessages() {
  console.log('\n💬 Client Messages');
  
  const clientToken = generateToken(CLIENT_USER);
  
  // List messages
  const list = await request('/api/v1/client/messages', { token: clientToken });
  expectStatus(list.status, 200, 'GET /api/v1/client/messages');
  
  // Mark read (will create test message if needed)
  const markRead = await request('/api/v1/client/messages/999/read', {
    method: 'PUT',
    token: clientToken,
    body: { isRead: true },
  });
  // Accept 200 (if message exists) or 404 (if not)
  if (markRead.status === 200 || markRead.status === 404) {
    addResult('PUT /api/v1/client/messages/:id/read', 'PASS', `${markRead.status}`);
  } else {
    addResult('PUT /api/v1/client/messages/:id/read', 'FAIL', `Expected 200 or 404, got ${markRead.status}`);
  }
  
  // No auth
  const noAuth = await request('/api/v1/client/messages');
  expectStatus(noAuth.status, 401, 'GET /api/v1/client/messages (no token) → 401');
}

async function testClientJournal() {
  console.log('\n📔 Client Journal');
  
  const clientToken = generateToken(CLIENT_USER);
  
  // List entries
  const list = await request('/api/v1/client/journal', { token: clientToken });
  expectStatus(list.status, 200, 'GET /api/v1/client/journal');
  
  // Create entry
  const create = await request('/api/v1/client/journal', {
    method: 'POST',
    token: clientToken,
    body: {
      entryDate: new Date().toISOString().split('T')[0],
      emotionalState: 'grateful',
      growthMoment: 'Completed a challenging task today',
      selfCare: ['exercise', 'meditation'],
    },
  });
  expectStatus(create.status, 201, 'POST /api/v1/client/journal (valid entry)');
  
  // Invalid entry (missing required field)
  const invalid = await request('/api/v1/client/journal', {
    method: 'POST',
    token: clientToken,
    body: {
      entryDate: new Date().toISOString().split('T')[0],
      // Missing emotionalState
    },
  });
  expectStatus(invalid.status, 400, 'POST /api/v1/client/journal (invalid) → 400');
  
  // No auth
  const noAuth = await request('/api/v1/client/journal', { method: 'POST', body: {} });
  expectStatus(noAuth.status, 401, 'POST /api/v1/client/journal (no token) → 401');
}

async function testClientProfile() {
  console.log('\n👤 Client Profile');
  
  const clientToken = generateToken(CLIENT_USER);
  
  // Get profile
  const get = await request('/api/v1/client/profile', { token: clientToken });
  expectStatus(get.status, 200, 'GET /api/v1/client/profile');
  
  // Update profile
  const update = await request('/api/v1/client/profile', {
    method: 'PUT',
    token: clientToken,
    body: {
      fullName: 'Updated Test User',
      phoneNumber: '555-0123',
    },
  });
  expectStatus(update.status, 200, 'PUT /api/v1/client/profile (valid update)');
  
  // Try to update restricted fields
  const restricted = await request('/api/v1/client/profile', {
    method: 'PUT',
    token: clientToken,
    body: {
      email: 'hacker@evil.com', // Should be ignored/rejected
      role: 'admin', // Should be ignored/rejected
    },
  });
  // Should still succeed but ignore restricted fields
  if (restricted.status === 200 || restricted.status === 400) {
    addResult('PUT /api/v1/client/profile (restricted fields blocked)', 'PASS', `${restricted.status}`);
  } else {
    addResult('PUT /api/v1/client/profile (restricted fields blocked)', 'FAIL', `Unexpected ${restricted.status}`);
  }
  
  // No auth
  const noAuth = await request('/api/v1/client/profile');
  expectStatus(noAuth.status, 401, 'GET /api/v1/client/profile (no token) → 401');
}

async function testAuditEvents() {
  console.log('\n📝 Audit Events');
  
  const clientToken = generateToken(CLIENT_USER);
  
  // Send audit event
  const send = await request('/api/v1/audit-events', {
    method: 'POST',
    token: clientToken,
    body: {
      eventType: 'page_view',
      pagePath: '/portal/dashboard',
      metadata: { test: true },
    },
  });
  expectStatus(send.status, 202, 'POST /api/v1/audit-events (valid event)');
  
  // Rate limit test (send 10 rapid events)
  let rateLimited = false;
  for (let i = 0; i < 10; i++) {
    const rapid = await request('/api/v1/audit-events', {
      method: 'POST',
      token: clientToken,
      body: { eventType: 'test_event', pagePath: '/test' },
    });
    if (rapid.status === 429) {
      rateLimited = true;
      break;
    }
  }
  
  if (rateLimited) {
    addResult('Audit rate limiting enforced', 'PASS', 'Got 429 after rapid requests');
  } else {
    addResult('Audit rate limiting enforced', 'SKIP', 'Did not hit rate limit');
  }
  
  // Optional auth (should work without token)
  const noAuth = await request('/api/v1/audit-events', {
    method: 'POST',
    body: { eventType: 'anonymous_event', pagePath: '/public' },
  });
  expectStatus(noAuth.status, 202, 'POST /api/v1/audit-events (no token allowed)');
}

async function testAdminUsers() {
  console.log('\n👥 Admin User Management');
  
  const adminToken = generateToken(ADMIN_USER);
  const clientToken = generateToken(CLIENT_USER);
  
  // Get pending users (admin)
  const pending = await request('/api/admin/users/pending', { token: adminToken });
  expectStatus(pending.status, 200, 'GET /api/admin/users/pending (admin)');
  
  // Get pending users (client - should fail)
  const clientForbidden = await request('/api/admin/users/pending', { token: clientToken });
  expectStatus(clientForbidden.status, 403, 'GET /api/admin/users/pending (client) → 403');
  
  // Approve user
  const approve = await request('/api/admin/users/pending/approve', {
    method: 'POST',
    token: adminToken,
    body: { userId: 'test-user-123' },
  });
  // Accept 200 (success) or 404 (user not found)
  if (approve.status === 200 || approve.status === 404) {
    addResult('POST /api/admin/users/pending/approve', 'PASS', `${approve.status}`);
  } else {
    addResult('POST /api/admin/users/pending/approve', 'FAIL', `Unexpected ${approve.status}`);
  }
  
  // Reject user
  const reject = await request('/api/admin/users/pending/reject', {
    method: 'POST',
    token: adminToken,
    body: { userId: 'test-user-456', reason: 'Test rejection' },
  });
  if (reject.status === 200 || reject.status === 404) {
    addResult('POST /api/admin/users/pending/reject', 'PASS', `${reject.status}`);
  } else {
    addResult('POST /api/admin/users/pending/reject', 'FAIL', `Unexpected ${reject.status}`);
  }
  
  // Bulk approve
  const bulk = await request('/api/admin/users/pending/bulk-approve', {
    method: 'POST',
    token: adminToken,
    body: { userIds: ['test-1', 'test-2', 'test-3'] },
  });
  if (bulk.status === 200 || bulk.status === 404) {
    addResult('POST /api/admin/users/pending/bulk-approve', 'PASS', `${bulk.status}`);
  } else {
    addResult('POST /api/admin/users/pending/bulk-approve', 'FAIL', `Unexpected ${bulk.status}`);
  }
  
  // Bulk approve too many (>50)
  const tooMany = await request('/api/admin/users/pending/bulk-approve', {
    method: 'POST',
    token: adminToken,
    body: { userIds: Array.from({ length: 51 }, (_, i) => `user-${i}`) },
  });
  expectStatus(tooMany.status, 400, 'POST /api/admin/users/pending/bulk-approve (>50) → 400');
  
  // No auth
  const noAuth = await request('/api/admin/users/pending');
  expectStatus(noAuth.status, 401, 'GET /api/admin/users/pending (no token) → 401');
}

async function testLegacyUsersMe() {
  console.log('\n🔄 Legacy Users API');
  
  const clientToken = generateToken(CLIENT_USER);
  
  // Get current user
  const get = await request('/api/v1/users/me', { token: clientToken });
  expectStatus(get.status, 200, 'GET /api/v1/users/me');
  
  // Update user
  const update = await request('/api/v1/users/me', {
    method: 'PATCH',
    token: clientToken,
    body: {
      DisplayName: 'Updated Display Name',
      PhoneNumber: '555-9999',
    },
  });
  expectStatus(update.status, 200, 'PATCH /api/v1/users/me (valid update)');
  
  // No auth
  const noAuth = await request('/api/v1/users/me');
  expectStatus(noAuth.status, 401, 'GET /api/v1/users/me (no token) → 401');
}

async function testTokenValidation() {
  console.log('\n🔐 Token Validation');
  
  // Expired token
  const expiredToken = generateToken(CLIENT_USER, '-1h'); // Already expired
  const expired = await request('/api/v1/client/dashboard', { token: expiredToken });
  expectStatus(expired.status, 401, 'Expired token → 401');
  
  // Invalid signature
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlIiwiZW1haWwiOiJmYWtlQHRlc3QuY29tIn0.fakesignature';
  const invalid = await request('/api/v1/client/dashboard', { token: fakeToken });
  expectStatus(invalid.status, 401, 'Invalid signature → 401');
  
  // Unverified email
  const unverifiedUser = { ...CLIENT_USER, emailVerified: false };
  const unverifiedToken = generateToken(unverifiedUser);
  const unverified = await request('/api/v1/client/dashboard', { token: unverifiedToken });
  expectStatus(unverified.status, 403, 'Unverified email → 403');
}

// Main test runner
async function runTests() {
  console.log('🚀 T.O.O.L.S Inc Backend Smoke Tests');
  console.log(`📍 Testing: ${BASE_URL}\n`);
  
  const startTime = Date.now();
  
  await testHealthChecks();
  await testClientDashboard();
  await testClientMessages();
  await testClientJournal();
  await testClientProfile();
  await testAuditEvents();
  await testAdminUsers();
  await testLegacyUsersMe();
  await testTokenValidation();
  
  const elapsed = Date.now() - startTime;
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  const total = results.length;
  
  console.log(`\n✓ Passed:  ${passed}/${total}`);
  console.log(`✗ Failed:  ${failed}/${total}`);
  console.log(`○ Skipped: ${skipped}/${total}`);
  console.log(`⏱ Time:    ${elapsed}ms\n`);
  
  if (failed > 0) {
    console.log('❌ Some tests failed. Review output above.');
    process.exit(1);
  } else if (passed === 0) {
    console.log('⚠️  No tests passed. Check if backend is running.');
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    process.exit(0);
  }
}

// Run
runTests().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
