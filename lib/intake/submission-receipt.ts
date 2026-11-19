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
  html?: string; // HTML-capable email sender only
  body: string;
  idempotencyKey: string;
}

/** Official public brand asset, no personalized tracking parameters. */
export const TOOLS_RECEIPT_LOGO_URL = "https://www.sdtoolsinc.org/logos/tools-inc-crown-official.svg";
/** Same branded receipt page for every communication channel. No client-specific query strings. */
export const TOOLS_RECEIPT_PAGE_URL = "https://www.sdtoolsinc.org/intake/received";

/** Message content intentionally omits name, justice status, housing and other sensitive details. */
export const RECEIPT_MESSAGE_TEXT =
  "Thank you for completing the T.O.O.L.S. Inc. Intake/Eligibility Form. " +
  "We have received your application. Please allow up to 72 hours for our Intake/Eligibility Review Board " +
  "to review the information you provided. A board representative will contact you regarding next steps. " +
  "Submission does not guarantee acceptance into services. " +
  "If you have an immediate emergency, please call 911. " +
  "If this is a mental health crisis in San Diego County, call or text 988 or call the Access and Crisis Line at 1-888-724-7240 to request assistance, including MCRT when appropriate. " +
  "For an emergency requiring PERT, call 911 and request PERT.";

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
    ...(contact.channel === "email"
      ? {html: `<!doctype html><html><body style="margin:0;background:#f3f7fb;font-family:Arial,Helvetica,sans-serif;color:#17253a;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;margin:auto;background:white;border-collapse:collapse;">
        <tr><td style="padding:26px 28px;background:#101f34;text-align:center;">
        <img src="${TOOLS_RECEIPT_LOGO_URL}" alt="T.O.O.L.S. Inc. logo" width="90" height="93" style="display:block;margin:0 auto 14px;max-width:90px;height:auto;border:0;" />
        <div style="font-weight:bold;font-size:18px;color:white;">T.O.O.L.S. Inc.</div>
        </td></tr>
        <tr><td style="padding:30px 28px;line-height:1.6;font-size:15px;">
        <h1 style="font-size:22px;color:#101f34;">Intake/Eligibility Form Received</h1>
        <p>Thank you for completing the T.O.O.L.S. Inc. Intake/Eligibility Form.</p>
        <p>We have received your application. Please allow <strong>up to 72 hours</strong> for our Intake/Eligibility Review Board to review the information you provided.</p>
        <p>A board representative will contact you regarding next steps. Submission does not guarantee acceptance into services.</p>
        <p><strong>Emergency assistance:</strong> If you have an immediate emergency, please call <strong>911</strong>. For a mental health crisis in San Diego County, call or text <strong>988</strong> or call <strong>1-888-724-7240</strong> to request crisis support, including MCRT when appropriate. For an emergency requiring PERT, call <strong>911</strong> and request PERT.</p>
        <p style="font-size:12px;color:#516078;">This is an acknowledgment of a saved application, not a final eligibility decision. The Intake/Eligibility Review Board sends a separate decision notice after completing its review.</p>
        <p style="font-weight:bold;">Empowering Individuals. Unlocking Potential.</p>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f3f7fb;font-size:12px;text-align:center;color:#516078;">
        <a href="${TOOLS_RECEIPT_PAGE_URL}" style="color:#174e85;font-weight:bold;">View the branded intake receipt and next steps</a>
        </td></tr></table></body></html>`}
      : {}),
    body: contact.channel === "sms"
      ? "T.O.O.L.S. Inc.: We received your Intake/Eligibility Form. Please allow up to 72 hours for Board review. This is not an eligibility decision. View the logo, next steps and crisis resources: " + TOOLS_RECEIPT_PAGE_URL + " Reply STOP to opt out of texts."
      : RECEIPT_MESSAGE_TEXT + "\n\nView the branded receipt and logo: " + TOOLS_RECEIPT_PAGE_URL + "\n\nT.O.O.L.S. Inc.\nEmpowering Individuals. Unlocking Potential.",
    idempotencyKey: "intake-received:" + receipt.caseId + ":" + contact.channel,
  };
}
