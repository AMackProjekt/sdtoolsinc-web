import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { decryptJson, encryptJson } from "@/lib/crypto";
import { getEncryptedRecord, setEncryptedRecord } from "@/lib/server-data-store";

type EnterpriseRole = "executive" | "hr-staff" | "newsroom-contributor" | "newsroom-editor";

const adminAllowlist = (process.env.ADMIN_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const staffAllowlist = (process.env.STAFF_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const clientAllowlist = (process.env.CLIENT_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const orgDomain = (process.env.WORKSPACE_DOMAIN ?? "sdtoolsinc.org").toLowerCase();
const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "";
const googleHostedDomain = (process.env.AUTH_GOOGLE_HD ?? process.env.GOOGLE_HOSTED_DOMAIN ?? orgDomain).toLowerCase();

type StoredClientCredential = {
  email: string;
  username: string;
  passwordHash: string;
  name?: string;
  mustChangePassword?: boolean;
  approvedAt: string;
};

function normalizeLoginIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function isOrgEmail(email: string) {
  return normalizeLoginIdentifier(email).endsWith(`@${orgDomain}`);
}

// Dynamically load node crypto in functions so Edge runtime isn't tripped up in middleware.
const SCRYPT_KEYLEN = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

async function hashPasswordAsync(password: string): Promise<string> {
  const crypto = await import("crypto");
  const util = await import("util");
  const scryptAsync = util.promisify(crypto.scrypt);
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = (await scryptAsync(password, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS)) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

/**
 * Verifies a password against a stored hash.
 * Supports:
 *   - New format: "scrypt$<hex-salt>$<hex-hash>"
 *   - Legacy format: plain SHA-256 hex (migration path — rehash on next password reset)
 */
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const crypto = await import("crypto");
  if (stored.startsWith("scrypt$")) {
    const parts = stored.split("$");
    if (parts.length !== 3) return false;
    const [, saltHex, hashHex] = parts;
    try {
      const util = await import("util");
      const scryptAsync = util.promisify(crypto.scrypt);
      const hash = (await scryptAsync(password, saltHex, SCRYPT_KEYLEN, SCRYPT_PARAMS)) as Buffer;
      const storedHash = Buffer.from(hashHex, "hex");
      if (hash.length !== storedHash.length) return false;
      return crypto.timingSafeEqual(hash, storedHash);
    } catch {
      return false;
    }
  }
  // Legacy SHA-256 path: rehash will occur on next password reset
  const secret = process.env.AUTH_SECRET ?? "dev-only-change-me";
  const legacyHash = crypto.createHash("sha256").update(`${secret}:${password}`).digest("hex");
  const left = Buffer.from(legacyHash, "utf8");
  const right = Buffer.from(stored, "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export async function getClientCredential(identifier: string): Promise<StoredClientCredential | null> {
  const normalized = normalizeLoginIdentifier(identifier);
  const byEmail = await getEncryptedRecord("client-credentials", `email:${normalized}`);
  if (byEmail) {
    return decryptJson<StoredClientCredential>(byEmail);
  }

  const byUsername = await getEncryptedRecord("client-credentials", `username:${normalized}`);
  if (byUsername) {
    return decryptJson<StoredClientCredential>(byUsername);
  }

  return null;
}

export async function upsertClientCredential(input: {
  email: string;
  username?: string;
  password: string;
  name?: string;
  mustChangePassword?: boolean;
}) {
  const email = normalizeLoginIdentifier(input.email);
  const username = normalizeLoginIdentifier(input.username ?? email.split("@")[0]);
  const record: StoredClientCredential = {
    email,
    username,
    passwordHash: await hashPasswordAsync(input.password),
    name: input.name,
    mustChangePassword: input.mustChangePassword,
    approvedAt: new Date().toISOString(),
  };

  const encrypted = encryptJson(record);
  await setEncryptedRecord("client-credentials", `email:${email}`, encrypted);
  await setEncryptedRecord("client-credentials", `username:${username}`, encrypted);
  return record;
}

export async function getStaffCredential(identifier: string): Promise<StoredClientCredential | null> {
  const normalized = normalizeLoginIdentifier(identifier);
  const byEmail = await getEncryptedRecord("staff-credentials", `email:${normalized}`);
  if (byEmail) {
    return decryptJson<StoredClientCredential>(byEmail);
  }
  const byUsername = await getEncryptedRecord("staff-credentials", `username:${normalized}`);
  if (byUsername) {
    return decryptJson<StoredClientCredential>(byUsername);
  }
  return null;
}

export async function upsertStaffCredential(input: {
  email: string;
  username?: string;
  password: string;
  name?: string;
}) {
  const email = normalizeLoginIdentifier(input.email);
  if (!isOrgEmail(email)) {
    throw new Error(`Staff credentials must use a @${orgDomain} email address.`);
  }
  const username = normalizeLoginIdentifier(input.username ?? email.split("@")[0]);
  const record: StoredClientCredential = {
    email,
    username,
    passwordHash: await hashPasswordAsync(input.password),
    name: input.name,
    approvedAt: new Date().toISOString(),
  };
  const encrypted = encryptJson(record);
  await setEncryptedRecord("staff-credentials", `email:${email}`, encrypted);
  await setEncryptedRecord("staff-credentials", `username:${username}`, encrypted);
  return record;
}

export async function getAdminCredential(identifier: string): Promise<StoredClientCredential | null> {
  const normalized = normalizeLoginIdentifier(identifier);
  const byEmail = await getEncryptedRecord("admin-credentials", `email:${normalized}`);
  if (byEmail) {
    return decryptJson<StoredClientCredential>(byEmail);
  }
  const byUsername = await getEncryptedRecord("admin-credentials", `username:${normalized}`);
  if (byUsername) {
    return decryptJson<StoredClientCredential>(byUsername);
  }
  return null;
}

export async function upsertAdminCredential(input: {
  email: string;
  username?: string;
  password: string;
  name?: string;
}) {
  const email = normalizeLoginIdentifier(input.email);
  if (!isOrgEmail(email)) {
    throw new Error(`Admin credentials must use a @${orgDomain} email address.`);
  }
  const username = normalizeLoginIdentifier(input.username ?? email.split("@")[0]);
  const record: StoredClientCredential = {
    email,
    username,
    passwordHash: await hashPasswordAsync(input.password),
    name: input.name,
    approvedAt: new Date().toISOString(),
  };
  const encrypted = encryptJson(record);
  await setEncryptedRecord("admin-credentials", `email:${email}`, encrypted);
  await setEncryptedRecord("admin-credentials", `username:${username}`, encrypted);
  return record;
}

// ── Enterprise Role Management ─────────────────────────────────────────────
/**
 * Get enterprise roles assigned to a user by email address.
 * Returns empty array if no roles assigned.
 */
export async function getEnterpriseRoles(email: string): Promise<EnterpriseRole[]> {
  const normalized = normalizeLoginIdentifier(email);
  const rolesJson = await getEncryptedRecord("enterprise-roles", normalized);
  if (!rolesJson) return [];
  try {
    return decryptJson<EnterpriseRole[]>(rolesJson);
  } catch {
    return [];
  }
}

/**
 * Assign enterprise roles to a user.
 * Replaces any existing roles.
 */
export async function setEnterpriseRoles(email: string, roles: EnterpriseRole[]): Promise<void> {
  const normalized = normalizeLoginIdentifier(email);
  const encrypted = encryptJson(roles);
  await setEncryptedRecord("enterprise-roles", normalized, encrypted);
}

/**
 * Add one or more enterprise roles to a user.
 * Does not remove existing roles.
 */
export async function addEnterpriseRoles(email: string, roles: EnterpriseRole[]): Promise<void> {
  const existing = await getEnterpriseRoles(email);
  const combined = Array.from(new Set([...existing, ...roles]));
  await setEnterpriseRoles(email, combined);
}

/**
 * Remove one or more enterprise roles from a user.
 */
export async function removeEnterpriseRoles(email: string, roles: EnterpriseRole[]): Promise<void> {
  const existing = await getEnterpriseRoles(email);
  const filtered = existing.filter((r) => !roles.includes(r));
  await setEnterpriseRoles(email, filtered);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "client-credentials",
      name: "Client Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = typeof credentials?.identifier === "string" ? credentials.identifier : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!identifier.trim() || !password) {
          return null;
        }

        const stored = await getClientCredential(identifier);
        if (!stored) {
          return null;
        }

        const valid = await verifyPassword(password, stored.passwordHash);
        if (!valid) return null;

        return {
          id: stored.email,
          email: stored.email,
          name: stored.name ?? stored.username,
          role: "client",
        };
      },
    }),
    Credentials({
      id: "staff-credentials",
      name: "Staff Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = typeof credentials?.identifier === "string" ? credentials.identifier : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!identifier.trim() || !password) {
          return null;
        }

        const stored = await getStaffCredential(identifier);
        if (!stored) {
          return null;
        }

        // Verify the stored email is an allowed staff member
        const storedEmailNorm = stored.email.toLowerCase();
        const isAllowedStaff =
          storedEmailNorm.endsWith(`@${orgDomain}`) ||
          staffAllowlist.includes(storedEmailNorm) ||
          adminAllowlist.includes(storedEmailNorm);
        if (!isAllowedStaff) return null;

        const valid = await verifyPassword(password, stored.passwordHash);
        if (!valid) return null;

        return {
          id: stored.email,
          email: stored.email,
          name: stored.name ?? stored.username,
          role: "staff",
        };
      },
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = typeof credentials?.identifier === "string" ? credentials.identifier : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!identifier.trim() || !password) {
          return null;
        }

        const stored = await getAdminCredential(identifier);
        if (!stored) {
          return null;
        }

        // Verify admin is on the allowlist
        const storedEmailNorm = stored.email.toLowerCase();
        if (!isOrgEmail(storedEmailNorm) || !adminAllowlist.includes(storedEmailNorm)) return null;

        const valid = await verifyPassword(password, stored.passwordHash);
        if (!valid) return null;

        return {
          id: stored.email,
          email: stored.email,
          name: stored.name ?? stored.username,
          role: "admin",
        };
      },
    }),
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          hd: googleHostedDomain,
          prompt: "select_account",
        },
      },
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "client-credentials") {
        token.role = "client";
        return token;
      }

      if (account?.provider === "staff-credentials") {
        token.role = "staff";
        if (profile?.email) {
          token.enterpriseRoles = await getEnterpriseRoles(profile.email.toLowerCase());
        }
        return token;
      }

      if (account?.provider === "admin-credentials") {
        token.role = "admin";
        if (profile?.email) {
          token.enterpriseRoles = await getEnterpriseRoles(profile.email.toLowerCase());
        }
        return token;
      }

      if (account && profile && typeof profile.email === "string") {
        const email = profile.email.toLowerCase();
        const isDomainEmail = email.endsWith(`@${orgDomain}`);
        const isAdmin = isDomainEmail && adminAllowlist.includes(email);
        const isStaff = isDomainEmail && !isAdmin && (staffAllowlist.includes(email) || adminAllowlist.includes(email));
        token.role = isAdmin ? "admin" : isStaff ? "staff" : "client";
        
        // Fetch enterprise roles for staff and admin users
        if (isStaff || isAdmin) {
          token.enterpriseRoles = await getEnterpriseRoles(email);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "staff" | "client" | "admin" | undefined) ?? "client";
        session.user.enterpriseRoles = (token.enterpriseRoles as EnterpriseRole[] | undefined) ?? [];
      }
      return session;
    },
    async signIn({ account, profile, user }) {
      if (
        account?.provider === "client-credentials" ||
        account?.provider === "staff-credentials" ||
        account?.provider === "admin-credentials"
      ) {
        return Boolean(user?.email);
      }

      if (account?.provider === "google" && profile && typeof profile === "object") {
        const emailVerified = (profile as { email_verified?: boolean }).email_verified;
        if (emailVerified === false) return false;
      }

      if (!profile?.email) return false;
      const email = profile.email.toLowerCase();
      const isAllowedDomain = email.endsWith(`@${orgDomain}`);
      const isAllowlisted =
        clientAllowlist.includes(email) ||
        staffAllowlist.includes(email) ||
        adminAllowlist.includes(email);
      return isAllowedDomain || isAllowlisted;
    },
  },
});
