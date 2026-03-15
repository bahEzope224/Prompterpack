'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setIsUpdateMode(true)
    }
  }, [])

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setError('Une erreur est survenue. Vérifiez votre adresse email.')
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setError('Impossible de mettre à jour le mot de passe. Réessayez.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  const inputClass = "w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
  const btnClass = "w-full flex items-center justify-center rounded-lg bg-amber-400 text-amber-900 font-medium text-sm px-4 py-2.5 hover:bg-amber-600 hover:text-amber-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-500 text-xl">
            ✉
          </div>
          <h2 className="font-semibold text-stone-900 mb-2">Email envoyé !</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Un lien de réinitialisation a été envoyé à{' '}
            <strong className="text-stone-700">{email}</strong>.
            Vérifiez votre boîte mail (et vos spams).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">
          {isUpdateMode ? 'Nouveau mot de passe' : 'Mot de passe oublié ?'}
        </h1>
        <p className="text-sm text-stone-500">
          {isUpdateMode
            ? 'Choisissez un nouveau mot de passe sécurisé.'
            : `Entrez votre email et nous vous enverrons un lien pour le réinitialiser.`}
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        {isUpdateMode ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className={inputClass}
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className={inputClass}
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>
        )}
      </div>

      <div className="mt-5 text-center">
        <a href="/auth/login" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
          ← Retour à la connexion
        </a>
      </div>
    </div>
  )
}
