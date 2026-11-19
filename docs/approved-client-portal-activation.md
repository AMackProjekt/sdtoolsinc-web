# T.O.O.L.S. Inc. — Approval-only client portal activation

## Non-negotiable state transitions

1. Application saved -> `pending_review`; confirmation number issued. Applicant can receive an acknowledgment but **not portal access**.
2. The authorized Intake/Eligibility Review Board records a final APPROVED disposition with reviewer identity, timestamp, and audit log. Reject self-approval and any client-controlled status or role attributes.
3. Only after approval is confirmed in the authoritative database, create or link a single client auth user and enrollment row. Reuse the confirmation number as the approved **client ID**; optionally display it as portal username. Keep an internal immutable auth user ID for all record ownership and authorization.
4. Generate an expiring, one-time, identity-bound **activation invitation** for the verified email or SMS channel. Send only a link to the approved portal origin, never a plaintext password. Issuance should be idempotent, revocable and audited. Never accept a confirmation number by itself as proof of identity.
5. On opening the activation link or entering the OTP, verify the invitation server-side, re-check that approval is still active, and establish a limited activation session. **No workshop, resume, case record or client data access is allowed yet.**
6. First activation screen requires client to **create their personal password and confirm it**. If an existing temporary credential was used, require immediate replacement; prefer not to issue any temporary password. Password length at least 12 characters or a passphrase; no arbitrary composition rules; use a breached/common-password filter supported by the identity provider.
7. On successful provider-side password update, atomically mark `password_setup_completed_at` in a protected enrollment/activation state record. Revoke/consume the activation token, rotate or refresh session, then redirect to approved portal landing. Never accept a client-side 'completed' flag as evidence.
8. Every protected **server API** and the portal eligibility endpoint require: valid authenticated session, staff-approved active enrollment, auth user ID matches enrollment user ID, and password setup completed. For self-service username login, resolve client ID to the internal auth identity **server-side only**; perform proper authentication against the provider. Do not make direct Supabase Auth password calls with client ID in the email field.
9. Only clients with those conditions can open Workshops and MasterResumeBuilder V4. Enrollment revocation, suspension, or deleted sessions immediately remove access. Provide password reset/recovery via verified channel and safely re-evaluate account status.

## Communication

**Approval notice / activation message (email or SMS)**:
> T.O.O.L.S. Inc.: Your Intake/Eligibility application has been approved. Your Client ID is [CLIENT_ID]. Activate your secure client portal using the one-time link sent to your verified contact method. Create your personal password when prompted. The activation link expires; do not share it. Access to workshops and the enrolled-client resume builder becomes available after activation.

Do not send this while review is pending, or before an invitation has been issued successfully. Use an idempotent notification outbox and avoid sending the raw activation token to logging, analytics, query-tracking tools or third parties. A redirect URL can hold a short-lived signed provider token only if approved under the chosen auth flow and never used for unrelated case lookups.

## Existing code and gaps (Nov 18, 2026)

- `app/portal/auth/page.tsx` formerly offered public `signUp`; the public registration UI has been removed.
- `app/api/portal/eligibility/route.ts` validates authenticated Supabase user and `program_enrollments.status=accepted`, `approved_at`. It does **not** yet check `password_setup_completed_at` or revocation.
- `components/ui/PortalAdmissionGuard.tsx` is presentation only; it is not a server security boundary.
- `app/api/workshops/progress/route.ts` checks approved client enrollment but does not check first-password completion. Other workshop and resume endpoints need identical server-side gates.
- `app/auth/reset-password/page.tsx` has a provider password update form but is not an approved-client invitation flow; must not be treated as first-login activation without a server-validated invitation and status transition.
- Current login still authenticates with email, not the client ID alias; server username resolution is still to be built.
- No activation sender, secure invitation store, verification endpoint, activation session, password setup database field, or end-to-end tests have been verified. Do NOT invite real clients or claim activation is live until all blockers are closed.

## Required tests before enabling

Attempt portal/workshops/resume API access as: anonymous; pending applicant; approved without password setup; approved after password setup; revoked; staff; expired/reused activation token; client who types another person's ID; wrong OTP; wrong email/phone; concurrent approval sends. Only the approved + securely activated client should have access to their own permitted data. Tests must exercise server endpoints and RLS, not just UI navigation.

## Supabase specifics

Use supported one-time magic-link / OTP flows, with new-user auto-signup disabled on client login paths (`shouldCreateUser:false`), and verified destination / allowed redirect URLs. Auth passwords are managed by Supabase Auth or another centralized identity provider; never hash them in custom code or store raw passwords in a spreadsheet. Treat Supabase user IDs, not visible client IDs, as primary authorization identity. RLS and server checks must agree.
