'use client'

import { useActionState } from 'react'
import { inviteMember } from './actions'

export function InviteMemberForm() {
  const [state, action, pending] = useActionState(inviteMember, null)

  return (
    <div className="space-y-2">
      <form action={action} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-1">Mitglied einladen</label>
          <input name="email" type="email" required placeholder="email@beispiel.de"
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <button type="submit" disabled={pending}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0">
          {pending ? '...' : 'Einladen'}
        </button>
      </form>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">{state.success}</p>}
    </div>
  )
}
