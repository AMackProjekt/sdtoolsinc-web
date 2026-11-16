import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSign } from "node:crypto";
import { WORKSHOP_MODULES } from "@/lib/workshops/modules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store, private" };
const response = (body:object,status=200) => NextResponse.json(body,{status,headers:noStore});
type Account = { client_email:string; private_key:string; token_uri?:string };

/** No Google data is accessed unless every security requirement is provisioned. */
function configuration() {
  if (process.env.DOCUREADY_WORKSHOP_SYNC_ENABLED !== "true") return null;
  const json=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId=process.env.TOOLS_DB_SHEET_ID;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!json || !sheetId || !url || !anon) return null;
  try {
    const account=JSON.parse(json) as Account;
    if (!account.client_email || !account.private_key) return null;
    return {account,sheetId,url,anon};
  } catch { return null; }
}

async function currentClient(request:NextRequest, config:NonNullable<ReturnType<typeof configuration>>) {
  const header=request.headers.get("authorization") ?? "";
  const match=/^Bearer\s+(.{20,4096})$/.exec(header);
  if (!match) return null;
  const supabase=createClient(config.url,config.anon,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data,error}=await supabase.auth.getUser(match[1]);
  if (error || !data.user) return null;
  const {data:profile,error:profileError}=await supabase
    .from("profiles").select("role").eq("id",data.user.id).single();
  if (profileError || profile?.role!=="client") return null;
  // Require independently approved enrolled records before enabling
  // DOCUREADY_WORKSHOP_SYNC_ENABLED, not merely self-registered accounts.
  return data.user.id;
}

const toBase64Url=(s:string|Buffer) => Buffer.from(s).toString("base64url");
async function googleAccessToken(account:Account) {
  const now=Math.floor(Date.now()/1000);
  const uri="https://oauth2.googleapis.com/token";
  const header=toBase64Url(JSON.stringify({alg:"RS256",typ:"JWT"}));
  const payload=toBase64Url(JSON.stringify({
    iss:account.client_email,scope:"https://www.googleapis.com/auth/spreadsheets",
    aud:uri,iat:now,exp:now+2400,
  }));
  const input=header+"."+payload;
  const signer=createSign("RSA-SHA256");
  signer.update(input);
  signer.end();
  const assertion=input+"."+signer.sign(account.private_key).toString("base64url");
  const res=await fetch(uri,{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}),
    cache:"no-store",
  });
  if (!res.ok) throw new Error("Google OAuth exchange failed");
  const data=await res.json() as {access_token?:string};
  if (!data.access_token) throw new Error("Google OAuth token missing");
  return data.access_token;
}

async function recordedModules(config:NonNullable<ReturnType<typeof configuration>>,uid:string,token:string) {
  const range=encodeURIComponent("'Workshop_Progress'!A:D");
  const uri=`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}/values/${range}`;
  const res=await fetch(uri,{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
  if (!res.ok) throw new Error("Google Sheets read failed (verify Workshop_Progress tab, permissions and API)");
  const data=await res.json() as {values?:string[][]};
  return [...new Set((data.values??[]).filter(row=>row[0]===uid).map(row=>Number(row[1])).filter(n=>Number.isInteger(n)&&n>=1&&n<=4))].sort();
}

export async function GET(request:NextRequest) {
  const cfg=configuration();
  if (!cfg) return response({error:"Secure Google Sheets workshop sync is not activated."},503);
  try {
    const userId=await currentClient(request,cfg);
    if (!userId) return response({error:"Verified client sign-in is required."},401);
    const token=await googleAccessToken(cfg.account);
    return response({completed:await recordedModules(cfg,userId,token)});
  } catch { return response({error:"Unable to retrieve protected workshop progress."},503); }
}

export async function POST(request:NextRequest) {
  const cfg=configuration();
  if (!cfg) return response({error:"Secure Google Sheets workshop sync is not activated."},503);
  const contentType=request.headers.get("content-type")??"";
  if (!contentType.includes("application/json") || Number(request.headers.get("content-length")||0)>2048) return response({error:"Invalid request."},400);
  try {
    const userId=await currentClient(request,cfg);
    if (!userId) return response({error:"Verified client sign-in is required."},401);
    const body=await request.json() as {moduleId?:unknown;answers?:unknown};
    const id=body.moduleId;
    const module=WORKSHOP_MODULES.find(m=>m.num===id);
    if (!module || !Array.isArray(body.answers) || body.answers.length!==3 ||
      !body.answers.every(n=>Number.isInteger(n)&&n>=0&&n<=2)) return response({error:"Invalid quiz submission."},400);
    const score=module.quiz.reduce((acc,q,i)=>acc+(q.answer===body.answers[i]?1:0),0);
    if(score!==3)return response({passed:false,score,completed:false},200);
    const token=await googleAccessToken(cfg.account);
    const existing=await recordedModules(cfg,userId,token);
    if (!existing.includes(module.num)) {
      const range=encodeURIComponent("'Workshop_Progress'!A:D");
      const uri=`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cfg.sheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
      const res=await fetch(uri,{
        method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
        body:JSON.stringify({values:[[userId,String(module.num),"3",new Date().toISOString()]]}),
        cache:"no-store",
      });
      if(!res.ok)throw new Error("Google Sheets append failed");
    }
    return response({passed:true,score:3,completed:[...new Set([...existing,module.num])].sort()});
  } catch {return response({error:"Verified cloud save failed. No successful save can be confirmed."},503);}
}
