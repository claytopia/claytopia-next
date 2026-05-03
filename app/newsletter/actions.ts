'use server'

import nodemailer from 'nodemailer'

export async function submitNewsletter(prevState: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()

  if (!name || !email) {
    return { success: false, message: 'Bitte fülle alle Felder aus.' }
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP Credentials missing.')
    return { success: false, message: 'Server-Konfigurationsfehler: E-Mail-Zugangsdaten fehlen.' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { ciphers: 'SSLv3' },
    })

    await transporter.sendMail({
      from: `"Claytopia Website" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL_RECEIVER || 'hello@claytopia.de',
      subject: 'CLAYTOPIA: Newsletter-Anmeldung',
      text: `${name} ${email} möchte sich zum Newsletter anmelden`,
    })

    return {
      success: true,
      message: 'Danke für deine Anmeldung! Du hörst bald von uns.',
    }
  } catch (error) {
    console.error('Newsletter mail error:', error)
    return {
      success: false,
      message: 'Es gab ein Problem. Bitte versuche es später noch einmal oder schreibe uns an hello@claytopia.de.',
    }
  }
}
