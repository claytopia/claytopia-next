'use client'

import { useTransition, useState } from 'react'
import { adminBookMember, adminBookGuest, adminRemoveBooking } from './actions'

type Attendee = { bookingId: string; userId: string | null; firstName: string; lastName: string; isGuest: boolean }
type Member = { id: string; firstName: string; lastName: string }
type Card = { id: string; userId: string; type: string; remaining: number; validUntil: string }

export function AdminAttendees({
  sessionId,
  attendees,
  members,
  cards,
}: {
  sessionId: string
  attendees: Attendee[]
  members: Member[]
  cards: Card[]
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState('')
  const [selectedCard, setSelectedCard] = useState('')
  const [guestName, setGuestName] = useState('')

  const attendeeUserIds = new Set(attendees.map(a => a.userId).filter(Boolean))
  const availableMembers = members.filter(m => !attendeeUserIds.has(m.id))

  const memberCards = cards.filter(
    c => c.userId === selectedMember && c.remaining > 0
  )

  function handleAdd() {
    if (!selectedMember || !selectedCard) return
    setError(null)
    startTransition(async () => {
      const result = await adminBookMember(sessionId, selectedMember, selectedCard)
      if (result.error) setError(result.error)
      setSelectedMember('')
      setSelectedCard('')
    })
  }

  function handleAddGuest() {
    const name = guestName.trim()
    if (!name) return
    setError(null)
    startTransition(async () => {
      const result = await adminBookGuest(sessionId, name)
      if (result.error) setError(result.error)
      else setGuestName('')
    })
  }

  function handleRemove(bookingId: string) {
    setError(null)
    startTransition(async () => {
      const result = await adminRemoveBooking(bookingId)
      if (result.error) setError(result.error)
    })
  }

  return (
    <div className="mt-3 space-y-2">
      {/* Current attendees */}
      {attendees.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attendees.map(a => (
            <span
              key={a.bookingId}
              className="inline-flex items-center gap-1 text-xs bg-background-alt text-foreground px-2 py-1 rounded-sm"
            >
              {a.firstName} {a.lastName}
              {a.isGuest && <span className="text-foreground-muted">(Gast)</span>}
              <button
                type="button"
                onClick={() => handleRemove(a.bookingId)}
                disabled={isPending}
                className="text-foreground-muted hover:text-red-600 disabled:opacity-50 ml-0.5"
                aria-label={`${a.firstName} ${a.lastName} austragen`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add member */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={selectedMember}
          onChange={e => { setSelectedMember(e.target.value); setSelectedCard('') }}
          className="text-xs border border-border rounded-sm px-2 py-1 bg-background"
        >
          <option value="">Mitglied hinzufügen…</option>
          {availableMembers.map(m => (
            <option key={m.id} value={m.id}>
              {m.firstName} {m.lastName}
            </option>
          ))}
        </select>

        {selectedMember && (
          <select
            value={selectedCard}
            onChange={e => setSelectedCard(e.target.value)}
            className="text-xs border border-border rounded-sm px-2 py-1 bg-background"
          >
            <option value="">Karte wählen…</option>
            {memberCards.map(c => (
              <option key={c.id} value={c.id}>
                {c.type} ({c.remaining} übrig, bis {c.validUntil})
              </option>
            ))}
          </select>
        )}

        {selectedMember && selectedCard && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isPending}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Eintragen
          </button>
        )}
      </div>

      {/* Add guest (walk-in / phone booking, no account or card needed) */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddGuest() } }}
          placeholder="Gast (Name)…"
          className="text-xs border border-border rounded-sm px-2 py-1 bg-background"
        />
        {guestName.trim() && (
          <button
            type="button"
            onClick={handleAddGuest}
            disabled={isPending}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Gast eintragen
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
