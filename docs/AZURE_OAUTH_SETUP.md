# Azure OAuth Configuration Guide

## Step-by-Step Setup Process

### Phase 1: Azure Portal App Registration (15 minutes)

#### 1.1 Navigate to Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your admin account
3. In the search bar, type **"Azure Active Directory"** or **"Microsoft Entra ID"**

#### 1.2 Create App Registration
1. In the left sidebar, click **"App registrations"**
2. Click **"+ New registration"** at the top
3. Fill in the registration form:
   - **Name:** `T.O.O.L.S Inc Platform`
   - **Supported account types:** 
     - Select **"Accounts in this organizational directory only (Single tenant)"**
   - **Redirect URI:**
     - Platform: **Web**
     - URI: `https://witgsjkbxflqlvvgmghu.supabase.co/auth/v1/callback`
4. Click **"Register"**

#### 1.3 Copy Application IDs
After registration, you'll see the Overview page. **Copy these values immediately:**

```
Application (client) ID: ________________________________
Directory (tenant) ID:   ________________________________
```

**Save these in a secure location (password manager recommended)**

#### 1.4 Create Client Secret
1. In the left sidebar, click **"Certificates & secrets"**
2. Click **"+ New client secret"**
3. Configure the secret:
   - **Description:** `T.O.O.L.S Inc Production Secret`
   - **Expires:** Select **"24 months"** (recommended)
