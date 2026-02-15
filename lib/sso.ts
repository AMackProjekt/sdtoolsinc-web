/**
 * Single Sign-On (SSO) Utilities
 * Handles token transfer between main site and portal applications
 */

import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/lib/hooks/useAuth";

/**
 * Get SSO token from current Supabase session
 * This token can be passed to portals for seamless authentication
 */
export async function getSSOToken(): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return session.access_token;
    }
    return null;
  } catch (error) {
    console.error("Failed to get SSO token:", error);
    return null;
  }
}

/**
 * Get the appropriate portal URL based on user role
 * Includes SSO token as query parameter for automatic authentication
 */
export async function getPortalRedirectUrl(profile: UserProfile | null): Promise<string | null> {
  if (!profile) return null;

  const token = await getSSOToken();
  const tokenParam = token ? `?sso_token=${encodeURIComponent(token)}` : "";

  // Portal URLs from environment or fallback to Azure SWA URLs
  const portalUrls = {
    client: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || "https://toolsinc-client-portal.azurestaticapps.net",
    casemgr: process.env.NEXT_PUBLIC_CASEMGR_PORTAL_URL || "https://toolsinc-casemgr-portal.azurestaticapps.net",
    admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "https://toolsinc-admin-portal.azurestaticapps.net",
  };

  switch (profile.role) {
    case "admin":
      return `${portalUrls.admin}/dashboard${tokenParam}`;
    case "case_manager":
      return `${portalUrls.casemgr}/dashboard${tokenParam}`;
    case "client":
      return `${portalUrls.client}/dashboard${tokenParam}`;
    default:
      return `${portalUrls.client}/dashboard${tokenParam}`;
  }
}

/**
 * Restore session from SSO token (for portals)
 * Call this in portal applications when ?sso_token is present in URL
 */
export async function restoreSessionFromToken(token: string): Promise<boolean> {
  try {
    // Set the session with the provided token
    const { error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token, // Note: This should ideally be separate
    });

    if (error) {
      console.error("Failed to restore session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error restoring session from token:", error);
    return false;
  }
}

/**
 * Check if SSO token is present in URL and restore session if available
 */
export function checkAndRestoreSSOToken(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const token = params.get("sso_token");

  if (token) {
    // Remove token from URL to keep it clean
    const url = new URL(window.location);
    url.searchParams.delete("sso_token");
    window.history.replaceState({}, document.title, url.toString());

    return token;
  }

  return null;
}
