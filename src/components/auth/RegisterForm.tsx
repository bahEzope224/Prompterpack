'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = { redirectTo: string }

export function RegisterForm({ redirectTo }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    })

    if (error) {
      setError(getFriendlyError(error.message))
      setLoading(false)
      return
    }

    // Si la confirmation email est désactivée dans Supabase,
    // l'utilisateur est directement connecté
    if (data.session) {
      // Mettre à jour le profil avec le prénom/nom
      await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', data.user!.id)

      router.push(redirectTo)
      router.refresh()
      return
    }

    // Sinon, on affiche le message de confirmation email
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="font-semibold text-stone-900 mb-2">Vérifiez votre email</h2>
        <p className="text-sm text-stone-500 leading-relaxed">
          Un lien de confirmation a été envoyé à <strong>{email}</strong>.
          Cliquez dessus pour activer votre compte.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Prénom + Nom */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="label">Prénom</label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Marie"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="label">Nom</label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Dupont"
            className="input"
          />
        </div>
      </div>

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
        <label htmlFor="password" className="label">Mot de passe</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="8 caractères minimum"
          className="input"
        />
        {password.length > 0 && password.length < 8 && (
          <p className="text-xs text-red-500 mt-1">
            {8 - password.length} caractère{8 - password.length > 1 ? 's' : ''} manquant{8 - password.length > 1 ? 's' : ''}
          </p>
        )}
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
        {loading ? 'Création du compte…' : 'Créer mon compte'}
      </button>
    </form>
  )
}

function getFriendlyError(message: string): string {
  if (message.includes('User already registered')) {
    return 'Un compte existe déjà avec cet email. Essayez de vous connecter.'
  }
  if (message.includes('Password should be')) {
    return 'Le mot de passe doit contenir au moins 8 caractères.'
  }
  if (message.includes('Unable to validate email')) {
    return 'Adresse email invalide.'
  }
  return 'Une erreur est survenue. Veuillez réessayer.'
}
