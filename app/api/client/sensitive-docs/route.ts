import { NextResponse } from "next/server";
import { requireClientSession } from "@/lib/client-auth";

export async function GET(request: Request) {
  const result = await requireClientSession(request);
  if (result instanceof NextResponse) return result;

  const { user } = result;
  return NextResponse.json({
    data: `Sensitive documents are locked until ${user.username} completes password rotation.`,
    user: { username: user.username, name: user.name },
  });
}
