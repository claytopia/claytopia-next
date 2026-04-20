'use client'

import { useActionState } from 'react'
import { createSession } from './actions'

export function SessionForm() {
  const [state, action, pending] = useActionState(createSession, null)

  return (
    <form action={action} className="border border-border rounded-sm p-6 space-y-4 bg-background">
      <h2 className="font-serif text-xl text-foreground">Neuen Termin anlegen</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Datum & Uhrzeit</label>
          <input name="starts_at" type="datetime-local" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Max. Teilnehmer</label>
          <input name="max_participants" type="number" defaultValue={5} min={1} max={20}
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Kommentar (optional)</label>
        <textarea name="note" rows={2} placeholder="z.B. Themenabend: Adventswerkstatt"
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Termin erstellt!</p>}
      <button type="submit" disabled={pending}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {pending ? 'Erstellen...' : 'Termin erstellen'}
      </button>
    </form>
  )
}
