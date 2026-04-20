'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSession(prevState: unknown, formData: FormData) {
  const dateTime = formData.get('starts_at') as string
  const maxParticipants = Number(formData.get('max_participants')) || 5

  if (!dateTime) return { error: 'Datum und Uhrzeit erforderlich.' }

  const note = (formData.get('note') as string | null) || null

  const berlinDate = new Date(dateTime + ':00')
  const startsAt = berlinDate.toISOString()

  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .insert({ starts_at: startsAt, max_participants: maxParticipants, note })

  if (error) return { error: 'Termin konnte nicht erstellt werden.' }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function deleteSession(sessionId: string) {
  const serviceSupabase = createServiceClient()

  const { data: activeBookings } = await serviceSupabase
    .from('bookings')
    .select('id')
    .eq('session_id', sessionId)
    .eq('status', 'active')

  for (const booking of activeBookings ?? []) {
    await serviceSupabase.rpc('admin_cancel_booking', { p_booking_id: booking.id })
  }

  const { error } = await serviceSupabase.from('sessions').delete().eq('id', sessionId)
  if (error) return { error: 'Termin konnte nicht gelöscht werden.' }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function updateSessionNote(sessionId: string, prevState: unknown, formData: FormData) {
  const note = (formData.get('note') as string | null) || null

  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .update({ note })
    .eq('id', sessionId)

  if (error) return { error: 'Kommentar konnte nicht gespeichert werden.' }

  // /admin only shows session counts, not notes — no revalidation needed there
  revalidatePath('/admin/sessions')
  revalidatePath('/members')
  return { success: true }
}
