"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getPortalUrlForUser,
  canAccessPortal,
  getCurrentPortal,
} from "@/lib/portal-routing";

interface PortalGuardProps {
  requiredRole?: "client" | "case_manager" | "admin";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PortalGuard Component
 * Protects portal pages and ensures users have proper access
 * Redirects to appropriate portal if user is logged in but accessing wrong portal
 */
export function PortalGuard({
  requiredRole,
  children,
  fallback,
}: PortalGuardProps) {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user || !profile) {
      router.push("/auth/login");
      return;
    }

    // If required role is specified, check access
    if (requiredRole) {
      const portalKey =
        requiredRole === "case_manager" ? "casemgr" : requiredRole;
      const hasAccess = canAccessPortal(profile, user.email || "", portalKey);

      if (!hasAccess) {
        // Try to get correct portal for this user
        const correctPortal = getPortalUrlForUser(profile, user.email || "");
        if (correctPortal) {
          // Redirect to correct portal
          window.location.href = correctPortal.portalUrl;
          return;
        } else {
          // No valid portal for this user
          setAccessDenied(true);
          setIsValidating(false);
          return;
        }
      }
    }

    setIsValidating(false);
  }, [isAuthenticated, user, profile, isLoading, requiredRole, router]);

  if (isLoading || isValidating) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-muted">Validating access...</p>
          </div>
        </div>
      )
    );
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-2">
            Access Denied
          </h1>
          <p className="text-muted mb-4">
            Your account does not have access to this portal.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand2 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * RedirectGuard Component
 * Automatically redirects to the correct portal after login
 */
export function RedirectGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoading || isProcessing) return;

    // Only redirect if user just authenticated
    if (isAuthenticated && user && profile) {
      // Check if we're already in a portal (not on main site)
      const currentPortal = getCurrentPortal();
      if (currentPortal && currentPortal !== "main") {
        return; // Already in correct portal or a portal
      }

      // Redirect to appropriate portal
      const portalInfo = getPortalUrlForUser(profile, user.email || "");
      if (portalInfo) {
        setIsProcessing(true);
        window.location.href = portalInfo.portalUrl;
      }
    }
  }, [isAuthenticated, user, profile, isLoading, isProcessing]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-muted">Redirecting to your portal...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
