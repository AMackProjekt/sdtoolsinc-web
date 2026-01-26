import { query } from './database';

export interface AuditLogEntry {
  Id?: string;
  UserId?: string;
  UserRole?: string;
  Action: string;
  Resource: string;
  ResourceId?: string;
  Details?: string | object;
  IpAddress?: string;
  UserAgent?: string;
  Success: boolean;
  ErrorMessage?: string;
  CreatedAt?: Date;
}

/**
 * Log an action to the audit log
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  const details = typeof entry.Details === 'object' 
    ? JSON.stringify(entry.Details) 
    : entry.Details;

  await query(
    `INSERT INTO AuditLog (
      UserId, UserRole, Action, Resource, ResourceId, 
      Details, IpAddress, UserAgent, Success, ErrorMessage, CreatedAt
    ) VALUES (
      @userId, @userRole, @action, @resource, @resourceId,
      @details, @ipAddress, @userAgent, @success, @errorMessage, GETDATE()
    )`,
    {
      userId: entry.UserId || null,
      userRole: entry.UserRole || null,
      action: entry.Action,
      resource: entry.Resource,
      resourceId: entry.ResourceId || null,
      details: details || null,
      ipAddress: entry.IpAddress || null,
      userAgent: entry.UserAgent || null,
      success: entry.Success ? 1 : 0,
      errorMessage: entry.ErrorMessage || null
    }
  );
}

/**
 * Log a successful action
 */
export async function logSuccess(
  userId: string,
  userRole: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: object,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAudit({
    UserId: userId,
    UserRole: userRole,
    Action: action,
    Resource: resource,
    ResourceId: resourceId,
    Details: details,
    IpAddress: ipAddress,
    UserAgent: userAgent,
    Success: true
  });
}

/**
 * Log a failed action
 */
export async function logFailure(
  userId: string,
  userRole: string,
  action: string,
  resource: string,
  errorMessage: string,
  resourceId?: string,
  details?: object,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAudit({
    UserId: userId,
    UserRole: userRole,
    Action: action,
    Resource: resource,
    ResourceId: resourceId,
    Details: details,
    IpAddress: ipAddress,
    UserAgent: userAgent,
    Success: false,
    ErrorMessage: errorMessage
  });
}

/**
 * Log a login attempt
 */
export async function logLogin(
  userId: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string,
  errorMessage?: string
): Promise<void> {
  await logAudit({
    UserId: userId,
    Action: 'login',
    Resource: 'auth',
    IpAddress: ipAddress,
    UserAgent: userAgent,
    Success: success,
    ErrorMessage: errorMessage
  });
}

/**
 * Log a client assignment
 */
export async function logAssignment(
  clientId: string,
  caseManagerId: string,
  assignedBy: string,
  assignedByRole: string,
  notes?: string
): Promise<void> {
  await logAudit({
    UserId: assignedBy,
    UserRole: assignedByRole,
    Action: 'assign_client',
    Resource: 'assignments',
    ResourceId: clientId,
    Details: {
      clientId,
      caseManagerId,
      notes
    },
    Success: true
  });
}

/**
 * Log a permission change
 */
export async function logPermissionChange(
  adminUserId: string,
  targetUserId: string,
  changes: { added?: string[]; removed?: string[] }
): Promise<void> {
  await logAudit({
    UserId: adminUserId,
    UserRole: 'admin',
    Action: 'update_permissions',
    Resource: 'users',
    ResourceId: targetUserId,
    Details: changes,
    Success: true
  });
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  userId?: string;
  resource?: string;
  action?: string;
  success?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<AuditLogEntry[]> {
  let sql = 'SELECT * FROM AuditLog WHERE 1=1';
  const params: Record<string, any> = {};

  if (filters.userId) {
    sql += ' AND UserId = @userId';
    params.userId = filters.userId;
  }

  if (filters.resource) {
    sql += ' AND Resource = @resource';
    params.resource = filters.resource;
  }

  if (filters.action) {
    sql += ' AND Action = @action';
    params.action = filters.action;
  }

  if (filters.success !== undefined) {
    sql += ' AND Success = @success';
    params.success = filters.success ? 1 : 0;
  }

  if (filters.startDate) {
    sql += ' AND CreatedAt >= @startDate';
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    sql += ' AND CreatedAt <= @endDate';
    params.endDate = filters.endDate;
  }

  sql += ' ORDER BY CreatedAt DESC';

  if (filters.limit) {
    sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    params.offset = filters.offset || 0;
    params.limit = filters.limit;
  }

  return query<AuditLogEntry>(sql, params);
}
