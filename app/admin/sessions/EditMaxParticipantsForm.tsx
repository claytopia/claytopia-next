'use client'

import { useActionState } from 'react'
import { updateSessionMaxParticipants } from './actions'

export function EditMaxParticipantsForm({ sessionId, currentMax, activeCount }: {
  sessionId: string
  currentMax: number
  activeCount: number
}) {
  const boundAction = updateSessionMaxParticipants.bind(null, sessionId)
  const [state, action, pending] = useActionState(boundAction, null)

  return (
    <form action={action} className="flex items-center gap-1.5">
      <label className="text-xs text-foreground-muted">Plätze</label>
      <input
        type="number"
        name="max_participants"
        defaultValue={currentMax}
        min={activeCount || 1}
        className="w-16 border border-border rounded-sm px-1.5 py-0.5 text-xs text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button type="submit" disabled={pending}
        className="text-xs text-primary hover:underline disabled:opacity-50">
        {pending ? 'Speichern...' : 'Speichern'}
      </button>
      <span className="text-xs text-foreground-muted">({activeCount} belegt)</span>
      {state?.success && <span className="text-xs text-green-700">Gespeichert</span>}
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  )
}
