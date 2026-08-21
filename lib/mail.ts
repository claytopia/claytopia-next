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
  })
}

/** Recipient for internal notifications (studio inbox). */
export function notificationReceiver() {
  return process.env.CONTACT_EMAIL_RECEIVER || 'hello@claytopia.de'
}

/**
 * Notify a member that they were automatically moved from a session's
 * waitlist into a confirmed booking. Uses the service client to look up the
 * member's email + name. Never throws — mail failure must not break cancellation.
 */
export async function notifyWaitlistPromotion(userId: string, sessionId: string) {
  const transporter = createTransporter()
  if (!transporter) return

  try {
    const { createServiceClient } = await import('./supabase/server')
    const service = createServiceClient()

    const [{ data: userData }, { data: profile }, { data: session }] = await Promise.all([
      service.auth.admin.getUserById(userId),
      service.from('profiles').select('first_name').eq('id', userId).single(),
      service.from('sessions').select('starts_at, note').eq('id', sessionId).single(),
    ])

    const email = userData?.user?.email
    if (!email) return

    const greeting = profile?.first_name ? `Hallo ${profile.first_name},` : 'Hallo,'

    const startsAt = session?.starts_at
      ? new Intl.DateTimeFormat('de-DE', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Europe/Berlin',
        }).format(new Date(session.starts_at))
      : 'einen Clay-Club-Termin'

    const note = session?.note ? `\nThema: ${session.note}` : ''

    await transporter.sendMail({
      from: `"Claytopia" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'CLAYTOPIA: Ein Platz ist frei geworden – du bist dabei!',
      text:
        `${greeting}\n\n` +
        `es ist ein Platz frei geworden und du bist von der Warteliste ` +
        `automatisch nachgerückt. Deine Buchung ist jetzt bestätigt:\n\n` +
        `Termin: ${startsAt}${note}\n\n` +
        `Wir freuen uns auf dich!\n` +
        `Falls du doch nicht kannst, melde dich bitte rechtzeitig über den ` +
        `Mitgliederbereich ab.\n\nLiebe Grüße\nPia · Claytopia`,
    })
  } catch (error) {
    console.error('Waitlist promotion mail error:', error)
  }
}
