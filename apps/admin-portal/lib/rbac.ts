// Client-side RBAC utilities for admin portal

export const PERMISSIONS = {
  // User management
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLE: 'users.assign_role',
  
  // Client management
  CLIENTS_CREATE: 'clients.create',
  CLIENTS_READ: 'clients.read',
  CLIENTS_UPDATE: 'clients.update',
  CLIENTS_DELETE: 'clients.delete',
  CLIENTS_ASSIGN: 'clients.assign',
  
  // Case manager management
  CASE_MANAGERS_CREATE: 'case_managers.create',
  CASE_MANAGERS_READ: 'case_managers.read',
  CASE_MANAGERS_UPDATE: 'case_managers.update',
  CASE_MANAGERS_DELETE: 'case_managers.delete',
  
  // Audit
  AUDIT_READ: 'audit.read',
  AUDIT_EXPORT: 'audit.export',
  AUDIT_DELETE: 'audit.delete',
  
  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  
  // Settings
  SETTINGS_READ: 'settings.read',
  SETTINGS_UPDATE: 'settings.update',
  ROLES_MANAGE: 'roles.manage',
} as const;

export const RESOURCES = {
  USERS: 'users',
  CLIENTS: 'clients',
  CASE_MANAGERS: 'case_managers',
  AUDIT: 'audit',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  ROLES: 'roles',
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  ASSIGN: 'assign',
  EXPORT: 'export',
  MANAGE: 'manage',
} as const;

/**
 * Check if user has permission (client-side check)
 * For server-side checks, use API/backend RBAC
 */
export function hasPermission(userPermissions: string[], permission: string): boolean {
  return userPermissions.includes(permission);
}

/**
 * Check if user has any of the given permissions
 */
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * Check if user has all of the given permissions
 */
export function hasAllPermissions(userPermissions: string[], permissions: string[]): boolean {
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * Check if user can perform action on resource
 */
export function canAccess(
  userPermissions: string[],
  resource: string,
  action: string
): boolean {
  const permission = `${resource}.${action}`;
  return userPermissions.includes(permission);
}

/**
 * Filter items based on permission
 */
export function filterByPermission<T>(
  items: T[],
  userPermissions: string[],
  getRequiredPermission: (item: T) => string
): T[] {
  return items.filter(item => {
    const permission = getRequiredPermission(item);
    return userPermissions.includes(permission);
  });
}

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type Resource = typeof RESOURCES[keyof typeof RESOURCES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];
