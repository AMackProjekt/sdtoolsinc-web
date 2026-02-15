# Client Intake & Approval Workflow

## 🎯 Overview

This document outlines the complete client intake and approval process for T.O.O.L.S Inc.

---

## 📋 Forms & Entry Points

### 1. Referral Form
**URL:** https://sdtoolsinc.org/referral  
**Purpose:** Primary intake for justice-involved individuals  
**Referral Sources:**
- Probation officers
- Parole officers
- DPOs (Departmental Probation Officers)
- Community organizations
- Self-referrals

### 2. Interest Form
**URL:** https://sdtoolsinc.org/interest  
**Purpose:** General inquiries and program interest  
**Use Cases:**
- Family members inquiring for loved ones
- Individuals exploring services
- Program partnerships

---

## 🔄 Complete Workflow

### Phase 1: Submission
```
Client/Referrer → Fills out form → Submits
```

**Data Collected:**
- Full name
- Email address
- Phone number
- Referral source
- Current status (probation/parole/post-release)
- Services needed
- Additional notes

---

### Phase 2: Automatic Account Creation (Pending)
```
Form Submission → Power Automate → Azure Function → Supabase
```

**What Happens:**
1. **Power Automate** detects new Microsoft Form submission
2. **Azure Function** (`api/onboarding/create-client`) is triggered:
   - Creates Supabase auth account
   - Generates temporary password
   - Sets status: `"pending"`
   - Sets approved: `false`
   - **Account is LOCKED** (email_confirmed = false)
3. **Profile created** in Supabase with all form data

**Result:** Client has an account but **cannot login yet**

---

### Phase 3: Notifications

#### Email to Client:
```
Subject: Application Received - T.O.O.L.S Inc

Dear [Name],

Thank you for your interest in T.O.O.L.S Inc programs. We have received your 
application and it is currently under review.

You will receive another email within 48 hours with:
- Your portal login credentials (if approved)
- Next steps for getting started

If you have questions, contact us at info@sdtoolsinc.org

Best regards,
T.O.O.L.S Inc Team
```

#### Email to Staff (info@sdtoolsinc.org):
```
Subject: New Client Application - [Name]

New client application received:

Name: [Full Name]
Email: [Email]
Phone: [Phone]
Referral Source: [Source]
Submitted: [Date/Time]

View and approve at:
https://staff.sdtoolsinc.org/approvals

Notes: [Any additional info from form]
```

#### Microsoft Teams Notification:
- Posted to **#client-approvals** channel
- @mentions case management team
- Includes quick action buttons

---

### Phase 4: Case Manager Review

**Access:** https://staff.sdtoolsinc.org/approvals

**Dashboard Displays:**
- Pending applications count
- Client name, email, phone
- Referral source
- Submission date/time
- Any notes from referral form

**Average Review Time:** 2-24 hours (target: same business day)

**Review Criteria:**
✅ **Auto-Approve Factors:**
- Valid referral from known partner (probation, parole, community org)
- San Diego County resident
- Complete application
- No duplicate submissions

⚠️ **Requires Manual Review:**
- Self-referrals (no case manager)
- Out-of-area applicants
- Incomplete information
- Special circumstances noted

❌ **Auto-Reject Factors:**
- Duplicate submission (already active client)
- Out of service area (not San Diego County)
- Spam/invalid contact info

---

### Phase 5A: APPROVAL

**Who Can Approve:**
- Any Admin
- Any Case Manager with available capacity

**Approval Process:**
1. Case manager clicks **"Approve"** button
2. Optional: Add approval notes
3. System calls `approve_client()` Supabase function:
   - Sets `status = 'approved'`
   - Sets `approved = true`
   - Sets `approved_by = [case_manager_id]`
   - Sets `approved_at = NOW()`
   - **Unlocks account** (confirms email)
   - Logs approval in audit trail

4. **Automated Actions:**
   - Welcome email sent to client with login credentials
   - Case manager auto-assigned
   - Client added to active roster
   - Intake task created for case manager

#### Welcome Email (Sent Automatically):
```
Subject: Welcome to T.O.O.L.S Inc - Portal Access Granted

Dear [Name],

Great news! Your application has been approved. Welcome to T.O.O.L.S Inc!

🔑 Your Portal Access:
Portal: https://client.sdtoolsinc.org
Email: [email@example.com]
Temporary Password: [TempPassword123!]

⚠️ IMPORTANT: Please change your password after your first login.

What's Next:
1. Login to your portal
2. Complete your profile
3. Schedule your intake appointment
4. Explore available programs

Your assigned case manager: [Case Manager Name]
Contact: [case.manager@sdtoolsinc.org]

Questions? Reply to this email or call (619) 350-7638

Welcome aboard!
T.O.O.L.S Inc Team
```

---

### Phase 5B: REJECTION

**Who Can Reject:**
- Any Admin
- Any Case Manager

**Rejection Reasons (Required):**
- Out of service area
- Incomplete application
- Duplicate submission
- Program capacity reached
- Refer to partner organization

**Rejection Process:**
1. Case manager clicks **"Reject"** button
2. **Required:** Enter rejection reason
3. Optional: Add alternative resources
4. System calls `reject_client()` Supabase function:
   - Sets `status = 'rejected'`
   - Sets `rejection_reason = [reason]`
   - Sets `rejected_by = [case_manager_id]`
   - Sets `rejected_at = NOW()`
   - Logs rejection in audit trail

5. **Automated Actions:**
   - Rejection email sent (tactful, with resources)
   - Notification logged
   - Client removed from pending queue

