"use client";

/**
 * lib/demo-auth.tsx — Mock authentication provider for demo mode.
 *
 * Provides the same useAuth() interface as lib/auth.tsx but always
 * returns an authenticated demo user — no real sign-in required.
 * Used exclusively by the /demo/* route tree.
 */

import { ReactNode } from "react";
import { AuthContext, AuthContextType, User } from "@/lib/auth";

export const DEMO_USER: User = {
  id: "demo-001",
  email: "alex.rivera@sdtoolsinc.org",
  name: "Alex Rivera",
  avatar: undefined,
  role: "demo_admin",
  provider: "demo",
};

const demoContextValue: AuthContextType = {
  user: DEMO_USER,
  login: async () => true,
  signup: async () => true,
  logout: () => {
    // In demo mode, logout simply redirects to the demo landing page
    if (typeof window !== "undefined") {
      window.location.href = "/demo";
    }
  },
  updateProfile: () => {},
  isAuthenticated: true,
  isLoading: false,
};

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={demoContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
