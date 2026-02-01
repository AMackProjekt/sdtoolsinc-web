import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";
import { hasPermission, hasRole } from "../../shared/rbac";
import { logSuccess, logFailure, queryAuditLogs, AuditLogEntry } from "../../shared/audit";

interface AuditLogWithUser extends AuditLogEntry {
  UserEmail?: string;
  UserDisplayName?: string;
}

interface CreateAuditRequest {
  Action: string;
  Resource: string;
  ResourceId?: string;
  Details?: string | object;
  Success: boolean;
  ErrorMessage?: string;
}

/**
 * Get authenticated user from Azure SWA
 */
function getAuthenticatedUser(req: HttpRequest): { userId: string; entraId: string; email: string } | null {
  const clientPrincipal = req.headers.get('x-ms-client-principal');
  
  if (!clientPrincipal) {
    return null;
  }

  try {
    const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
    return {
      userId: principal.userId,
      entraId: principal.userId,
      email: principal.userDetails
    };
  } catch {
    return null;
  }
}

/**
 * Get admin user ID from database
 */
async function getAdminUserId(entraId: string): Promise<string | null> {
  const users = await query<{ Id: string }>(
    "SELECT Id FROM Users WHERE EntraId = @entraId",
    { entraId }
  );
  return users.length > 0 ? users[0].Id : null;
}

/**
 * Parse date from query parameter
 */
function parseDate(dateStr: string | null): Date | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Convert audit logs to CSV format
 */
function convertToCSV(logs: AuditLogWithUser[]): string {
  if (logs.length === 0) {
    return 'Id,UserId,UserEmail,UserDisplayName,UserRole,Action,Resource,ResourceId,Details,IpAddress,UserAgent,Success,ErrorMessage,CreatedAt\n';
  }

  const headers = ['Id', 'UserId', 'UserEmail', 'UserDisplayName', 'UserRole', 'Action', 'Resource', 'ResourceId', 'Details', 'IpAddress', 'UserAgent', 'Success', 'ErrorMessage', 'CreatedAt'];
  const rows = logs.map(log => {
    const details = typeof log.Details === 'object' ? JSON.stringify(log.Details) : log.Details || '';
    return [
      log.Id || '',
      log.UserId || '',
      log.UserEmail || '',
      log.UserDisplayName || '',
      log.UserRole || '',
      log.Action || '',
      log.Resource || '',
      log.ResourceId || '',
      `"${details.replace(/"/g, '""')}"`,
      log.IpAddress || '',
      log.UserAgent || '',
      log.Success ? 'true' : 'false',
      log.ErrorMessage || '',
      log.CreatedAt ? new Date(log.CreatedAt).toISOString() : ''
    ].join(',');
  });

  return headers.join(',') + '\n' + rows.join('\n');
}

/**
 * GET /api/v1/admin/audit - Query audit logs with filters
 */
