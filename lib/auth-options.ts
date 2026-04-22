import { Account, NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
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

    // ── Email / Password via Supabase ─────────────────────────
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
        const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
        if (!supaUrl.startsWith("http")) return null;
        try {
          const supa = createClient(supaUrl, supaKey);
          const { data, error } = await supa.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
          if (error || !data.user) return null;
          return {
            id: data.user.id,
            email: data.user.email ?? "",
            name: (data.user.user_metadata?.full_name as string | undefined)
              ?? data.user.email
              ?? "",
            image: (data.user.user_metadata?.avatar_url as string | undefined) ?? null,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // Allow any successfully authenticated OAuth user.
      // Enterprise-portal domain restriction is enforced in middleware.
      return !!user?.email;
    },

    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
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
        const sessionUser = session.user as Session["user"] & {
          id?: string;
          role?: string;
          provider?: string;
        };
        sessionUser.id = token.sub;
        sessionUser.role = token.role as string | undefined;
        sessionUser.provider = token.provider as string | undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: "/portal/auth",
    error: "/portal/auth",
  },
};
