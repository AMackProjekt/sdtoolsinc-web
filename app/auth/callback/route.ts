import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth exchange error:", error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=auth_error`
        );
      }

      // Get the user to check their role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check user's role in profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // Redirect based on role
        const role = profile?.role;
        if (role === "admin") {
          return NextResponse.redirect(`${requestUrl.origin}/admin/dashboard`);
        } else if (role === "case_manager") {
          return NextResponse.redirect(
            `${requestUrl.origin}/portal/manager/dashboard`
          );
        } else {
          // Default to client portal
          return NextResponse.redirect(
            `${requestUrl.origin}/portal/client/dashboard`
          );
        }
      }
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=callback_error`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
