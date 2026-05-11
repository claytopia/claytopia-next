'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requestNewInvite(prevState: unknown, formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  if (!email) return { error: 'Bitte E-Mail-Adresse eingeben.' }

  const serviceSupabase = createServiceClient()

  // Verify user exists and has no profile yet (unregistered invite)
  const { data: { users } } = await serviceSupabase.auth.admin.listUsers()
  const user = users?.find(u => u.email === email)

  if (!user) {
    return { error: 'Diese E-Mail-Adresse wurde nicht eingeladen. Bitte kontaktiere Pia.' }
  }

  const { error } = await serviceSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/invite`,
  })

  if (error) return { error: `Fehler beim Senden: ${error.message}` }
  return { success: 'Neuer Einladungslink wurde an deine E-Mail gesendet!' }
}

export async function completeInvite(prevState: unknown, formData: FormData) {
  const firstName = (formData.get('first_name') as string).trim()
  const lastName = (formData.get('last_name') as string).trim()
  const password = (formData.get('password') as string).trim()

  if (!firstName || !lastName) return { error: 'Bitte Vor- und Nachname eingeben.' }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log('OOPS', userError, user)
    return { error: 'Ungültiger oder abgelaufener Einladungslink. Bitte Pia kontaktieren.' }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', user.id)

  if (profileError) return { error: 'Fehler beim Speichern des Profils.' }

  if (password) {
    if (password.length < 6) return { error: 'Passwort muss mindestens 6 Zeichen haben.' }
    const { error: pwError } = await supabase.auth.updateUser({ password })
    if (pwError) {
      console.error(pwError)
      return { error: 'Passwort konnte nicht gesetzt werden.' }
    }
  }

  redirect('/members')
}
