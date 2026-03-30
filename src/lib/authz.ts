import { auth } from "@/auth";

/**
 * Core role hierarchy: admin > staff > client
 * Enterprise roles: executive, hr-staff, newsroom-contributor, newsroom-editor
 *
 * Users can have multiple roles. Enterprise roles are additive (e.g., admin can also be executive).
 */
export type CoreRole = "staff" | "client" | "admin";
export type EnterpriseRole = "executive" | "hr-staff" | "newsroom-contributor" | "newsroom-editor";
export type AppRole = CoreRole | EnterpriseRole;

export async function getAuthContext() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  const coreRole = (session?.user?.role as CoreRole | undefined) ?? "client";
  const enterpriseRoles = (session?.user?.enterpriseRoles as EnterpriseRole[] | undefined) ?? [];
  
  return {
    session,
    email,
    coreRole,
    enterpriseRoles,
    allRoles: [coreRole, ...enterpriseRoles] as AppRole[],
    isAuthenticated: Boolean(email),
  };
}

/**
 * Returns true if the caller's core role satisfies the required minimum role.
 * Hierarchy: admin > staff > client
 */
export function hasRole(required: CoreRole, role: CoreRole): boolean {
  if (required === "client") return true; // everyone qualifies
  if (required === "staff") return role === "staff" || role === "admin";
  if (required === "admin") return role === "admin";
  return false;
}

/**
 * Returns true if the caller has at least one of the given enterprise roles.
 */
export function hasEnterpriseRole(required: EnterpriseRole[], userRoles: EnterpriseRole[]): boolean {
  if (!required.length) return true; // no specific role required
  return required.some((r) => userRoles.includes(r));
}
