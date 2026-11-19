import { randomBytes } from "node:crypto";

/**
 * Server-only issuance. Generate before the intake transaction and persist it
 * with a UNIQUE constraint in the authoritative intake record. Retry on collision.
 * This is a public tracking identifier, NEVER an authentication secret.
 */
export function issueApplicationReference(year = new Date().getUTCFullYear()): string {
  if (!Number.isInteger(year) || year < 2020 || year > 9999) throw new Error("Invalid year");
  return "TLS-" + year + "-" + randomBytes(9).toString("hex").toUpperCase();
}

export function isApplicationReference(value: unknown): value is string {
  return typeof value === "string" && /^TLS-[2-9][0-9]{3}-[A-F0-9]{18}$/.test(value);
}

export type IntakeRecordStatus = "pending_review" | "more_information" | "approved" | "warm_referral" | "declined";

/**
 * Conversion does not create an account or grant access. Call only after
 * Board approval has been persisted by an authorized reviewer.
 */
export function approvedClientId(record: {
  confirmationNumber: string;
  status: IntakeRecordStatus;
  approvedAt?: string | null;
}): string | null {
  if (!isApplicationReference(record.confirmationNumber)) throw new Error("Invalid application reference");
  if (record.status !== "approved" || !record.approvedAt ||
      !Number.isFinite(Date.parse(record.approvedAt))) return null;
  return record.confirmationNumber;
}

/** The ID may be shown in a username field, but authentication still requires
 * verified email/SMS OTP or another secure identity-bound sign-in method.
 * Possession or knowledge of the number alone must grant NO case access.
 */
