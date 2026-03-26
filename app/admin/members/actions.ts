'use server'

import { createServiceClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function inviteMember(prevState: unknown, formData: FormData) {
  const email = (formData.get('email') as string).trim()
  if (!email) return { error: 'E-Mail erforderlich.' }

  const serviceSupabase = createServiceClient()
  const { error } = await serviceSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/invite`,
  })

  if (error) return { error: `Einladung fehlgeschlagen: ${error.message}` }
  revalidatePath('/admin/members')
  return { success: `Einladung an ${email} gesendet.` }
}

export async function createCard(prevState: unknown, formData: FormData) {
  const userId = formData.get('user_id') as string
  const type = formData.get('type') as string
  const totalUnits = Number(formData.get('total_units'))
  const validUntil = formData.get('valid_until') as string

  if (!userId || !type || !totalUnits || !validUntil) return { error: 'Alle Felder erforderlich.' }

  const supabase = await createClient()
  const { error } = await supabase.from('club_cards').insert({
    user_id: userId, type, total_units: totalUnits, valid_until: validUntil,
  })

  if (error) return { error: 'Karte konnte nicht erstellt werden.' }
  revalidatePath('/admin/members')
  return { success: true }
}

export async function updateCardUnits(cardId: string, usedUnits: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('club_cards')
    .update({ used_units: usedUnits })
    .eq('id', cardId)

  if (error) return { error: 'Karte konnte nicht aktualisiert werden.' }
  revalidatePath('/admin/members')
  return { success: true }
}
