import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";

/**
 * User Approval API Endpoints
 * Handles approve, reject, and pending user operations
 */

// Helper function to get authenticated user from Azure SWA
function getAuthUser(req: HttpRequest): { userId: string; email: string; role: string } | null {
  const clientPrincipal = req.headers.get('x-ms-client-principal');
  
  if (!clientPrincipal) {
    return null;
  }

  try {
    const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
    return {
      userId: principal.userId,
      email: principal.userDetails,
      role: principal.userRoles?.[0] || 'user'
    };
  } catch {
    return null;
  }
}

// Helper function to check if user is admin
async function isAdmin(email: string): Promise<boolean> {
  const users = await query(
    "SELECT Role FROM Users WHERE Email = @email",
    { email }
  );
  
  return users.length > 0 && (users[0].Role === 'Admin' || users[0].Role === 'admin');
}

export async function userApproval(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authUser = getAuthUser(req);
  
  if (!authUser) {
    return fail("unauthorized", "Authentication required", 401);
  }

  // Check admin permission
  const hasAdminRole = await isAdmin(authUser.email);
  if (!hasAdminRole) {
    return fail("forbidden", "Admin role required", 403);
  }

  const method = req.method?.toUpperCase();
  const userId = req.params.userId;
  const action = req.params.action;

  // GET /api/v1/admin/users/pending - Get all pending users
  if (method === "GET" && !userId && !action) {
    try {
      const pendingUsers = await query(
        `SELECT Id, Email, DisplayName, Role, Status, CreatedAt, EntraId
         FROM Users 
         WHERE Status = 'pending' 
         ORDER BY CreatedAt DESC`,
        {}
      );

      return ok({
        users: pendingUsers,
        total: pendingUsers.length
      });
    } catch (error) {
      context.error("Error fetching pending users:", error);
      return fail("server_error", "Failed to fetch pending users", 500);
    }
  }

  // POST /api/v1/admin/users/:userId/approve - Approve a user
  if (method === "POST" && userId && action === "approve") {
    try {
      let body: any = {};
      try {
        body = await req.json();
      } catch {
        // Body is optional for approve
      }

      // Get admin user ID
      const adminUsers = await query(
        "SELECT Id FROM Users WHERE Email = @email",
        { email: authUser.email }
      );

      if (adminUsers.length === 0) {
        return fail("server_error", "Admin user not found", 500);
      }

      const adminId = adminUsers[0].Id;

      // Update user approval status
      await query(
        `UPDATE Users 
         SET Approved = 1, 
             Status = 'approved', 
             ApprovedAt = GETUTCDATE(), 
             ApprovedBy = @approvedBy,
             UpdatedAt = GETUTCDATE()
         WHERE Id = @userId`,
        { userId, approvedBy: adminId }
      );

      // Get updated user
      const users = await query(
        `SELECT Id, Email, DisplayName, Role, Status, Approved, ApprovedAt, ApprovedBy, CreatedAt
         FROM Users WHERE Id = @userId`,
        { userId }
      );

      if (users.length === 0) {
        return fail("not_found", "User not found", 404);
      }

      // Log audit event
      await query(
        `INSERT INTO AuditLog (UserId, Action, Details, Timestamp)
         VALUES (@adminId, 'USER_APPROVED', @details, GETUTCDATE())`,
        {
          adminId,
          details: JSON.stringify({
            approvedUserId: userId,
            approvedUserEmail: users[0].Email,
            notes: body.notes || null
          })
        }
      );

      return ok({
        success: true,
        user: users[0]
      });
    } catch (error) {
      context.error("Error approving user:", error);
      return fail("server_error", "Failed to approve user", 500);
    }
  }

  // POST /api/v1/admin/users/:userId/reject - Reject a user
  if (method === "POST" && userId && action === "reject") {
    try {
      let body: any;
      try {
        body = await req.json();
      } catch {
        return fail("invalid_json", "Request body must be valid JSON", 400);
      }

      if (!body.reason) {
        return fail("validation_error", "Rejection reason is required", 422);
      }

      // Get admin user ID
      const adminUsers = await query(
        "SELECT Id FROM Users WHERE Email = @email",
        { email: authUser.email }
      );

      if (adminUsers.length === 0) {
        return fail("server_error", "Admin user not found", 500);
      }

      const adminId = adminUsers[0].Id;

      // Update user rejection status
      await query(
        `UPDATE Users 
         SET Approved = 0, 
             Status = 'rejected', 
             RejectionReason = @reason,
             ApprovedBy = @approvedBy,
             ApprovedAt = GETUTCDATE(),
             UpdatedAt = GETUTCDATE()
         WHERE Id = @userId`,
        { userId, reason: body.reason, approvedBy: adminId }
      );

      // Get updated user
      const users = await query(
        `SELECT Id, Email, DisplayName, Role, Status, RejectionReason, CreatedAt
         FROM Users WHERE Id = @userId`,
        { userId }
      );

      if (users.length === 0) {
        return fail("not_found", "User not found", 404);
      }

      // Log audit event
      await query(
        `INSERT INTO AuditLog (UserId, Action, Details, Timestamp)
         VALUES (@adminId, 'USER_REJECTED', @details, GETUTCDATE())`,
        {
          adminId,
          details: JSON.stringify({
            rejectedUserId: userId,
            rejectedUserEmail: users[0].Email,
            reason: body.reason
          })
        }
      );

      return ok({
        success: true
      });
    } catch (error) {
      context.error("Error rejecting user:", error);
      return fail("server_error", "Failed to reject user", 500);
    }
  }

  // POST /api/v1/admin/users/bulk-approve - Bulk approve users
  if (method === "POST" && action === "bulk-approve" && !userId) {
    try {
      let body: any;
      try {
        body = await req.json();
      } catch {
        return fail("invalid_json", "Request body must be valid JSON", 400);
      }

      if (!body.userIds || !Array.isArray(body.userIds) || body.userIds.length === 0) {
        return fail("validation_error", "userIds array is required", 422);
      }

      // Get admin user ID
      const adminUsers = await query(
        "SELECT Id FROM Users WHERE Email = @email",
        { email: authUser.email }
      );

      if (adminUsers.length === 0) {
        return fail("server_error", "Admin user not found", 500);
      }

      const adminId = adminUsers[0].Id;

      // Bulk approve users
      const userIdList = body.userIds.map((id: string) => `'${id}'`).join(',');
      
      await query(
        `UPDATE Users 
         SET Approved = 1, 
             Status = 'approved', 
             ApprovedAt = GETUTCDATE(), 
             ApprovedBy = @approvedBy,
             UpdatedAt = GETUTCDATE()
         WHERE Id IN (${userIdList})`,
        { approvedBy: adminId }
      );

      // Log audit event
      await query(
        `INSERT INTO AuditLog (UserId, Action, Details, Timestamp)
         VALUES (@adminId, 'BULK_USER_APPROVAL', @details, GETUTCDATE())`,
        {
          adminId,
          details: JSON.stringify({
            approvedUserIds: body.userIds,
            count: body.userIds.length
          })
        }
      );

      return ok({
        success: true,
        approved: body.userIds.length
      });
    } catch (error) {
      context.error("Error bulk approving users:", error);
      return fail("server_error", "Failed to bulk approve users", 500);
    }
  }

  return fail("method_not_allowed", "Unsupported method or route", 405);
}

app.http("user-approval", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "v1/admin/users/{userId?}/{action?}",
  handler: userApproval
});
