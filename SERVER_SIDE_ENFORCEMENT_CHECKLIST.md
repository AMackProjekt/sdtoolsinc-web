# Server-Side API Enforcement Checklist
## Backend Security Requirements for Client Portal Hardening

This document maps the client portal security features to **required backend enforcement**. The client portal now enforces strict security policies, but all critical checks **must be mirrored server-side** to prevent bypass attempts.

---

## 🔐 Authentication & Authorization Middleware

### Required for ALL Protected Endpoints

Every authenticated endpoint must enforce these checks in order:

```typescript
async function authMiddleware(req, res, next) {
  // 1. Validate JWT token
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 2. Check email verification
    if (!user.email_confirmed_at) {
      return res.status(403).json({ 
        error: 'Email not verified',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // 3. Check approval status
    const approvalStatus = user.user_metadata?.approval_status || 'approved'; // Legacy users
    if (approvalStatus !== 'approved') {
      return res.status(403).json({ 
        error: 'Account pending approval',
        code: 'ACCOUNT_PENDING_APPROVAL'
      });
    }

    // 4. Check role matches expected (for client portal endpoints)
    const userRole = user.app_metadata?.role || 'client';
    if (userRole !== 'client') {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'ROLE_MISMATCH'
      });
    }

    // 5. Check token expiry
    const expiresAt = user.exp; // JWT exp claim
    if (expiresAt && Date.now() / 1000 > expiresAt) {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
```

---

## 📋 API Endpoint Checklist

### ✅ Client Portal Endpoints

All endpoints called by `apps/client-portal/lib/api.ts`:

#### **GET /v1/client/dashboard**
- **Purpose**: Fetch dashboard stats, activities, messages
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Response**: DashboardData
  ```typescript
  interface DashboardData {
    stats: {
      hoursLogged: number;
      programsJoined: number;
      milestonesAchieved: number;
      daysActive: number;
    };
    activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      time: string;
      icon: string;
    }>;
    messages: Array<{
      id: string;
      sender: string;
      subject: string;
      preview: string;
      timestamp: string;
      isRead: boolean;
    }>;
  }
  ```
- **Ownership Check**: Return data for `req.user.id` only
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **GET /v1/client/messages**
- **Purpose**: Fetch user messages
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Response**: Message[]
  ```typescript
  interface Message {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
  }
  ```
- **Ownership Check**: WHERE `messages.recipient_id = req.user.id`
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **PUT /v1/client/messages/:id/read**
- **Purpose**: Mark message as read/unread
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Request Body**: `{ isRead: boolean }`
- **Ownership Check**: Verify `messages[id].recipient_id = req.user.id` before update
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **GET /v1/client/journal**
- **Purpose**: Fetch user journal entries
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Response**: JournalEntry[]
  ```typescript
  interface JournalEntry {
    id: string;
    emotionalState: string;
    progressFeeling: string;
    growthMoment: string;
    personalInsight: string;
    isPrivate: boolean;
    timestamp: string;
  }
  ```
- **Ownership Check**: WHERE `journal.user_id = req.user.id`
- **Privacy Filter**: Return `isPrivate=true` entries only to owner and assigned case managers
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **POST /v1/client/journal**
- **Purpose**: Create journal entry
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Request Body**: JournalEntry (without id/timestamp)
- **Data Validation**:
  - `emotionalState`: Required, max 100 chars
  - `progressFeeling`: Required, max 100 chars
  - `growthMoment`: Optional, max 500 chars
  - `personalInsight`: Optional, max 1000 chars
  - `isPrivate`: Boolean, default false
- **Auto-set Fields**: `user_id = req.user.id`, `created_at = now()`
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **GET /v1/client/profile**
- **Purpose**: Fetch user profile
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Response**: User profile from `profiles` table
- **Ownership Check**: WHERE `profiles.id = req.user.id`
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **PUT /v1/client/profile**
- **Purpose**: Update user profile
- **Required Checks**:
  - ✅ Token validation
  - ✅ Email verification
  - ✅ Approval status = 'approved'
  - ✅ Role = 'client'
- **Request Body**: `{ fullName?: string, phone?: string, address?: string }`
- **Data Validation**:
  - Sanitize all string inputs
  - Phone: Validate format if provided
  - Prevent modification of: `id`, `email`, `role`, `created_at`
