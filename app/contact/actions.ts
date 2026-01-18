'use server'

import nodemailer from 'nodemailer';

export async function submitContactForm(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, message: 'Bitte fülle alle Pflichtfelder aus.' };
  }

  try {
    // Create a transporter using environment variables
    // These should be set in .env.local for local development
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // Sender address (often needs to be the auth user)
      replyTo: email, // The user's email for replies
      to: process.env.CONTACT_EMAIL_RECEIVER || 'hello@claytopia.de',
      subject: `Kontaktanfrage von ${name} via Website`,
      text: `Name: ${name}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}

Nachricht:
${message}`,
      html: `
        <h3>Neue Kontaktanfrage</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email successfully sent from ${email}`);

    return { 
      success: true, 
      message: 'Danke für deine Nachricht! Wir haben sie erhalten und melden uns so schnell wie möglich bei dir.' 
    };

  } catch (error) {
    console.error('Nodemailer Error:', error);
    return { 
      success: false, 
      message: 'Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es später noch einmal oder schreibe uns direkt an hello@claytopia.de.' 
    };
  }
}