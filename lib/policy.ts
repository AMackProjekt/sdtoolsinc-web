import type { CoreRole, EnterpriseRole } from "./authz";

/**
 * Actions a caller can attempt on a resource.
 */
export type PolicyAction = "read" | "write" | "execute" | "admin";

/**
 * Named resources that have explicit policy rules.
 *
 * Core resources govern standard app features.
 * Enterprise resources govern executive, HR, and newsroom suites.
 */
export type PolicyResource =
  | "secure-data"       // /api/secure-data/[key]        — encrypted user records
  | "secure-data:notes" // specific per-key overrides (inherits "secure-data" if absent)
  | "secure-data:docs"
  | "secure-data:journals"
  | "secure-data:feedback"
  | "secure-data:shoutouts"
  | "secure-data:smartgoals"
  | "secure-data:requests"
  | "terminal"          // /api/terminal                 — command execution
  | "enterprise-control" // /api/enterprise/control-center — enterprise control plane
  | "compliance"        // /api/admin/compliance         — full compliance status (staff only)
  | "compliance-summary" // /api/compliance/status       — safe summary for any auth'd user
  | "audit-log"         // /api/admin/audit              — audit trail review
  | "enterprise-executive" // /portal/enterprise/executive — executive command suite
  | "enterprise-hr"     // /portal/enterprise/hr         — HR operations suite
  | "enterprise-newsroom"; // /portal/enterprise/newsroom — news & media kit suite

interface PolicyRule {
  roles: (CoreRole | EnterpriseRole)[];
  actions: PolicyAction[];
}

/**
 * Top-level policy map.
 *
 * Admin always has full access — the admin role check is enforced in middleware,
 * but we include admin in every rule so can() / enforce() work correctly for
 * server-side policy checks inside route handlers.
 *
 * Enterprise resources grant access to users with matching enterprise roles OR admin role.
 */
const POLICIES: Record<PolicyResource, PolicyRule[]> = {
  "secure-data": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],

  "secure-data:feedback": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["write"] },
  ],
  "secure-data:shoutouts": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["write"] },
  ],
  
  // Other secure-data subtypes inherit from "secure-data" base rules (see can() function)
  "secure-data:docs": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],
  "secure-data:notes": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],
  "secure-data:journals": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],
  "secure-data:smartgoals": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],
  "secure-data:requests": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],

  "terminal": [
    { roles: ["admin"], actions: ["execute", "admin"] },
    { roles: ["staff"], actions: ["execute"] },
  ],

  "enterprise-control": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
  ],

  "compliance": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "admin"] },
  ],

  "compliance-summary": [
    { roles: ["admin"], actions: ["read"] },
    { roles: ["staff"], actions: ["read"] },
    { roles: ["client"], actions: ["read"] },
  ],

  "audit-log": [
    { roles: ["admin"], actions: ["read", "admin"] },
    { roles: ["staff"], actions: ["read"] },
  ],

  "enterprise-executive": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["executive"], actions: ["read", "write"] },
    { roles: ["staff"], actions: ["read"] },
  ],

  "enterprise-hr": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["hr-staff"], actions: ["read", "write"] },
    { roles: ["staff"], actions: ["read"] },
  ],

  "enterprise-newsroom": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["newsroom-contributor"], actions: ["read", "write"] },
    { roles: ["newsroom-editor"], actions: ["read", "write"] },
    { roles: ["staff"], actions: ["read"] },
  ],
};

/**
 * Returns true if the given role is permitted to perform `action` on `resource`.
 *
 * Falls back from "secure-data:{key}" → "secure-data" if no specific rule exists.
 */
export function can(role: CoreRole | EnterpriseRole, resource: PolicyResource, action: PolicyAction): boolean {
  // Admin bypasses all policy checks
  if (role === "admin") return true;
  const rules = POLICIES[resource] ?? POLICIES[resource.split(":")[0] as PolicyResource];
  if (!rules) return false;
  return rules.some(
    (rule) => rule.roles.includes(role) && rule.actions.includes(action)
  );
}

/**
 * Convenience: throws a structured error object if access is denied.
 * Use in API routes after retrieving auth roles.
 */
export function enforce(
  role: CoreRole | EnterpriseRole,
  resource: PolicyResource,
  action: PolicyAction
): { allowed: true } | { allowed: false; status: 403; error: string } {
  if (can(role, resource, action)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    status: 403,
    error: `Role '${role}' is not permitted to perform '${action}' on '${resource}'`,
  };
}
