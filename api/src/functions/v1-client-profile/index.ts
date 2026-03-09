import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { fail, ok } from "../../shared/http";
import { query } from "../../shared/database";
import { requirePortalAuth } from "../../shared/auth";

export async function clientProfile(req: HttpRequest): Promise<HttpResponseInit> {
  const auth = await requirePortalAuth(req, { allowedRoles: ["client"] });
  if (auth.response || !auth.user) {
    return auth.response!;
  }

  const method = req.method?.toUpperCase();

  if (method === "GET") {
    const rows = await query<{
      id: string;
      email: string;
      full_name: string;
      role: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
    }>(
      `SELECT
         u.Id as id,
         u.Email as email,
         u.DisplayName as full_name,
         u.Role as role,
         p.PhoneNumber as phone,
         p.Address as address,
         p.City as city,
         p.State as state,
         p.ZipCode as zip_code
       FROM Users u
       LEFT JOIN UserProfiles p ON p.UserId = u.Id
       WHERE u.Id = @userId`,
      { userId: auth.user.id }
    );

    if (rows.length === 0) {
      return fail("not_found", "Profile not found", 404);
    }

    return ok(rows[0]);
  }

  if (method === "PUT") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return fail("invalid_json", "Request body must be valid JSON", 400);
    }

    const fullName = typeof body.full_name === "string" ? body.full_name.trim() : undefined;
    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
    const address = typeof body.address === "string" ? body.address.trim() : undefined;

    if (fullName) {
      await query(
        `UPDATE Users SET DisplayName = @displayName, UpdatedAt = GETUTCDATE() WHERE Id = @userId`,
        { userId: auth.user.id, displayName: fullName }
      );
    }

    await query(
      `IF EXISTS (SELECT 1 FROM UserProfiles WHERE UserId = @userId)
         UPDATE UserProfiles
         SET PhoneNumber = COALESCE(@phone, PhoneNumber),
             Address = COALESCE(@address, Address)
         WHERE UserId = @userId
       ELSE
         INSERT INTO UserProfiles (UserId, PhoneNumber, Address)
         VALUES (@userId, @phone, @address)`,
      {
        userId: auth.user.id,
        phone: phone || null,
        address: address || null,
      }
    );

    const rows = await query<{
      id: string;
      email: string;
      full_name: string;
      role: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
    }>(
      `SELECT
         u.Id as id,
         u.Email as email,
         u.DisplayName as full_name,
         u.Role as role,
         p.PhoneNumber as phone,
         p.Address as address,
         p.City as city,
         p.State as state,
         p.ZipCode as zip_code
       FROM Users u
       LEFT JOIN UserProfiles p ON p.UserId = u.Id
       WHERE u.Id = @userId`,
      { userId: auth.user.id }
    );

    return ok(rows[0]);
  }

  return fail("method_not_allowed", "Unsupported method", 405);
}

app.http("v1-client-profile", {
  methods: ["GET", "PUT"],
  authLevel: "anonymous",
  route: "v1/client/profile",
  handler: clientProfile,
});
