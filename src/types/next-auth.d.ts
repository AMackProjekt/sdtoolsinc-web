import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "staff" | "client" | "admin";
      enterpriseRoles?: ("executive" | "hr-staff" | "newsroom-contributor" | "newsroom-editor")[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "staff" | "client" | "admin";
    enterpriseRoles?: ("executive" | "hr-staff" | "newsroom-contributor" | "newsroom-editor")[];
  }
}
