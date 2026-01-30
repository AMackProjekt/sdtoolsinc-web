import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

      return NextResponse.redirect(`${requestUrl.origin}/`);
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=callback_error`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
