'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const email = new FormData(e.currentTarget).get('email') as string
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })
    setStatus(error ? 'error' : 'done')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">E-Mail</label>
        <input name="email" type="email" required
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      {status === 'done' && <p className="text-sm text-green-700">Reset-Link wurde gesendet! Schau in dein Postfach.</p>}
      {status === 'error' && <p className="text-sm text-red-600">Fehler beim Senden. Bitte versuche es erneut.</p>}
      <button type="submit" disabled={status === 'loading'}
        className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {status === 'loading' ? 'Sende...' : 'Reset-Link senden'}
      </button>
    </form>
  )
}
