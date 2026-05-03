'use client'

import { useActionState } from 'react'
import { submitNewsletter } from './actions'
import { useEffect, useRef } from 'react'

const initialState = { success: false, message: '' }

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(submitNewsletter, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {state.message && (
        <div className={`p-4 rounded-sm text-sm ${state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm"
          placeholder="Dein Name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          E-Mail <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm"
          placeholder="deine@email.de"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-medium py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? 'Wird gesendet...' : 'Zum Newsletter anmelden'}
      </button>

      <p className="text-xs text-foreground-muted mt-4">
        Mit der Anmeldung erklärst du dich damit einverstanden, gelegentlich E-Mails von Claytopia zu erhalten. Du kannst dich jederzeit abmelden.
      </p>
    </form>
  )
}
