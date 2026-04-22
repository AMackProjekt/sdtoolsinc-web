#!/usr/bin/env node

/**
 * CLI script to generate full-access pass tokens for enterprise users.
 * Usage: npx tsx scripts/generate-tokens.ts
 */

import { addToken, listTokens } from "@/lib/token-store";

const USERS = [
  { email: "dmack@sdtoolsinc.org", role: "admin" as const },
  { email: "dmack@sdtoolsinc.com", role: "admin" as const },
];

async function main() {
  console.log("🔐 Generating full-access pass tokens for enterprise users...\n");

  const tokens: Array<{ email: string; plainToken: string; createdAt: string }> = [];

  for (const user of USERS) {
    try {
      const { token: storedToken, plainToken } = await addToken(user.email, user.role);
      tokens.push({
        email: storedToken.email,
        plainToken,
        createdAt: storedToken.createdAt,
      });
      console.log(`✅ Token created for ${storedToken.email}`);
    } catch (err) {
      console.error(`❌ Failed to create token for ${user.email}:`, err);
    }
  }

  console.log("\n📋 Generated Tokens:\n");
  console.log("=" + "=".repeat(79));

  tokens.forEach((t, idx) => {
    console.log(`\n${idx + 1}. Email: ${t.email}`);
    console.log(`   Token: ${t.plainToken}`);
    console.log(`   Created: ${t.createdAt}`);
    console.log(`   Usage: Add to Authorization header as: Bearer ${t.plainToken}`);
  });

  console.log("\n" + "=" + "=".repeat(79));
  console.log("\n⚠️  IMPORTANT:");
  console.log("   • Save these tokens securely. They are shown only once.");
  console.log("   • Store in your password manager or secure vault.");
  console.log("   • Do NOT commit these tokens to version control.");
  console.log("   • Use them in HTTP requests with Authorization: Bearer TOOLS_xxxx\n");

  console.log("📊 All Tokens Summary:\n");
  const allTokens = await listTokens();
  console.log(`Total active tokens in system: ${allTokens.length}`);
  allTokens.forEach((t) => {
    const status = new Date(t.expiresAt || "2099-12-31").getTime() < Date.now() ? "❌ EXPIRED" : "✅ ACTIVE";
    console.log(`   • ${t.email} (${t.role}) - ${status}`);
  });

  console.log("\n✨ Token generation complete!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