- **Ownership Check**: UPDATE WHERE `profiles.id = req.user.id`
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **POST /v1/audit-events**
- **Purpose**: Receive audit logs from client
- **Required Checks**:
  - ✅ Token validation (optional, logs from unauthenticated events are allowed)
  - Rate limiting: 100 events / minute per IP
- **Request Body**: 
  ```typescript
  interface AuditEvent {
    user_id?: string;
    event_type: string;
    event_data: Record<string, any>;
    timestamp: string;
    ip_address?: string;
    user_agent?: string;
  }
  ```
- **Storage**: Write to `audit_logs` table or external logging service
- **Validation**: 
  - `event_type` must match known types (see client-portal/lib/audit.ts)
  - `timestamp` must be recent (within 5 minutes)
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

### ✅ Admin Portal Endpoints

All endpoints called by `apps/admin-portal/lib/user-approval-api.ts`:

#### **GET /api/admin/users/pending**
- **Purpose**: Fetch users with approval_status='pending'
- **Required Checks**:
  - ✅ Token validation
  - ✅ Role = 'admin' or 'case_manager'
- **Query**: Fetch from Supabase Auth Admin API
  ```sql
  -- Pseudo-SQL (requires Supabase Admin SDK)
  SELECT id, email, raw_user_meta_data, created_at
  FROM auth.users
  WHERE raw_user_meta_data->>'approval_status' = 'pending'
    AND email_confirmed_at IS NOT NULL  -- Only show verified emails
  ORDER BY created_at ASC
  ```
- **Response**: PendingUser[]
- **Implementation Notes**: 
  - Requires Supabase **Service Role Key** (not anon key)
  - Use `@supabase/supabase-js` `createClient()` with service role
  - Never expose service role to client
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **POST /api/admin/users/:userId/approve**
- **Purpose**: Approve pending user
- **Required Checks**:
  - ✅ Token validation
  - ✅ Role = 'admin' or 'case_manager'
- **Action**:
  ```typescript
  // Update user metadata
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      approval_status: 'approved',
      approved_by: req.user.id,
      approved_at: new Date().toISOString(),
    },
  });

  // Optional: Send approval email
  await sendEmail({
    to: user.email,
    subject: 'Account Approved - T.O.O.L.S Inc',
    template: 'account-approved',
    data: { username: user.user_metadata.full_name },
  });

  // Log audit event
  await logAuditEvent({
    event_type: 'admin.user.approved',
    admin_id: req.user.id,
    target_user_id: userId,
  });
  ```
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **POST /api/admin/users/:userId/reject**
- **Purpose**: Reject pending user
- **Required Checks**:
  - ✅ Token validation
  - ✅ Role = 'admin' or 'case_manager'
- **Request Body**: `{ reason: string }`
- **Action**:
  ```typescript
  // Update user metadata
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      approval_status: 'rejected',
      rejected_by: req.user.id,
      rejected_at: new Date().toISOString(),
      rejection_reason: reason,
    },
  });

  // Optional: Send rejection email
  await sendEmail({
    to: user.email,
    subject: 'Account Registration Status',
    template: 'account-rejected',
    data: { reason },
  });

  // Log audit event
  await logAuditEvent({
    event_type: 'admin.user.rejected',
    admin_id: req.user.id,
    target_user_id: userId,
    reason,
  });
  ```
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

#### **POST /api/admin/users/bulk-approve**
- **Purpose**: Approve multiple users at once
- **Required Checks**:
  - ✅ Token validation
  - ✅ Role = 'admin' (higher privilege than single approve)
- **Request Body**: `{ userIds: string[] }`
- **Validation**: Max 50 users per request
- **Action**: Loop through userIds and call approve logic for each
- **Implementation Status**: ⚠️ **NOT IMPLEMENTED**

---

## 🛡️ Security Best Practices

### 1. Rate Limiting
```typescript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', apiLimiter);
```

### 2. Input Validation & Sanitization
```typescript
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  address: z.string().max(500).optional(),
});

// In route handler
const validated = profileSchema.parse(req.body);
```

### 3. SQL Injection Prevention
- Use parameterized queries (Supabase client does this automatically)
- Never concatenate user input into SQL strings
- Use `.eq()`, `.select()`, etc. from Supabase (already sanitized)

