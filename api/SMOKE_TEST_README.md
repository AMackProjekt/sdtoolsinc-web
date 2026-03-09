# Backend Smoke Tests

Comprehensive test suite for validating all T.O.O.L.S Inc API endpoints with authentication, authorization, and validation scenarios.

## What Gets Tested

### Client Portal Endpoints
- **Dashboard** (`/api/v1/client/dashboard`)
  - ✓ Approved client can access
  - ✓ Pending user gets 403
  - ✓ No token gets 401
  - ✓ Returns stats, courses, activities, messages

- **Messages** (`/api/v1/client/messages`)
  - ✓ List messages with auth
  - ✓ Mark messages as read/unread
  - ✓ Ownership verification (can't mark other users' messages)
  - ✓ Auth required

- **Journal** (`/api/v1/client/journal`)
  - ✓ List journal entries
  - ✓ Create new entries with validation
  - ✓ Required field enforcement (emotionalState, growthMoment)
  - ✓ Self-care activities parsing
  - ✓ Auth required

- **Profile** (`/api/v1/client/profile`)
  - ✓ Get user profile
  - ✓ Update profile fields (fullName, phoneNumber, address)
  - ✓ Restricted field protection (can't change email, role)
  - ✓ Auth required

- **Audit Events** (`/api/v1/audit-events`)
  - ✓ Accept valid events
  - ✓ Rate limiting (100 events/min per user)
  - ✓ Optional auth (anonymous events allowed)
  - ✓ Metadata storage

### Admin Portal Endpoints
- **Pending Users** (`/api/admin/users/pending`)
  - ✓ Admin can list pending users
  - ✓ Client role gets 403
  - ✓ No token gets 401

- **Approve User** (`/api/admin/users/pending/approve`)
  - ✓ Admin can approve users
  - ✓ Client role gets 403

- **Reject User** (`/api/admin/users/pending/reject`)
  - ✓ Admin can reject with reason
  - ✓ Client role gets 403

- **Bulk Approve** (`/api/admin/users/pending/bulk-approve`)
  - ✓ Admin can bulk-approve up to 50 users
  - ✓ Rejects >50 users with 400
  - ✓ Client role gets 403

### Authentication & Authorization
- ✓ Valid JWT tokens accepted
- ✓ Expired tokens rejected (401)
- ✓ Invalid signatures rejected (401)
- ✓ Unverified emails rejected (403)
- ✓ Pending users blocked from client portal (403)
- ✓ Admin-only endpoints enforce role
- ✓ Client role blocked from admin endpoints

### Health Checks
- ✓ `/api/healthz` returns 200
- ✓ `/api/readyz` returns 200

## Prerequisites

1. **Backend running** (locally or deployed)
   ```bash
   cd api
   npm run start
   ```

2. **Environment variables** configured in `.env`:
   ```bash
   AZURE_SQL_SERVER=your-server.database.windows.net
   AZURE_SQL_DATABASE=your-database-name
   AZURE_SQL_USER=your-username
   AZURE_SQL_PASSWORD=your-password
   SUPABASE_JWT_SECRET=your-jwt-secret
   ```

3. **Test data** (optional - tests will work with or without existing data):
   - Users table with test accounts
   - ClientMessages, ClientJournalEntries, ClientAuditEvents tables created

## Usage

### Run Tests Locally
```bash
cd api
npm install tsx  # If not already installed
npm run smoke-test
```

### Run Against Deployed Backend
```bash
cd api
SMOKE_TEST_URL=https://your-app.azurewebsites.net npm run smoke-test
```

### Run With Custom JWT Secret
```bash
cd api
SUPABASE_JWT_SECRET=your-secret SMOKE_TEST_URL=http://localhost:7071 npm run smoke-test
```

## Output Format

Tests provide color-coded results:

```
🚀 T.O.O.L.S Inc Backend Smoke Tests
📍 Testing: http://localhost:7071

📋 Health Checks
✓ GET /api/healthz - 200
✓ GET /api/readyz - 200

📊 Client Dashboard
✓ GET /api/v1/client/dashboard (approved client) - 200
✓ Dashboard returns stats object
✓ GET /api/v1/client/dashboard (no token) → 401 - 401
✓ GET /api/v1/client/dashboard (pending user) → 403 - 403

...

=============================================================
📊 Test Summary
=============================================================

✓ Passed:  42/45
✗ Failed:  0/45
○ Skipped: 3/45
⏱ Time:    1234ms

✅ All tests passed!
```

## Interpreting Results

### PASS ✓
Test executed and got expected status code. No issues detected.

### FAIL ✗
Test got unexpected status code. Indicates:
- Backend not running
- Auth middleware not enforcing rules
- Validation not working
- Database connection issue
- Bug in endpoint logic

### SKIP ○
Test skipped (e.g., rate limit not triggered in test window). Not a failure.

## Troubleshooting

### All tests fail with status 0
**Problem**: Backend not running or cannot connect

**Solution**:
```bash
cd api
npm run start
# In another terminal:
npm run smoke-test
```

### Token validation tests fail
**Problem**: JWT_SECRET mismatch between test and backend

**Solution**:
- Ensure `SUPABASE_JWT_SECRET` in `.env` matches test secret
- Or set `SUPABASE_JWT_SECRET` when running tests:
  ```bash
  SUPABASE_JWT_SECRET=your-secret npm run smoke-test
  ```

### Auth tests pass but data tests fail
**Problem**: Database tables don't exist

**Solution**:
- Backend auto-creates tables on first request
- Check database connection in `.env`
- Check SQL Server firewall rules allow your IP

### Admin tests all fail
**Problem**: Admin role not configured correctly in test

**Solution**:
- Tests generate mock JWT tokens with admin role
- Verify backend `requirePortalAuth` accepts `admin` role
- Check Users table has role='admin' for test user

## Test Tokens

The smoke test generates three JWT tokens:

1. **CLIENT_USER** (approved)
   - email: client@test.com
   - role: client
   - emailVerified: true
   - approvalStatus: approved

2. **PENDING_USER** (pending approval)
   - email: pending@test.com
   - role: client
   - emailVerified: true
   - approvalStatus: pending

3. **ADMIN_USER** (admin)
   - email: admin@test.com
   - role: admin
   - emailVerified: true
   - approvalStatus: approved

Tokens are signed with `SUPABASE_JWT_SECRET` and valid for 1 hour.

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Backend Smoke Tests
  run: |
    cd api
    npm ci
    npm run build
    npm run start &
    sleep 10  # Wait for backend to start
    npm run smoke-test
  env:
    AZURE_SQL_SERVER: ${{ secrets.AZURE_SQL_SERVER }}
    AZURE_SQL_DATABASE: ${{ secrets.AZURE_SQL_DATABASE }}
    AZURE_SQL_USER: ${{ secrets.AZURE_SQL_USER }}
    AZURE_SQL_PASSWORD: ${{ secrets.AZURE_SQL_PASSWORD }}
    SUPABASE_JWT_SECRET: ${{ secrets.SUPABASE_JWT_SECRET }}
```

### Azure DevOps
```yaml
- script: |
    cd api
    npm ci
    npm run build
    npm run start &
    sleep 10
    npm run smoke-test
  displayName: 'Backend Smoke Tests'
  env:
    AZURE_SQL_SERVER: $(AzureSqlServer)
    AZURE_SQL_DATABASE: $(AzureSqlDatabase)
    AZURE_SQL_USER: $(AzureSqlUser)
    AZURE_SQL_PASSWORD: $(AzureSqlPassword)
    SUPABASE_JWT_SECRET: $(SupabaseJwtSecret)
```

## Extending Tests

### Add New Test Suite
```typescript
async function testMyNewFeature() {
  console.log('\n🎯 My New Feature');
  
  const token = generateToken(CLIENT_USER);
  
  const result = await request('/api/v1/my-endpoint', { token });
  expectStatus(result.status, 200, 'GET /api/v1/my-endpoint');
}

// Add to runTests()
async function runTests() {
  // ... existing tests
  await testMyNewFeature();
}
```

### Add Custom Assertions
```typescript
function expectContains(data: any, key: string, testName: string) {
  if (data && key in data) {
    addResult(testName, 'PASS');
  } else {
    addResult(testName, 'FAIL', `Missing key: ${key}`);
  }
}
```

## Related Documentation

- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Server Side Enforcement Checklist](../SERVER_SIDE_ENFORCEMENT_CHECKLIST.md) - Security requirements
- [Backend Architecture](../docs/BACKEND_ARCHITECTURE.md) - System design
- [Deployment Guide](../DEPLOYMENT_GUIDE.md) - Production deployment

## Support

For issues with smoke tests:
1. Check backend logs for errors
2. Verify database connectivity
3. Confirm JWT secret matches
4. Review test output for specific failures
5. Check Azure SQL firewall rules
