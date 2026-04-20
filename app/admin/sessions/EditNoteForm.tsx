'use client'

import { useActionState } from 'react'
import { updateSessionNote } from './actions'

export function EditNoteForm({ sessionId, currentNote }: {
  sessionId: string
  currentNote: string | null
}) {
  const boundAction = updateSessionNote.bind(null, sessionId)
  const [state, action, pending] = useActionState(boundAction, null)

  return (
    <form action={action} className="mt-2">
      <textarea
        name="note"
        defaultValue={currentNote ?? ''}
        rows={2}
        placeholder="Kommentar (optional)"
        className="w-full border border-border rounded-sm px-2 py-1 text-xs text-foreground-muted bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <div className="flex items-center gap-2 mt-1">
        <button type="submit" disabled={pending}
          className="text-xs text-primary hover:underline disabled:opacity-50">
          {pending ? 'Speichern...' : 'Speichern'}
        </button>
        {state?.success && <span className="text-xs text-green-700">Gespeichert</span>}
        {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
      </div>
    </form>
  )
}
