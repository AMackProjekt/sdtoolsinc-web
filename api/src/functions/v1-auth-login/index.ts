import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
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

export async function loginHandler(request: HttpRequest): Promise<HttpResponseInit> {
  try {
    const body: any = await request.json();
    if (!body.email || !body.password) return { status: 400, jsonBody: { success: false, error: "Email and password required" } };

    const pool = new ConnectionPool(getDBConfig());
    await pool.connect();

    try {
      const result = await pool.request()
        .input("email", body.email)
        .query(`SELECT id, email, passwordHash, name, phone, verified, role FROM users WHERE email = @email`);

      if (result.recordset.length === 0) return { status: 401, jsonBody: { success: false, error: "Invalid credentials" } };

      const user = result.recordset[0];
      if (!user.verified) return { status: 403, jsonBody: { success: false, error: "Please verify your email first" } };

      const passwordValid = await bcrypt.compare(body.password, user.passwordHash);
      if (!passwordValid) return { status: 401, jsonBody: { success: false, error: "Invalid credentials" } };

      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

      await pool.request()
        .input("userId", user.id)
        .input("timestamp", new Date())
        .input("action", "LOGIN_SUCCESS")
        .query(`INSERT INTO auditLog (userId, timestamp, action) VALUES (@userId, @timestamp, @action)`);

      return { status: 200, jsonBody: { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } };
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error("Login error:", error);
    return { status: 500, jsonBody: { success: false, error: "Login failed" } };
  }
}

app.http("v1-auth-login", { methods: ["POST"], authLevel: "anonymous", handler: loginHandler });
