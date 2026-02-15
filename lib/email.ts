/**
 * Email service integration using Resend
 * Handles transactional emails for auth, notifications, etc.
 */

import { logger } from './logger'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@sdtoolsinc.org'

interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send email using Resend API
 */
async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY not configured. Email not sent.', {
      to: payload.to,
      subject: payload.subject,
    })
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        ...payload,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      logger.error('Failed to send email via Resend', new Error(error), {
        to: payload.to,
        subject: payload.subject,
        status: response.status,
      })
      return false
    }

    logger.info('Email sent successfully', {
      to: payload.to,
      subject: payload.subject,
    })
    return true
  } catch (error) {
    logger.error('Error sending email', error as Error, {
      to: payload.to,
      subject: payload.subject,
    })
    return false
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
  userName?: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Thank you for signing up with T.O.O.L.S Inc. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>Or copy and paste this link: <a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link expires in 24 hours.</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - T.O.O.L.S Inc',
    html,
    text: `Verify your email: ${verificationLink}`,
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  userName?: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link: <a href="${resetLink}">${resetLink}</a></p>
      <p>This link expires in 1 hour.</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - T.O.O.L.S Inc',
    html,
    text: `Reset your password: ${resetLink}`,
  })
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  portalUrl: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to T.O.O.L.S Inc!</h2>
      <p>Hi ${userName},</p>
      <p>Your account has been successfully created. You're now ready to access your personalized portal and begin your journey with us.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${portalUrl}" style="background-color: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to Your Portal
        </a>
      </div>
      <h3>What's Next?</h3>
      <ul>
        <li>Complete your profile</li>
        <li>Explore available courses and programs</li>
        <li>Connect with our case management team</li>
      </ul>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">Questions? Contact us at support@sdtoolsinc.org</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to T.O.O.L.S Inc - Get Started',
    html,
    text: `Welcome! Access your portal: ${portalUrl}`,
  })
}

/**
 * Send notification email (generic)
 */
export async function sendNotificationEmail(
  email: string,
  subject: string,
  message: string,
  actionUrl?: string,
  actionLabel?: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>${message}</p>
      ${actionUrl && actionLabel ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionUrl}" style="background-color: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            ${actionLabel}
          </a>
        </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">T.O.O.L.S Inc - Supporting Your Reentry Journey</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
    text: message,
  })
}
