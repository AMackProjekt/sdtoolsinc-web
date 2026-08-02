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

export async function clientProgressHandler(request: HttpRequest): Promise<HttpResponseInit> {
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

    const clientId = request.params.clientId;
    if (!clientId) return { status: 400, jsonBody: { success: false, error: "Client ID required" } };

    const pool = new ConnectionPool(getDBConfig());
    await pool.connect();

    try {
      const clientResult = await pool.request()
        .input("clientId", clientId)
        .query(`SELECT id, caseManagerId FROM users WHERE id = @clientId`);

      if (clientResult.recordset.length === 0) return { status: 404, jsonBody: { success: false, error: "Client not found" } };

      const client = clientResult.recordset[0];
      if (decoded.role !== "admin" && client.caseManagerId !== decoded.userId) {
        return { status: 403, jsonBody: { success: false, error: "Access denied" } };
      }

      const progressResult = await pool.request()
        .input("clientId", clientId)
        .query(`SELECT c.id, c.title, COUNT(l.id) as totalLessons, COUNT(cl.id) as completedLessons
                FROM courses c
                LEFT JOIN lessons l ON c.id = l.courseId
                LEFT JOIN completedLessons cl ON l.id = cl.lessonId
                GROUP BY c.id, c.title`);

      const certificatesResult = await pool.request()
        .input("clientId", clientId)
        .query(`SELECT id, courseId, issuedDate FROM certificates WHERE userId = @clientId`);

      const goalsResult = await pool.request()
        .input("clientId", clientId)
        .query(`SELECT id, description, status, dueDate FROM goals WHERE userId = @clientId`);

      return { status: 200, jsonBody: { success: true, courses: progressResult.recordset, certificates: certificatesResult.recordset, goals: goalsResult.recordset } };
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error("Error:", error);
    return { status: 500, jsonBody: { success: false, error: "Failed to fetch progress" } };
  }
}

app.http("v1-casemgr-client-progress", { methods: ["GET"], authLevel: "anonymous", handler: clientProgressHandler });
