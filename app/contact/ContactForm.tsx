'use client'

import { useActionState } from 'react';
import { submitContactForm } from './actions';
import { useEffect, useRef } from 'react';

const initialState = {
  success: false,
  message: '',
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      
      {/* Status Messages */}
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

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          Telefon <span className="text-xs text-foreground-muted font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm"
          placeholder="+49 ..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Nachricht <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm resize-none"
          placeholder="Wie können wir dir helfen?"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-medium py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? 'Wird gesendet...' : 'Nachricht senden'}
      </button>

      <p className="text-xs text-foreground-muted mt-4">
        Mit dem Absenden des Formulars erklärst du dich damit einverstanden, dass deine Daten zur Bearbeitung deines Anliegens verwendet werden.
      </p>

    </form>
  );
}
