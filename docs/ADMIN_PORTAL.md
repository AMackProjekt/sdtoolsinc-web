# Admin Portal Guide

## Overview

The T.O.O.L.S Inc Admin Portal provides comprehensive administrative oversight and management capabilities for the entire platform. It enables administrators to manage users, assign clients to case managers, monitor audit logs, and configure system permissions.

## Access

**URL:** `/admin` (production) or `http://localhost:3003` (development)

**Default Credentials:**
- Email: `admin@sdtoolsinc.org`
- Password: `demo123`

⚠️ **Security Note:** Change default credentials in production!

## Features

### 1. Dashboard
- **User Statistics:** Total users, active clients, case managers
- **Assignment Metrics:** Pending assignments, active cases
- **Recent Activity:** Latest audit log entries
- **Quick Actions:** Create user, assign client, view reports

### 2. User Management
- **List Users:** View all users with filtering by role and status
- **Create Users:** Add new users with role assignment
- **Edit Users:** Update user information, roles, and permissions
- **Deactivate Users:** Soft delete users (maintains audit trail)
- **Role Assignment:** Assign multiple roles to users

### 3. Client Assignments
- **Visual Interface:** Drag-and-drop or click-to-assign interface
- **Caseload Monitoring:** View case manager capacity with color-coded indicators
- **Assignment History:** Track all past and current assignments
- **Notes:** Add context notes to assignments
- **Status Management:** Active, inactive, transferred statuses

### 4. Audit Log
- **Comprehensive Logging:** All user actions tracked with details
- **Advanced Filters:** Filter by user, resource, action, date range
- **Export Functionality:** Download logs as CSV or JSON
- **Detail View:** Expandable rows showing before/after states
- **Real-time Monitoring:** Auto-refresh for live monitoring

### 5. Reports & Analytics
- **Dashboard Statistics:** User growth, assignment trends
- **User Activity Reports:** Login patterns, action counts
- **Case Manager Performance:** Caseload metrics, activity rates
- **Export Reports:** Download reports in multiple formats

### 6. Settings
- **Role Management:** Create, edit, delete custom roles
- **Permission Management:** Assign granular permissions to roles
- **System Settings:** Configure application behavior
- **User Preferences:** Customize admin portal experience

## User Roles

### Super Admin
- **Permissions:** All permissions (full system access)
- **Use Cases:** System configuration, user management, security oversight

### Admin
- **Permissions:** Most permissions except system-critical changes
- **Use Cases:** Day-to-day administration, user support, reporting

### Moderator
- **Permissions:** Limited administrative functions
- **Use Cases:** Content moderation, basic user management

### Viewer
- **Permissions:** Read-only access to most resources
- **Use Cases:** Reporting, auditing, monitoring

## Workflow Examples

### Creating a New User
1. Navigate to **Users** → **Create New User**
2. Fill in user details (name, email, role)
3. Assign initial permissions or roles
4. Click **Create User**
5. User receives welcome email (if configured)

### Assigning a Client to Case Manager
1. Navigate to **Clients** → **Assignments**
2. Select an unassigned client from the right panel
3. Click on a case manager in the left panel
4. Review assignment details in the modal
5. Add notes (optional)
6. Click **Confirm Assignment**

### Viewing Audit Logs
1. Navigate to **Audit** → **Audit Logs**
2. Apply filters (user, resource, action, date range)
3. Click on any row to expand details
4. Export filtered results if needed

### Managing Roles & Permissions
1. Navigate to **Settings** → **Roles**
2. Click **Create Role** or select existing role
3. Assign permissions using the permission matrix
4. Save changes
5. Assign role to users via User Management

## Security Best Practices

### Authentication
- ✅ Use strong passwords (min 12 characters, mixed case, numbers, symbols)
- ✅ Enable two-factor authentication (when available)
- ✅ Rotate credentials regularly (every 90 days)
- ✅ Never share admin credentials

### Authorization
- ✅ Follow principle of least privilege
- ✅ Assign roles based on job function
- ✅ Review permissions quarterly
- ✅ Remove access immediately upon role change

### Audit Compliance
- ✅ Review audit logs weekly
- ✅ Investigate all failed login attempts
- ✅ Export and archive logs monthly
- ✅ Report suspicious activity immediately

### Data Protection
- ✅ Never export sensitive data to unsecured locations
- ✅ Encrypt exported files
- ✅ Use HTTPS only (never HTTP)
- ✅ Lock workstation when stepping away

## Troubleshooting

### Cannot Login
- **Issue:** Invalid credentials or account locked
- **Solution:** Verify email/password, contact super admin to unlock account

### Permission Denied
- **Issue:** Insufficient permissions for action
- **Solution:** Contact admin to request role/permission update

### Audit Logs Not Showing
- **Issue:** Database connection or permission issue
- **Solution:** Check network connectivity, verify audit.read permission

### Assignment Failed
- **Issue:** Client already assigned or case manager at capacity
- **Solution:** Check existing assignments, reassign if needed

## API Integration

The admin portal connects to the following API endpoints:

- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users` - Create user
- `GET /api/v1/admin/assignments` - List assignments
- `POST /api/v1/admin/assignments` - Create assignment
- `GET /api/v1/admin/audit` - Query audit logs
- `GET /api/v1/admin/roles` - List roles
- `GET /api/v1/admin/reports/dashboard` - Dashboard statistics

See API documentation for complete endpoint reference.

## Support

For technical support or questions:
- **Email:** support@sdtoolsinc.org
- **Documentation:** `/docs`
- **Issue Tracker:** GitHub Issues

## Version History

- **v1.0.0** (2026-01) - Initial release with core admin features
