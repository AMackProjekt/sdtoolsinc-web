# Client Onboarding Automation Guide

## Current Manual Process

1. Client submits referral form (Microsoft Forms)
2. Staff checks form submissions
3. Staff manually creates account OR tells client to register
4. Client gets login credentials

**Time:** ~10-15 minutes per client

---

## Automated Solution Architecture

### Option A: Power Automate + Azure Function (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client Submits Referral Form                             │
│    (Microsoft Forms)                                         │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Power Automate Trigger                                   │
│    - Detects new form submission                            │
│    - Extracts: name, email, phone, status                   │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Azure Function (api/onboarding/create-client)           │
│    - Creates Supabase auth account                          │
│    - Generates temporary password                           │
│    - Creates profile with role:"client"                     │
│    - Creates participant record                             │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ├──────────────────┬──────────────────────┐
                    ▼                  ▼                      ▼
┌──────────────────────┐  ┌────────────────────┐  ┌─────────────────┐
│ Email to Client      │  │ Email to Staff     │  │ Log to Supabase │
│ - Welcome message    │  │ - New client alert │  │ - Audit trail   │
│ - Login link         │  │ - Client details   │  │                 │
│ - Temp password      │  └────────────────────┘  └─────────────────┘
│ - Reset password URL │
└──────────────────────┘
```

**Time:** ~30 seconds (automatic)

---

## Setup Instructions

### Step 1: Create Azure Function

```typescript
// api/src/functions/onboarding/create-client.ts

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key for creating users
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createClientAccount(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, referralSource } = body;

    // Generate temporary password
    const tempPassword = `Tools${Math.random().toString(36).slice(-8)}!`;

    // 1. Create Supabase auth account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false, // Require email verification
      user_metadata: {
        full_name: `${firstName} ${lastName}`,
        role: "client",
      },
    });

    if (authError) throw authError;

    // 2. Create profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        full_name: `${firstName} ${lastName}`,
        role: "client",
      });

    if (profileError) throw profileError;

    // 3. Create participant record
    const { error: participantError } = await supabase
      .from("participants")
      .insert({
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        phone,
        status: "Waitlist",
        intake_date: new Date().toISOString(),
        referral_source: referralSource,
      });

    if (participantError) throw participantError;

    // 4. Send welcome email
    await resend.emails.send({
      from: "noreply@sdtoolsinc.org",
      to: email,
      subject: "Welcome to T.O.O.L.S Inc - Your Portal Access",
      html: `
        <h2>Welcome to T.O.O.L.S Inc, ${firstName}!</h2>
        
        <p>Your client portal account has been created. You can now access resources, courses, and connect with your case manager.</p>
        
        <h3>Login Information:</h3>
        <ul>
          <li><strong>Portal:</strong> <a href="https://client.sdtoolsinc.org">client.sdtoolsinc.org</a></li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        </ul>
        
        <p><strong>⚠️ Important:</strong> Please change your password after your first login.</p>
        
        <a href="https://client.sdtoolsinc.org/auth/login" style="display: inline-block; padding: 12px 24px; background: #38bdf8; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Login to Portal →
        </a>
        
        <p style="margin-top: 24px; color: #666;">Questions? Contact us at info@sdtoolsinc.org</p>
      `,
    });

    // 5. Notify staff
    await resend.emails.send({
      from: "noreply@sdtoolsinc.org",
      to: "staff@sdtoolsinc.org",
      subject: `New Client Registered: ${firstName} ${lastName}`,
      html: `
        <h3>New Client Registration</h3>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Referral Source:</strong> ${referralSource}</li>
          <li><strong>Status:</strong> Waitlist</li>
        </ul>
        
        <p>Client portal: <a href="https://staff.sdtoolsinc.org/clients/${authData.user.id}">View Profile</a></p>
      `,
    });

    return {
      status: 200,
      jsonBody: {
        success: true,
        userId: authData.user.id,
        message: "Client account created and welcome email sent",
      },
    };
  } catch (error: any) {
    context.error("Error creating client account:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message,
      },
    };
  }
}

