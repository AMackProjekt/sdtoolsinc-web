/**
 * Check if user has access to specific portal based on roles
 */
export function checkUserAccess(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role))
}

/**
 * Get user's highest privilege level
 */
export function getUserPrivilegeLevel(userRoles: string[]): 'admin' | 'staff' | 'client' | 'none' {
  if (userRoles.includes('admin')) return 'admin'
  if (userRoles.includes('case_manager')) return 'staff'
  if (userRoles.includes('client')) return 'client'
  return 'none'
}
