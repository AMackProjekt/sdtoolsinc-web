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

export async function caseManagerClientsHandler(request: HttpRequest): Promise<HttpResponseInit> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return { status: 401, jsonBody: { success: false, error: "Missing auth" } };

    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return { status: 401, jsonBody: { success: false, error: "Invalid token" } };
    }
    if (decoded.role !== "case_manager") return { status: 403, jsonBody: { success: false, error: "Access denied" } };

    const pool = new ConnectionPool(getDBConfig());
    await pool.connect();

    try {
      const result = await pool.request()
        .input("caseManagerId", decoded.userId)
        .query(`SELECT u.id, u.name, u.email, COUNT(e.id) as enrollmentCount, 
                MAX(m.createdAt) as lastContactDate
                FROM users u
                LEFT JOIN enrollments e ON u.id = e.userId
                LEFT JOIN messages m ON u.id = m.recipientId
                WHERE u.caseManagerId = @caseManagerId
                GROUP BY u.id, u.name, u.email`);

      return { status: 200, jsonBody: { success: true, clients: result.recordset } };
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error("Error:", error);
    return { status: 500, jsonBody: { success: false, error: "Failed to fetch clients" } };
  }
}

app.http("v1-casemgr-clients", { methods: ["GET"], authLevel: "anonymous", handler: caseManagerClientsHandler });