async function listAuditLogs(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const userId = url.searchParams.get('userId') || undefined;
    const resource = url.searchParams.get('resource') || undefined;
    const action = url.searchParams.get('action') || undefined;
    const successParam = url.searchParams.get('success');
    const success = successParam ? successParam === 'true' : undefined;
    const startDate = parseDate(url.searchParams.get('startDate'));
    const endDate = parseDate(url.searchParams.get('endDate'));

    if (limit < 1 || limit > 1000) {
      return fail("validation_error", "Limit must be between 1 and 1000", 422);
    }

    // Query with filters
    const filters = {
      userId,
      resource,
      action,
      success,
      startDate,
      endDate,
      limit,
      offset
    };

    // Get audit logs with user details via JOIN
    let sql = `
      SELECT 
        a.Id,
        a.UserId,
        u.Email as UserEmail,
        u.DisplayName as UserDisplayName,
        a.UserRole,
        a.Action,
        a.Resource,
        a.ResourceId,
        a.Details,
        a.IpAddress,
        a.UserAgent,
        a.Success,
        a.ErrorMessage,
        a.CreatedAt
      FROM AuditLog a
      LEFT JOIN Users u ON a.UserId = u.Id
      WHERE 1=1
    `;
    const params: Record<string, any> = {};

    if (userId) {
      sql += ' AND a.UserId = @userId';
      params.userId = userId;
    }

    if (resource) {
      sql += ' AND a.Resource = @resource';
      params.resource = resource;
    }

    if (action) {
      sql += ' AND a.Action = @action';
      params.action = action;
    }

    if (success !== undefined) {
      sql += ' AND a.Success = @success';
      params.success = success ? 1 : 0;
    }

    if (startDate) {
      sql += ' AND a.CreatedAt >= @startDate';
      params.startDate = startDate;
    }

    if (endDate) {
      sql += ' AND a.CreatedAt <= @endDate';
      params.endDate = endDate;
    }

    sql += ' ORDER BY a.CreatedAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    params.offset = offset;
    params.limit = limit;

    const logs = await query<AuditLogWithUser>(sql, params);

    // Get total count with same filters
    let countSql = 'SELECT COUNT(*) as Total FROM AuditLog a WHERE 1=1';
    const countParams: Record<string, any> = {};

    if (userId) {
      countSql += ' AND a.UserId = @userId';
      countParams.userId = userId;
    }

    if (resource) {
      countSql += ' AND a.Resource = @resource';
      countParams.resource = resource;
    }

    if (action) {
      countSql += ' AND a.Action = @action';
      countParams.action = action;
    }

    if (success !== undefined) {
      countSql += ' AND a.Success = @success';
      countParams.success = success ? 1 : 0;
    }

    if (startDate) {
      countSql += ' AND a.CreatedAt >= @startDate';
      countParams.startDate = startDate;
    }

    if (endDate) {
      countSql += ' AND a.CreatedAt <= @endDate';
      countParams.endDate = endDate;
    }

    const countResult = await query<{ Total: number }>(countSql, countParams);
    const total = countResult[0]?.Total || 0;

    await logSuccess(adminUserId, 'admin', 'list_audit_logs', 'audit', undefined,
      { filters }, ipAddress, userAgent);

    return ok({
      data: logs,
      pagination: {
        limit,
        offset,
        total
      }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'list_audit_logs', 'audit',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/audit/:id - Get specific audit entry details
 */
async function getAuditById(auditId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const logs = await query<AuditLogWithUser>(
      `SELECT 
        a.Id,
        a.UserId,
        u.Email as UserEmail,
        u.DisplayName as UserDisplayName,
        a.UserRole,
        a.Action,
        a.Resource,
        a.ResourceId,
        a.Details,
        a.IpAddress,
        a.UserAgent,
        a.Success,
        a.ErrorMessage,
        a.CreatedAt
      FROM AuditLog a
      LEFT JOIN Users u ON a.UserId = u.Id
      WHERE a.Id = @auditId`,
      { auditId }
    );

    if (logs.length === 0) {
      await logFailure(adminUserId, 'admin', 'get_audit_entry', 'audit',
        'Audit entry not found', auditId, undefined, ipAddress, userAgent);
      return fail("not_found", "Audit entry not found", 404);
    }

    const log = logs[0];

    // Parse Details if it's JSON string
    if (log.Details && typeof log.Details === 'string') {
      try {
        log.Details = JSON.parse(log.Details);
      } catch {
        // Keep as string if not valid JSON
      }
    }

    await logSuccess(adminUserId, 'admin', 'get_audit_entry', 'audit', auditId,
      undefined, ipAddress, userAgent);

    return ok(log);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'get_audit_entry', 'audit',
      error instanceof Error ? error.message : 'Unknown error',
      auditId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/audit/export - Export audit logs (CSV or JSON)
 */
async function exportAuditLogs(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check export permission
    const canExport = await hasPermission(adminUserId, 'audit.export');
    if (!canExport) {
      await logFailure(adminUserId, 'admin', 'export_audit_logs', 'audit',
        'Insufficient permissions', undefined, undefined, ipAddress, userAgent);
      return fail("forbidden", "Permission 'audit.export' required", 403);
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const userId = url.searchParams.get('userId') || undefined;
    const resource = url.searchParams.get('resource') || undefined;
    const action = url.searchParams.get('action') || undefined;
    const successParam = url.searchParams.get('success');
    const success = successParam ? successParam === 'true' : undefined;
    const startDate = parseDate(url.searchParams.get('startDate'));
    const endDate = parseDate(url.searchParams.get('endDate'));
    const limit = parseInt(url.searchParams.get('limit') || '10000', 10);

    if (!['csv', 'json'].includes(format)) {
      return fail("validation_error", "Format must be 'csv' or 'json'", 422);
    }

    if (limit > 50000) {
      return fail("validation_error", "Export limit cannot exceed 50,000 records", 422);
    }

    // Query audit logs with user details
    let sql = `
      SELECT 
        a.Id,
        a.UserId,
        u.Email as UserEmail,
        u.DisplayName as UserDisplayName,
        a.UserRole,
        a.Action,
        a.Resource,
        a.ResourceId,
        a.Details,
        a.IpAddress,
        a.UserAgent,
        a.Success,
        a.ErrorMessage,
        a.CreatedAt
      FROM AuditLog a
      LEFT JOIN Users u ON a.UserId = u.Id
      WHERE 1=1
    `;
    const params: Record<string, any> = {};

    if (userId) {
      sql += ' AND a.UserId = @userId';
      params.userId = userId;
    }

    if (resource) {
      sql += ' AND a.Resource = @resource';
      params.resource = resource;
    }

    if (action) {
      sql += ' AND a.Action = @action';
      params.action = action;
    }

    if (success !== undefined) {
      sql += ' AND a.Success = @success';
      params.success = success ? 1 : 0;
    }

    if (startDate) {
      sql += ' AND a.CreatedAt >= @startDate';
      params.startDate = startDate;
    }

    if (endDate) {
      sql += ' AND a.CreatedAt <= @endDate';
      params.endDate = endDate;
    }

    sql += ' ORDER BY a.CreatedAt DESC';
    
    // Add limit
    sql += ' OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY';
    params.limit = limit;

    const logs = await query<AuditLogWithUser>(sql, params);

    await logSuccess(adminUserId, 'admin', 'export_audit_logs', 'audit', undefined,
      { format, count: logs.length, filters: { userId, resource, action, success, startDate, endDate } },
      ipAddress, userAgent);

    if (format === 'csv') {
      const csv = convertToCSV(logs);
      return {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`
        },
        body: csv
      };
    }

    // JSON format
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.json"`
      },
      jsonBody: {
        exportedAt: new Date().toISOString(),
        count: logs.length,
        filters: { userId, resource, action, success, startDate, endDate },
        data: logs
      }
    };
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'export_audit_logs', 'audit',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * POST /api/v1/admin/audit - Manual audit entry creation
 */
async function createAuditEntry(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: CreateAuditRequest;
  try {
    body = await req.json() as CreateAuditRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  // Validate required fields
  if (!body.Action || typeof body.Action !== 'string') {
    return fail("validation_error", "Action is required", 422);
  }

  if (!body.Resource || typeof body.Resource !== 'string') {
    return fail("validation_error", "Resource is required", 422);
  }

  if (body.Success === undefined || typeof body.Success !== 'boolean') {
    return fail("validation_error", "Success must be a boolean", 422);
  }

  try {
    // Get admin's role
    const adminRoles = await query<{ Name: string }>(
      `SELECT r.Name FROM UserRoles ur
       INNER JOIN Roles r ON ur.RoleId = r.Id
       WHERE ur.UserId = @adminUserId`,
      { adminUserId }
    );
    const adminRole = adminRoles.length > 0 ? adminRoles[0].Name : 'admin';

    const details = typeof body.Details === 'object' 
      ? JSON.stringify(body.Details) 
      : body.Details;

    const result = await query<AuditLogEntry>(
      `INSERT INTO AuditLog (
        UserId, UserRole, Action, Resource, ResourceId, 
        Details, IpAddress, UserAgent, Success, ErrorMessage, CreatedAt
      )
      OUTPUT INSERTED.*
      VALUES (
        @userId, @userRole, @action, @resource, @resourceId,
        @details, @ipAddress, @userAgent, @success, @errorMessage, GETDATE()
      )`,
      {
        userId: adminUserId,
        userRole: adminRole,
        action: body.Action,
        resource: body.Resource,
        resourceId: body.ResourceId || null,
        details: details || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        success: body.Success ? 1 : 0,
        errorMessage: body.ErrorMessage || null
      }
    );

    const newEntry = result[0];

    await logSuccess(adminUserId, 'admin', 'create_audit_entry', 'audit', newEntry.Id,
      { action: body.Action, resource: body.Resource }, ipAddress, userAgent);

    return ok(newEntry, 201);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'create_audit_entry', 'audit',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * DELETE /api/v1/admin/audit/:id - Delete audit entry
 */
async function deleteAuditEntry(auditId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check delete permission
    const canDelete = await hasPermission(adminUserId, 'audit.delete');
    if (!canDelete) {
      await logFailure(adminUserId, 'admin', 'delete_audit_entry', 'audit',
        'Insufficient permissions', auditId, undefined, ipAddress, userAgent);
      return fail("forbidden", "Permission 'audit.delete' required", 403);
    }

    // Check if audit entry exists
    const existingLogs = await query<AuditLogEntry>(
      "SELECT * FROM AuditLog WHERE Id = @auditId",
      { auditId }
    );

    if (existingLogs.length === 0) {
      await logFailure(adminUserId, 'admin', 'delete_audit_entry', 'audit',
        'Audit entry not found', auditId, undefined, ipAddress, userAgent);
      return fail("not_found", "Audit entry not found", 404);
    }

    // Delete the audit entry
    await query(
      "DELETE FROM AuditLog WHERE Id = @auditId",
      { auditId }
    );

    await logSuccess(adminUserId, 'admin', 'delete_audit_entry', 'audit', auditId,
      { deletedEntry: existingLogs[0] }, ipAddress, userAgent);

    return ok({ message: "Audit entry deleted successfully" });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'delete_audit_entry', 'audit',
      error instanceof Error ? error.message : 'Unknown error',
      auditId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * Main handler for admin audit endpoint
 */
export async function adminAudit(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Get authenticated user
  const authUser = getAuthenticatedUser(req);
  
  if (!authUser) {
    return fail("unauthorized", "Authentication required", 401);
  }

  // Get admin user ID from database
  const adminUserId = await getAdminUserId(authUser.entraId);
  if (!adminUserId) {
    return fail("unauthorized", "User not found", 401);
  }

  // Check admin role or audit.read permission
  const isAdmin = await hasRole(adminUserId, 'admin');
  const canReadAudit = await hasPermission(adminUserId, 'audit.read');

  if (!isAdmin && !canReadAudit) {
    await logFailure(adminUserId, 'user', 'admin_audit_access_denied', 'audit',
      'Insufficient permissions', undefined, undefined,
      req.headers.get('x-forwarded-for') || undefined,
      req.headers.get('user-agent') || undefined);
    return fail("forbidden", "Admin permissions or 'audit.read' permission required", 403);
  }

  const method = req.method?.toUpperCase();
  const ipAddress = req.headers.get('x-forwarded-for') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    // Parse route params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    // pathParts: ['api', 'v1', 'admin', 'audit', ...rest]
    
    const auditId = pathParts[4]; // ID after /api/v1/admin/audit/
    const subResource = auditId; // Could be 'export' or an ID

    if (method === "GET") {
      // Handle /api/v1/admin/audit/export
      if (subResource === 'export') {
        return await exportAuditLogs(req, adminUserId, ipAddress, userAgent);
      }
      
      // Handle /api/v1/admin/audit/:id
      if (auditId) {
        return await getAuditById(auditId, adminUserId, ipAddress, userAgent);
      }
      
      // Handle /api/v1/admin/audit
      return await listAuditLogs(req, adminUserId, ipAddress, userAgent);
    }

    if (method === "POST") {
      if (!auditId) {
        return await createAuditEntry(req, adminUserId, ipAddress, userAgent);
      }
      return fail("not_found", "Endpoint not found", 404);
    }

    if (method === "DELETE") {
      if (!auditId || auditId === 'export') {
        return fail("bad_request", "Audit entry ID required", 400);
      }
      return await deleteAuditEntry(auditId, adminUserId, ipAddress, userAgent);
    }

    return fail("method_not_allowed", "Unsupported method", 405);
  } catch (error) {
    context.error('Error in adminAudit handler:', error);
    return fail(
      "internal_error",
      "An internal error occurred",
      500,
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

app.http("admin-audit", {
  methods: ["GET", "POST", "DELETE"],
  authLevel: "anonymous",
  route: "v1/admin/audit/{*restOfPath}",
  handler: adminAudit
});
