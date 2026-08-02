// Client-side audit logging utilities
// Sends audit events to backend for persistent storage

interface AuditEvent {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Log an audit event
 * In production, this should call the backend API
 */
export async function logAudit(event: AuditEvent): Promise<void> {
  // For development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      ...event,
    });
  }

  // TODO: In production, send to backend API
  // try {
  //   await fetch('/api/v1/admin/audit', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       ...event,
  //       timestamp: new Date().toISOString(),
  //       userAgent: navigator.userAgent,
  //     }),
  //   });
  // } catch (error) {
  //   console.error('Failed to log audit event:', error);
  // }
}

/**
 * Log a successful action
 */
export function logSuccess(
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>
): void {
  logAudit({
    action,
    resource,
    resourceId,
    details,
    success: true,
  });
}

/**
 * Log a failed action
 */
export function logFailure(
  action: string,
  resource: string,
  errorMessage: string,
  resourceId?: string,
  details?: Record<string, any>
): void {
  logAudit({
    action,
    resource,
    resourceId,
    details,
    success: false,
    errorMessage,
  });
}

/**
 * Log user login
 */
export function logLogin(success: boolean, email?: string, errorMessage?: string): void {
  logAudit({
    action: 'login',
    resource: 'auth',
    details: { email },
    success,
    errorMessage,
  });
}

/**
 * Log user logout
 */
export function logLogout(): void {
  logAudit({
    action: 'logout',
    resource: 'auth',
    success: true,
  });
}

/**
 * Log resource creation
 */
export function logCreate(resource: string, resourceId: string, details?: Record<string, any>): void {
  logAudit({
    action: 'create',
    resource,
    resourceId,
    details,
    success: true,
  });
}

/**
 * Log resource update
 */
export function logUpdate(
  resource: string,
  resourceId: string,
  changes: Record<string, any>
): void {
  logAudit({
    action: 'update',
    resource,
    resourceId,
    details: { changes },
    success: true,
  });
}

/**
 * Log resource deletion
 */
export function logDelete(resource: string, resourceId: string): void {
  logAudit({
    action: 'delete',
    resource,
    resourceId,
    success: true,
  });
}

/**
 * Log client assignment
 */
export function logAssignment(
  clientId: string,
  caseManagerId: string,
  notes?: string
): void {
  logAudit({
    action: 'assign_client',
    resource: 'assignments',
    resourceId: clientId,
    details: {
      clientId,
      caseManagerId,
      notes,
    },
    success: true,
  });
}

/**
 * Log permission change
 */
export function logPermissionChange(
  userId: string,
  changes: { added?: string[]; removed?: string[] }
): void {
  logAudit({
    action: 'update_permissions',
    resource: 'users',
    resourceId: userId,
    details: changes,
    success: true,
  });
}

/**
 * Log role assignment
 */
export function logRoleAssignment(userId: string, roleId: string, roleName: string): void {
  logAudit({
    action: 'assign_role',
    resource: 'users',
    resourceId: userId,
    details: { roleId, roleName },
    success: true,
  });
}

/**
 * Log data export
 */
export function logExport(resource: string, format: string, filters?: Record<string, any>): void {
  logAudit({
    action: 'export',
    resource,
    details: { format, filters },
    success: true,
  });
}
