import { query } from './database';

export interface Permission {
  Id: string;
  Name: string;
  Resource: string;
  Action: string;
  Description: string;
}

export interface Role {
  Id: string;
  Name: string;
  Description: string;
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const results = await query<{ Count: number }>(
    `SELECT COUNT(*) as Count
     FROM UserRoles ur
     INNER JOIN RolePermissions rp ON ur.RoleId = rp.RoleId
     INNER JOIN Permissions p ON rp.PermissionId = p.Id
     WHERE ur.UserId = @userId AND p.Name = @permissionName`,
    { userId, permissionName }
  );
  
  return results.length > 0 && results[0].Count > 0;
}

/**
 * Check if a user has a specific role
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const results = await query<{ Count: number }>(
    `SELECT COUNT(*) as Count
     FROM UserRoles ur
     INNER JOIN Roles r ON ur.RoleId = r.Id
     WHERE ur.UserId = @userId AND r.Name = @roleName`,
    { userId, roleName }
  );
  
  return results.length > 0 && results[0].Count > 0;
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  return query<Permission>(
    `SELECT DISTINCT p.*
     FROM UserRoles ur
     INNER JOIN RolePermissions rp ON ur.RoleId = rp.RoleId
     INNER JOIN Permissions p ON rp.PermissionId = p.Id
     WHERE ur.UserId = @userId`,
    { userId }
  );
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
  return query<Role>(
    `SELECT r.*
     FROM UserRoles ur
     INNER JOIN Roles r ON ur.RoleId = r.Id
     WHERE ur.UserId = @userId`,
    { userId }
  );
}

/**
 * Check if a user can perform an action on a resource
 */
export async function canAccess(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const results = await query<{ Count: number }>(
    `SELECT COUNT(*) as Count
     FROM UserRoles ur
     INNER JOIN RolePermissions rp ON ur.RoleId = rp.RoleId
     INNER JOIN Permissions p ON rp.PermissionId = p.Id
     WHERE ur.UserId = @userId 
       AND p.Resource = @resource 
       AND p.Action = @action`,
    { userId, resource, action }
  );
  
  return results.length > 0 && results[0].Count > 0;
}

/**
 * Assign a role to a user
 */
export async function assignRole(
  userId: string,
  roleId: string,
  assignedBy: string
): Promise<void> {
  await query(
    `IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @userId AND RoleId = @roleId)
     BEGIN
       INSERT INTO UserRoles (UserId, RoleId, AssignedBy, AssignedAt)
       VALUES (@userId, @roleId, @assignedBy, GETDATE())
     END`,
    { userId, roleId, assignedBy }
  );
}

/**
 * Remove a role from a user
 */
export async function removeRole(userId: string, roleId: string): Promise<void> {
  await query(
    `DELETE FROM UserRoles WHERE UserId = @userId AND RoleId = @roleId`,
    { userId, roleId }
  );
}

/**
 * Get role by name
 */
export async function getRoleByName(roleName: string): Promise<Role | null> {
  const results = await query<Role>(
    `SELECT * FROM Roles WHERE Name = @roleName`,
    { roleName }
  );
  return results.length > 0 ? results[0] : null;
}
