'use client'

import { deleteSession } from './actions'

export function DeleteSessionButton({ sessionId, attendeeCount, attendeeNames }: {
  sessionId: string
  attendeeCount: number
  attendeeNames: string[]
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (attendeeCount > 0) {
      const names = attendeeNames.join(', ')
      if (!confirm(`Dieser Termin hat ${attendeeCount} Anmeldung${attendeeCount > 1 ? 'en' : ''} (${names}). Wirklich löschen? Alle Anmeldungen werden storniert.`)) return
    }
    await deleteSession(sessionId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit"
        className="text-xs text-foreground-muted border border-border px-3 py-1.5 rounded-sm hover:border-red-400 hover:text-red-600 transition-colors">
        Löschen
      </button>
    </form>
  )
}
