'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function UpdatePasswordForm() {
  const router = useRouter()
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
        setSessionError('Ungültiger oder abgelaufener Link. Bitte starte den Passwort-Reset erneut.')
      } else {
        setSessionReady(true)
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg(null)
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setErrorMsg('Passwörter stimmen nicht überein.')
      setStatus('idle')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setErrorMsg('Passwort konnte nicht gesetzt werden. Bitte versuche es erneut.')
      setStatus('error')
      return
    }

    setStatus('done')
    setTimeout(() => router.push('/members'), 1500)
  }

  if (sessionError) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{sessionError}</p>
        <a href="/reset-password" className="text-sm text-primary hover:underline">
          Erneut Reset-Link anfordern
        </a>
      </div>
    )
  }

  if (!sessionReady) {
    return <p className="text-sm text-foreground-muted">Link wird geprüft…</p>
  }

  if (status === 'done') {
    return <p className="text-sm text-green-700">Passwort erfolgreich gesetzt! Du wirst weitergeleitet…</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Neues Passwort</label>
        <input name="password" type="password" required minLength={6}
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <p className="text-xs text-foreground-muted mt-1">Mindestens 6 Zeichen.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Passwort bestätigen</label>
        <input name="confirm" type="password" required minLength={6}
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === 'loading'}
        className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {status === 'loading' ? 'Speichern...' : 'Neues Passwort speichern'}
      </button>
    </form>
  )
}
