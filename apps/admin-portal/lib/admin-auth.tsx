"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, getProfile } from "@/lib/supabase";

export type AdminRole = "super_admin" | "admin" | "moderator" | "viewer";

export type AdminPermission =
  | "manage_users"
  | "manage_cases"
  | "manage_programs"
  | "manage_referrals"
  | "view_analytics"
  | "manage_settings"
  | "manage_admins"
  | "audit_logs"
  | "export_data"
  | "delete_data";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
};

type AuthContextType = {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<AdminUser>) => void;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  hasAnyPermission: (permissions: AdminPermission[]) => boolean;
  hasAllPermissions: (permissions: AdminPermission[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default permissions by role
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    "manage_users",
    "manage_cases",
    "manage_programs",
    "manage_referrals",
    "view_analytics",
    "manage_settings",
    "manage_admins",
    "audit_logs",
    "export_data",
    "delete_data",
  ],
  admin: [
    "manage_users",
    "manage_cases",
    "manage_programs",
    "manage_referrals",
    "view_analytics",
    "manage_settings",
    "audit_logs",
    "export_data",
  ],
  moderator: [
    "manage_cases",
    "manage_programs",
    "manage_referrals",
    "view_analytics",
  ],
  viewer: ["view_analytics"],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        return;
      }

      try {
        const profile = await getProfile(session.user.id);
        if (profile.role !== "admin") {
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        const adminUser: AdminUser = {
          id: profile.id,
          email: session.user.email ?? "",
          name: profile.full_name ?? session.user.email ?? "Admin",
          role: "admin",
          permissions: ROLE_PERMISSIONS.admin,
          avatar: profile.avatar_url ?? undefined,
          lastLogin: new Date().toISOString(),
          createdAt: session.user.created_at ?? new Date().toISOString(),
        };

        setUser(adminUser);
      } catch (error) {
        console.error("Failed to load admin profile:", error);
        setUser(null);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) return false;

      const profile = await getProfile(userId);
      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        return false;
      }

      const adminUser: AdminUser = {
        id: profile.id,
        email: data.user?.email ?? email,
        name: profile.full_name ?? data.user?.email ?? "Admin",
        role: "admin",
        permissions: ROLE_PERMISSIONS.admin,
        avatar: profile.avatar_url ?? undefined,
        lastLogin: new Date().toISOString(),
        createdAt: data.user?.created_at ?? new Date().toISOString(),
      };

      setUser(adminUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = (updates: Partial<AdminUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  // Role checking functions
  const isAdmin = (): boolean => {
    if (!user) return false;
    return user.role === "admin" || user.role === "super_admin";
  };

  const isSuperAdmin = (): boolean => {
    if (!user) return false;
    return user.role === "super_admin";
  };

  // Permission checking functions
  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: AdminPermission[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: AdminPermission[]): boolean => {
    if (!user) return false;
    return permissions.every((permission) => user.permissions.includes(permission));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export types and constants for use in other components
export type { AdminUser };
export { ROLE_PERMISSIONS };
