# Role-Based Portal Routing System

## Overview

The T.O.O.LS Inc platform implements role-based access control that automatically routes authenticated users to their appropriate portal based on their role and email address.

## Portal Access Rules

### 1. Client Portal (Port 3001)
- **Access**: All users with `client` role
- **Email Requirements**: None - any email domain allowed
- **URL**: `http://localhost:3001`
- **Description**: Personal dashboard, course enrollment, progress tracking

### 2. Case Manager Portal (Port 3002)
- **Access**: Users with `case_manager` role
- **Email Requirements**: MUST have `@sdtoolsinc.org` email domain
- **URL**: `http://localhost:3002`
- **Description**: Case management, client coordination, outcome tracking
- **Email Pattern**: `username@sdtoolsinc.org`

### 3. Admin Portal (Port 3003)
- **Access**: Users with `admin` role
- **Email Requirements**: MUST be exactly `dmack@sdtoolsinc.org`
- **URL**: `http://localhost:3003`
- **Description**: System administration, user management, configuration

## Authentication Flow

```
1. User visits login page (/auth/login)
2. User provides credentials
3. Supabase validates credentials and returns user + profile
4. System checks user.role from profile
5. System validates email against role requirements
6. If valid: User redirected to appropriate portal
7. If invalid: Access denied page displayed
```

## Implementation Details

### Key Files

- **`lib/portal-routing.ts`** - Portal routing logic and authorization checks
- **`components/auth/PortalGuard.tsx`** - React components for protecting portal pages
- **`app/auth/login/page.tsx`** - Enhanced login page with role info display
- **`lib/hooks/useAuth.ts`** - Authentication hook (already has role support)

### Core Functions

#### `getPortalUrlForUser(profile, email)`
Determines the appropriate portal URL for a user based on their profile and email.

```typescript
const portalInfo = getPortalUrlForUser(profile, user.email);
if (portalInfo) {
  window.location.href = portalInfo.portalUrl;
}
```

#### `canAccessPortal(profile, email, portalKey)`
Checks if a user has permission to access a specific portal.

```typescript
const hasAccess = canAccessPortal(profile, user.email, "casemgr");
```

#### `getAccessiblePortals(profile, email)`
Returns list of all portals a user can access.

```typescript
const portals = getAccessiblePortals(profile, user.email);
```

### React Components

#### `<PortalGuard>`
Protects portal pages and enforces access control.

```tsx
<PortalGuard requiredRole="case_manager">
  <CaseManagerDashboard />
</PortalGuard>
```

#### `<RedirectGuard>`
Auto-redirects to appropriate portal after login.

```tsx
<RedirectGuard>
  <MainContent />
</RedirectGuard>
```

## Test Scenarios

### Test Case 1: Client Login
- Email: `client@example.com`
- Password: `password123`
- Role: `client`
- Expected: Redirects to Client Portal (3001) ✅

### Test Case 2: Case Manager Login
- Email: `casemgr@sdtoolsinc.org`
- Password: `password123`
- Role: `case_manager`
- Expected: Redirects to Case Manager Portal (3002) ✅

### Test Case 3: Case Manager with Wrong Domain
- Email: `casemgr@gmail.com`
- Password: `password123`
- Role: `case_manager`
- Expected: Access Denied (email domain not allowed) ❌

### Test Case 4: Admin Login
- Email: `dmack@sdtoolsinc.org`
- Password: `password123`
- Role: `admin`
- Expected: Redirects to Admin Portal (3003) ✅

### Test Case 5: Admin Login - Wrong Email
- Email: `admin@sdtoolsinc.org`
- Password: `password123`
- Role: `admin`
- Expected: Access Denied (only dmack@sdtoolsinc.org allowed) ❌

## Supabase Profile Setup

Ensure your `profiles` table has the required role field:

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

## Security Considerations

1. **Role Validation**: Roles are verified server-side by Supabase
2. **Email Pattern Matching**: Email domain requirements prevent unauthorized access
3. **No Client-Side Role Override**: All decisions use server data
4. **Protected Routes**: Portal pages use PortalGuard component
5. **Secure Redirects**: Only redirects to known portal URLs

## Future Enhancements

- [ ] Add role hierarchy (admin can override lower roles)
- [ ] Add per-portal permissions system
- [ ] Add session validation on portal load
- [ ] Add audit logging for portal access
- [ ] Add multi-role support (user can have multiple roles)
- [ ] Add role change notifications
- [ ] Add portal access recovery for denied users

## Troubleshooting

### User stuck on login page
1. Check if user has a role in `profiles` table
2. Verify email matches role requirements
3. Check browser console for auth errors
4. Verify portal URLs are accessible

### "Access Denied" message
1. Check user's role in Supabase
2. Verify email pattern for case managers (@sdtoolsinc.org)
3. Verify only dmack@sdtoolsinc.org can access admin

### User redirected to wrong portal
1. Check user profile role in Supabase
2. Verify `getPortalUrlForUser` logic
3. Check portal URLs in `PORTAL_CONFIG`

---

**Last Updated**: January 29, 2026  
**Maintained By**: T.O.O.LS Inc Development Team
