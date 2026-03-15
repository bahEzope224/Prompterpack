import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Réinitialisez votre mot de passe PromptPack.',
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Mot de passe oublié ?</h1>
        <p className="text-sm text-stone-500">
          Entrez votre email et nous vous enverrons un lien pour le réinitialiser.
        </p>
      </div>

      <div className="card">
        <ResetPasswordForm />
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  )
}
