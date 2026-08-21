'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyWaitlistPromotion } from '@/lib/mail'

export async function createSession(prevState: unknown, formData: FormData) {
  const dateTime = formData.get('starts_at') as string
  const maxParticipants = Number(formData.get('max_participants')) || 5

  if (!dateTime) return { error: 'Datum und Uhrzeit erforderlich.' }

  const note = (formData.get('note') as string | null) || null

  // dateTime from <input type="datetime-local"> has no timezone info (e.g. "2025-06-15T10:00").
  // Interpret it as Europe/Berlin by formatting with the Berlin offset.
  const berlinFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset',
  })
  // Build a Date in UTC that we can use to find Berlin's current offset
  const probe = new Date(dateTime + ':00Z')
  const parts = berlinFormatter.formatToParts(probe)
  const offsetStr = parts.find(p => p.type === 'timeZoneName')?.value ?? '+02:00'
  // e.g. "GMT+02:00" → "+02:00"
  const offset = offsetStr.replace('GMT', '') || '+00:00'
  const startsAt = new Date(dateTime + ':00' + offset).toISOString()

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
    await serviceSupabase.rpc('admin_cancel_booking_no_promote', { p_booking_id: booking.id })
  }

  const { error } = await serviceSupabase.from('sessions').delete().eq('id', sessionId)
  if (error) return { error: 'Termin konnte nicht gelöscht werden.' }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function adminBookMember(sessionId: string, userId: string, cardId: string) {
  const serviceSupabase = createServiceClient()

  const { error } = await serviceSupabase.rpc('book_session', {
    p_session_id: sessionId,
    p_user_id: userId,
    p_card_id: cardId,
  })

  if (error) {
    if (error.message.includes('fully booked')) return { error: 'Termin ist voll.' }
    return { error: 'Buchung fehlgeschlagen.' }
  }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function adminBookGuest(sessionId: string, guestName: string) {
  const name = guestName.trim()
  if (!name) return { error: 'Name erforderlich.' }

  const serviceSupabase = createServiceClient()

  const { error } = await serviceSupabase.rpc('admin_book_guest', {
    p_session_id: sessionId,
    p_guest_name: name,
  })

  if (error) {
    if (error.message.includes('fully booked')) return { error: 'Termin ist voll.' }
    return { error: 'Buchung fehlgeschlagen.' }
  }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function adminRemoveBooking(bookingId: string) {
  const serviceSupabase = createServiceClient()

  // Grab the session before cancelling (booking row survives as 'cancelled')
  const { data: bookingRow } = await serviceSupabase
    .from('bookings')
    .select('session_id')
    .eq('id', bookingId)
    .single()

  const { data: promotedUserId, error } = await serviceSupabase.rpc('admin_cancel_booking', {
    p_booking_id: bookingId,
  })

  if (error) return { error: 'Stornierung fehlgeschlagen.' }

  if (promotedUserId && bookingRow?.session_id) {
    await notifyWaitlistPromotion(promotedUserId as string, bookingRow.session_id)
  }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function updateSessionMaxParticipants(sessionId: string, prevState: unknown, formData: FormData) {
  const maxParticipants = Number(formData.get('max_participants'))

  if (!Number.isInteger(maxParticipants) || maxParticipants < 1) {
    return { error: 'Ungültige Platzanzahl.' }
  }

  const serviceSupabase = createServiceClient()

  const { count } = await serviceSupabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('status', 'active')

  if ((count ?? 0) > maxParticipants) {
    return { error: `Bereits ${count} Plätze belegt.` }
  }

  const { error } = await serviceSupabase
    .from('sessions')
    .update({ max_participants: maxParticipants })
    .eq('id', sessionId)

  if (error) return { error: 'Platzanzahl konnte nicht gespeichert werden.' }

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
