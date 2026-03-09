import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { fail, ok } from "../../shared/http";
import { query } from "../../shared/database";
import { requirePortalAuth } from "../../shared/auth";

async function requireAdmin(req: HttpRequest): Promise<{ response?: HttpResponseInit; userId?: string }> {
  const auth = await requirePortalAuth(req, {
    requireApproved: true,
    allowedRoles: ["admin", "casemanager"],
  });

  if (auth.response || !auth.user) {
    return { response: auth.response };
  }

  return { userId: auth.user.id };
}

export async function pendingUsers(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "GET") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const admin = await requireAdmin(req);
  if (admin.response) {
    return admin.response;
  }

  const rows = await query<{
    id: string;
    email: string;
    display_name: string;
    role: string;
    status: string;
    created_at: Date;
    email_confirmed_at: Date | null;
    approval_status: string;
  }>(
    `SELECT
      Id as id,
      Email as email,
      DisplayName as display_name,
      Role as role,
      Status as status,
      CreatedAt as created_at,
      NULL as email_confirmed_at,
      Status as approval_status
     FROM Users
     WHERE Status = 'pending'
     ORDER BY CreatedAt ASC`
  );

  return ok({ users: rows });
}

export async function approvePendingUser(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "POST") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const admin = await requireAdmin(req);
  if (admin.response || !admin.userId) {
    return admin.response!;
  }

  const userId = req.params.userId;
  if (!userId) {
    return fail("validation_error", "userId is required", 422);
  }

  await query(
    `UPDATE Users
     SET Approved = 1,
         Status = 'approved',
         ApprovedAt = GETUTCDATE(),
         ApprovedBy = @approvedBy,
         RejectionReason = NULL,
         UpdatedAt = GETUTCDATE()
     WHERE Id = @userId`,
    { userId, approvedBy: admin.userId }
  );

  return ok({ success: true });
}

export async function rejectPendingUser(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "POST") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const admin = await requireAdmin(req);
  if (admin.response || !admin.userId) {
    return admin.response!;
  }

  const userId = req.params.userId;
  if (!userId) {
    return fail("validation_error", "userId is required", 422);
  }

  let body: { reason?: string };
  try {
    body = (await req.json()) as { reason?: string };
  } catch {
    return fail("invalid_json", "Request body must be valid JSON", 400);
  }

  if (!body.reason || !body.reason.trim()) {
    return fail("validation_error", "reason is required", 422);
  }

  await query(
    `UPDATE Users
     SET Approved = 0,
         Status = 'rejected',
         RejectionReason = @reason,
         ApprovedAt = GETUTCDATE(),
         ApprovedBy = @approvedBy,
         UpdatedAt = GETUTCDATE()
     WHERE Id = @userId`,
    { userId, approvedBy: admin.userId, reason: body.reason.trim() }
  );

  return ok({ success: true });
}

export async function bulkApprovePendingUsers(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "POST") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const auth = await requirePortalAuth(req, {
    requireApproved: true,
    allowedRoles: ["admin"],
  });
  if (auth.response || !auth.user) {
    return auth.response!;
  }

  let body: { userIds?: string[] };
  try {
    body = (await req.json()) as { userIds?: string[] };
  } catch {
    return fail("invalid_json", "Request body must be valid JSON", 400);
  }

  if (!Array.isArray(body.userIds) || body.userIds.length === 0) {
    return fail("validation_error", "userIds is required", 422);
  }

  if (body.userIds.length > 50) {
    return fail("validation_error", "Maximum 50 users per bulk request", 422);
  }

  let approved = 0;
  for (const userId of body.userIds) {
    await query(
      `UPDATE Users
       SET Approved = 1,
           Status = 'approved',
           ApprovedAt = GETUTCDATE(),
           ApprovedBy = @approvedBy,
           RejectionReason = NULL,
           UpdatedAt = GETUTCDATE()
       WHERE Id = @userId`,
      {
        userId,
        approvedBy: auth.user.id,
      }
    );

    approved += 1;
  }

  return ok({ success: true, approved });
}

app.http("admin-users-pending", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "admin/users/pending",
  handler: pendingUsers,
});

app.http("admin-users-approve", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "admin/users/{userId}/approve",
  handler: approvePendingUser,
});

app.http("admin-users-reject", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "admin/users/{userId}/reject",
  handler: rejectPendingUser,
});

app.http("admin-users-bulk-approve", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "admin/users/bulk-approve",
  handler: bulkApprovePendingUsers,
});
