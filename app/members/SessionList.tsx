'use client'

import { useState } from 'react'
import { bookSession, cancelBooking } from './actions'

interface SessionWithBooking {
  id: string
  starts_at: string
  max_participants: number
  note: string | null
  attendeeNames: string[]
  activeBookingCount: number
  myBookingId: string | null
  hasActiveCard: boolean
}

function formatBerlinTime(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isWithin24h(iso: string) {
  return new Date(iso).getTime() - Date.now() < 24 * 60 * 60 * 1000
}

export function SessionList({ sessions, hasActiveCard }: {
  sessions: SessionWithBooking[]
  hasActiveCard: boolean
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleBook(sessionId: string) {
    setLoadingId(sessionId)
    setErrors(e => ({ ...e, [sessionId]: '' }))
    const result = await bookSession(sessionId)
    if (result?.error) setErrors(e => ({ ...e, [sessionId]: result.error }))
    setLoadingId(null)
  }

  async function handleCancel(bookingId: string, sessionId: string) {
    setLoadingId(sessionId)
    const result = await cancelBooking(bookingId)
    if (result?.error) setErrors(e => ({ ...e, [sessionId]: result.error }))
    setLoadingId(null)
  }

  if (sessions.length === 0) {
    return <p className="text-foreground-muted">Keine kommenden Termine geplant.</p>
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => {
        const full = session.activeBookingCount >= session.max_participants
        const isBooked = !!session.myBookingId
        const tooLate = isWithin24h(session.starts_at)
        const freeSpots = session.max_participants - session.activeBookingCount

        return (
          <div key={session.id}
            className={`border border-border rounded-sm p-4 flex items-center justify-between gap-4 ${full && !isBooked ? 'opacity-60 bg-background-alt' : 'bg-background'}`}>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{formatBerlinTime(session.starts_at)} Uhr</p>
              {session.note && (
                <p className="text-sm text-foreground-muted italic mt-0.5">{session.note}</p>
              )}
              <p className="text-sm text-foreground-muted mt-0.5">
                {session.attendeeNames.length > 0
                  ? `${session.attendeeNames.join(', ')} · `
                  : 'Noch niemand · '}
                {full
                  ? <span className="text-foreground-muted">ausgebucht</span>
                  : <span className={freeSpots <= 2 ? 'text-primary font-medium' : 'text-foreground-muted'}>
                      {freeSpots} {freeSpots === 1 ? 'Platz' : 'Plätze'} frei
                    </span>
                }
              </p>
              {errors[session.id] && <p className="text-xs text-red-600 mt-1">{errors[session.id]}</p>}
            </div>

            <div className="shrink-0">
              {isBooked ? (
                tooLate ? (
                  <span className="text-sm text-primary font-medium">Du bist dabei</span>
                ) : (
                  <button
                    onClick={() => handleCancel(session.myBookingId!, session.id)}
                    disabled={loadingId === session.id}
                    className="text-sm border border-border text-foreground-muted px-3 py-1.5 rounded-sm hover:border-foreground transition-colors disabled:opacity-50">
                    {loadingId === session.id ? '...' : 'Abmelden'}
                  </button>
                )
              ) : full ? (
                <span className="text-sm text-foreground-muted">Voll</span>
              ) : !hasActiveCard ? (
                <span className="text-sm text-foreground-muted" title="Keine aktive Club-Karte">Keine Karte</span>
              ) : (
                <button
                  onClick={() => handleBook(session.id)}
                  disabled={loadingId === session.id}
                  className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loadingId === session.id ? '...' : 'Buchen'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
