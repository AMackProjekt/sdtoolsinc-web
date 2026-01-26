# Role-Based Access Control (RBAC)

## Overview

T.O.O.L.S Inc uses a comprehensive Role-Based Access Control (RBAC) system to manage user permissions across all portals. RBAC ensures users have appropriate access levels based on their organizational role.

## Architecture

### Components

1. **Users** - Individual accounts with unique identities
2. **Roles** - Named collections of permissions (e.g., "admin", "case_manager")
3. **Permissions** - Granular access rights (e.g., "users.create", "audit.read")
4. **Resources** - Protected entities (e.g., users, clients, assignments)
5. **Actions** - Operations on resources (e.g., create, read, update, delete)

### Database Schema

```sql
Users (Id, Email, DisplayName, Role, IsActive)
Roles (Id, Name, Description)
Permissions (Id, Name, Resource, Action, Description)
UserRoles (UserId, RoleId) -- Many-to-many
RolePermissions (RoleId, PermissionId) -- Many-to-many
```

## Default Roles

### Admin
- **Description:** Full system administrator with all permissions
- **Permissions:** All permissions across all resources
- **Use Cases:** System configuration, user management, security oversight
- **Count:** Should be minimal (2-3 users)

### Case Manager
- **Description:** Case manager with client management permissions
- **Permissions:**
  - `clients.read` - View client information
  - `clients.update` - Update client details
  - `reports.view` - Access reports
  - `audit.read` - View audit logs
- **Use Cases:** Client support, progress tracking, resource assignment
- **Count:** Based on organizational needs

### Client
- **Description:** End user client with limited permissions
- **Permissions:**
  - `clients.read` - View own information only
- **Use Cases:** Self-service portal access, progress tracking
- **Count:** Unlimited

### Auditor
- **Description:** Read-only access to audit logs and reports
- **Permissions:**
  - `audit.read` - View audit logs
  - `audit.export` - Export audit data
  - `reports.view` - Access reports
  - `reports.export` - Export reports
- **Use Cases:** Compliance monitoring, security audits
- **Count:** 1-2 users

## Permission Naming Convention

Permissions follow the format: `{resource}.{action}`

### Resources
- `users` - User accounts
- `clients` - Client records
- `case_managers` - Case manager accounts
- `assignments` - Client-case manager assignments
- `audit` - Audit logs
- `reports` - Reporting system
- `settings` - System configuration
- `roles` - Role management

### Actions
- `create` - Create new records
- `read` - View/query records
- `update` - Modify existing records
- `delete` - Remove records (soft delete)
- `assign` - Assign resources to users
- `export` - Download/export data
- `manage` - Full management rights

### Examples
- `users.create` - Create new users
- `clients.read` - View client information
- `audit.export` - Export audit logs
- `roles.manage` - Manage roles and permissions

## Permission Matrix

| Resource | Admin | Case Manager | Client | Auditor |
|----------|-------|--------------|--------|---------|
| users.* | ✅ | ❌ | ❌ | ❌ |
| clients.read | ✅ | ✅ | ✅* | ❌ |
| clients.update | ✅ | ✅ | ❌ | ❌ |
| clients.assign | ✅ | ❌ | ❌ | ❌ |
| audit.read | ✅ | ✅ | ❌ | ✅ |
| audit.export | ✅ | ❌ | ❌ | ✅ |
| reports.view | ✅ | ✅ | ❌ | ✅ |
| roles.manage | ✅ | ❌ | ❌ | ❌ |

*Clients can only read their own information

## Creating Custom Roles

### Step 1: Define Role
```sql
INSERT INTO Roles (Name, Description)
VALUES ('supervisor', 'Supervisory role with oversight permissions');
```

### Step 2: Assign Permissions
```sql
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 
  (SELECT Id FROM Roles WHERE Name = 'supervisor'),
  Id
FROM Permissions
WHERE Name IN (
  'clients.read',
  'clients.update',
  'case_managers.read',
  'reports.view',
  'audit.read'
);
```

### Step 3: Assign to Users
```sql
INSERT INTO UserRoles (UserId, RoleId, AssignedBy)
VALUES (
  @userId,
  (SELECT Id FROM Roles WHERE Name = 'supervisor'),
  @adminUserId
);
```

## Best Practices

### Role Design
✅ **DO:**
- Use descriptive role names (lowercase with underscores)
- Document role purpose and typical users
- Start with minimal permissions and add as needed
- Review role permissions quarterly

❌ **DON'T:**
- Create roles for individual users
- Grant unnecessary permissions
- Use generic names like "user" or "staff"
- Allow users to self-assign admin roles

### Permission Management
✅ **DO:**
- Follow principle of least privilege
- Group related permissions together
- Test permissions before deploying to production
- Audit permission changes regularly

❌ **DON'T:**
- Grant wildcard permissions unnecessarily
- Bypass permission checks in code
- Hard-code permission checks
- Share accounts between users

### Security
✅ **DO:**
- Log all permission changes to audit trail
- Require admin approval for role assignment
- Review admin role members monthly
- Implement separation of duties for critical operations

❌ **DON'T:**
- Allow users to modify their own permissions
- Store permissions in client-side storage only
- Trust client-side permission checks alone
- Disable audit logging for admin actions

## Implementation

### Backend (API)
```typescript
import { hasPermission } from '../shared/rbac';

// Check permission before operation
const canCreate = await hasPermission(userId, 'users.create');
if (!canCreate) {
  return fail('forbidden', 'Insufficient permissions', 403);
}
```

### Frontend (Admin Portal)
```typescript
import { useAuth } from '@/lib/admin-auth';
import { hasPermission } from '@/lib/rbac';

const { user } = useAuth();

// Conditionally render based on permission
{hasPermission(user.permissions, 'users.create') && (
  <button onClick={createUser}>Create User</button>
)}
```

## Troubleshooting

### User Cannot Access Feature
1. Verify user has required role assigned
2. Check role has required permission
3. Ensure permission is spelled correctly
4. Verify user account is active
5. Check audit log for permission denials

### Permission Check Failing
1. Verify backend and frontend use same permission names
2. Check database RolePermissions table
3. Ensure user session is up-to-date
4. Clear browser cache and re-login

## Migration Guide

### Adding New Permission
1. Insert into Permissions table
2. Assign to appropriate roles
3. Update permission constants in code
4. Deploy backend first, then frontend
5. Document in this guide

### Modifying Existing Role
1. Review current permissions
2. Test changes in staging environment
3. Update RolePermissions table
4. Notify affected users
5. Update documentation

## Compliance

### Audit Requirements
- All permission changes must be logged
- Permission denials must be tracked
- Role assignments require approval trail
- Quarterly access reviews mandatory

### Retention
- Permission changes: 7 years
- Role assignments: 7 years
- Access logs: 1 year minimum

## References

- [Admin Portal Guide](./ADMIN_PORTAL.md)
- [API Documentation](../api/README.md)
- [Security Policy](./SECURITY.md)
