'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AuthButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!isLoggedIn) {
    return (
      <a href="/login"
        className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">
        Anmelden
      </a>
    )
  }

  return (
    <button onClick={handleSignOut}
      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">
      Abmelden
    </button>
  )
}
