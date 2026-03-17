'use client'

import { useActionState } from 'react'
import { completeInvite } from './actions'

export function InviteForm() {
  const [state, action, pending] = useActionState(completeInvite, null)

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Vorname *</label>
          <input name="first_name" type="text" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nachname *</label>
          <input name="last_name" type="text" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Passwort <span className="text-foreground-muted font-normal">(optional, mind. 6 Zeichen)</span>
        </label>
        <input name="password" type="password" minLength={6}
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <p className="text-xs text-foreground-muted mt-1">Ohne Passwort kannst du dich jederzeit per Magic Link anmelden.</p>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {pending ? 'Speichern...' : 'Profil anlegen & loslegen'}
      </button>
    </form>
  )
}
