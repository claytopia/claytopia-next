'use client'

import { useTransition, useState } from 'react'
import { cancelBooking } from '../actions'

export function CancelBookingButton({ bookingId, startsAt }: {
  bookingId: string
  startsAt: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const tooLate = new Date(startsAt).getTime() - Date.now() < 24 * 60 * 60 * 1000

  function handleCancel() {
    if (!confirm('Möchtest du dich wirklich von diesem Termin abmelden?')) return
    setError(null)
    startTransition(async () => {
      const result = await cancelBooking(bookingId)
      if (result?.error) setError(result.error)
    })
  }

  if (tooLate) {
    return (
      <span className="text-xs text-foreground-muted">
        Abmeldung nur bis 24 Std. vorher
      </span>
    )
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending}
        className="text-xs text-red-600 hover:underline disabled:opacity-50"
      >
        {isPending ? 'Abmelden...' : 'Abmelden'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
