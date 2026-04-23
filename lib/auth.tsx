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

export type AuthContextType = {
  user: User | null;
  /** OAuth sign-in — redirects to Google or Azure AD consent screen. */
  login: (email?: string, password?: string) => Promise<boolean>;
  signup: (email?: string, password?: string, name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
   * login() — supports both credentials (email+password) and OAuth providers.
   * If a real email + password are passed, uses Supabase credentials sign-in.
   * If a provider name (google / azure-ad) is passed, does OAuth redirect.
   */
  const login = async (emailOrProvider?: string, password?: string): Promise<boolean> => {
    if (emailOrProvider && password) {
      // Credentials sign-in (email + password)
      const result = await signIn("credentials", {
        email: emailOrProvider,
        password,
        callbackUrl: "/portal",
        redirect: false,
      });
      if (result?.error) return false;
      if (result?.url) {
        window.location.href = result.url;
      }
      return true;
    }
    // OAuth redirect
    await signIn(emailOrProvider ?? "google", { callbackUrl: "/portal" });
    return true;
  };

  /** signup() — creates a Supabase account and signs the user in immediately. */
  const signup = async (email?: string, password?: string, name?: string): Promise<boolean> => {
    if (!email || !password) return false;
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) return false;

      // Sign in immediately after account creation
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/portal/participant/dashboard",
        redirect: false,
      });
      if (result?.error) return false;
      if (result?.url) window.location.href = result.url;
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    signOut({ callbackUrl: "/portal" });
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
