import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
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

export async function signupHandler(request: HttpRequest): Promise<HttpResponseInit> {
  try {
    const body: any = await request.json();
    if (!body.email || !body.password || !body.name) {
      return { status: 400, jsonBody: { success: false, error: "Email, password, and name required" } };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const verificationToken = jwt.sign({ email: body.email, type: "email-verification" }, JWT_SECRET, { expiresIn: "24h" });

    const pool = new ConnectionPool(getDBConfig());
    await pool.connect();

    try {
      const userId = uuidv4();
      await pool.request()
        .input("id", userId)
        .input("email", body.email)
        .input("passwordHash", hashedPassword)
        .input("name", body.name)
        .input("phone", body.phone || null)
        .input("verified", 0)
        .input("verificationToken", verificationToken)
        .input("createdAt", new Date())
        .query(`INSERT INTO users (id, email, passwordHash, name, phone, verified, verificationToken, createdAt) VALUES (@id, @email, @passwordHash, @name, @phone, @verified, @verificationToken, @createdAt)`);

      const verificationLink = `${process.env.APP_URL}/portal/verify-email?token=${verificationToken}`;
      console.log(`[INFO] Verification link: ${verificationLink}`);

      return { status: 201, jsonBody: { success: true, message: "Check email to verify account" } };
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { status: 500, jsonBody: { success: false, error: "Signup failed" } };
  }
}

app.http("v1-auth-signup", { methods: ["POST"], authLevel: "anonymous", handler: signupHandler });
