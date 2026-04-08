"use client";

/**
 * lib/auth.tsx — NextAuth-backed authentication context.
 *
 * Provides the same useAuth() interface used across all Enterprise portal pages
 * while delegating to NextAuth for Google Workspace + Microsoft 365 OAuth with
 * encrypted, httpOnly JWT session cookies (no localStorage).
 */

import { createContext, useContext, ReactNode } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "enterprise_admin" | "enterprise_viewer" | string;
  provider?: "google" | "azure-ad" | string;
};

type AuthContextType = {
  user: User | null;
  /** OAuth sign-in — redirects to Google or Azure AD consent screen. */
  login: (email?: string, password?: string) => Promise<boolean>;
  signup: (email?: string, password?: string, name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inner hook that reads the NextAuth session and exposes the useAuth() contract.
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user: User | null = isAuthenticated && session?.user
    ? {
        id: (session.user as Session["user"] & { id?: string }).id ?? session.user.email ?? "",
        email: session.user.email ?? "",
        name: session.user.name ?? "",
        avatar: session.user.image ?? undefined,
        role: ((session.user as Session["user"] & { role?: string }).role as User["role"]) ?? "enterprise_viewer",
        provider: (session.user as Session["user"] & { provider?: string }).provider ?? undefined,
      }
    : null;

  /**
   * login() — ignores the legacy email/password args; triggers OAuth redirect.
   * Pass "azure-ad" as the first arg to use Microsoft 365, else defaults to Google.
   */
  const login = async (provider?: string): Promise<boolean> => {
    await signIn(provider ?? "google", {
      callbackUrl: "/portal/enterprise/dashboard",
    });
    return true; // actual success determined by redirect
  };

  /** signup() — no email-only registration; same OAuth flow as login. */
  const signup = async (provider?: string): Promise<boolean> => {
    return login(provider);
  };

  const logout = () => {
    signOut({ callbackUrl: "/portal/enterprise/auth" });
  };

  /** updateProfile — no-op stub; profile data lives in the OAuth provider. */
  const updateProfile = (_updates: Partial<User>) => {
    // Profile updates are handled through the respective identity provider.
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * AuthProvider — wraps the app with NextAuth SessionProvider + the auth context.
 * Used in app/layout.tsx.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
