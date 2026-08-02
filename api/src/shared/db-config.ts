import { ConnectionPool, config as SQLConfig } from "mssql";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export function getDBConfig(): SQLConfig {
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

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";
export const JWT_EXPIRY = "7d";
