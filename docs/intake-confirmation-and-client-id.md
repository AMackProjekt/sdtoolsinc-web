# T.O.O.L.S. Inc. application confirmation and client ID contract

## Identifier lifecycle

1. On protected intake submission, the server generates one unpredictable unique **confirmation number** (example FORMAT ONLY: `TLS-2026-0123456789ABCDEF01`). It is stored atomically in the authoritative application row with status `pending_review` and an immutable receipt timestamp. Enforce a UNIQUE constraint and retry rare collisions. Never generate real references on the public client UI.
2. **Only after the durable save succeeds**, queue the immediate submission acknowledgment. Send the same number in email/SMS (verified contact + SMS consent required) and in the private on-screen submission success response. Do not claim receipt if storage fails.
3. The public branded link `/intake/received` shows standard information and the logo only. It contains **no application ID, name, contact information, token, status, or other sensitive data in URL query parameters**. The actual confirmation number is included in the direct message or authenticated receipt; opening the generic link alone never grants case access.
4. Before Board approval, status remains pending or more-information-needed; the confirmation number is **not a client ID and not a portal account**. The Board can use it for internal case lookup.
5. After authorized Board approval is durably recorded, **reuse the exact confirmation number as client ID** and (optionally) as the portal's visible username. An applicant with no approval must not be issued a client identity, even when the client completed the form.
6. Portal authentication must still verify a current email/SMS OTP or another secure independent factor and bind the session to the approved internal user identity. A confirmation number/username alone is publicly knowable and must **never** grant access; do not use it as a password, bearer token, or sole lookup proof.
7. All client record access must validate verified identity, approval status and record ownership server-side (RLS where applicable). Rate-limit identifier lookup and avoid existence leaks. Keep an audit trail for issuance, decisions and notifications.

## Staff UI and status tracking

Protected queue fields: Confirmation Number, Submitted At, Review Status, Assigned Reviewer, Board Decision, Decision Date, Contact Verification, Notification Delivery State. Client may reference the number in follow-up without gaining read access to records. Do not include sensitive details in unprotected staff alerts.

## Delivery contract

Receipt message assembly is defined in `lib/intake/submission-receipt.ts`. It validates `persisted: true`, `pending_review`, a syntactically valid confirmation number, and verified destination before returning an email/SMS payload. The actual sender/outbox, database transaction, final Board notice, and secure status-check API remain **unimplemented**. Do not deploy a public case-status endpoint that accepts only this reference.

## Security and deployment

The implementation helper in `lib/intake/application-reference.ts` is for server-side ID issuance and approval-gated conversion only. It does not create an identity, modify Supabase records or authenticate anyone. Confirm email/SMS retention, access and notices with legal/privacy review before enabling real applicants.
