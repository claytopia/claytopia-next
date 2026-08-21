import 'server-only'
import nodemailer from 'nodemailer'

/**
 * Shared Nodemailer transporter for all outgoing site mail.
 * Returns null if SMTP credentials are not configured, so callers
 * can degrade gracefully instead of throwing.
 */
export function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { ciphers: 'SSLv3' },
  })
}

/** Recipient for internal notifications (studio inbox). */
export function notificationReceiver() {
  return process.env.CONTACT_EMAIL_RECEIVER || 'hello@claytopia.de'
}
