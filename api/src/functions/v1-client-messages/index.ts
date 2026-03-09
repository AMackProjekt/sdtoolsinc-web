import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { fail, ok } from "../../shared/http";
import { query } from "../../shared/database";
import { requirePortalAuth } from "../../shared/auth";
import { ensureClientDataTables } from "../../shared/client-data";

export async function clientMessages(req: HttpRequest): Promise<HttpResponseInit> {
  const auth = await requirePortalAuth(req, { allowedRoles: ["client"] });
  if (auth.response || !auth.user) {
    return auth.response!;
  }

  await ensureClientDataTables();
  const userId = auth.user.id;
  const method = req.method?.toUpperCase();

  if (method === "GET") {
    const rows = await query<{
      id: string;
      senderId: string;
      senderName: string;
      subject: string;
      preview: string;
      body: string;
      timestamp: Date;
      isRead: boolean;
    }>(
      `SELECT
        Id as id,
        SenderId as senderId,
        SenderName as senderName,
        Subject as subject,
        Preview as preview,
        Body as body,
        [Timestamp] as timestamp,
        IsRead as isRead
       FROM ClientMessages
       WHERE UserId = @userId
       ORDER BY [Timestamp] DESC`,
      { userId }
    );

    return ok(
      rows.map((row) => ({
        id: row.id,
        senderId: row.senderId,
        senderName: row.senderName,
        subject: row.subject,
        preview: row.preview,
        body: row.body,
        timestamp: new Date(row.timestamp).toISOString(),
        read: Boolean(row.isRead),
      }))
    );
  }

  return fail("method_not_allowed", "Unsupported method", 405);
}

export async function clientMessageRead(req: HttpRequest): Promise<HttpResponseInit> {
  const auth = await requirePortalAuth(req, { allowedRoles: ["client"] });
  if (auth.response || !auth.user) {
    return auth.response!;
  }

  await ensureClientDataTables();

  if (req.method?.toUpperCase() !== "PUT") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const id = req.params.id;
  if (!id) {
    return fail("validation_error", "Message id is required", 422);
  }

  let body: { isRead?: boolean };
  try {
    body = (await req.json()) as { isRead?: boolean };
  } catch {
    return fail("invalid_json", "Request body must be valid JSON", 400);
  }

  const isRead = body.isRead !== false;

  const existing = await query<{ id: string }>(
    `SELECT Id as id FROM ClientMessages WHERE Id = @id AND UserId = @userId`,
    { id, userId: auth.user.id }
  );

  if (existing.length === 0) {
    return fail("not_found", "Message not found", 404);
  }

  await query(
    `UPDATE ClientMessages SET IsRead = @isRead WHERE Id = @id AND UserId = @userId`,
    { id, userId: auth.user.id, isRead: isRead ? 1 : 0 }
  );

  return ok({ success: true });
}

app.http("v1-client-messages", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "v1/client/messages",
  handler: clientMessages,
});

app.http("v1-client-message-read", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "v1/client/messages/{id}/read",
  handler: clientMessageRead,
});
