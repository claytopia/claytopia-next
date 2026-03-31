'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AuthButton({ isLoggedIn, className }: { isLoggedIn: boolean; className?: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const defaultClass = "text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide"

  if (!isLoggedIn) {
    return (
      <a href="/login" className={className ?? defaultClass}>
        Members
      </a>
    )
  }

  return (
    <div>
    <button onClick={handleSignOut} className={className ?? defaultClass}>
      Abmelden
    </button>
    </div>
  )
}
