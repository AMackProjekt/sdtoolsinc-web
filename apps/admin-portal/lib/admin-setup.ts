/**
 * Admin Portal Setup & User Management
 * Handles initial admin user creation with email verification
 */

export interface AdminSetupUser {
  id: string;
  email: string;
  password?: string; // Only temporary during setup
  name: string;
  role: "super_admin" | "admin" | "moderator" | "viewer";
  permissions: string[];
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SetupState {
  step: "verify_email" | "set_password" | "profile_setup" | "complete";
  user: Partial<AdminSetupUser>;
  emailVerified: boolean;
  verificationCode: string;
}

/**
 * Default admin permissions (full access)
 */
export const DEFAULT_ADMIN_PERMISSIONS = [
  // User Management
  "users.create",
  "users.read",
  "users.update",
  "users.delete",
  "users.assign_role",

  // Client Management & Data Integration
  "clients.create",
  "clients.read",
  "clients.update",
  "clients.delete",
  "clients.assign",
  "clients.data_integration",

  // Case Manager Management & Data Integration
  "case_managers.create",
  "case_managers.read",
  "case_managers.update",
  "case_managers.delete",
  "case_managers.assign",
  "case_managers.data_integration",

  // Configuration & Tools
  "settings.read",
  "settings.update",
  "tools.manage",
  "tools.configure",

  // Audit & Reporting
  "audit.read",
  "audit.export",
  "reports.view",
  "reports.export",

  // Administrative
  "roles.manage",
  "admin.manage",
  "system.configure",
];

/**
 * Initialize admin user setup
 */
export function initializeAdminSetup(email: string): SetupState {
  const verificationCode = generateVerificationCode();

  return {
    step: "verify_email",
    user: {
      email,
      role: "super_admin",
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    emailVerified: false,
    verificationCode,
  };
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Verify email with code
 */
export function verifyEmailCode(providedCode: string, correctCode: string): boolean {
  return providedCode === correctCode;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create admin user after setup completion
 */
export function createAdminUserFromSetup(setupState: SetupState): AdminSetupUser {
  const now = new Date().toISOString();

  return {
    id: `admin-${Date.now()}`,
    email: setupState.user.email!,
    name: setupState.user.name || "Administrator",
    role: setupState.user.role || "super_admin",
    permissions: setupState.user.permissions || DEFAULT_ADMIN_PERMISSIONS,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Store admin user securely (client-side - for production use backend)
 * SECURITY WARNING: This is for development only!
 * In production, use secure backend API with proper encryption
 */
export function storeAdminUser(user: AdminSetupUser, password: string): void {
  // Store user data (encrypted in production)
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: new Date().toISOString(),
  };

  // WARNING: Only for development! Use secure backend in production
  localStorage.setItem(
    "admin-user",
    btoa(JSON.stringify(userData))
  );

  localStorage.setItem(
    `admin-pwd-${user.email}`,
    btoa(password)
  );

  localStorage.setItem("admin-setup-complete", "true");
}

/**
 * Retrieve stored admin user (development only)
 */
export function getStoredAdminUser(): AdminSetupUser | null {
  try {
    const stored = localStorage.getItem("admin-user");
    if (!stored) return null;
    return JSON.parse(atob(stored));
  } catch (error) {
    console.error("Error retrieving stored admin user:", error);
    return null;
  }
}

/**
 * Check if admin setup is complete
 */
export function isAdminSetupComplete(): boolean {
  return localStorage.getItem("admin-setup-complete") === "true";
}

/**
 * Get default admin user for initial setup
 * Email: dmack@sdtoolsinc.org
 */
export const DEFAULT_ADMIN = {
  email: "dmack@sdtoolsinc.org",
  name: "Donyale Mack",
  role: "super_admin" as const,
  description: "Founder & CEO",
};
