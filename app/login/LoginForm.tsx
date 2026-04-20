'use client'

import { useActionState } from 'react'
import { signInWithPassword, sendMagicLink } from './actions'

export function LoginForm() {
  const [passwordState, passwordAction, passwordPending] = useActionState(signInWithPassword, null)
  const [magicState, magicAction, magicPending] = useActionState(sendMagicLink, null)

  return (
    <div className="space-y-8">
      {/* Password login */}
      <form action={passwordAction} className="space-y-4">
        <h2 className="font-serif text-xl text-foreground">Mit Passwort anmelden</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">E-Mail</label>
          <input name="email" type="email" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Passwort</label>
          <input name="password" type="password" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <div className="text-right mt-1">
            <a href="/reset-password" className="text-xs text-foreground-muted hover:text-primary">
              Passwort vergessen?
            </a>
          </div>
        </div>
        {passwordState?.error && (
          <p className="text-sm text-red-600">{passwordState.error}</p>
        )}
        <button type="submit" disabled={passwordPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          {passwordPending ? 'Anmelden...' : 'Anmelden'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-foreground-muted bg-background px-2">oder</div>
      </div>

      {/* Magic link */}
      <form action={magicAction} className="space-y-4">
        <h2 className="font-serif text-xl text-foreground">Einmal-Link zum Einloggen anfordern</h2>
        <p className="text-sm text-foreground-muted">Wir senden dir einen Einmal-Link per E-Mail.</p>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">E-Mail</label>
          <input name="email" type="email" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {magicState?.error && <p className="text-sm text-red-600">{magicState.error}</p>}
        {magicState?.success && <p className="text-sm text-green-700">{magicState.success}</p>}
        <button type="submit" disabled={magicPending}
          className="w-full border border-primary text-primary py-2 rounded-sm text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50">
          {magicPending ? 'Sende...' : 'Magic Link senden'}
        </button>
      </form>
    </div>
  )
}
