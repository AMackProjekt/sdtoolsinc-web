#!/usr/bin/env node
/**
 * Test: client instant chat → staff receives message
 *
 * Simulates:
 *   - Client ("the Champ") sends a DM to Staff ("Mack")
 *   - Queries the conversation as Staff to verify delivery
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = "https://rightful-firefly-201.convex.cloud";
const CLIENT_ID = "the Champ";
const STAFF_ID = "Mack";
const TEST_BODY = `[Test] Client → Staff chat at ${new Date().toLocaleTimeString()}`;

const client = new ConvexHttpClient(CONVEX_URL);

async function run() {
  console.log("=== Chat Delivery Test ===\n");
  console.log(`Convex URL : ${CONVEX_URL}`);
  console.log(`Client ID  : ${CLIENT_ID}`);
  console.log(`Staff ID   : ${STAFF_ID}`);
  console.log(`Message    : ${TEST_BODY}\n`);

  // 1. Send message as client
  console.log("1. Sending DM (client → staff)...");
  await client.mutation(api.functions.sendDirectMessage, {
    senderId: CLIENT_ID,
    receiverId: STAFF_ID,
    senderRole: "client",
    body: TEST_BODY,
  });
  console.log("   ✓ Mutation succeeded\n");

  // 2. Query conversation as staff (userA/userB order shouldn't matter — convKey is sorted)
  console.log("2. Querying conversation (staff perspective)...");
  const messages = await client.query(api.functions.getDirectMessages, {
    userA: STAFF_ID,
    userB: CLIENT_ID,
  });

  if (!Array.isArray(messages) || messages.length === 0) {
    console.error("   ✗ No messages returned — something is wrong!");
    process.exit(1);
  }

  const last = messages[messages.length - 1];
  console.log(`   ✓ ${messages.length} message(s) in thread`);
  console.log(`   Most recent: "${last.body}" from ${last.senderId} at ${last.ts}\n`);

  // 3. Verify the message we just sent is the latest
  if (last.body === TEST_BODY && last.senderId === CLIENT_ID) {
    console.log("✅ PASS — Staff receives client's message in real-time via Convex.\n");
  } else {
    console.warn("⚠️  Latest message doesn't match what we sent. Check for race conditions or ID mismatch.");
    console.warn("    Expected body  :", TEST_BODY);
    console.warn("    Actual body    :", last.body);
    console.warn("    Expected sender:", CLIENT_ID);
    console.warn("    Actual sender  :", last.senderId);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("✗ Test failed with error:", err.message ?? err);
  process.exit(1);
});
