# Portal Configuration Guide

## Overview

This document provides comprehensive guidance on configuring the T.O.O.L.S Inc portal system, including environment variables, user approval workflows, role assignments, and deployment considerations.

---

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Portal URLs Configuration](#portal-urls-configuration)
3. [User Approval Workflow](#user-approval-workflow)
4. [Role Assignment Rules](#role-assignment-rules)
5. [Azure Static Web Apps Configuration](#azure-static-web-apps-configuration)
6. [Database Setup](#database-setup)
7. [Email Notifications](#email-notifications)
8. [Deployment Checklist](#deployment-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Environment Variables

### Required Variables

All portal URLs must use `NEXT_PUBLIC_` prefix to be available at runtime on the client side:

```bash
# Portal URLs (Runtime - Configurable per environment)
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://toolsinc-client-portal.azurestaticapps.net
NEXT_PUBLIC_CASEMGR_PORTAL_URL=https://toolsinc-casemgr-portal.azurestaticapps.net
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://toolsinc-admin-portal.azurestaticapps.net
NEXT_PUBLIC_HUB_URL=https://portal.sdtoolsinc.org
NEXT_PUBLIC_LEARNING_URL=https://www.sdtoolsinc.org/portal
```

### Local Development Defaults

If environment variables are not set, the system defaults to localhost ports:

```javascript
// lib/portal-routing.ts defaults
NEXT_PUBLIC_CLIENT_PORTAL_URL || "http://localhost:3001"
NEXT_PUBLIC_CASEMGR_PORTAL_URL || "http://localhost:3002"
NEXT_PUBLIC_ADMIN_PORTAL_URL || "http://localhost:3003"
```

### Database Configuration

```bash
DB_SERVER=your-database-server.database.windows.net
DB_NAME=toolsinc
DB_USER=admin_user
DB_PASSWORD=SecurePassword123!
```

### Authentication & API

```bash
JWT_SECRET=your-secure-jwt-secret-key-here
APP_URL=https://www.sdtoolsinc.org
NEXT_PUBLIC_API_URL=https://api.sdtoolsinc.org
```

### Email Service (Optional - for notifications)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=noreply@sdtoolsinc.org
```

### Feature Flags

```bash
ENABLE_AUTO_APPROVAL=false          # Auto-approve users (not recommended)
ENABLE_EMAIL_NOTIFICATIONS=true     # Send approval emails
```

---

## Portal URLs Configuration

### Why Runtime Environment Variables?

Previously, the system used `process.env.NODE_ENV` which is evaluated at **build time**, causing all environments (dev, staging, production) to use the same URLs regardless of deployment location.

**The Fix:**
- Use `NEXT_PUBLIC_*` environment variables
- These are evaluated at **runtime** in the browser
- Each environment can have different portal URLs

### Setting Portal URLs per Environment

#### Development
```bash
NEXT_PUBLIC_CLIENT_PORTAL_URL=http://localhost:3001
NEXT_PUBLIC_CASEMGR_PORTAL_URL=http://localhost:3002
NEXT_PUBLIC_ADMIN_PORTAL_URL=http://localhost:3003
```

#### Staging
```bash
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://staging-client.azurestaticapps.net
NEXT_PUBLIC_CASEMGR_PORTAL_URL=https://staging-staff.azurestaticapps.net
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://staging-admin.azurestaticapps.net
```

#### Production
```bash
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://toolsinc-client-portal.azurestaticapps.net
NEXT_PUBLIC_CASEMGR_PORTAL_URL=https://toolsinc-casemgr-portal.azurestaticapps.net
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://toolsinc-admin-portal.azurestaticapps.net
```

---

## User Approval Workflow

### Overview

New user signups go through an approval process before gaining portal access:

1. **User Signs Up** → Account created with `status: 'pending'`, `approved: false`
2. **Email Verification** → User verifies email address
3. **Pending Approval** → User sees pending approval page
4. **Admin Reviews** → Admin approves or rejects from dashboard
5. **Access Granted** → Approved users can access portals

### User Status States

| Status | Description | Portal Access |
|--------|-------------|---------------|
| `pending` | Awaiting admin approval | ❌ Blocked |
| `approved` | Admin approved, full access | ✅ Allowed |
| `rejected` | Admin rejected application | ❌ Blocked |
| `suspended` | Temporarily suspended | ❌ Blocked |

### Database Fields

The following fields are added to the `Users` table:

```sql
Approved         BIT DEFAULT 0
ApprovedAt       DATETIME2 NULL
ApprovedBy       UNIQUEIDENTIFIER NULL  -- Foreign key to Users(Id)
Status           NVARCHAR(20) DEFAULT 'pending'
RejectionReason  NVARCHAR(MAX) NULL
```

### Approval Actions

#### Approve User
- Sets `Approved = 1`, `Status = 'approved'`
- Records `ApprovedAt` timestamp
- Records `ApprovedBy` (admin user ID)
- Logs action to `AuditLog`
- (Optional) Sends approval email notification

#### Reject User
- Sets `Approved = 0`, `Status = 'rejected'`
- Records rejection reason
- Records `ApprovedBy` (admin user ID)
- Logs action to `AuditLog`
- (Optional) Sends rejection email with reason

#### Bulk Approve
- Approves multiple users in one action
- Same approval logic as single approval
- Logs bulk action with count

---

## Role Assignment Rules

### Automatic Role Assignment

Roles are automatically assigned during signup based on email domain:

```javascript
// Auto-role assignment logic
if (email === 'dmack@sdtoolsinc.org') {
  role = 'admin';                    // Special admin account
}
else if (email.endsWith('@sdtoolsinc.org')) {
  role = 'case_manager';             // Staff members
}
else {
  role = 'client';                   // General public
}
```

### Role Definitions

| Role | Access | Email Pattern | Description |
|------|--------|---------------|-------------|
| **admin** | Admin Portal | `dmack@sdtoolsinc.org` | Full system access, user management |
| **case_manager** | Case Manager Portal | `*@sdtoolsinc.org` | Manage clients, cases, reports |
| **client** | Client Portal | All other emails | Personal dashboard, courses, progress |

### Portal Access Control

#### Original Issue (Fixed)
Previously, admin portal access was hardcoded to **only** allow `dmack@sdtoolsinc.org`:

```javascript
// ❌ OLD - Too restrictive
emailPattern: /^dmack@sdtoolsinc\.org$/
```

#### New Behavior
Any user with `role = 'admin'` can access the admin portal:

```javascript
// ✅ NEW - Role-based access
allowedRoles: ["admin"]
// No email restriction for admin portal
```

Case managers still require `@sdtoolsinc.org` domain:

```javascript
// ✅ Domain-based restriction for staff
emailPattern: /@sdtoolsinc\.org$/
```

---

## Azure Static Web Apps Configuration

### Custom Roles

Azure SWA uses role-based access control. Configure in `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    },
    {
      "route": "/api/v1/admin/*",
      "allowedRoles": ["admin"]
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/auth/login",
      "statusCode": 302
    }
  }
}
```

### Environment Variables in Azure

1. Navigate to Azure Portal → Static Web Apps
2. Select your app → **Configuration**
3. Add Application Settings:

```
NEXT_PUBLIC_CLIENT_PORTAL_URL
NEXT_PUBLIC_CASEMGR_PORTAL_URL
NEXT_PUBLIC_ADMIN_PORTAL_URL
NEXT_PUBLIC_API_URL
DB_SERVER
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
```

---

## Database Setup

### Running Migrations

Execute migrations in order:

```bash
# 1. Initial schema
sqlcmd -S server.database.windows.net -d toolsinc -U admin -P password -i api/migrations/001-init-schema.sql

# 2. RBAC system
sqlcmd -S server.database.windows.net -d toolsinc -U admin -P password -i api/migrations/002-rbac-admin.sql

# 3. User approval fields
sqlcmd -S server.database.windows.net -d toolsinc -U admin -P password -i api/migrations/003-add-user-approval-fields.sql
```

### Verifying Migration

```sql
-- Check if approval columns exist
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Users'
  AND COLUMN_NAME IN ('Approved', 'Status', 'ApprovedAt', 'ApprovedBy', 'RejectionReason');

-- Check indexes
SELECT name, type_desc
FROM sys.indexes
WHERE object_id = OBJECT_ID('Users')
  AND name IN ('idx_users_status', 'idx_users_approved');
```

### Backward Compatibility

The migration automatically approves existing verified users:

```sql
UPDATE Users 
SET Approved = 1, 
    Status = 'approved',
    ApprovedAt = VerifiedAt
WHERE Verified = 1 AND Approved IS NULL;
```

---

## Email Notifications

### Setup (Optional)

Configure SMTP settings for approval notifications:

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM_EMAIL=noreply@sdtoolsinc.org
```

### Email Templates

Create templates in `lib/emails/`:

- `user-approved.ts` - Sent when user is approved
- `user-rejected.ts` - Sent when user is rejected
- `admin-new-signup.ts` - Notify admins of new signups

### SendGrid Example

```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SMTP_PASSWORD);

const msg = {
  to: user.email,
  from: 'noreply@sdtoolsinc.org',
  subject: 'Your Account Has Been Approved',
  html: approvalEmailTemplate(user),
};

await sgMail.send(msg);
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Update `.env` with production values
- [ ] Run database migrations
- [ ] Test portal URLs in staging
- [ ] Verify role assignments work correctly
- [ ] Test approval workflow end-to-end
- [ ] Check email notifications (if enabled)
- [ ] Review audit logging functionality

### Environment-Specific Checks

#### Development
- [ ] Portal URLs point to `localhost:300X`
- [ ] Database uses local/dev instance
- [ ] Test data seeded

#### Staging
- [ ] Portal URLs point to staging Azure SWA instances
- [ ] Staging database configured
- [ ] Test with real signup flow

#### Production
- [ ] Portal URLs point to production Azure SWA instances
- [ ] Production database configured
- [ ] SSL/HTTPS enabled
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place

### Post-Deployment Verification

```bash
# 1. Test portal URL resolution
curl https://www.sdtoolsinc.org/api/health

# 2. Test signup with different email domains
# - Register with @sdtoolsinc.org → should get case_manager role
# - Register with dmack@sdtoolsinc.org → should get admin role
# - Register with other email → should get client role

# 3. Test approval workflow
# - Sign up new user
# - Check pending approval page loads
# - Admin approves user
# - User gains portal access

# 4. Verify audit logging
SELECT * FROM AuditLog WHERE Action IN ('USER_APPROVED', 'USER_REJECTED')
ORDER BY Timestamp DESC;
```

---

## Troubleshooting

### Issue: Portal URLs not updating after deployment

**Cause:** Environment variables not set in Azure Static Web Apps

**Solution:**
1. Check Application Settings in Azure Portal
2. Ensure variables start with `NEXT_PUBLIC_`
3. Restart the Static Web App
4. Clear browser cache and test

### Issue: Admin portal still restricted to dmack@sdtoolsinc.org

**Cause:** Code not deployed or environment using old build

**Solution:**
1. Verify `lib/portal-routing.ts` has updated code
2. Check git branch is up to date
3. Rebuild and redeploy application
4. Clear CDN cache if applicable

### Issue: Users not getting auto-assigned roles

**Cause:** Signup function not updated with role logic

**Solution:**
1. Verify `api/src/functions/v1-auth-signup/index.ts` has `getDefaultRole()` function
2. Check database has `role` column
3. Review signup API logs for errors

### Issue: Approval status not showing in user list

**Cause:** Database missing approval columns

**Solution:**
```sql
-- Run migration
EXEC sp_executesql N'
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ''Users'' AND COLUMN_NAME = ''Approved'')
  BEGIN
    ALTER TABLE Users ADD Approved BIT DEFAULT 0;
  END
'
```

### Issue: Pending approval page shows to approved users

**Cause:** Auth context not checking approval status

**Solution:**
1. Ensure `v1-users-me` API returns approval fields
2. Update authentication context to check `user.status === 'approved'`
3. Add guard in protected routes

### Getting Help

For additional support:

- **Email:** support@sdtoolsinc.org
- **Documentation:** [GitHub Wiki](https://github.com/AMackProjekt/sdtoolsinc-web/wiki)
- **Issues:** [GitHub Issues](https://github.com/AMackProjekt/sdtoolsinc-web/issues)

---

## Security Considerations

### Best Practices

1. **Never commit secrets to Git**
   - Use `.env.local` for local secrets
   - Use Azure Key Vault for production secrets

2. **Rotate JWT secrets regularly**
   - Change `JWT_SECRET` every 90 days
   - Update all environments simultaneously

3. **Monitor approval logs**
   - Review `AuditLog` regularly
   - Set up alerts for suspicious approval patterns

4. **Limit admin accounts**
   - Only create admin accounts for trusted staff
   - Use principle of least privilege

5. **Enable email notifications**
   - Track all approval/rejection actions
   - Notify admins of new signups immediately

---

## Appendix

### Example `.env.production`

```bash
# Portal URLs
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://toolsinc-client-portal.azurestaticapps.net
NEXT_PUBLIC_CASEMGR_PORTAL_URL=https://toolsinc-casemgr-portal.azurestaticapps.net
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://toolsinc-admin-portal.azurestaticapps.net
NEXT_PUBLIC_HUB_URL=https://portal.sdtoolsinc.org
NEXT_PUBLIC_API_URL=https://api.sdtoolsinc.org

# Database (Azure SQL)
DB_SERVER=toolsinc-db.database.windows.net
DB_NAME=toolsinc_prod
DB_USER=toolsinc_admin
DB_PASSWORD=SecurePassword123!

# Authentication
JWT_SECRET=your-production-jwt-secret-change-this
APP_URL=https://www.sdtoolsinc.org

# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key-here
SMTP_FROM_EMAIL=noreply@sdtoolsinc.org

# Feature Flags
ENABLE_AUTO_APPROVAL=false
ENABLE_EMAIL_NOTIFICATIONS=true
```

### API Endpoint Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/users/pending` | GET | List pending users |
| `/api/v1/admin/users/:id/approve` | POST | Approve user |
| `/api/v1/admin/users/:id/reject` | POST | Reject user (requires reason) |
| `/api/v1/admin/users/bulk-approve` | POST | Bulk approve users |
| `/api/v1/users/me` | GET | Get current user with approval status |

---

**Last Updated:** 2026-02-10  
**Version:** 1.0.0
