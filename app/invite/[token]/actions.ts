'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeInvite(prevState: unknown, formData: FormData) {
  const firstName = (formData.get('first_name') as string).trim()
  const lastName = (formData.get('last_name') as string).trim()
  const password = (formData.get('password') as string).trim()

  if (!firstName || !lastName) return { error: 'Bitte Vor- und Nachname eingeben.' }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) return { error: 'Ungültiger oder abgelaufener Einladungslink. Bitte Pia kontaktieren.' }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', user.id)

  if (profileError) return { error: 'Fehler beim Speichern des Profils.' }

  if (password) {
    if (password.length < 6) return { error: 'Passwort muss mindestens 6 Zeichen haben.' }
    const { error: pwError } = await supabase.auth.updateUser({ password })
    if (pwError) return { error: 'Passwort konnte nicht gesetzt werden.' }
  }

  redirect('/members')
}
