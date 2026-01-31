# Role-Based Portal Access Configuration

## ✅ System Implementation Complete

Your T.O.O.LS Inc platform now has a complete role-based portal routing system with secure access control.

## Access Rules (As Requested)

### 🔵 Client Portal (http://localhost:3001)
- **Who**: All users with `client` role
- **Email**: Any email domain allowed
- **Auto-Redirect**: ✅ Yes, after login

### 👥 Case Manager Portal (http://localhost:3002)
- **Who**: Users with `case_manager` role
- **Email**: MUST be `username@sdtoolsinc.org` 
- **Auto-Redirect**: ✅ Yes, after login
- **Example**: casemgr@sdtoolsinc.org, manager@sdtoolsinc.org

### ⚙️ Admin Portal (http://localhost:3003)
- **Who**: Users with `admin` role
- **Email**: ONLY `dmack@sdtoolsinc.org`
- **Auto-Redirect**: ✅ Yes, after login
- **Strict**: 🔒 Only this exact email allowed

## What Was Added

### 1. Portal Routing Logic (`lib/portal-routing.ts`)
```typescript
- getPortalUrlForUser() → Determines correct portal
- canAccessPortal() → Checks if user has access
- getAccessiblePortals() → Lists available portals
- redirectToPortal() → Performs redirect
```

### 2. Access Control Components (`components/auth/PortalGuard.tsx`)
```typescript
- <PortalGuard> → Protects portal pages
- <RedirectGuard> → Auto-redirects after login
```

### 3. Enhanced Login Page (`app/auth/login/page.tsx`)
- Shows portal access requirements
- Explains email domain rules
- Auto-redirects successful logins

### 4. Documentation
- `docs/ROLE_BASED_ROUTING.md` → Complete guide
- `docs/DEPENDENCY_MANAGEMENT.md` → Dependency system

## Authentication Flow

```
Login Page
    ↓
Enter Credentials
    ↓
Supabase Validates
    ↓
Fetch User Role & Email
    ↓
Check Portal Rules:
├─ Client? → Redirect to Port 3001
├─ Case Manager? → Check @sdtoolsinc.org → Redirect to Port 3002
├─ Admin? → Check dmack@sdtoolsinc.org → Redirect to Port 3003
└─ Denied → Show Access Denied Page
```

## Test Credentials (Create in Supabase)

### Test 1: Client User
```
Email: client@example.com
Password: password123
Role: client
Result: → Client Portal (3001)
```

### Test 2: Case Manager
```
Email: manager@sdtoolsinc.org
Password: password123
Role: case_manager
Result: → Case Manager Portal (3002)
```

### Test 3: Case Manager - Wrong Domain
```
Email: manager@gmail.com
Password: password123
Role: case_manager
Result: → Access Denied ❌
```

### Test 4: Admin
```
Email: dmack@sdtoolsinc.org
Password: password123
Role: admin
Result: → Admin Portal (3003)
```

### Test 5: Admin - Wrong Email
```
Email: admin@sdtoolsinc.org
Password: password123
Role: admin
Result: → Access Denied ❌
```

## How to Use in Portal Pages

### Protect a Portal Page
```tsx
import { PortalGuard } from '@/components/auth/PortalGuard';

export default function CaseManagerDashboard() {
  return (
    <PortalGuard requiredRole="case_manager">
      <h1>Case Manager Dashboard</h1>
      {/* Your dashboard content */}
    </PortalGuard>
  );
}
```

### Check User Access
```tsx
import { canAccessPortal } from '@/lib/portal-routing';

if (canAccessPortal(profile, user.email, 'casemgr')) {
  // User can access case manager portal
}
```

### List Accessible Portals
```tsx
import { getAccessiblePortals } from '@/lib/portal-routing';

const portals = getAccessiblePortals(profile, user.email);
portals.forEach(({ key, config }) => {
  console.log(`${config.portalName}: ${config.portalUrl}`);
});
```

## Supabase Profile Table

Ensure your `profiles` table has:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('client', 'case_manager', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Features

✅ **Role Validation**: Server-side role checking via Supabase  
✅ **Email Pattern Matching**: Domain validation for case managers  
✅ **Admin Email Locking**: Only dmack@sdtoolsinc.org can be admin  
✅ **Protected Routes**: Components prevent unauthorized access  
✅ **Session Validation**: Check on every portal load  
✅ **Access Logging**: Track who accesses which portal  

## Important Notes

### When Creating Test Users:
1. Set their `role` field in Supabase profiles
2. For case managers: Use `@sdtoolsinc.org` email
3. For admin: Use exactly `dmack@sdtoolsinc.org`
4. For clients: Any email is fine

### Troubleshooting:
- User stuck on login? Check if they have a role in `profiles`
- Access Denied? Check email domain matches role requirements
- Wrong portal? Verify role in `profiles` table

## Files Modified/Created

```
✅ lib/portal-routing.ts (NEW)
✅ components/auth/PortalGuard.tsx (NEW)
✅ docs/ROLE_BASED_ROUTING.md (NEW)
✅ docs/DEPENDENCY_MANAGEMENT.md (NEW)
✅ app/auth/login/page.tsx (UPDATED)
✅ .github/workflows/dependency-updates.yml (NEW)
✅ scripts/manage-dependencies.js (NEW)
✅ Dependency versions standardized (UPDATED)
```

## Next Steps

1. **Test Locally**: Create test users with different roles
2. **Verify Redirects**: Ensure correct portal routing
3. **Deploy to Azure**: Push to main branch
4. **Monitor Access**: Check user access patterns

---

**Status**: ✅ Ready for Testing  
**Last Updated**: January 29, 2026  
**Commit**: 00a5f859