4. Click **"Add"**
5. **IMMEDIATELY COPY THE SECRET VALUE** (you can't see it again!)

```
Client Secret Value: ________________________________
```

**⚠️ WARNING:** The secret value is shown only once. Save it immediately in your password manager.

#### 1.5 Configure API Permissions
1. In the left sidebar, click **"API permissions"**
2. Click **"+ Add a permission"**
3. Select **"Microsoft Graph"**
4. Select **"Delegated permissions"**
5. Add these permissions:
   - ✅ `User.Read` (should already be there)
   - ✅ `email`
   - ✅ `profile`
6. Click **"Add permissions"**
7. Click **"Grant admin consent for [Your Organization]"** (if you have admin rights)
8. Click **"Yes"** to confirm

---

### Phase 2: Supabase Dashboard Configuration (10 minutes)

#### 2.1 Navigate to Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: **`witgsjkbxflqlvvgmghu`**
3. In the left sidebar, click **"Authentication"**
4. Click **"Providers"** tab

#### 2.2 Enable Azure Provider
1. Scroll down and find **"Azure"** provider
2. Toggle it **ON** (switch to enabled)
3. Fill in the Azure OAuth configuration:
   - **Azure Client ID:** `[Paste Application (client) ID from Azure Portal]`
   - **Azure Client Secret:** `[Paste Client Secret Value from Azure Portal]`
   - **Azure Tenant ID:** `[Paste Directory (tenant) ID from Azure Portal]`
4. Click **"Save"**

#### 2.3 Enable Email Provider
1. Find **"Email"** provider
2. Toggle it **ON**
3. Enable these options:
   - ✅ **Enable Email Signup**
   - ✅ **Enable Magic Link (Email OTP)**
4. Click **"Save"**

#### 2.4 Configure Email Templates (Optional but Recommended)
1. Click **"Email Templates"** tab
2. Customize templates:
   - **Confirm signup:** Welcome message for new users
   - **Magic Link:** OTP email template
   - **Change Email Address:** Email change confirmation
3. Add your branding and customize messaging

---

### Phase 3: Azure Static Web Apps Environment Variables (5 minutes)

#### 3.1 Get Supabase API Keys
1. In Supabase Dashboard, click **"Settings"** (gear icon)
2. Click **"API"** in the left sidebar
3. Copy these values:

```
Project URL:     https://witgsjkbxflqlvvgmghu.supabase.co
anon public key: [Copy the "anon public" key]
```

#### 3.2 Add Environment Variables to Azure
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Static Web Apps"**
3. Select your app: **`sdtoolsinc-web`**
4. In the left sidebar, click **"Configuration"**
5. Click **"+ Add"** for each variable:

**Add these 5 environment variables:**

| Name | Value | Source |
|------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://witgsjkbxflqlvvgmghu.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[Your anon public key]` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_AZURE_CLIENT_ID` | `[Your Application (client) ID]` | Azure Portal → App Registration |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | `[Your Directory (tenant) ID]` | Azure Portal → App Registration |
| `AZURE_CLIENT_SECRET` | `[Your Client Secret Value]` | Azure Portal → Certificates & secrets |

6. Click **"Save"** after adding all variables
7. Wait for the deployment to restart (automatic, takes 1-2 minutes)

---

### Phase 4: Testing Authentication (10 minutes)

#### 4.1 Access Deployed Application
1. Get your deployed URL:
   - Azure Portal → Static Web Apps → **"URL"** (e.g., `https://blue-desert-08d808f10.5.azurestaticapps.net`)
2. Navigate to: `https://[your-url]/auth/login`

#### 4.2 Test Azure AD OAuth
1. Click the **"Sign in with Azure"** button
2. You'll be redirected to Microsoft login
3. Sign in with your Azure AD account
4. Grant permissions when prompted
5. You should be redirected to:
   - **Admin users:** `/admin/dashboard`
   - **Case managers:** `/portal/manager/dashboard`
   - **Clients:** `/portal/client/dashboard`

#### 4.3 Test Magic Link (Email OTP)
1. Go back to `/auth/login`
2. Click the **"Magic Link"** tab
3. Enter your email address
4. Click **"Send Magic Link"**
5. Check your email inbox
6. Click the magic link in the email
7. You should be automatically logged in and redirected

#### 4.4 Test Email/Password Signup
1. Navigate to `/auth/signup`
2. Click the **"Password"** tab
3. Fill in:
   - Full Name
   - Email Address
   - Password (minimum 8 characters)
   - Confirm Password
4. Click **"Sign Up"**
5. Check your email for confirmation link
6. Click the confirmation link
7. You should be redirected to `/portal/dashboard`

#### 4.5 Test Middleware Protection
1. While logged out, try to access:
   - `/admin/dashboard` → Should redirect to `/auth/login`
   - `/portal/dashboard` → Should redirect to `/auth/login`
2. While logged in as non-admin:
   - `/admin/dashboard` → Should redirect to home page
3. While logged in:
   - `/portal/dashboard` → Should display successfully

---

## Troubleshooting

### Issue: "Invalid redirect URI" error
**Solution:** Ensure the redirect URI in Azure Portal exactly matches:
```
https://witgsjkbxflqlvvgmghu.supabase.co/auth/v1/callback
```
No trailing slash, must be HTTPS, must be exact match.

### Issue: "Configuration not found" error in Supabase
**Solution:** 
1. Verify all three values are entered in Supabase (Client ID, Secret, Tenant ID)
2. Click "Save" after entering
3. Wait 1-2 minutes for changes to propagate

### Issue: Environment variables not working
**Solution:**
1. Check variable names match exactly (case-sensitive)
2. Ensure you clicked "Save" in Azure Static Web Apps Configuration
3. Wait for automatic redeployment (check GitHub Actions)
4. Clear browser cache and test again

### Issue: Email not receiving magic link
**Solution:**
1. Check spam/junk folder
2. Verify email provider is enabled in Supabase
3. Check Supabase logs: Authentication → Logs

### Issue: "Profiles table does not exist" error
**Solution:** Run the following SQL in Supabase SQL Editor:
```sql
-- Profiles table should already exist from migration
-- If not, contact developer to run database migrations
```

---

## Security Checklist

After configuration, verify:
- [ ] Client Secret is stored securely (not in code or public repos)
- [ ] Environment variables are set in Azure (not committed to Git)
- [ ] Azure AD app registration has correct redirect URI
- [ ] Email confirmation is required for signups
- [ ] Row Level Security (RLS) is enabled on all Supabase tables
- [ ] Admin role is manually assigned (not self-service)

---

## Next Steps

✅ **Configuration Complete!**

Now you can:
1. Test all three authentication methods
2. Create your first admin user (manually set role in Supabase)
3. Start building the admin portal UI
4. Begin MackAi 2.0 implementation

**For Admin Portal Development:**
- See: `agents/admin-portal.json`
- Start with: Admin dashboard layout and participants DataTable

**For MackAi 2.0 Development:**
- See: `agents/mackai.json`
- Start with: Vector database setup and PDF embedding pipeline

---

## Support Resources

- Azure AD Documentation: https://learn.microsoft.com/entra/identity-platform/
- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- Next.js Authentication: https://nextjs.org/docs/app/building-your-application/authentication
- Troubleshooting Guide: `docs/TROUBLESHOOTING.md` (to be created)

**Need help?** Create a GitHub Issue with the `authentication` label.
