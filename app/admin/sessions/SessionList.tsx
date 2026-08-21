'use client'

import { useState, type ReactNode } from 'react'

type Item = { id: string; isPast: boolean; node: ReactNode }

export function SessionList({ items }: { items: Item[] }) {
  const [showPast, setShowPast] = useState(false)

  const pastCount = items.filter(i => i.isPast).length
  const visible = showPast ? items : items.filter(i => !i.isPast)

  return (
    <>
      {pastCount > 0 && (
        <label className="flex items-center gap-2 mb-4 text-sm text-foreground-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPast}
            onChange={e => setShowPast(e.target.checked)}
            className="rounded-sm border-border"
          />
          Vergangene Termine anzeigen ({pastCount})
        </label>
      )}
      {visible.length === 0 ? (
        <p className="text-foreground-muted">Keine kommenden Termine.</p>
      ) : (
        <div className="space-y-2">
          {visible.map(i => i.node)}
        </div>
      )}
    </>
  )
}
