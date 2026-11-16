# DocuReady Work-Readiness Academy — release gate

## November 2026 frontend delivery
The owner supplied a full standalone HTML/Apps Script reference. The current Next.js site does **not** host that standalone HTML or automatically inherit its Apps Script methods. Its four curriculum records were preserved in `lib/workshops/modules.ts` and implemented in `components/ui/WorkshopAcademy.tsx`.

Tab 3 on `sdtoolsinc.org/#docuready` includes:
1. Digital Literacy, Email & Calendar Readiness
2. Financial Basics, Budgeting & Benefits Management
3. California Fair Chance Act (AB 1008) & Interview Prep
4. Workplace Communication & Retention

Each has three navigable **scripted text chapters**, an action worksheet downloadable as `.txt`, and a self-grading three-question quiz requiring 3/3. **The source does not contain MP4 or embedded video URLs.** Do not market these as playable filmed lessons until media is supplied and tested.

Public previews do not transmit personal information or award enrollment/completion records. The authenticated `/portal/workshops` screen uses the actual Supabase session and role; do not use the legacy mock `lib/auth.tsx` localStorage session for completion authorization.

## Authenticated cloud-sync implementation (fail closed)

`app/api/workshops/progress/route.ts`:
- Requires `DOCUREADY_WORKSHOP_SYNC_ENABLED=true`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `TOOLS_DB_SHEET_ID`, and valid Supabase URL/anon key in **server environment**. Otherwise GET/POST return 503 and do not write anything.
- Requires a valid Supabase bearer token revalidated server-side via `auth.getUser()` and matching `profiles.role=client`.
- POST accepts only one module ID and exactly three quiz answers. Checks all three answers on the server before attempting a Sheets write; no direct client-supplied completion flags.
- Uses Google Sheets API server-to-server, OAuth service-account JWT, and a `Workshop_Progress` sheet with columns **Supabase_User_ID | Module_ID | Quiz_Score | Completed_At**.
- Rejects missing credentials, failed OAuth/Sheets writes, and unauthorized requests; never reports a successful save if Google Sheets rejects it.
- Records only an opaque Supabase user ID and workshop completion metadata, not DOB, release, case details, resume data or client access code.

**Activation is blocked pending security verification:** The Worker may have a separate Google service-account secret but it is NOT automatically accessible to Azure. Never commit or paste secret values to GitHub. Create the `Workshop_Progress` tab with exactly the expected header and grant least-privilege sheet access to the account. Confirm an **independent server-side approved-enrollment check**, not just a self-signup client role, before enabling this feature flag; the current role check alone does not prove director approval. Add request throttling and collision-safe idempotency before deployment of high-volume writes. Review contractual/privacy obligations, audit and retention policies for educational records.

## Acceptance tests before enabling live sync
- Anonymous and invalid JWT calls fail with 401 when configured; an unauthorized/non-client role fails.
- No Google calls on a missing feature flag or credentials.
- Wrong quiz answers cannot create a completion record; scores are recomputed on the server.
- Passing all three questions appends exactly one record and is idempotent for repeated submissions.
- Signed-in client reload restores only their own four completion flags.
- Google failure returns 503, displays an unsynced warning, and never claims cloud success.
- Protected clients cannot access another client's workshop data or submit a user ID of their choosing.
- Actual approval check, retention policy, rate limits, and integration tests pass before activation.

**Current state:** Curriculum/frontend and a gated backend implementation are committed. No live Google Sheets write, consent compliance, or recording-based lesson is confirmed yet.
