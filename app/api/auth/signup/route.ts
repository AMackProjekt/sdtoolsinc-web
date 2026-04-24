import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin();

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: name ?? email },
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Notify admin — non-blocking, never fails the signup
    sendAdminNotification(email, name ?? email).catch((err) =>
      console.error("[signup] Admin notification error:", err)
    );

    return NextResponse.json({ success: true, userId: data.user?.id });
  } catch (err) {
    console.error("[signup] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function sendAdminNotification(email: string, name: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@sdtoolsinc.org";

  if (!resendApiKey) {
    console.log(
      `[signup] New participant: ${name} <${email}> — set RESEND_API_KEY to enable notification emails`
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: "dmack@sdtoolsinc.org",
      subject: `New Participant Signup — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">New Participant Signup</h2>
          <p>
            <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>) has created
            an account on the T.O.O.L.S Inc Participant Portal.
          </p>
          <p>Please review their request and approve or deny access from the admin portal.</p>
          <p style="margin-top: 32px; color: #94a3b8; font-size: 12px;">
            T.O.O.L.S Inc Platform — Automated Notification
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[signup] Resend API error ${response.status}:`, text);
  }
}
