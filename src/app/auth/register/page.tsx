'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
        // Supabase n'accepte que les URLs enregistrées dans Auth → URL Configuration
        // On envoie uniquement l'URL de base, sans paramètres imbriqués
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes('User already registered')) {
        setError('Un compte existe déjà avec cet email.')
      } else if (error.message.includes('Password should be')) {
        setError('Le mot de passe doit contenir au moins 8 caractères.')
      } else if (error.message.includes('Unable to validate email')) {
        setError('Adresse email invalide.')
      } else if (error.message.includes('rate limit') || error.status === 429) {
        setError('Trop de tentatives. Attendez quelques minutes avant de réessayer.')
      } else {
        setError(`Erreur : ${error.message}`)
      }
      setLoading(false)
      return
    }

    // Si la confirmation email est désactivée : session directe
    if (data.session) {
      await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', data.user!.id)

      const params = new URLSearchParams(window.location.search)
      router.push(params.get('redirect') ?? '/dashboard')
      router.refresh()
      return
    }

    // Sinon : affiche la confirmation email
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-green-600 text-xl">
            ✓
          </div>
          <h2 className="font-semibold text-stone-900 mb-2">Vérifiez votre email</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Un lien de confirmation a été envoyé à{' '}
            <strong className="text-stone-700">{email}</strong>.
            Cliquez dessus pour activer votre compte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Créer un compte</h1>
        <p className="text-sm text-stone-500">Accès immédiat à vos packs après chaque achat.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-1.5">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Marie"
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-1.5">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Dupont"
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-red-500 mt-1">
                {8 - password.length} caractère{8 - password.length > 1 ? 's' : ''} manquant{8 - password.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded-lg bg-amber-400 text-amber-900 font-medium text-sm px-4 py-2.5 hover:bg-amber-600 hover:text-amber-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Création du compte…' : 'Créer mon compte'}
          </button>
        </form>
      </div>

      <p className="text-sm text-stone-500 text-center mt-5">
        Déjà un compte ?{' '}
        <a href="/auth/login" className="text-amber-600 hover:text-amber-800 font-medium">
          Se connecter
        </a>
      </p>
      <p className="text-xs text-stone-400 text-center mt-3 leading-relaxed">
        En créant un compte, vous acceptez nos{' '}
        <a href="/cgv" className="underline hover:text-stone-600">CGV</a> et notre{' '}
        <a href="/confidentialite" className="underline hover:text-stone-600">politique de confidentialité</a>.
      </p>
    </div>
  )
}
