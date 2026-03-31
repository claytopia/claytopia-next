'use client'

import { deleteCard } from './actions'

export function DeleteCardButton({ cardId }: { cardId: string }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!confirm('Karte wirklich löschen?')) return
    await deleteCard(cardId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="text-xs text-red-500 hover:underline">
        Löschen
      </button>
    </form>
  )
}
