'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-semibold text-stone-900 text-[15px] tracking-tight">
          Prompt<span className="text-amber-400">Pack</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/catalogue" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            Catalogue
          </Link>
          <Link href="/categories" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            Catégories
          </Link>
          <Link href="/faq" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm">
                Mon espace
              </Link>
              <button onClick={handleSignOut} className="btn-secondary text-sm">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm">
                Connexion
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Commencer
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-5 h-3.5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-stone-600 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-stone-600 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-stone-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            <Link href="/catalogue" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
              Catalogue
            </Link>
            <Link href="/categories" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
              Catégories
            </Link>
            <Link href="/faq" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
              FAQ
            </Link>
            <div className="h-px bg-stone-200 my-2" />
            {user ? (
              <>
                <Link href="/dashboard" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
                  Mon espace
                </Link>
                <button onClick={handleSignOut} className="btn-secondary justify-start">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn-primary justify-start" onClick={() => setMenuOpen(false)}>
                  Commencer gratuitement
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
