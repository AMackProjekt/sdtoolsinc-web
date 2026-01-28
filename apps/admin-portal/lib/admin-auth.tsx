"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * SECURITY WARNING:
 * This is a MOCK IMPLEMENTATION for development only!
 * 
 * Before production deployment:
 * 1. Implement secure backend API (Node.js/Express, ASP.NET, etc.)
 * 2. Use proper password hashing (bcrypt, argon2)
 * 3. Implement JWT or session-based authentication
 * 4. Add HTTPS-only, HttpOnly cookies
 * 5. Never store passwords or sensitive data in localStorage
 * 6. Implement proper role-based access control (RBAC) on backend
 * 7. Add rate limiting and brute force protection
 * 8. Implement audit logging for admin actions
 */

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
    // Check for stored admin session (encrypted in production)
    const storedUser = localStorage.getItem("admin-session");
    if (storedUser) {
      try {
        const decoded = JSON.parse(atob(storedUser)); // Base64 decode (use proper encryption in production)
        // Update last login time on session restore
        decoded.lastLogin = new Date().toISOString();
        setUser(decoded);
      } catch (e) {
        // Invalid session, clear it
        localStorage.removeItem("admin-session");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In production: Call secure backend API for authentication
    // This is a mock implementation for development only
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if admin setup is complete
      const setupComplete = localStorage.getItem("admin-setup-complete") === "true";
      if (!setupComplete) {
        // Setup not yet completed
        return false;
      }

      // Check stored credentials (NEVER do this in production!)
      const storedPassword = localStorage.getItem(`admin-pwd-${email}`);
      const storedSession = localStorage.getItem("admin-user");

      if (storedPassword && atob(storedPassword) === password && storedSession) {
        const adminData = JSON.parse(atob(storedSession));
        adminData.lastLogin = new Date().toISOString();

        // Update session with new login time
        const encryptedSession = btoa(JSON.stringify(adminData));
        localStorage.setItem("admin-session", encryptedSession);
        localStorage.setItem("admin-user", encryptedSession);

        setUser(adminData);
        return true;
      }

      // For demo purposes, support default admin account
      if (email === "dmack@sdtoolsinc.org" && password === "TOOLSINC") {
        const newAdmin: AdminUser = {
          id: "admin-1",
          email: "dmack@sdtoolsinc.org",
          name: "Donyale Mack",
          role: "super_admin",
          permissions: ROLE_PERMISSIONS.super_admin,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        // Store session
        const encryptedSession = btoa(JSON.stringify(newAdmin));
        localStorage.setItem("admin-session", encryptedSession);
        localStorage.setItem("admin-user", encryptedSession);
        localStorage.setItem(`admin-pwd-${email}`, btoa(password));
        localStorage.setItem("admin-setup-complete", "true");

        setUser(newAdmin);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin-session");
    setUser(null);
  };

  const updateProfile = (updates: Partial<AdminUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update encrypted session
    const encryptedSession = btoa(JSON.stringify(updatedUser));
    localStorage.setItem("admin-session", encryptedSession);
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

// Utility function to create a new admin user (for development/setup)
export function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: AdminRole = "admin"
): AdminUser {
  const newAdmin: AdminUser = {
    id: Date.now().toString(),
    email,
    name,
    role,
    permissions: ROLE_PERMISSIONS[role],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // Store credentials (NEVER do this in production!)
  localStorage.setItem(`admin-pwd-${email}`, btoa(password));

  return newAdmin;
}

// Export types and constants for use in other components
export type { AdminUser };
export { ROLE_PERMISSIONS };
