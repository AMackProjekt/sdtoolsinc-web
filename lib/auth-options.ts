import { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { JWT } from "next-auth/jwt";

/** Domains allowed to access the Enterprise portal */
const ENTERPRISE_DOMAINS = (process.env.ENTERPRISE_ALLOWED_DOMAINS ?? "sdtoolsinc.org,sdtoolsinc.com")
  .split(",")
  .map((d) => d.trim().toLowerCase());

/** Returns true if the email belongs to an allowed enterprise domain */
function isEnterpriseEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return ENTERPRISE_DOMAINS.includes(domain ?? "");
}

export const authOptions: NextAuthOptions = {
  // Use encrypted JWT cookies — no database adapter required
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  providers: [
    // ── Google Workspace ──────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // ── Microsoft 365 / Azure AD (Entra ID) ──────────────────
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID ?? "common",
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // Allow any successfully authenticated OAuth user.
      // Enterprise-portal domain restriction is enforced in middleware.
      return !!user?.email;
    },

    async jwt({ token, user, account }: { token: JWT; user?: User; account?: any }) {
      if (user) {
        token.sub = user.id ?? token.sub;
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture;
        token.provider = account?.provider ?? "unknown";
        token.role =
          user.email === process.env.ENTERPRISE_ADMIN_EMAIL
            ? "enterprise_admin"
            : isEnterpriseEmail(user.email)
            ? "enterprise_viewer"
            : "user";
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },

  pages: {
    signIn: "/portal/auth",
    error: "/portal/auth",
  },
};
