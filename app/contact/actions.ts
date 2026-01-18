'use server'

export async function submitContactForm(prevState: unknown, formData: FormData) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // In a real application, you would use an email service here.
  // For example: Resend, SendGrid, or Nodemailer.
  console.log('--- Form Submission ---');
  console.log('From:', name, email);
  console.log('Message:', message);
  console.log('-----------------------');

  // Validate (basic)
  if (!name || !email || !message) {
      return { success: false, message: 'Bitte fülle alle Pflichtfelder aus.' };
  }

  return { 
    success: true, 
    message: 'Danke für deine Nachricht! Wir melden uns so schnell wie möglich bei dir.' 
  };
}
