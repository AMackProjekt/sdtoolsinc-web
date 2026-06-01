import { NextResponse } from "next/server";
import { verifyPassword, updateClientUserPassword } from "@/lib/client-users";
import { requireClientPasswordResetSession } from "@/lib/client-auth";
import { isRateLimited, buildRateLimitKey } from "@/lib/rate-limit";

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_RULES = [
  { regex: /[A-Z]/, label: "uppercase letter" },
  { regex: /[a-z]/, label: "lowercase letter" },
  { regex: /[0-9]/, label: "number" },
  { regex: /[@$!%*?&]/, label: "special character" },
];

function validateNewPassword(password: string, confirmPassword: string): string | null {
  if (!password || typeof password !== "string") return "New password is required.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `New password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  for (const rule of PASSWORD_RULES) {
    if (!rule.regex.test(password)) {
      return `New password must contain at least one ${rule.label}.`;
    }
  }
  if (password !== confirmPassword) {
    return "New password and confirm password must match.";
  }
  return null;
}

export async function POST(request: Request) {
  const result = await requireClientPasswordResetSession(request);
  if (result instanceof NextResponse) return result;

  const { user } = result;
  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const rateLimitKey = buildRateLimitKey(["client-reset", ipAddress, user.username]);
  if (isRateLimited(rateLimitKey, 5, 60_000)) {
    return NextResponse.json(
      { error: "RATE_LIMIT_EXCEEDED", message: "Too many password reset attempts. Try again in a minute." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const currentPassword = body?.currentPassword;
  const newPassword = body?.newPassword;
  const confirmPassword = body?.confirmPassword;

  if (!currentPassword || typeof currentPassword !== "string") {
    return NextResponse.json({ error: "Current password is required." }, { status: 400 });
  }

  const validationError = validateNewPassword(newPassword, confirmPassword);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const isCurrentValid = verifyPassword(currentPassword, user.passwordHash, user.salt);
  if (!isCurrentValid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await updateClientUserPassword(user.username, newPassword);
  return NextResponse.json({ message: "Security profile updated. Redirecting to vault..." }, { status: 200 });
}
