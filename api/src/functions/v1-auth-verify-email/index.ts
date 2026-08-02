import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import * as jwt from "jsonwebtoken";
import { ConnectionPool } from "mssql";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

function getDBConfig() {
  return {
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_NAME || "toolsinc",
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "Password@123",
    options: {
      encrypt: true,
      trustServerCertificate: true,
      connectTimeout: 30000,
      requestTimeout: 30000,
    },
  };
}

export async function verifyEmailHandler(request: HttpRequest): Promise<HttpResponseInit> {
  try {
    let token = request.query.get("token");
    if (!token && request.method === "POST") {
      const body: any = await request.json();
      token = body.token;
    }
    if (!token) return { status: 400, jsonBody: { success: false, error: "Token required" } };

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return { status: 401, jsonBody: { success: false, error: "Invalid token" } };
    }
    if (decoded.type !== "email-verification") return { status: 400, jsonBody: { success: false, error: "Invalid token type" } };

    const pool = new ConnectionPool(getDBConfig());
    await pool.connect();

    try {
      const result = await pool.request()
        .input("email", decoded.email)
        .query(`UPDATE users SET verified = 1, verificationToken = NULL WHERE email = @email`);

      if (result.rowsAffected[0] === 0) return { status: 404, jsonBody: { success: false, error: "User not found" } };

      return { status: 200, jsonBody: { success: true, message: "Email verified! Log in now." } };
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error("Verification error:", error);
    return { status: 500, jsonBody: { success: false, error: "Verification failed" } };
  }
}

app.http("v1-auth-verify-email", { methods: ["GET", "POST"], authLevel: "anonymous", handler: verifyEmailHandler });
