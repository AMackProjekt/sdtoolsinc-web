import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, private" };
function reply(body:object,status=200){return NextResponse.json(body,{status,headers});}

/** Only an independently confirmed program acceptance grants portal access.
 * Missing fields/tables/configurations deny by default.
 */
export async function GET(request:NextRequest) {
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!supabaseUrl||!key)return reply({accepted:false,reason:"Access verification unavailable"},503);
 const match=/^Bearer\s+(.{20,4096})$/.exec(request.headers.get("authorization")??"");
 if(!match)return reply({accepted:false,reason:"Sign-in required"},401);
 try{
  const supabase=createClient(supabaseUrl,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error}=await supabase.auth.getUser(match[1]);
  if(error||!user)return reply({accepted:false,reason:"Sign-in required"},401);
  // Enrollment approval is intentionally distinct from authentication.
  // Staff must provision and secure the program_enrollments table through RLS.
  const {data,error:enrollmentError}=await supabase.from("program_enrollments")
   .select("status,approved_at").eq("user_id",user.id).eq("status","accepted")
   .not("approved_at","is",null).limit(1).maybeSingle();
  if(enrollmentError||!data)return reply({accepted:false,reason:"Intake acceptance has not been confirmed"});
  return reply({accepted:true});
 }catch{return reply({accepted:false,reason:"Could not verify acceptance"},503);}
}