#### Rejection Email (Sent Automatically):
```
Subject: Application Update - T.O.O.L.S Inc

Dear [Name],

Thank you for your interest in T.O.O.L.S Inc programs.

After reviewing your application, we are unable to provide services at this time 
for the following reason:

[Tactful rejection reason - e.g., "Our programs currently focus on San Diego 
County residents. We recommend contacting..."]

Alternative Resources:
- [Relevant organization 1]
- [Relevant organization 2]
- 211 San Diego: dial 2-1-1 for community resources

If your situation changes or you have questions, please contact us at 
info@sdtoolsinc.org

We wish you the best in your journey.

T.O.O.L.S Inc Team
```

---

## 👥 Notification Matrix

| Event | Who Gets Notified | How | When |
|-------|-------------------|-----|------|
| **New Submission** | info@sdtoolsinc.org | Email | Immediate |
| | Case Managers | Teams | Immediate |
| | Client | Email (confirmation) | Immediate |
| **Approval** | Client | Email (welcome) | Immediate |
| | Assigned Case Manager | Email + Teams | Immediate |
| | Admin Dashboard | In-app notification | Immediate |
| **Rejection** | Client | Email (with resources) | Immediate |
| | Admin Log | System log | Immediate |
| **24hr No Action** | info@sdtoolsinc.org | Email (reminder) | Daily 9am |
| **Capacity Alert** | Admins | Email + Teams | When pending > 10 |

---

## 📊 Approval Dashboard Features

**URL:** https://staff.sdtoolsinc.org/approvals

### Filters:
- All Applications
- Pending Only
- Approved (last 30 days)
- Rejected (last 30 days)

### Stats Display:
- Pending count
- Approved today
- Average approval time
- Applications this week/month
- Rejection rate

### Bulk Actions:
- Approve multiple (with same case manager)
- Export to CSV
- Assign case manager

### Sorting Options:
- Newest first (default)
- Oldest first (urgent)
- By referral source
- By status

---

## 🔐 Permissions

| Role | Can View Pending | Can Approve | Can Reject | Can Bulk Edit |
|------|------------------|-------------|------------|---------------|
| **Admin** | ✅ All | ✅ Yes | ✅ Yes | ✅ Yes |
| **Case Manager** | ✅ All | ✅ Yes | ✅ Yes | ❌ No |
| **Staff** | ✅ All | ❌ No | ❌ No | ❌ No |
| **Client** | ❌ No | ❌ No | ❌ No | ❌ No |

---

## ⚙️ Configuration

### Approval Settings (Configurable by Admins):

```typescript
// api/src/config/approvals.ts

export const APPROVAL_CONFIG = {
  // Auto-approve clients from these sources
  AUTO_APPROVE_SOURCES: [
    'San Diego Probation',
    'San Diego Parole',
    'County DPO'
  ],
  
  // Require manual review for these
  MANUAL_REVIEW_SOURCES: [
    'Self-Referral',
    'Community Advocate',
    'Other'
  ],
  
  // Service area (zip codes)
  SERVICE_AREA_ZIPS: [
    '92101', '92102', '92103', // Downtown
    // ... add all San Diego County zips
  ],
  
  // Capacity limits
  MAX_PENDING: 50,
  MAX_CLIENTS_PER_CASE_MANAGER: 30,
  
  // Notification settings
  NOTIFY_EMAIL: 'info@sdtoolsinc.org',
  TEAMS_WEBHOOK_URL: process.env.TEAMS_WEBHOOK_URL,
  
  // SLA (Service Level Agreement)
  TARGET_APPROVAL_TIME_HOURS: 24,
  SEND_REMINDER_AFTER_HOURS: 24,
};
```

---

## 📈 Metrics & Reporting

### Weekly Report (Sent to Admins):
```
Client Intake Report - Week of [Date]

Submissions: 45
Approved: 38 (84%)
Rejected: 5 (11%)
Pending: 2 (4%)

Average approval time: 6.2 hours
Fastest approval: 15 minutes
Slowest approval: 18 hours

Top referral sources:
1. San Diego Probation (18)
2. Self-Referral (12)
3. Community Advocates (8)

Capacity:
- Total active clients: 287
- Available slots: 13
- Case manager utilization: 92%
```

---

## 🚨 Escalation Process

### If Pending > 24 Hours:
1. Email reminder to case management team
2. Teams notification with @mention
3. If pending > 48 hours:
   - Escalate to Admin
   - Auto-assign to available case manager

### If Client Complains:
1. Check approval dashboard
2. Review submission timestamp
3. If approved: Resend welcome email
4. If pending: Priority review
5. If rejected: Supervisor review

---

## 🛠️ Technical Implementation

### Required Environment Variables:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key  # For admin operations

# Email (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@sdtoolsinc.org

# Notifications
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/[YOUR_WEBHOOK]
NOTIFICATION_EMAIL=info@sdtoolsinc.org

# Power Automate
AZURE_FUNCTION_KEY=your_function_key
```

### Setup Checklist:
- [ ] Run `003-client-approvals.sql` in Supabase SQL Editor
- [ ] Configure Power Automate flow for form submissions
- [ ] Set up Azure Function for account creation
- [ ] Configure Teams webhook
- [ ] Test approval/rejection emails
- [ ] Add case managers to system
- [ ] Train staff on approval dashboard
- [ ] Set up weekly reporting

---

## 📞 Support Contacts

**Technical Issues:**
- Email: dev@sdtoolsinc.org
- Teams: @IT Support

**Process Questions:**
- Email: staff@sdtoolsinc.org
- Supervisor: [Name]

**Client Inquiries:**
- Email: info@sdtoolsinc.org
- Phone: (619) 350-7638
