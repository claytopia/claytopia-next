'use client'

import { resendInvitation } from './actions'

export function ResendInviteButton({ email }: { email: string }) {
  async function handleClick() {
    if (!confirm(`Einladungsmail erneut senden an ${email}?`)) return
    const result = await resendInvitation(email)
    if (result.error) alert(result.error)
  }

  return (
    <button type="button" onClick={handleClick}
      className="text-xs text-primary hover:underline ml-2">
      Erneut senden
    </button>
  )
}
