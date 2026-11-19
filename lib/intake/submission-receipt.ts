/**
 * Post-submission receipt contract for T.O.O.L.S. Inc.
 *
 * NEVER call from a public form, checkbox change, or before a durable
 * server-confirmed intake save. A verified contact channel and consent
 * are prerequisites. The worker's outbox must handle idempotent delivery.
 */
export type ReceiptChannel = "email" | "sms";
export interface VerifiedReceiptContact {
  channel: ReceiptChannel;
  address: string;
  verifiedAt: string; // server-attested, not client asserted
  notificationConsentAt?: string; // required for SMS
}
export interface ConfirmedIntakeReceipt {
  caseId: string;
  savedAt: string;
  status: "pending_review";
  persisted: true;
}
export interface IntakeReceiptMessage {
  channel: ReceiptChannel;
  destination: string;
  subject?: string;
  body: string;
  idempotencyKey: string;
}

/** Message content intentionally omits name, justice status, housing and other sensitive details. */
export const RECEIPT_MESSAGE_TEXT =
  "Thank you for completing the T.O.O.L.S. Inc. Intake/Eligibility Form. " +
  "We have received your application. Please allow up to 72 hours for our Intake/Eligibility Review Board " +
  "to review the information you provided. A board representative will contact you regarding next steps. " +
  "Submission does not guarantee acceptance into services. " +
  "If you have an immediate emergency, please contact appropriate emergency services.";

export function prepareIntakeReceipt(
  receipt: ConfirmedIntakeReceipt,
  contact: VerifiedReceiptContact,
): IntakeReceiptMessage {
  if (receipt.persisted !== true || receipt.status !== "pending_review" ||
      !receipt.caseId.trim() || !Number.isFinite(Date.parse(receipt.savedAt))) {
    throw new Error("Verified saved intake receipt required");
  }
  if (!contact.verifiedAt || !Number.isFinite(Date.parse(contact.verifiedAt))) {
    throw new Error("Verified contact required");
  }
  if (contact.channel !== "email" && contact.channel !== "sms") {
    throw new Error("Unsupported notification channel");
  }
  if (contact.channel === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.address)) {
      throw new Error("Invalid verified email destination");
    }
  } else {
    if (!/^\+[1-9]\d{6,14}$/.test(contact.address)) {
      throw new Error("Verified E.164 mobile number required");
    }
    if (!contact.notificationConsentAt ||
        !Number.isFinite(Date.parse(contact.notificationConsentAt))) {
      throw new Error("SMS notification authorization required");
    }
  }
  // The reference is not included in SMS or email content to minimize exposure.
  // Server implementations should derive idempotency from an immutable receipt ID.
  return {
    channel: contact.channel,
    destination: contact.address,
    ...(contact.channel === "email"
      ? {subject:"T.O.O.L.S. Inc. — Intake/Eligibility Form Received"}
      : {}),
    body: contact.channel === "sms"
      ? RECEIPT_MESSAGE_TEXT + " Reply STOP to opt out of texts."
      : RECEIPT_MESSAGE_TEXT + "\n\nT.O.O.L.S. Inc.\nEmpowering Individuals. Unlocking Potential.",
    idempotencyKey: "intake-received:" + receipt.caseId + ":" + contact.channel,
  };
}
