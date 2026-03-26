'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithPassword(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'E-Mail oder Passwort falsch.' }
  redirect('/members')
}

export async function sendMagicLink(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/members` },
  })

  if (error) return { error: 'E-Mail konnte nicht gesendet werden.' }
  return { success: 'Magic Link wurde gesendet! Schau in dein Postfach.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
