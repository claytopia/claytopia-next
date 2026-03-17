'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function bookSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  // Find oldest valid card with remaining units
  const today = new Date().toISOString().split('T')[0]
  const { data: cards } = await supabase
    .from('club_cards')
    .select('id, used_units, total_units')
    .eq('user_id', user.id)
    .gte('valid_until', today)
    .order('created_at', { ascending: true })

  const card = cards?.find(c => c.used_units < c.total_units) ?? null

  if (!card) return { error: 'Keine aktive Club-Karte mit verbleibenden Einheiten.' }

  const { error } = await supabase.rpc('book_session', {
    p_session_id: sessionId,
    p_user_id: user.id,
    p_card_id: card.id,
  })

  if (error) {
    if (error.message.includes('fully booked')) return { error: 'Dieser Termin ist leider ausgebucht.' }
    return { error: 'Buchung fehlgeschlagen. Bitte versuche es erneut.' }
  }

  revalidatePath('/members')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  const { error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
  })

  if (error) return { error: 'Stornierung fehlgeschlagen.' }

  revalidatePath('/members')
  revalidatePath('/members/bookings')
  return { success: true }
}
