import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";
import { hasRole, assignRole, getRoleByName, getUserRoles } from "../../shared/rbac";
import { logSuccess, logFailure } from "../../shared/audit";

interface User {
  Id: string;
  Email: string;
  DisplayName: string;
  EntraId: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Address?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  IsActive: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface CreateUserRequest {
  Email: string;
  DisplayName: string;
  EntraId?: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Address?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
}

interface UpdateUserRequest {
  Email?: string;
  DisplayName?: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Address?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  IsActive?: number;
}

interface AssignRoleRequest {
  roleName: string;
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
 * Validate and sanitize user input
 */
function validateCreateUser(body: CreateUserRequest): { valid: boolean; error?: string } {
  if (!body.Email || typeof body.Email !== 'string' || !body.Email.includes('@')) {
    return { valid: false, error: 'Valid email is required' };
  }
  if (!body.DisplayName || typeof body.DisplayName !== 'string' || body.DisplayName.trim().length === 0) {
    return { valid: false, error: 'Display name is required' };
  }
  return { valid: true };
}

/**
 * GET /api/v1/admin/users - List all users
 */
async function listUsers(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const role = url.searchParams.get('role');
    const isActive = url.searchParams.get('isActive');

    if (limit < 1 || limit > 1000) {
      return fail("validation_error", "Limit must be between 1 and 1000", 422);
    }

    let sql = `
      SELECT DISTINCT u.*, 
        (SELECT STRING_AGG(r.Name, ', ') 
         FROM UserRoles ur 
         INNER JOIN Roles r ON ur.RoleId = r.Id 
         WHERE ur.UserId = u.Id) as Roles
      FROM Users u
      LEFT JOIN UserRoles ur ON u.Id = ur.UserId
      LEFT JOIN Roles r ON ur.RoleId = r.Id
      WHERE 1=1
    `;
    const params: Record<string, any> = {};

    if (role) {
      sql += ' AND r.Name = @role';
      params.role = role;
    }

    if (isActive !== null && isActive !== undefined) {
      sql += ' AND u.IsActive = @isActive';
      params.isActive = isActive === 'true' || isActive === '1' ? 1 : 0;
    }

    sql += ' ORDER BY u.CreatedAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    params.offset = offset;
    params.limit = limit;

    const users = await query<User>(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(DISTINCT u.Id) as Total FROM Users u';
    if (role || isActive !== null) {
      countSql += ' LEFT JOIN UserRoles ur ON u.Id = ur.UserId';
      if (role) {
        countSql += ' LEFT JOIN Roles r ON ur.RoleId = r.Id';
      }
      countSql += ' WHERE 1=1';
      if (role) {
        countSql += ' AND r.Name = @role';
      }
      if (isActive !== null && isActive !== undefined) {
        countSql += ' AND u.IsActive = @isActive';
      }
    }

    const countResult = await query<{ Total: number }>(countSql, params);
    const total = countResult[0]?.Total || 0;

    await logSuccess(adminUserId, 'admin', 'list_users', 'users', undefined, 
      { limit, offset, role, isActive }, ipAddress, userAgent);

    return ok({
      data: users,
      pagination: {
        limit,
        offset,
        total
      }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'list_users', 'users', 
      error instanceof Error ? error.message : 'Unknown error', 
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * POST /api/v1/admin/users - Create new user
 */
async function createUser(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: CreateUserRequest;
  try {
    body = await req.json() as CreateUserRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  const validation = validateCreateUser(body);
  if (!validation.valid) {
    return fail("validation_error", validation.error!, 422);
  }

  try {
    // Check if user already exists
    const existingUsers = await query<User>(
      "SELECT * FROM Users WHERE Email = @email",
      { email: body.Email }
    );

    if (existingUsers.length > 0) {
      await logFailure(adminUserId, 'admin', 'create_user', 'users', 
        'User with this email already exists', undefined, 
        { email: body.Email }, ipAddress, userAgent);
      return fail("duplicate_user", "User with this email already exists", 409);
    }

    const result = await query<User>(
      `INSERT INTO Users (Email, DisplayName, EntraId, PhoneNumber, DateOfBirth, 
        Address, City, State, ZipCode, IsActive, CreatedAt, UpdatedAt)
       OUTPUT INSERTED.*
       VALUES (@email, @displayName, @entraId, @phoneNumber, @dateOfBirth,
        @address, @city, @state, @zipCode, 1, GETUTCDATE(), GETUTCDATE())`,
      {
        email: body.Email,
        displayName: body.DisplayName,
        entraId: body.EntraId || null,
        phoneNumber: body.PhoneNumber || null,
        dateOfBirth: body.DateOfBirth || null,
        address: body.Address || null,
        city: body.City || null,
        state: body.State || null,
        zipCode: body.ZipCode || null
      }
    );

    const newUser = result[0];

    await logSuccess(adminUserId, 'admin', 'create_user', 'users', newUser.Id,
      { email: body.Email, displayName: body.DisplayName }, ipAddress, userAgent);

    return ok(newUser, 201);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'create_user', 'users',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, { email: body.Email }, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/users/:id - Get user details
 */
async function getUserById(userId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const users = await query<User>(
      "SELECT * FROM Users WHERE Id = @userId",
      { userId }
    );

    if (users.length === 0) {
      await logFailure(adminUserId, 'admin', 'get_user', 'users', 
        'User not found', userId, undefined, ipAddress, userAgent);
      return fail("not_found", "User not found", 404);
    }

    const user = users[0];

    // Get user roles
    const roles = await getUserRoles(userId);

    await logSuccess(adminUserId, 'admin', 'get_user', 'users', userId,
      undefined, ipAddress, userAgent);

    return ok({
      ...user,
      roles
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'get_user', 'users',
      error instanceof Error ? error.message : 'Unknown error',
      userId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * PATCH /api/v1/admin/users/:id - Update user
 */
async function updateUser(userId: string, req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: UpdateUserRequest;
  try {
    body = await req.json() as UpdateUserRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  const allowedFields = ['Email', 'DisplayName', 'PhoneNumber', 'DateOfBirth', 
    'Address', 'City', 'State', 'ZipCode', 'IsActive'];
  const updates: string[] = [];
  const params: Record<string, any> = { userId };

  Object.keys(body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = @${key}`);
      params[key] = (body as any)[key];
    }
  });

  if (updates.length === 0) {
    return fail("validation_error", "No valid fields to update", 422);
  }

  try {
    // Check if user exists
    const existingUsers = await query<User>(
      "SELECT * FROM Users WHERE Id = @userId",
      { userId }
    );

    if (existingUsers.length === 0) {
      await logFailure(adminUserId, 'admin', 'update_user', 'users',
        'User not found', userId, body, ipAddress, userAgent);
      return fail("not_found", "User not found", 404);
    }

    await query(
      `UPDATE Users SET ${updates.join(', ')}, UpdatedAt = GETUTCDATE() WHERE Id = @userId`,
      params
    );

    const updatedUsers = await query<User>("SELECT * FROM Users WHERE Id = @userId", { userId });

    await logSuccess(adminUserId, 'admin', 'update_user', 'users', userId,
      body, ipAddress, userAgent);

    return ok(updatedUsers[0]);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'update_user', 'users',
      error instanceof Error ? error.message : 'Unknown error',
      userId, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * DELETE /api/v1/admin/users/:id - Deactivate user
 */
async function deactivateUser(userId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check if user exists
    const existingUsers = await query<User>(
      "SELECT * FROM Users WHERE Id = @userId",
      { userId }
    );

    if (existingUsers.length === 0) {
      await logFailure(adminUserId, 'admin', 'deactivate_user', 'users',
        'User not found', userId, undefined, ipAddress, userAgent);
      return fail("not_found", "User not found", 404);
    }

    await query(
      "UPDATE Users SET IsActive = 0, UpdatedAt = GETUTCDATE() WHERE Id = @userId",
      { userId }
    );

    await logSuccess(adminUserId, 'admin', 'deactivate_user', 'users', userId,
      undefined, ipAddress, userAgent);

    return ok({ message: "User deactivated successfully" });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'deactivate_user', 'users',
      error instanceof Error ? error.message : 'Unknown error',
      userId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * POST /api/v1/admin/users/:id/roles - Assign role to user
 */
async function assignUserRole(userId: string, req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: AssignRoleRequest;
  try {
    body = await req.json() as AssignRoleRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  if (!body.roleName || typeof body.roleName !== 'string') {
    return fail("validation_error", "Role name is required", 422);
  }

  try {
    // Check if user exists
    const existingUsers = await query<User>(
      "SELECT * FROM Users WHERE Id = @userId",
      { userId }
    );

    if (existingUsers.length === 0) {
      await logFailure(adminUserId, 'admin', 'assign_role', 'users',
        'User not found', userId, body, ipAddress, userAgent);
      return fail("not_found", "User not found", 404);
    }

    // Get role by name
    const role = await getRoleByName(body.roleName);
    if (!role) {
      await logFailure(adminUserId, 'admin', 'assign_role', 'users',
        'Role not found', userId, body, ipAddress, userAgent);
      return fail("not_found", `Role '${body.roleName}' not found`, 404);
    }

    // Assign role
    await assignRole(userId, role.Id, adminUserId);

    await logSuccess(adminUserId, 'admin', 'assign_role', 'users', userId,
      { roleName: body.roleName, roleId: role.Id }, ipAddress, userAgent);

    return ok({ message: `Role '${body.roleName}' assigned successfully` });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'assign_role', 'users',
      error instanceof Error ? error.message : 'Unknown error',
      userId, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * Main handler for admin users endpoint
 */
export async function adminUsers(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

  // Check admin role
  const isAdmin = await hasRole(adminUserId, 'admin');
  if (!isAdmin) {
    await logFailure(adminUserId, 'user', 'admin_access_denied', 'users',
      'Insufficient permissions', undefined, undefined, 
      req.headers.get('x-forwarded-for') || undefined,
      req.headers.get('user-agent') || undefined);
    return fail("forbidden", "Admin permissions required", 403);
  }

  const method = req.method?.toUpperCase();
  const ipAddress = req.headers.get('x-forwarded-for') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    // Parse route params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    // pathParts: ['api', 'v1', 'admin', 'users', ...rest]
    
    const userId = pathParts[4]; // ID after /api/v1/admin/users/
    const subResource = pathParts[5]; // e.g., 'roles'

    if (method === "GET") {
      if (!userId) {
        return await listUsers(req, adminUserId, ipAddress, userAgent);
      }
      return await getUserById(userId, adminUserId, ipAddress, userAgent);
    }

    if (method === "POST") {
      if (userId && subResource === 'roles') {
        return await assignUserRole(userId, req, adminUserId, ipAddress, userAgent);
      }
      if (!userId) {
        return await createUser(req, adminUserId, ipAddress, userAgent);
      }
      return fail("not_found", "Endpoint not found", 404);
    }

    if (method === "PATCH") {
      if (!userId) {
        return fail("bad_request", "User ID required", 400);
      }
      return await updateUser(userId, req, adminUserId, ipAddress, userAgent);
    }

    if (method === "DELETE") {
      if (!userId) {
        return fail("bad_request", "User ID required", 400);
      }
      return await deactivateUser(userId, adminUserId, ipAddress, userAgent);
    }

    return fail("method_not_allowed", "Unsupported method", 405);
  } catch (error) {
    context.error('Error in adminUsers handler:', error);
    return fail(
      "internal_error",
      "An internal error occurred",
      500,
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

app.http("admin-users", {
  methods: ["GET", "POST", "PATCH", "DELETE"],
  authLevel: "anonymous",
  route: "v1/admin/users/{*restOfPath}",
  handler: adminUsers
});
