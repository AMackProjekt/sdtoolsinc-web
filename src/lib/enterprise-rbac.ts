import { can } from "./policy";
import type { EnterpriseRole, CoreRole } from "./authz";
import type { PolicyResource, PolicyAction } from "./policy";

/**
 * Role definitions and access requirements for each enterprise suite.
 * Used for page-level and component-level role checks.
 */
export const ENTERPRISE_ROLE_CONFIG = {
  executive: {
    label: "Executive Command",
    requiredRoles: ["executive"] as EnterpriseRole[],
    fallbackRoles: ["admin", "staff"] as (CoreRole | EnterpriseRole)[],
    description: "Portfolio scorecards, executive actions, cross-suite coordination",
  },
  hr: {
    label: "HR Operations",
    requiredRoles: ["hr-staff"] as EnterpriseRole[],
    fallbackRoles: ["admin", "staff"] as (CoreRole | EnterpriseRole)[],
    description: "Workforce planning, onboarding, policy compliance",
  },
  newsroom: {
    label: "News & Media Kit",
    requiredRoles: ["newsroom-contributor", "newsroom-editor"] as EnterpriseRole[],
    fallbackRoles: ["admin", "staff"] as (CoreRole | EnterpriseRole)[],
    description: "Press releases, media assets, external messaging",
  },
};

/**
 * Server-side: Check if the current user has access to an enterprise suite.
 * Returns { allowed: true } or { allowed: false; status: 403; error: string }
 *
 * Usage in API routes:
 *   const auth = await getAuthContext();
 *   const check = await enforceEnterpriseAccess("executive", auth.coreRole, auth.enterpriseRoles);
 *   if (!check.allowed) return NextResponse.json(check, { status: check.status });
 */
export async function enforceEnterpriseAccess(
  suite: keyof typeof ENTERPRISE_ROLE_CONFIG,
  coreRole: CoreRole,
  enterpriseRoles: EnterpriseRole[]
): Promise<{ allowed: true } | { allowed: false; status: 403; error: string }> {
  const config = ENTERPRISE_ROLE_CONFIG[suite];

  // Admin always has access
  if (coreRole === "admin") return { allowed: true };

  // Check if user has required enterprise role or fallback role
  const allRoles = [coreRole, ...enterpriseRoles] as (CoreRole | EnterpriseRole)[];
  const hasRequiredRole = allRoles.some((r) =>
    config.requiredRoles.includes(r as EnterpriseRole) || config.fallbackRoles.includes(r)
  );

  if (!hasRequiredRole) {
    return {
      allowed: false,
      status: 403,
      error: `Access denied. ${config.label} requires one of: ${[...config.requiredRoles, ...config.fallbackRoles].join(", ")}`,
    };
  }

  return { allowed: true };
}

/**
 * Client-side: Check if the current user can access an enterprise suite.
 * Used in React components for conditional rendering.
 *
 * Usage in components:
 *   const auth = await getAuthContext();
 *   const canViewExecutive = checkEnterpriseAccess("executive", auth.coreRole, auth.enterpriseRoles);
 *   if (!canViewExecutive) return <AccessDenied suite="Executive Command" />;
 */
export function checkEnterpriseAccess(
  suite: keyof typeof ENTERPRISE_ROLE_CONFIG,
  coreRole: CoreRole,
  enterpriseRoles: EnterpriseRole[]
): boolean {
  const config = ENTERPRISE_ROLE_CONFIG[suite];

  // Admin always has access
  if (coreRole === "admin") return true;

  // Check if user has required enterprise role or fallback role
  const allRoles = [coreRole, ...enterpriseRoles] as (CoreRole | EnterpriseRole)[];
  return allRoles.some((r) =>
    config.requiredRoles.includes(r as EnterpriseRole) || config.fallbackRoles.includes(r)
  );
}

/**
 * Server-side policy check using the policy framework.
 * Used in API routes that need to validate write operations.
 *
 * Usage:
 *   const auth = await getAuthContext();
 *   const result = checkEnterprisePolicy(auth.allRoles, "enterprise-hr", "write");
 *   if (!result.allowed) return NextResponse.json(result, { status: result.status });
 */
export function checkEnterprisePolicy(
  userRoles: (CoreRole | EnterpriseRole)[],
  resource: PolicyResource,
  action: PolicyAction
): { allowed: true } | { allowed: false; status: 403; error: string } {
  // Check if ANY of the user's roles allow this action
  for (const role of userRoles) {
    if (can(role, resource, action)) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    status: 403,
    error: `Your roles do not permit '${action}' on '${resource}'`,
  };
}

/**
 * Get a user-friendly error message for access denied scenarios.
 */
export function getAccessDeniedMessage(
  suite: keyof typeof ENTERPRISE_ROLE_CONFIG
): string {
  const config = ENTERPRISE_ROLE_CONFIG[suite];
  const requiredRolesText = config.requiredRoles.join(", ");
  return `You don't have access to ${config.label}. Required role(s): ${requiredRolesText}`;
}
