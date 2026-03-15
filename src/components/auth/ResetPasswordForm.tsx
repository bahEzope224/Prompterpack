'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  // Mode "update" : l'utilisateur arrive depuis le lien email
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Détecte si on est en mode update (lien magique Supabase)
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setIsUpdateMode(true)
    }
  }, [])

  // ── Envoi du lien de reset ──
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

  // ── Mise à jour du nouveau mot de passe ──
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

    router.push('/dashboard?reset=success')
  }

  // ── Confirmation d'envoi ──
  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-amber-500 text-xl">✉</span>
        </div>
        <h2 className="font-semibold text-stone-900 mb-2">Email envoyé !</h2>
        <p className="text-sm text-stone-500 leading-relaxed">
          Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
          Vérifiez votre boîte mail (et vos spams).
        </p>
      </div>
    )
  }

  // ── Mode update : nouveau mot de passe ──
  if (isUpdateMode) {
    return (
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="label">Nouveau mot de passe</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="input"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5 disabled:opacity-60"
        >
          {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    )
  }

  // ── Mode demande : envoi du lien ──
  return (
    <form onSubmit={handleSendLink} className="space-y-4">
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

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-2.5 disabled:opacity-60"
      >
        {loading ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}
      </button>
    </form>
  )
}