### 4. CORS Configuration
```typescript
// Only allow requests from your frontend domains
app.use(cors({
  origin: [
    'https://client-portal.sdtoolsinc.org',
    'https://admin.sdtoolsinc.org',
    'http://localhost:3000', // Dev only
  ],
  credentials: true,
}));
```

### 5. Audit Logging
Every sensitive operation should be logged:
- User approvals/rejections
- Profile updates
- Permission changes
- Failed authentication attempts (after 3 failures)

---

## 🔧 Implementation Priority

### Phase 1: Critical Security (MUST DO FIRST)
1. ✅ Implement auth middleware with all 5 checks
2. ✅ Admin user approval endpoints (approve/reject/bulk)
3. ✅ GET /v1/client/dashboard (with ownership checks)

### Phase 2: Core Functionality
4. ✅ GET /v1/client/profile
5. ✅ PUT /v1/client/profile (with validation)
6. ✅ GET /v1/client/messages
7. ✅ GET /v1/client/journal

### Phase 3: Enhanced Features
8. ✅ POST /v1/client/journal
9. ✅ PUT /v1/client/messages/:id/read
10. ✅ POST /v1/audit-events

### Phase 4: Hardening
11. ✅ Rate limiting on all endpoints
12. ✅ Input validation schemas with Zod
13. ✅ CORS configuration
14. ✅ Comprehensive error handling
15. ✅ Security headers (Helmet.js)

---

## 📦 Required Dependencies

For a Node.js/Express backend:

```bash
npm install @supabase/supabase-js
npm install express express-rate-limit cors helmet
npm install zod  # Input validation
npm install dotenv  # Environment variables
```

For Azure Functions:
```bash
npm install @supabase/supabase-js
npm install @azure/functions
npm install zod
```

---

## 🔑 Environment Variables

Add to backend `.env`:

```bash
# Supabase Service Role (NEVER expose to client)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# API Configuration
API_PORT=8080
NODE_ENV=production

# Email Service (for approval/rejection notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

---

## ✅ Testing Checklist

### Authentication Tests
- [ ] Valid token with all checks passing returns 200
- [ ] Missing token returns 401
- [ ] Expired token returns 401
- [ ] Unverified email returns 403 with code EMAIL_NOT_VERIFIED
- [ ] Pending approval returns 403 with code ACCOUNT_PENDING_APPROVAL
- [ ] Wrong role returns 403 with code ROLE_MISMATCH

### Ownership Tests
- [ ] User A cannot access User B's dashboard
- [ ] User A cannot read User B's journal entries
- [ ] User A cannot update User B's profile
- [ ] Admin can approve any pending user
- [ ] Case manager cannot approve admin users (if role checking implemented)

### Data Validation Tests
- [ ] Invalid phone format rejected
- [ ] String fields exceeding max length truncated or rejected
- [ ] SQL injection attempts sanitized
- [ ] XSS attempts in text fields sanitized

---

## 📊 Monitoring & Alerting

Set up alerts for:
- High rate of 403 ACCOUNT_PENDING_APPROVAL (may indicate misconfiguration)
- Spike in authentication failures (potential attack)
- 500 errors on auth endpoints (system issue)
- Abnormal approval patterns (e.g., 100 approvals in 1 minute)

---

## 📚 Next Steps

1. **Review this document** with backend team
2. **Set up Supabase Service Role** in backend environment
3. **Implement Phase 1** endpoints first (critical path)
4. **Test with Postman/Insomnia** using real JWT tokens
5. **Update admin portal** `.env.production` with API base URL
6. **Deploy backend** to staging environment
7. **Run integration tests** between client portal → API → Supabase
8. **Monitor audit logs** for security events
9. **Deploy to production** after QA signoff
10. **Document API** with OpenAPI/Swagger for future reference

---

## 🤝 Support

Questions about this checklist? Contact the security team or check:
- Supabase Auth Admin API: https://supabase.com/docs/reference/javascript/admin-api
- Next.js API Routes: https://nextjs.org/docs/pages/building-your-application/routing/api-routes
- Express.js Middleware: https://expressjs.com/en/guide/using-middleware.html

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-09  
**Author**: GitHub Copilot (Security Hardening Agent)
