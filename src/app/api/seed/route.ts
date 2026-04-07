import { NextResponse } from "next/server";
import { upsertAdminCredential, upsertStaffCredential, upsertClientCredential, setEnterpriseRoles } from "@/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  
  // Protect route in production
  if (process.env.NODE_ENV === "production") {
    if (!process.env.SETUP_TOKEN || token !== process.env.SETUP_TOKEN) {
      return NextResponse.json({ error: "Forbidden. Invalid or missing SETUP_TOKEN." }, { status: 403 });
    }
  }

  const email = "dmack@sdtoolsinc.org";
  const password = "Mackematicks";

  try {
    // 1. Seed as Admin
    await upsertAdminCredential({
      email,
      password,
      name: "DMack",
      username: "dmack_admin"
    });

    // 2. Seed as Staff
    await upsertStaffCredential({
      email,
      password,
      name: "DMack",
        username: "dmack_staff"
    });

    // 3. Seed as Client (Catch-all)
    await upsertClientCredential({
      email,
      password,
      name: "DMack",
      username: "dmack_client",
      mustChangePassword: false
    });

    // 4. Grant Enterprise Roles for all suites
    await setEnterpriseRoles(email, [
      "executive", 
      "hr-staff", 
      "newsroom-contributor", 
      "newsroom-editor",
      "auditor"
    ] as any[]);

    return NextResponse.json({ 
      success: true, 
      message: `Credentials and enterprise roles successfully seeded for ${email}`,
      next_steps: [
        "In your Vercel / Azure environment variables, ensure ADMIN_ALLOWLIST contains 'dmack@sdtoolsinc.org'.",
        "Ensure STAFF_ALLOWLIST contains 'dmack@sdtoolsinc.org'."
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
