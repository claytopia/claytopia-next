'use client'

import { useEffect, useState, useActionState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { completeInvite } from './actions'

export function InviteForm() {
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [state, action, pending] = useActionState(completeInvite, null)

  useEffect(() => {
    const supabase = createClient()
    const params = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    const init = accessToken && refreshToken
      ? supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      : supabase.auth.getSession().then(r => ({ data: { session: r.data.session }, error: r.error }))

    init.then(({ data: { session }, error }) => {
      if (error || !session) {
        setSessionError('Ungültiger oder abgelaufener Einladungslink. Bitte kontaktiere Pia.')
      } else {
        setSessionReady(true)
      }
    })
  }, [])

  if (sessionError) {
    return <p className="text-sm text-red-600">{sessionError}</p>
  }

  if (!sessionReady) {
    return <p className="text-sm text-foreground-muted">Einladungslink wird geprüft…</p>
  }

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
