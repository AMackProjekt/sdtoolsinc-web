import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Resend } from "resend";
import { ensureTrustedOrigin } from "@/lib/request-security";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailBlastBody {
  subject: string;
  body: string;
  recipients: string[];
}

export async function POST(req: NextRequest) {
  const originError = ensureTrustedOrigin(req);
  if (originError) return originError;

  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: EmailBlastBody;
  try {
    payload = (await req.json()) as EmailBlastBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { subject, body, recipients } = payload;

  if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json({ error: "subject, body, and at least one recipient are required" }, { status: 400 });
  }

  // Validate email format to prevent header injection
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRecipients = recipients.filter((r) => typeof r === "string" && emailRegex.test(r));

  if (validRecipients.length === 0) {
    return NextResponse.json({ error: "No valid recipient email addresses found" }, { status: 400 });
  }

  const failed: string[] = [];
  let sent = 0;

  for (const to of validRecipients) {
    try {
      const { error } = await resend.emails.send({
        from: "T.O.O.LS INC <noreply@dreamsforchange.org>",
        to,
        subject,
        text: body,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <p style="font-size:13px;color:#64748b;margin-bottom:16px">From: T.O.O.LS INC Admin</p>
          <div style="white-space:pre-wrap;font-size:14px;color:#1e293b;line-height:1.6">${escapeHtml(body)}</div>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0"/>
          <p style="font-size:11px;color:#94a3b8">This message was sent via the DFC Staff Portal. Do not reply to this email.</p>
        </div>`,
      });
      if (error) {
        failed.push(to);
      } else {
        sent++;
      }
    } catch {
      failed.push(to);
    }
  }

  return NextResponse.json({ sent, failed });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}
