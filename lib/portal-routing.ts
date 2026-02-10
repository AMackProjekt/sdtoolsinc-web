/**
 * Portal Routing Logic
 * Determines which portal a user should access based on their role and email
 */

import type { AuthRole, UserProfile } from "@/lib/hooks/useAuth";

export interface PortalConfig {
  portalUrl: string;
  portalName: string;
  allowedRoles: AuthRole[];
  emailPattern?: RegExp;
  description: string;
}

// Runtime environment-aware portal URLs using NEXT_PUBLIC_ variables
// These are evaluated at runtime and can be different per deployment environment
const PORTAL_URLS = {
  client: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || "http://localhost:3001",
  casemgr: process.env.NEXT_PUBLIC_CASEMGR_PORTAL_URL || "http://localhost:3002",
  admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "http://localhost:3003",
};

export const PORTAL_CONFIG: Record<string, PortalConfig> = {
  client: {
    portalUrl: PORTAL_URLS.client,
    portalName: "Client Portal",
    allowedRoles: ["client"],
    description: "Access your dashboard, courses, and profile",
  },
  casemgr: {
    portalUrl: PORTAL_URLS.casemgr,
    portalName: "Case Manager Portal",
    allowedRoles: ["case_manager"],
    emailPattern: /@sdtoolsinc\.org$/,
    description: "Manage cases, clients, and outcomes",
  },
  admin: {
    portalUrl: PORTAL_URLS.admin,
    portalName: "Admin Portal",
    allowedRoles: ["admin"],
    // Removed email restriction - any user with admin role can access
    description: "System administration and configuration",
  },
};

/**
 * Determine the appropriate portal URL based on user profile
 */
export function getPortalUrlForUser(
  profile: UserProfile,
  userEmail: string
): { portalUrl: string; portalName: string } | null {
  const role = profile.role as AuthRole;

  // Admin portal - allow any admin role
  if (role === "admin") {
    return {
      portalUrl: PORTAL_CONFIG.admin.portalUrl,
      portalName: PORTAL_CONFIG.admin.portalName,
    };
  }

  // Case Manager portal - check email domain
  if (role === "case_manager" && userEmail.endsWith("@sdtoolsinc.org")) {
    return {
      portalUrl: PORTAL_CONFIG.casemgr.portalUrl,
      portalName: PORTAL_CONFIG.casemgr.portalName,
    };
  }

  // Client portal
  if (role === "client") {
    return {
      portalUrl: PORTAL_CONFIG.client.portalUrl,
      portalName: PORTAL_CONFIG.client.portalName,
    };
  }

  return null;
}

/**
 * Check if user is authorized to access a specific portal
 */
export function canAccessPortal(
  profile: UserProfile,
  userEmail: string,
  portalKey: string
): boolean {
  const portalConfig = PORTAL_CONFIG[portalKey];
  if (!portalConfig) return false;

  const role = profile.role as AuthRole;

  // Check role
  if (!portalConfig.allowedRoles.includes(role)) {
    return false;
  }

  // Check email pattern if required
  if (portalConfig.emailPattern) {
    return portalConfig.emailPattern.test(userEmail);
  }

  return true;
}

/**
 * Get a list of accessible portals for a user
 */
export function getAccessiblePortals(
  profile: UserProfile,
  userEmail: string
): Array<{ key: string; config: PortalConfig }> {
  return Object.entries(PORTAL_CONFIG)
    .filter(([key]) => canAccessPortal(profile, userEmail, key))
    .map(([key, config]) => ({ key, config }));
}

/**
 * Redirect user to their appropriate portal post-login
 */
export function redirectToPortal(
  profile: UserProfile,
  userEmail: string
): boolean {
  const portalInfo = getPortalUrlForUser(profile, userEmail);

  if (!portalInfo) {
    return false;
  }

  // Redirect to the portal
  window.location.href = portalInfo.portalUrl;
  return true;
}

/**
 * Get the current portal host
 */
export function getCurrentPortal(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;

  if (hostname.includes("3001")) return "client";
  if (hostname.includes("3002")) return "casemgr";
  if (hostname.includes("3003")) return "admin";
  if (hostname.includes("sdtoolsinc")) return "main";

  return "";
}

/**
 * Role-based display names
 */
export const ROLE_DISPLAY: Record<AuthRole, string> = {
  admin: "Administrator",
  case_manager: "Case Manager",
  client: "Client",
};
