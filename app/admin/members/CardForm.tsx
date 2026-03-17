'use client'

import { useActionState } from 'react'
import { createCard } from './actions'

export function CardForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(createCard, null)

  const defaultValidUntil = new Date(Date.now() + 183 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0]

  return (
    <div className="mt-3">
      <form action={action} className="grid grid-cols-4 gap-2 items-end">
        <input type="hidden" name="user_id" value={userId} />
        <div>
          <label className="block text-xs text-foreground-muted mb-1">Typ</label>
          <select name="type"
            className="w-full border border-border rounded-sm px-2 py-1.5 bg-background text-foreground text-sm">
            <option value="5er">5er-Karte</option>
            <option value="10er">10er-Karte</option>
            <option value="schnupper">Schnupperkarte</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-foreground-muted mb-1">Einheiten</label>
          <input name="total_units" type="number" defaultValue={5} min={1}
            className="w-full border border-border rounded-sm px-2 py-1.5 bg-background text-foreground text-sm" />
        </div>
        <div>
          <label className="block text-xs text-foreground-muted mb-1">Gültig bis</label>
          <input name="valid_until" type="date" defaultValue={defaultValidUntil}
            className="w-full border border-border rounded-sm px-2 py-1.5 bg-background text-foreground text-sm" />
        </div>
        <button type="submit" disabled={pending}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-sm text-xs font-medium hover:bg-primary/90 disabled:opacity-50">
          {pending ? '...' : 'Karte anlegen'}
        </button>
      </form>
      {state?.error && <p className="text-xs text-red-600 mt-1">{state.error}</p>}
    </div>
  )
}
