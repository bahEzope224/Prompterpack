'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Props = { redirectTo: string }

export function LoginForm({ redirectTo }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(getFriendlyError(error.message))
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="label">Adresse email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="input"
        />
      </div>

      {/* Mot de passe */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="label mb-0">Mot de passe</label>
          <Link
            href="/auth/reset-password"
            className="text-xs text-stone-400 hover:text-amber-600 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="input"
        />
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}

function getFriendlyError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect.'
  }
  if (message.includes('Email not confirmed')) {
    return `Votre email n'a pas encore été confirmé. Vérifiez votre boîte mail.`
  }
  if (message.includes('Too many requests')) {
    return 'Trop de tentatives. Réessayez dans quelques minutes.'
  }
  return 'Une erreur est survenue. Veuillez réessayer.'
}
