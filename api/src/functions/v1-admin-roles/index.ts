import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";
import { hasPermission } from "../../shared/rbac";
import { logSuccess, logFailure } from "../../shared/audit";

interface Role {
  Id: string;
  Name: string;
  Description: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface Permission {
  Id: string;
  Name: string;
  Resource: string;
  Action: string;
  Description: string;
}

interface RoleWithPermissions extends Role {
  Permissions?: Permission[];
}

interface CreateRoleRequest {
  Name: string;
  Description?: string;
}

interface UpdateRoleRequest {
  Name?: string;
  Description?: string;
}

interface AddPermissionRequest {
  permissionId: string;
}

const DEFAULT_ROLES = ['admin', 'case_manager', 'client', 'auditor'];

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
 * Validate role name
 */
function validateRoleName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Role name is required' };
  }
  if (name.trim().length === 0) {
    return { valid: false, error: 'Role name cannot be empty' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'Role name must be 50 characters or less' };
  }
  if (!/^[a-z_]+$/.test(name)) {
    return { valid: false, error: 'Role name must contain only lowercase letters and underscores' };
  }
  return { valid: true };
}

/**
 * GET /api/v1/admin/roles - List all roles with their permissions
 */
async function listRoles(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const includePermissions = url.searchParams.get('includePermissions') !== 'false';

    // Get all roles
    const roles = await query<Role>(
      "SELECT * FROM Roles ORDER BY Name"
    );

    let rolesWithPermissions: RoleWithPermissions[] = roles;

    if (includePermissions) {
      // Get permissions for each role
      for (const role of rolesWithPermissions) {
        const permissions = await query<Permission>(
          `SELECT p.*
           FROM RolePermissions rp
           INNER JOIN Permissions p ON rp.PermissionId = p.Id
           WHERE rp.RoleId = @roleId
           ORDER BY p.Name`,
          { roleId: role.Id }
        );
        role.Permissions = permissions;
      }
    }

    await logSuccess(adminUserId, 'admin', 'list_roles', 'roles', undefined,
      { includePermissions }, ipAddress, userAgent);

    return ok({
      data: rolesWithPermissions,
      total: roles.length
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'list_roles', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * POST /api/v1/admin/roles - Create new role
 */
async function createRole(req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: CreateRoleRequest;
  try {
    body = await req.json() as CreateRoleRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  const validation = validateRoleName(body.Name);
  if (!validation.valid) {
    return fail("validation_error", validation.error!, 422);
  }

  try {
    // Check if role name already exists
    const existingRoles = await query<Role>(
      "SELECT * FROM Roles WHERE Name = @name",
      { name: body.Name }
    );

    if (existingRoles.length > 0) {
      await logFailure(adminUserId, 'admin', 'create_role', 'roles',
        'Role name already exists', undefined,
        { name: body.Name }, ipAddress, userAgent);
      return fail("duplicate_role", "Role with this name already exists", 409);
    }

    const result = await query<Role>(
      `INSERT INTO Roles (Name, Description, CreatedAt, UpdatedAt)
       OUTPUT INSERTED.*
       VALUES (@name, @description, GETUTCDATE(), GETUTCDATE())`,
      {
        name: body.Name,
        description: body.Description || null
      }
    );

    const newRole = result[0];

    await logSuccess(adminUserId, 'admin', 'create_role', 'roles', newRole.Id,
      { name: body.Name, description: body.Description }, ipAddress, userAgent);

    return ok(newRole, 201);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'create_role', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, { name: body.Name }, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/roles/:id - Get role details with permissions
 */
async function getRoleById(roleId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    const roles = await query<Role>(
      "SELECT * FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    if (roles.length === 0) {
      await logFailure(adminUserId, 'admin', 'get_role', 'roles',
        'Role not found', roleId, undefined, ipAddress, userAgent);
      return fail("not_found", "Role not found", 404);
    }

    const role = roles[0];

    // Get permissions for the role
    const permissions = await query<Permission>(
      `SELECT p.*
       FROM RolePermissions rp
       INNER JOIN Permissions p ON rp.PermissionId = p.Id
       WHERE rp.RoleId = @roleId
       ORDER BY p.Name`,
      { roleId }
    );

    await logSuccess(adminUserId, 'admin', 'get_role', 'roles', roleId,
      undefined, ipAddress, userAgent);

    return ok({
      ...role,
      Permissions: permissions
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'get_role', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      roleId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * PATCH /api/v1/admin/roles/:id - Update role
 */
async function updateRole(roleId: string, req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: UpdateRoleRequest;
  try {
    body = await req.json() as UpdateRoleRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  if (!body.Name && !body.Description) {
    return fail("validation_error", "At least one field (Name or Description) is required", 422);
  }

  if (body.Name) {
    const validation = validateRoleName(body.Name);
    if (!validation.valid) {
      return fail("validation_error", validation.error!, 422);
    }
  }

  try {
    // Check if role exists
    const existingRoles = await query<Role>(
      "SELECT * FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    if (existingRoles.length === 0) {
      await logFailure(adminUserId, 'admin', 'update_role', 'roles',
        'Role not found', roleId, body, ipAddress, userAgent);
      return fail("not_found", "Role not found", 404);
    }

    const existingRole = existingRoles[0];

    // Prevent updating default roles' names
    if (DEFAULT_ROLES.includes(existingRole.Name) && body.Name && body.Name !== existingRole.Name) {
      await logFailure(adminUserId, 'admin', 'update_role', 'roles',
        'Cannot rename default role', roleId, body, ipAddress, userAgent);
      return fail("forbidden", "Cannot rename default system roles", 403);
    }

    // Check if new name already exists
    if (body.Name && body.Name !== existingRole.Name) {
      const duplicateRoles = await query<Role>(
        "SELECT * FROM Roles WHERE Name = @name AND Id != @roleId",
        { name: body.Name, roleId }
      );

      if (duplicateRoles.length > 0) {
        await logFailure(adminUserId, 'admin', 'update_role', 'roles',
          'Role name already exists', roleId, body, ipAddress, userAgent);
        return fail("duplicate_role", "Role with this name already exists", 409);
      }
    }

    const allowedFields = ['Name', 'Description'];
    const updates: string[] = [];
    const params: Record<string, any> = { roleId };

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = @${key}`);
        params[key] = (body as any)[key];
      }
    });

    if (updates.length === 0) {
      return fail("validation_error", "No valid fields to update", 422);
    }

    await query(
      `UPDATE Roles SET ${updates.join(', ')}, UpdatedAt = GETUTCDATE() WHERE Id = @roleId`,
      params
    );

    const updatedRoles = await query<Role>("SELECT * FROM Roles WHERE Id = @roleId", { roleId });

    await logSuccess(adminUserId, 'admin', 'update_role', 'roles', roleId,
      body, ipAddress, userAgent);

    return ok(updatedRoles[0]);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'update_role', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      roleId, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * DELETE /api/v1/admin/roles/:id - Delete role
 */
async function deleteRole(roleId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check if role exists
    const existingRoles = await query<Role>(
      "SELECT * FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    if (existingRoles.length === 0) {
      await logFailure(adminUserId, 'admin', 'delete_role', 'roles',
        'Role not found', roleId, undefined, ipAddress, userAgent);
      return fail("not_found", "Role not found", 404);
    }

    const role = existingRoles[0];

    // Prevent deletion of default roles
    if (DEFAULT_ROLES.includes(role.Name)) {
      await logFailure(adminUserId, 'admin', 'delete_role', 'roles',
        'Cannot delete default role', roleId, undefined, ipAddress, userAgent);
      return fail("forbidden", "Cannot delete default system roles", 403);
    }

    // Check if any users have this role
    const userRoles = await query<{ Count: number }>(
      "SELECT COUNT(*) as Count FROM UserRoles WHERE RoleId = @roleId",
      { roleId }
    );

    if (userRoles.length > 0 && userRoles[0].Count > 0) {
      await logFailure(adminUserId, 'admin', 'delete_role', 'roles',
        'Role is assigned to users', roleId,
        { userCount: userRoles[0].Count }, ipAddress, userAgent);
      return fail("conflict", `Cannot delete role: ${userRoles[0].Count} user(s) have this role`, 409);
    }

    // Delete the role (cascade will remove RolePermissions entries)
    await query(
      "DELETE FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    await logSuccess(adminUserId, 'admin', 'delete_role', 'roles', roleId,
      { roleName: role.Name }, ipAddress, userAgent);

    return ok({ message: "Role deleted successfully" });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'delete_role', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      roleId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/roles/:id/permissions - Get all permissions for a role
 */
async function getRolePermissions(roleId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check if role exists
    const roles = await query<Role>(
      "SELECT * FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    if (roles.length === 0) {
      await logFailure(adminUserId, 'admin', 'get_role_permissions', 'roles',
        'Role not found', roleId, undefined, ipAddress, userAgent);
      return fail("not_found", "Role not found", 404);
    }

    const permissions = await query<Permission>(
      `SELECT p.*
       FROM RolePermissions rp
       INNER JOIN Permissions p ON rp.PermissionId = p.Id
       WHERE rp.RoleId = @roleId
       ORDER BY p.Name`,
      { roleId }
    );

    await logSuccess(adminUserId, 'admin', 'get_role_permissions', 'roles', roleId,
      undefined, ipAddress, userAgent);

    return ok({
      data: permissions,
      total: permissions.length
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'get_role_permissions', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      roleId, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * POST /api/v1/admin/roles/:id/permissions - Add permission to role
 */
async function addPermissionToRole(roleId: string, req: HttpRequest, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  let body: AddPermissionRequest;
  try {
    body = await req.json() as AddPermissionRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  if (!body.permissionId || typeof body.permissionId !== 'string') {
    return fail("validation_error", "Permission ID is required", 422);
  }

  try {
    // Check if role exists
    const roles = await query<Role>(
      "SELECT * FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    if (roles.length === 0) {
      await logFailure(adminUserId, 'admin', 'add_permission_to_role', 'roles',
        'Role not found', roleId, body, ipAddress, userAgent);
      return fail("not_found", "Role not found", 404);
    }

    // Check if permission exists
    const permissions = await query<Permission>(
      "SELECT * FROM Permissions WHERE Id = @permissionId",
      { permissionId: body.permissionId }
    );

    if (permissions.length === 0) {
      await logFailure(adminUserId, 'admin', 'add_permission_to_role', 'roles',
        'Permission not found', roleId, body, ipAddress, userAgent);
      return fail("not_found", "Permission not found", 404);
    }

    const permission = permissions[0];

    // Check if already assigned
    const existingAssignments = await query<{ Count: number }>(
      "SELECT COUNT(*) as Count FROM RolePermissions WHERE RoleId = @roleId AND PermissionId = @permissionId",
      { roleId, permissionId: body.permissionId }
    );

    if (existingAssignments.length > 0 && existingAssignments[0].Count > 0) {
      return fail("conflict", "Permission already assigned to role", 409);
    }

    // Add permission to role
    await query(
      "INSERT INTO RolePermissions (RoleId, PermissionId) VALUES (@roleId, @permissionId)",
      { roleId, permissionId: body.permissionId }
    );

    await logSuccess(adminUserId, 'admin', 'add_permission_to_role', 'roles', roleId,
      { permissionId: body.permissionId, permissionName: permission.Name }, ipAddress, userAgent);

    return ok({
      message: "Permission added to role successfully",
      permission
    }, 201);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'add_permission_to_role', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      roleId, body, ipAddress, userAgent);
    throw error;
  }
}

/**
 * DELETE /api/v1/admin/roles/:id/permissions/:permId - Remove permission from role
 */
async function removePermissionFromRole(roleId: string, permissionId: string, adminUserId: string, ipAddress?: string, userAgent?: string): Promise<HttpResponseInit> {
  try {
    // Check if role exists
    const roles = await query<Role>(
      "SELECT * FROM Roles WHERE Id = @roleId",
      { roleId }
    );

    if (roles.length === 0) {
      await logFailure(adminUserId, 'admin', 'remove_permission_from_role', 'roles',
        'Role not found', roleId, { permissionId }, ipAddress, userAgent);
      return fail("not_found", "Role not found", 404);
    }

    const role = roles[0];

    // Prevent removing permissions from admin role
    if (role.Name === 'admin') {
      await logFailure(adminUserId, 'admin', 'remove_permission_from_role', 'roles',
        'Cannot modify admin role permissions', roleId, { permissionId }, ipAddress, userAgent);
      return fail("forbidden", "Cannot remove permissions from admin role", 403);
    }

    // Check if permission exists
    const permissions = await query<Permission>(
      "SELECT * FROM Permissions WHERE Id = @permissionId",
      { permissionId }
    );

    if (permissions.length === 0) {
      await logFailure(adminUserId, 'admin', 'remove_permission_from_role', 'roles',
        'Permission not found', roleId, { permissionId }, ipAddress, userAgent);
      return fail("not_found", "Permission not found", 404);
    }

    // Check if assignment exists
    const existingAssignments = await query<{ Count: number }>(
      "SELECT COUNT(*) as Count FROM RolePermissions WHERE RoleId = @roleId AND PermissionId = @permissionId",
      { roleId, permissionId }
    );

    if (existingAssignments.length === 0 || existingAssignments[0].Count === 0) {
      await logFailure(adminUserId, 'admin', 'remove_permission_from_role', 'roles',
        'Permission not assigned to role', roleId, { permissionId }, ipAddress, userAgent);
      return fail("not_found", "Permission not assigned to this role", 404);
    }

    // Remove permission from role
    await query(
      "DELETE FROM RolePermissions WHERE RoleId = @roleId AND PermissionId = @permissionId",
      { roleId, permissionId }
    );

    await logSuccess(adminUserId, 'admin', 'remove_permission_from_role', 'roles', roleId,
      { permissionId, permissionName: permissions[0].Name }, ipAddress, userAgent);

    return ok({ message: "Permission removed from role successfully" });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'remove_permission_from_role', 'roles',
      error instanceof Error ? error.message : 'Unknown error',
      roleId, { permissionId }, ipAddress, userAgent);
    throw error;
  }
}

/**
 * Main handler for admin roles endpoint
 */
export async function adminRoles(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

  // Check for roles.manage permission
  const hasRoleManagePermission = await hasPermission(adminUserId, 'roles.manage');
  if (!hasRoleManagePermission) {
    await logFailure(adminUserId, 'user', 'admin_access_denied', 'roles',
      'Insufficient permissions - roles.manage required', undefined, undefined,
      req.headers.get('x-forwarded-for') || undefined,
      req.headers.get('user-agent') || undefined);
    return fail("forbidden", "Insufficient permissions: roles.manage required", 403);
  }

  const method = req.method?.toUpperCase();
  const ipAddress = req.headers.get('x-forwarded-for') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    // Parse route params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    // pathParts: ['api', 'v1', 'admin', 'roles', ...rest]
    
    const roleId = pathParts[4]; // ID after /api/v1/admin/roles/
    const subResource = pathParts[5]; // e.g., 'permissions'
    const permissionId = pathParts[6]; // Permission ID for DELETE

    if (method === "GET") {
      if (!roleId) {
        return await listRoles(req, adminUserId, ipAddress, userAgent);
      }
      if (roleId && subResource === 'permissions') {
        return await getRolePermissions(roleId, adminUserId, ipAddress, userAgent);
      }
      return await getRoleById(roleId, adminUserId, ipAddress, userAgent);
    }

    if (method === "POST") {
      if (roleId && subResource === 'permissions') {
        return await addPermissionToRole(roleId, req, adminUserId, ipAddress, userAgent);
      }
      if (!roleId) {
        return await createRole(req, adminUserId, ipAddress, userAgent);
      }
      return fail("not_found", "Endpoint not found", 404);
    }

    if (method === "PATCH") {
      if (!roleId) {
        return fail("bad_request", "Role ID required", 400);
      }
      return await updateRole(roleId, req, adminUserId, ipAddress, userAgent);
    }

    if (method === "DELETE") {
      if (roleId && subResource === 'permissions' && permissionId) {
        return await removePermissionFromRole(roleId, permissionId, adminUserId, ipAddress, userAgent);
      }
      if (roleId && !subResource) {
        return await deleteRole(roleId, adminUserId, ipAddress, userAgent);
      }
      return fail("bad_request", "Invalid DELETE request", 400);
    }

    return fail("method_not_allowed", "Unsupported method", 405);
  } catch (error) {
    context.error('Error in adminRoles handler:', error);
    return fail(
      "internal_error",
      "An internal error occurred",
      500,
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

app.http("admin-roles", {
  methods: ["GET", "POST", "PATCH", "DELETE"],
  authLevel: "anonymous",
  route: "v1/admin/roles/{*restOfPath}",
  handler: adminRoles
});