app.http("createClientAccount", {
  methods: ["POST"],
  authLevel: "function",
  handler: createClientAccount,
});
```

### Step 2: Configure Power Automate Flow

**Trigger:** When a new response is submitted (Microsoft Forms)

**Actions:**
1. **Get response details**
   - Form ID: `G0kkRW4F7q`
   - Extract: First Name, Last Name, Email, Phone, Referral Source

2. **HTTP POST to Azure Function**
   ```
   URL: https://api.sdtoolsinc.org/api/onboarding/create-client
   Method: POST
   Headers:
     Content-Type: application/json
     x-functions-key: [YOUR_FUNCTION_KEY]
   Body:
     {
       "firstName": "@{outputs('Get_response_details')?['first_name']}",
       "lastName": "@{outputs('Get_response_details')?['last_name']}",
       "email": "@{outputs('Get_response_details')?['email']}",
       "phone": "@{outputs('Get_response_details')?['phone']}",
       "referralSource": "@{outputs('Get_response_details')?['referral_source']}"
     }
   ```

3. **Condition: If HTTP status = 200**
   - **Yes:** Log success to SharePoint/Excel
   - **No:** Send error email to admin

---

## Alternative: Manual Approval Workflow

If you want staff to approve referrals first:

```
Referral Form → Power Automate → Microsoft Teams Approval
                                        ↓
                            Approved? → Azure Function → Create Account
                                        ↓
                            Denied? → Send rejection email
```

### Setup Approval Flow:

**Power Automate Actions:**
1. Trigger: New form submission
2. **Create approval request** (send to staff@sdtoolsinc.org)
3. **Condition: If approved**
   - Call Azure Function (create account)
4. **Condition: If rejected**
   - Send email: "Thank you for your interest..."

---

## Security Considerations

### Temporary Passwords
- Format: `Tools` + 8 random chars + `!`
- Example: `ToolskR7x9mP2!`
- Must be changed on first login

### Email Verification
- Supabase sends verification email
- Client must verify before full portal access
- Set `email_confirm: true` in Azure Function

### Rate Limiting
- Limit referral form submissions to 5 per hour per IP
- Prevent spam account creation

### RLS (Row Level Security)
Ensure Supabase RLS policies:
```sql
-- Clients can only see their own data
CREATE POLICY "Clients view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id AND role = 'client');

-- Only admins can modify participant records
CREATE POLICY "Admins manage participants"
ON participants FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

---

## Testing the Flow

### Test Referral Submission:
1. Go to: https://sdtoolsinc.org/referral
2. Fill out form with test email
3. Submit

### Verify:
1. Check Power Automate run history
2. Check Azure Function logs
3. Check test email inbox for welcome message
4. Try logging in at client.sdtoolsinc.org

---

## Cost Estimate

**Power Automate:** Free (included in Microsoft 365)  
**Azure Functions:** ~$0.01 per 1,000 executions  
**Resend Emails:** Free tier (100 emails/day)  
**Supabase:** Free tier (50,000 monthly active users)

**Total additional cost:** ~$0 (within free tiers)

---

## Rollback Plan

If automation fails:
1. **Immediate:** Disable Power Automate flow
2. **Fallback:** Staff manually creates accounts via Supabase dashboard
3. **Recovery:** Check Azure Function logs for failed submissions
4. **Manual processing:** Use CSV export from Microsoft Forms

---

## Next Steps

1. ✅ **Already done:** Deployment tokens configured
2. ⚠️ **Needed:** Create Azure Function endpoint
3. ⚠️ **Needed:** Configure Power Automate flow
4. ⚠️ **Needed:** Test with sample referral
5. ⚠️ **Needed:** Update Supabase RLS policies

**Want me to create the Azure Function code now?**
