import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte PromptPack.',
}

type Props = {
  searchParams: { redirect?: string }
}

export default function LoginPage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-sm">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Bon retour !</h1>
        <p className="text-sm text-stone-500">Connectez-vous pour accéder à vos packs.</p>
      </div>

      {/* Formulaire */}
      <div className="card">
        <LoginForm redirectTo={searchParams.redirect ?? '/dashboard'} />
      </div>

      {/* Liens */}
      <div className="mt-5 text-center space-y-2">
        <p className="text-sm text-stone-500">
          Pas encore de compte ?{' '}
          <Link
            href={`/auth/register${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ''}`}
            className="text-amber-600 hover:text-amber-800 font-medium transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
