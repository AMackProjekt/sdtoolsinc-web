# DocuReady Cloud Intake — implementation contract and security release gate

Source: owner-supplied **Architecture of the DocuReady Flow** (November 2026). This document preserves the four-stage workflow but does not assert that the sensitive-data backend is production-ready.

## Current verified setup

- Public landing page: `https://sdtoolsinc.org` (Next.js on Azure Static Web Apps, through Cloudflare DNS).
- Protected portals landing: `https://sdtoolsinc.com`, with existing Cloudflare Zero Trust restrictions.
- Cloudflare Worker: `api.sdtoolsinc.com`, service `tools-inc-backend-api`. `/api/healthz` works; `GEMINI_API_KEY` exists.
- Worker sensitive endpoints `/api/intake`, `/api/director/approve`, `/api/client/verify`, `/api/client/save` are **disabled**. Director cases endpoint is not enabled.
- Public Track A/B tracker records **only a track code and checked milestone indices** in local storage; do not store names, DOB, release information, health or case data.
- `lib/docuready/flow.ts` provides a typed, pure in-memory mapping contract, **not** a submission transport or an authentication mechanism.

## Target workflow

1. **Krucial 72-Hour Quick Form**: Track A (Justice-Involved / Reentry) or Track B (Community); six milestones (CA ID, PRONTO, CalFresh, phone, housing, first income), plus 0–72-hour priorities. Personal identity fields must be collected within a secured workflow and never written to public local storage.
2. **DocuReady Track A/B Intake**: Prepopulate draft within authenticated context; require informed notice and a deliberate submit action. Server-side validation; AES-256-GCM encryption using a required validated key; store to the `DocuReady_Intakes` sheet with unique server-generated case ID and pending-review status. Director alert must omit PII/PHI.
3. **Director Approval**: Restrict `/api/director/cases` and `/api/director/approve` through verified Cloudflare Access identity, explicit director role/allowlist and audit logs. A stand-alone static PIN is insufficient. Only after authorized approval, issue a high-entropy, expiring, revocable enrollment invitation; configure Google Calendar/Meet orientation and send minimal notification after checking every upstream response.
4. **Client Portal**: Verify the invitation through a protected identity-bound exchange. Issue short-lived sessions (or server sessions), with expiration, issuer/audience, key rotation and revocation; enforce server-side access to permitted workshops/resume fields; encrypt stored personal resume content. Workshop progress cannot be saved without a valid server-side session.

## Google storage schema — user-supplied

`DocuReady_Intakes`: `Case_ID | Timestamp | Status | Track | Full_Name_Enc | DOB_Enc | Phone_Enc | Email_Enc | Housing_Enc | Disposition | Release_Enc | DPO_Enc | Community_Need_Enc | Completed_6_Steps | Checked_72Hr_Tasks | Notes_Enc | Client_Access_Code | Google_Meet_Link`.

`Enrolled_Clients`: `Client_Access_Code | Case_ID | Full_Name_Enc | Email_Enc | Track | Approved_Date | Completed_Modules | Resume_JSON_Enc | Google_Meet_Link`.

**Security refinement:** `Client_Access_Code` should be stored as a salted/hash-verified or keyed digest, **not plaintext**; release/invite secrets should never be embedded in calendar descriptions or returned to general staff views. A Google Sheet is only permissible after access controls, auditability, retention/deletion rules, institutional permission, and contractual data handling are assessed.

## Required Cloudflare secrets and bindings (not committed)

- `GOOGLE_SERVICE_ACCOUNT_JSON` (least privilege, Sheets and authorized Calendar only)
- `TOOLS_DB_SHEET_ID` and `GOOGLE_CALENDAR_ID` (IDs, not access credentials; appropriate protected configuration)
- `PHI_ENCRYPTION_KEY` (valid AES-256-GCM key, securely generated and versioned)
- `JWT_SECRET` or preferably asymmetric signing keypair + key rotation
- `FRONTEND_ORIGINS` (strict actual host allowlist; CORS never authenticates requests)
- Cloudflare Access application and JWT verification for director roles
- Transactional email provider credentials, consent controls, and templates for welcome packets

## Mandatory release-blocking corrections to supplied sample

- **Fail closed on encryption**: the sample `encryptField` returns plaintext if its key is missing or malformed. Replace this with a hard failure before any write.
- **Never use only a director PIN**: despite constant-time PIN comparisons, the sample provides neither identity nor role authorization, rate limiting or session bound approvals. Also do not expose case PII in an unprotected `GET`.
- **Avoid short reusable client codes**: a 3-byte code is brute-forceable without rate limits. Use longer cryptographically random, expiring, single-use invitations or access tied to verified client identity.
- **Reject unknown CORS origins** rather than returning a default allow-origin; and apply authenticated authorization on every protected route.
- **Check Google API response status**: sample Sheets helpers silently ignore failed appends/updates. A 200 response to a client must represent a confirmed durable write.
- **Ensure idempotency and consistency**: approval must not issue multiple invites, duplicate enrolled rows, or mark approved when Calendar/Sheets/email steps fail. Use an operation ID and durable workflow/outbox; retries must be safe.
- **No PII/PHI in alerts, application logs, analytics, URLs, public email or calendar metadata**. Orientations can use a case reference and neutral meeting title, with minimal attendees.
- **Consent and compliance review**: HIPAA applicability, BAAs (if required), data minimization, access grants, retention schedule, breach response and client notices need documented assessment. Encryption alone does not establish HIPAA compliance.
- **Service credentials**: never expose service account JSON, Director identity credentials, encryption or JWT secrets to browsers, GitHub or chat.
- **Separate domains correctly**: `.org` remains public landing; `.com` remains protected portal; `api.sdtoolsinc.com` is a Worker under .com. Do not describe public site as hosted on Cloudflare Pages while Next.js remains on Azure.

## Acceptance tests before enabling submission

- Public page contains no sensitive form submission capability or PII persistent storage.
- Prepopulation retains Track A/Track B differences and all six milestone selections without silently sending data.
- Client intake rejects invalid input and unauthorized origins/identities; encryption without a key fails closed.
- Google Sheets failure produces an error, not a false case confirmation.
- Director cannot read/approve without a valid Access JWT and correct role; approvals are logged and idempotent.
- Client code cannot be guessed, reused after expiry, or used to access other cases.
- Calendar failures do not create fake success confirmations; no access code appears in invite descriptions.
- End-to-end tests with synthetic records validate Track A, Track B, authorization, encryption, save/reload, and recovery.
- Privacy and security review complete before handling live records.

## Rollout

1. Agree on identity, permissions, data processor terms, retention schedule and encryption key management.
2. Create access-controlled Sheets & Calendar resources and grant least-privilege service-account permissions.
3. Build and test a separate staging Worker with isolated test credentials and fictitious data.
4. Connect protected forms and do integration/security tests.
5. Release behind an explicit feature flag, monitor access and errors; only then enable live intakes.

Do **not** deploy the user-supplied sample Worker verbatim to production.
