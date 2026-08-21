'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createTransporter, notificationReceiver, notifyWaitlistPromotion } from '@/lib/mail'

async function notifyBooking(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionId: string,
  user: { id: string; email?: string },
) {
  const transporter = createTransporter()
  if (!transporter) return

  try {
    const [{ data: session }, { data: profile }] = await Promise.all([
      supabase.from('sessions').select('starts_at, note').eq('id', sessionId).single(),
      supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single(),
    ])

    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim()
    const participant = name || user.email || 'Unbekannte Teilnehmerin'

    const startsAt = session?.starts_at
      ? new Intl.DateTimeFormat('de-DE', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Europe/Berlin',
        }).format(new Date(session.starts_at))
      : 'unbekannter Termin'

    const note = session?.note ? `\nThema: ${session.note}` : ''

    await transporter.sendMail({
      from: `"Claytopia Website" <${process.env.SMTP_USER}>`,
      replyTo: user.email,
      to: notificationReceiver(),
      subject: `CLAYTOPIA: Neue Clay-Club-Anmeldung von ${participant}`,
      text:
        `${participant} hat sich für eine Clay-Club-Session angemeldet.\n\n` +
        `Teilnehmerin: ${participant}\n` +
        `E-Mail: ${user.email ?? 'unbekannt'}\n` +
        `Termin: ${startsAt}${note}`,
    })
  } catch (error) {
    // Never let a mail failure break the booking itself.
    console.error('Booking notification mail error:', error)
  }
}

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

  await notifyBooking(supabase, sessionId, user)

  revalidatePath('/members')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  const { data: promotedUserId, error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
  })

  if (error) return { error: 'Stornierung fehlgeschlagen.' }

  // A waitlisted member was auto-promoted into the freed seat → notify them.
  if (promotedUserId) {
    const { data: session } = await supabase
      .from('bookings')
      .select('session_id')
      .eq('id', bookingId)
      .single()
    if (session?.session_id) {
      await notifyWaitlistPromotion(promotedUserId as string, session.session_id)
    }
  }

  revalidatePath('/members')
  revalidatePath('/members/bookings')
  return { success: true }
}

export async function joinWaitlist(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  const { error } = await supabase.rpc('join_waitlist', {
    p_session_id: sessionId,
    p_user_id: user.id,
  })

  if (error) {
    if (error.message.includes('No valid card'))
      return { error: 'Du brauchst eine gültige Club-Karte mit freier Einheit.' }
    if (error.message.includes('Already booked'))
      return { error: 'Du bist bereits für diesen Termin gebucht.' }
    if (error.message.includes('not full'))
      return { error: 'Es sind noch Plätze frei – buche direkt.' }
    return { error: 'Eintrag auf die Warteliste fehlgeschlagen.' }
  }

  revalidatePath('/members')
  return { success: true }
}

export async function leaveWaitlist(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  const { error } = await supabase.rpc('leave_waitlist', {
    p_session_id: sessionId,
    p_user_id: user.id,
  })

  if (error) return { error: 'Austragen fehlgeschlagen.' }

  revalidatePath('/members')
  return { success: true }
}
