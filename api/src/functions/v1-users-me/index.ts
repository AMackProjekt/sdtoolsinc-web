import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";

export async function usersMe(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Get user from Azure SWA authentication
  const clientPrincipal = req.headers.get('x-ms-client-principal');
  
  if (!clientPrincipal) {
    return fail("unauthorized", "Authentication required", 401);
  }

  const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
  const entraId = principal.userId;
  const email = principal.userDetails;
  const displayName = principal.userDetails.split('@')[0];

  const method = req.method?.toUpperCase();

  if (method === "GET") {
    // Get or create user
    let users = await query(
      "SELECT * FROM Users WHERE EntraId = @entraId",
      { entraId }
    );

    if (users.length === 0) {
      // Create new user
      await query(
        `INSERT INTO Users (Email, DisplayName, EntraId) 
         OUTPUT INSERTED.* 
         VALUES (@email, @displayName, @entraId)`,
        { email, displayName, entraId }
      );
      
      users = await query(
        "SELECT * FROM Users WHERE EntraId = @entraId",
        { entraId }
      );
    }

    return ok(users[0]);
  }

  if (method === "PATCH") {
    // Update user profile
    let body: any;
    try {
      body = await req.json();
    } catch {
      return fail("invalid_json", "Request body must be valid JSON.", 400);
    }

    const allowedFields = ['DisplayName', 'PhoneNumber', 'DateOfBirth', 'Address', 'City', 'State', 'ZipCode'];
    const updates: string[] = [];
    const params: Record<string, any> = { entraId };

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = @${key}`);
        params[key] = body[key];
      }
    });

    if (updates.length === 0) {
      return fail("validation_error", "No valid fields to update", 422);
    }

    await query(
      `UPDATE Users SET ${updates.join(', ')}, UpdatedAt = GETUTCDATE() WHERE EntraId = @entraId`,
      params
    );

    const users = await query("SELECT * FROM Users WHERE EntraId = @entraId", { entraId });
    return ok(users[0]);
  }

  return fail("method_not_allowed", "Unsupported method", 405);
}

app.http("users-me", {
  methods: ["GET", "PATCH"],
  authLevel: "anonymous",
  route: "v1/users/me",
  handler: usersMe
});
