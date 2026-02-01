import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";
import { hasRole } from "../../shared/rbac";
import { logSuccess, logFailure, logAssignment } from "../../shared/audit";

interface User {
  Id: string;
  Email: string;
  DisplayName: string;
  EntraId: string;
  PhoneNumber?: string;
  IsActive: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface ClientAssignment {
  Id: string;
  ClientId: string;
  CaseManagerId: string;
  AssignedBy: string;
  AssignedAt: Date;
  Status: string;
  Notes?: string;
  ClientDisplayName?: string;
  ClientEmail?: string;
  CaseManagerDisplayName?: string;
  CaseManagerEmail?: string;
  AssignedByDisplayName?: string;
  AssignedByEmail?: string;
}

interface CreateAssignmentRequest {
  clientId: string;
  caseManagerId: string;
  notes?: string;
}

interface UpdateAssignmentRequest {
  status?: string;
  notes?: string;
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
  const users = await query<User>(
    "SELECT Id FROM Users WHERE EntraId = @entraId",
    { entraId }
  );
  return users.length > 0 ? users[0].Id : null;
}

/**
 * Validate assignment request
 */
function validateCreateAssignment(body: CreateAssignmentRequest): { valid: boolean; error?: string } {
  if (!body.clientId || typeof body.clientId !== 'string' || body.clientId.trim().length === 0) {
    return { valid: false, error: 'Client ID is required' };
  }
  if (!body.caseManagerId || typeof body.caseManagerId !== 'string' || body.caseManagerId.trim().length === 0) {
    return { valid: false, error: 'Case Manager ID is required' };
  }
  return { valid: true };
}

/**
 * Check if user exists
 */
async function userExists(userId: string): Promise<boolean> {
  const users = await query<User>(
    "SELECT Id FROM Users WHERE Id = @userId AND IsActive = 1",
    { userId }
  );
  return users.length > 0;
}

/**
 * Check if case manager has the appropriate role
 */
async function isCaseManager(userId: string): Promise<boolean> {
  const hasCaseManagerRole = await hasRole(userId, 'case_manager');
  const isAdmin = await hasRole(userId, 'admin');
  return hasCaseManagerRole || isAdmin;
}

/**
 * Check if active assignment exists
 */
async function hasActiveAssignment(clientId: string): Promise<boolean> {
  const assignments = await query<ClientAssignment>(
    "SELECT Id FROM ClientAssignments WHERE ClientId = @clientId AND Status = 'active'",
    { clientId }
  );
  return assignments.length > 0;
}

/**
 * GET /api/v1/admin/assignments - List all client assignments
 */
async function listAssignments(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const caseManagerId = url.searchParams.get('caseManagerId');
    const clientId = url.searchParams.get('clientId');
    const status = url.searchParams.get('status');

    if (limit < 1 || limit > 1000) {
      return fail("validation_error", "Limit must be between 1 and 1000", 422);
    }

    let sql = `
      SELECT 
        ca.*,
        client.DisplayName as ClientDisplayName,
        client.Email as ClientEmail,
        cm.DisplayName as CaseManagerDisplayName,
        cm.Email as CaseManagerEmail,
        assignedBy.DisplayName as AssignedByDisplayName,
        assignedBy.Email as AssignedByEmail
      FROM ClientAssignments ca
      INNER JOIN Users client ON ca.ClientId = client.Id
      INNER JOIN Users cm ON ca.CaseManagerId = cm.Id
      INNER JOIN Users assignedBy ON ca.AssignedBy = assignedBy.Id
      WHERE 1=1
    `;
    const params: Record<string, any> = {};

    if (caseManagerId) {
      sql += ' AND ca.CaseManagerId = @caseManagerId';
      params.caseManagerId = caseManagerId;
    }

    if (clientId) {
      sql += ' AND ca.ClientId = @clientId';
      params.clientId = clientId;
    }

    if (status) {
      sql += ' AND ca.Status = @status';
      params.status = status;
    }

    sql += ' ORDER BY ca.AssignedAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    params.offset = offset;
    params.limit = limit;

    const assignments = await query<ClientAssignment>(sql, params);

    // Get total count
    let countSql = `
      SELECT COUNT(*) as Total 
      FROM ClientAssignments ca
      WHERE 1=1
    `;
    if (caseManagerId) {
      countSql += ' AND ca.CaseManagerId = @caseManagerId';
    }
    if (clientId) {
      countSql += ' AND ca.ClientId = @clientId';
    }
    if (status) {
      countSql += ' AND ca.Status = @status';
    }

    const countResult = await query<{ Total: number }>(countSql, params);
    const total = countResult[0]?.Total || 0;

    await logSuccess(adminUserId, 'admin', 'list_assignments', 'assignments', undefined,
      { limit, offset, caseManagerId, clientId, status }, ipAddress, userAgent);

    return ok({
      data: assignments,
      pagination: {
        limit,
        offset,
        total
      }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'list_assignments', 'assignments',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * POST /api/v1/admin/assignments - Assign client to case manager
 */
async function createAssignment(req: HttpRequest, adminUserId: string, adminRole: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: CreateAssignmentRequest;
  try {
    body = await req.json() as CreateAssignmentRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  const validation = validateCreateAssignment(body);
  if (!validation.valid) {
    return fail("validation_error", validation.error!, 422);
  }

  try {
    // Check if client exists
    if (!await userExists(body.clientId)) {
      await logFailure(adminUserId, adminRole, 'create_assignment', 'assignments',
        'Client not found or inactive', undefined, body, ipAddress, userAgent);
      return fail("not_found", "Client not found or inactive", 404);
    }

    // Check if case manager exists
    if (!await userExists(body.caseManagerId)) {
      await logFailure(adminUserId, adminRole, 'create_assignment', 'assignments',
        'Case manager not found or inactive', undefined, body, ipAddress, userAgent);
      return fail("not_found", "Case manager not found or inactive", 404);
    }

    // Check if case manager has appropriate role
    if (!await isCaseManager(body.caseManagerId)) {
      await logFailure(adminUserId, adminRole, 'create_assignment', 'assignments',
        'User is not a case manager', undefined, body, ipAddress, userAgent);
      return fail("validation_error", "User is not a case manager", 422);
    }

    // Check for duplicate active assignment
    if (await hasActiveAssignment(body.clientId)) {
      await logFailure(adminUserId, adminRole, 'create_assignment', 'assignments',
        'Client already has an active assignment', undefined, body, ipAddress, userAgent);
      return fail("conflict", "Client already has an active assignment", 409);
    }

    const result = await query<ClientAssignment>(
      `INSERT INTO ClientAssignments (ClientId, CaseManagerId, AssignedBy, AssignedAt, Status, Notes)
       OUTPUT INSERTED.*
       VALUES (@clientId, @caseManagerId, @assignedBy, GETUTCDATE(), 'active', @notes)`,
      {
        clientId: body.clientId,
        caseManagerId: body.caseManagerId,
        assignedBy: adminUserId,
        notes: body.notes || null
      }
    );

    const newAssignment = result[0];

    // Get user details for response
    const enriched = await query<ClientAssignment>(
      `SELECT 
        ca.*,
        client.DisplayName as ClientDisplayName,
        client.Email as ClientEmail,
        cm.DisplayName as CaseManagerDisplayName,
        cm.Email as CaseManagerEmail,
        assignedBy.DisplayName as AssignedByDisplayName,
        assignedBy.Email as AssignedByEmail
       FROM ClientAssignments ca
       INNER JOIN Users client ON ca.ClientId = client.Id
       INNER JOIN Users cm ON ca.CaseManagerId = cm.Id
       INNER JOIN Users assignedBy ON ca.AssignedBy = assignedBy.Id
       WHERE ca.Id = @assignmentId`,
      { assignmentId: newAssignment.Id }
    );

    await logAssignment(body.clientId, body.caseManagerId, adminUserId, adminRole, body.notes);

    await logSuccess(adminUserId, adminRole, 'create_assignment', 'assignments', newAssignment.Id,
      { clientId: body.clientId, caseManagerId: body.caseManagerId }, ipAddress, userAgent);

    return ok(enriched[0], 201);
  } catch (error) {
    await logFailure(adminUserId, adminRole, 'create_assignment', 'assignments',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * PATCH /api/v1/admin/assignments/:id - Update assignment
 */
async function updateAssignment(assignmentId: string, req: HttpRequest, adminUserId: string, adminRole: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: UpdateAssignmentRequest;
  try {
    body = await req.json() as UpdateAssignmentRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  // Validate status if provided
  if (body.status && !['active', 'inactive', 'transferred'].includes(body.status)) {
    return fail("validation_error", "Status must be 'active', 'inactive', or 'transferred'", 422);
  }

  const allowedFields = ['Status', 'Notes'];
  const updates: string[] = [];
  const params: Record<string, any> = { assignmentId };

  if (body.status !== undefined) {
    updates.push('Status = @status');
    params.status = body.status;
  }

  if (body.notes !== undefined) {
    updates.push('Notes = @notes');
    params.notes = body.notes;
  }

  if (updates.length === 0) {
    return fail("validation_error", "No valid fields to update", 422);
  }

  try {
    // Check if assignment exists
    const existingAssignments = await query<ClientAssignment>(
      "SELECT * FROM ClientAssignments WHERE Id = @assignmentId",
      { assignmentId }
    );

    if (existingAssignments.length === 0) {
      await logFailure(adminUserId, adminRole, 'update_assignment', 'assignments',
        'Assignment not found', assignmentId, body, ipAddress, userAgent);
      return fail("not_found", "Assignment not found", 404);
    }

    await query(
      `UPDATE ClientAssignments SET ${updates.join(', ')} WHERE Id = @assignmentId`,
      params
    );

    // Get updated assignment with user details
    const updatedAssignments = await query<ClientAssignment>(
      `SELECT 
        ca.*,
        client.DisplayName as ClientDisplayName,
        client.Email as ClientEmail,
        cm.DisplayName as CaseManagerDisplayName,
        cm.Email as CaseManagerEmail,
        assignedBy.DisplayName as AssignedByDisplayName,
        assignedBy.Email as AssignedByEmail
       FROM ClientAssignments ca
       INNER JOIN Users client ON ca.ClientId = client.Id
       INNER JOIN Users cm ON ca.CaseManagerId = cm.Id
       INNER JOIN Users assignedBy ON ca.AssignedBy = assignedBy.Id
       WHERE ca.Id = @assignmentId`,
      { assignmentId }
    );

    await logSuccess(adminUserId, adminRole, 'update_assignment', 'assignments', assignmentId,
      body, ipAddress, userAgent);

    return ok(updatedAssignments[0]);
  } catch (error) {
    await logFailure(adminUserId, adminRole, 'update_assignment', 'assignments',
      error instanceof Error ? error.message : 'Unknown error',
      assignmentId, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * DELETE /api/v1/admin/assignments/:id - Remove assignment (set status to 'inactive')
 */
async function deactivateAssignment(assignmentId: string, adminUserId: string, adminRole: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check if assignment exists
    const existingAssignments = await query<ClientAssignment>(
      "SELECT * FROM ClientAssignments WHERE Id = @assignmentId",
      { assignmentId }
    );

    if (existingAssignments.length === 0) {
      await logFailure(adminUserId, adminRole, 'deactivate_assignment', 'assignments',
        'Assignment not found', assignmentId, undefined, ipAddress, userAgent);
      return fail("not_found", "Assignment not found", 404);
    }

    await query(
      "UPDATE ClientAssignments SET Status = 'inactive' WHERE Id = @assignmentId",
      { assignmentId }
    );

    await logSuccess(adminUserId, adminRole, 'deactivate_assignment', 'assignments', assignmentId,
      undefined, ipAddress, userAgent);

    return ok({ message: "Assignment deactivated successfully" });
  } catch (error) {
    await logFailure(adminUserId, adminRole, 'deactivate_assignment', 'assignments',
      error instanceof Error ? error.message : 'Unknown error',
      assignmentId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/assignments/case-manager/:id - Get assignments by case manager
 */
async function getAssignmentsByCaseManager(caseManagerId: string, req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const status = url.searchParams.get('status') || 'active';

    if (limit < 1 || limit > 1000) {
      return fail("validation_error", "Limit must be between 1 and 1000", 422);
    }

    const sql = `
      SELECT 
        ca.*,
        client.DisplayName as ClientDisplayName,
        client.Email as ClientEmail,
        cm.DisplayName as CaseManagerDisplayName,
        cm.Email as CaseManagerEmail,
        assignedBy.DisplayName as AssignedByDisplayName,
        assignedBy.Email as AssignedByEmail
      FROM ClientAssignments ca
      INNER JOIN Users client ON ca.ClientId = client.Id
      INNER JOIN Users cm ON ca.CaseManagerId = cm.Id
      INNER JOIN Users assignedBy ON ca.AssignedBy = assignedBy.Id
      WHERE ca.CaseManagerId = @caseManagerId AND ca.Status = @status
      ORDER BY ca.AssignedAt DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    const assignments = await query<ClientAssignment>(sql, {
      caseManagerId,
      status,
      offset,
      limit
    });

    // Get total count
    const countResult = await query<{ Total: number }>(
      `SELECT COUNT(*) as Total 
       FROM ClientAssignments 
       WHERE CaseManagerId = @caseManagerId AND Status = @status`,
      { caseManagerId, status }
    );
    const total = countResult[0]?.Total || 0;

    await logSuccess(adminUserId, 'admin', 'get_assignments_by_case_manager', 'assignments', caseManagerId,
      { limit, offset, status }, ipAddress, userAgent);

    return ok({
      data: assignments,
      pagination: {
        limit,
        offset,
        total
      }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'get_assignments_by_case_manager', 'assignments',
      error instanceof Error ? error.message : 'Unknown error',
      caseManagerId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/assignments/client/:id - Get assignment history for client
 */
async function getAssignmentsByClient(clientId: string, req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    if (limit < 1 || limit > 1000) {
      return fail("validation_error", "Limit must be between 1 and 1000", 422);
    }

    const sql = `
      SELECT 
        ca.*,
        client.DisplayName as ClientDisplayName,
        client.Email as ClientEmail,
        cm.DisplayName as CaseManagerDisplayName,
        cm.Email as CaseManagerEmail,
        assignedBy.DisplayName as AssignedByDisplayName,
        assignedBy.Email as AssignedByEmail
      FROM ClientAssignments ca
      INNER JOIN Users client ON ca.ClientId = client.Id
      INNER JOIN Users cm ON ca.CaseManagerId = cm.Id
      INNER JOIN Users assignedBy ON ca.AssignedBy = assignedBy.Id
      WHERE ca.ClientId = @clientId
      ORDER BY ca.AssignedAt DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    const assignments = await query<ClientAssignment>(sql, {
      clientId,
      offset,
      limit
    });

    // Get total count
    const countResult = await query<{ Total: number }>(
      `SELECT COUNT(*) as Total 
       FROM ClientAssignments 
       WHERE ClientId = @clientId`,
      { clientId }
    );
    const total = countResult[0]?.Total || 0;

    await logSuccess(adminUserId, 'admin', 'get_assignments_by_client', 'assignments', clientId,
      { limit, offset }, ipAddress, userAgent);

    return ok({
      data: assignments,
      pagination: {
        limit,
        offset,
        total
      }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'get_assignments_by_client', 'assignments',
      error instanceof Error ? error.message : 'Unknown error',
      clientId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * Main handler for admin assignments endpoint
 */
export async function adminAssignments(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

  // Check admin or case_manager role
  const isAdmin = await hasRole(adminUserId, 'admin');
  const isCaseManagerRole = await hasRole(adminUserId, 'case_manager');
  
  if (!isAdmin && !isCaseManagerRole) {
    await logFailure(adminUserId, 'user', 'admin_access_denied', 'assignments',
      'Insufficient permissions', undefined, undefined,
      req.headers.get('x-forwarded-for') || undefined,
      req.headers.get('user-agent') || undefined);
    return fail("forbidden", "Admin or case manager permissions required", 403);
  }

  const userRole = isAdmin ? 'admin' : 'case_manager';
  const method = req.method?.toUpperCase();
  const ipAddress = req.headers.get('x-forwarded-for') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    // Parse route params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    // pathParts: ['api', 'v1', 'admin', 'assignments', ...rest]
    
    const idOrResource = pathParts[4]; // ID or resource after /api/v1/admin/assignments/
    const subId = pathParts[5]; // Sub-ID for case-manager/:id or client/:id

    if (method === "GET") {
      if (!idOrResource) {
        // GET /api/v1/admin/assignments
        return await listAssignments(req, adminUserId, ipAddress, userAgent);
      }
      
      if (idOrResource === 'case-manager' && subId) {
        // GET /api/v1/admin/assignments/case-manager/:id
        return await getAssignmentsByCaseManager(subId, req, adminUserId, ipAddress, userAgent);
      }
      
      if (idOrResource === 'client' && subId) {
        // GET /api/v1/admin/assignments/client/:id
        return await getAssignmentsByClient(subId, req, adminUserId, ipAddress, userAgent);
      }
      
      return fail("not_found", "Endpoint not found", 404);
    }

    if (method === "POST") {
      if (!idOrResource) {
        // POST /api/v1/admin/assignments
        return await createAssignment(req, adminUserId, userRole, ipAddress, userAgent);
      }
      return fail("not_found", "Endpoint not found", 404);
    }

    if (method === "PATCH") {
      if (!idOrResource) {
        return fail("bad_request", "Assignment ID required", 400);
      }
      // PATCH /api/v1/admin/assignments/:id
      return await updateAssignment(idOrResource, req, adminUserId, userRole, ipAddress, userAgent);
    }

    if (method === "DELETE") {
      if (!idOrResource) {
        return fail("bad_request", "Assignment ID required", 400);
      }
      // DELETE /api/v1/admin/assignments/:id
      return await deactivateAssignment(idOrResource, adminUserId, userRole, ipAddress, userAgent);
    }

    return fail("method_not_allowed", "Unsupported method", 405);
  } catch (error) {
    context.error('Error in adminAssignments handler:', error);
    return fail(
      "internal_error",
      "An internal error occurred",
      500,
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

app.http("admin-assignments", {
  methods: ["GET", "POST", "PATCH", "DELETE"],
  authLevel: "anonymous",
  route: "v1/admin/assignments/{*restOfPath}",
  handler: adminAssignments
});
