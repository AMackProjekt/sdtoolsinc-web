import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const staffAllowlist = (process.env.STAFF_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const clientAllowlist = (process.env.CLIENT_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const dfcDomain = (process.env.WORKSPACE_DOMAIN ?? "dreamsforchange.org").toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile && typeof profile.email === "string") {
        const email = profile.email.toLowerCase();
        const isStaff =
          staffAllowlist.includes(email) ||
          (!clientAllowlist.includes(email) && email.endsWith(`@${dfcDomain}`));
        token.role = isStaff ? "staff" : "client";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "staff" | "client" | undefined) ?? "client";
      }
      return session;
    },
    async signIn({ profile }) {
      if (!profile?.email) return false;
      const email = profile.email.toLowerCase();
      const isAllowedDomain = email.endsWith(`@${dfcDomain}`);
      const isAllowlisted = staffAllowlist.includes(email) || clientAllowlist.includes(email);
      return isAllowedDomain || isAllowlisted;
    },
  },
});
