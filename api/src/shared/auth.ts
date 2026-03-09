import { HttpRequest, HttpResponseInit } from "@azure/functions";
import jwt from "jsonwebtoken";
import { query } from "./database";
import { fail } from "./http";

export interface PortalUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  approved: boolean;
  status: string;
}

interface JwtClaims {
  sub?: string;
  email?: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

interface AuthOptions {
  requireApproved?: boolean;
  allowedRoles?: string[];
}

export interface AuthResult {
  response?: HttpResponseInit;
  user?: PortalUser;
  claims?: JwtClaims;
}

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

function inferRoleFromEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (normalized === "dmack@sdtoolsinc.org") {
    return "Admin";
  }
  if (normalized.endsWith("@sdtoolsinc.org")) {
    return "CaseManager";
  }
  return "Client";
}

function decodeClientPrincipal(req: HttpRequest): { email: string; userId?: string } | null {
  const clientPrincipal = req.headers.get("x-ms-client-principal");
  if (!clientPrincipal) {
    return null;
  }

  try {
    const principal = JSON.parse(Buffer.from(clientPrincipal, "base64").toString("utf8"));
    return {
      email: principal.userDetails,
      userId: principal.userId,
    };
  } catch {
    return null;
  }
}

function extractBearer(req: HttpRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return auth.slice(7).trim();
}

function verifyToken(token: string): JwtClaims {
  const secrets = [process.env.SUPABASE_JWT_SECRET, process.env.JWT_SECRET].filter(Boolean) as string[];

  for (const secret of secrets) {
    try {
      return jwt.verify(token, secret) as JwtClaims;
    } catch {
      // try next secret
    }
  }

  throw new Error("Invalid token");
}

async function findOrCreateUser(email: string, claims?: JwtClaims): Promise<PortalUser> {
  const existing = await query<PortalUser & { Approved: number; Status: string }>(
    `SELECT TOP 1 Id as id, Email as email, DisplayName as displayName, Role as role, Approved as approved, Status as status
     FROM Users
     WHERE Email = @email`,
    { email }
  );

  if (existing.length > 0) {
    const user = existing[0] as PortalUser & { approved: number | boolean };
    return {
      ...user,
      approved: Boolean(user.approved),
      status: user.status || (Boolean(user.approved) ? "approved" : "pending"),
    };
  }

  const defaultRole = inferRoleFromEmail(email);
  const displayName = (claims?.email || email).split("@")[0];

  const created = await query<PortalUser & { approved: number | boolean }>(
    `INSERT INTO Users (Email, DisplayName, EntraId, Role, Approved, Status)
     OUTPUT INSERTED.Id as id, INSERTED.Email as email, INSERTED.DisplayName as displayName,
            INSERTED.Role as role, INSERTED.Approved as approved, INSERTED.Status as status
     VALUES (@email, @displayName, @entraId, @role, 0, 'pending')`,
    {
      email,
      displayName,
      entraId: claims?.sub || null,
      role: defaultRole,
    }
  );

  const user = created[0];
  return {
    ...user,
    approved: Boolean(user.approved),
    status: user.status || "pending",
  };
}

export async function requirePortalAuth(req: HttpRequest, options: AuthOptions = {}): Promise<AuthResult> {
  const principal = decodeClientPrincipal(req);
  let claims: JwtClaims | undefined;
  let email = principal?.email;

  if (!email) {
    const token = extractBearer(req);
    if (!token) {
      return { response: fail("unauthorized", "Authentication required", 401) };
    }

    try {
      claims = verifyToken(token);
    } catch {
      return { response: fail("invalid_token", "Invalid authentication token", 401) };
    }

    email = claims.email;
    if (!email) {
      return { response: fail("invalid_token", "Token is missing email claim", 401) };
    }

    if (!claims.email_confirmed_at) {
      return {
        response: fail(
          "email_not_verified",
          "Email is not verified",
          403,
          [{ code: "EMAIL_NOT_VERIFIED" }]
        ),
      };
    }
  }

  const user = await findOrCreateUser(email, claims);

  // Check approval status from JWT claims first (for testing/override), then database
  const jwtApprovalStatus = (claims?.approval_status as string || "").toLowerCase();
  const dbApprovalStatus = normalizeRole(user.status);
  const approvalStatus = jwtApprovalStatus || dbApprovalStatus;

  if (options.requireApproved !== false) {
    if (!user.approved && approvalStatus !== "approved") {
      return {
        response: fail(
          "account_pending_approval",
          "Account pending approval",
          403,
          [{ code: "ACCOUNT_PENDING_APPROVAL" }]
        ),
      };
    }
  }

  if (options.allowedRoles && options.allowedRoles.length > 0) {
    const allowed = options.allowedRoles.map(normalizeRole);
    if (!allowed.includes(normalizeRole(user.role))) {
      return {
        response: fail(
          "role_mismatch",
          "Insufficient permissions",
          403,
          [{ code: "ROLE_MISMATCH" }]
        ),
      };
    }
  }

  return { user, claims };
}
