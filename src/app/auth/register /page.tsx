import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créer un compte',
  description: 'Créez votre compte PromptPack et accédez à vos packs immédiatement après achat.',
}

type Props = {
  searchParams: { redirect?: string }
}

export default function RegisterPage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-sm">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Créer un compte</h1>
        <p className="text-sm text-stone-500">
          Accès immédiat à vos packs après chaque achat.
        </p>
      </div>

      {/* Formulaire */}
      <div className="card">
        <RegisterForm redirectTo={searchParams.redirect ?? '/dashboard'} />
      </div>

      {/* Liens */}
      <div className="mt-5 text-center">
        <p className="text-sm text-stone-500">
          Déjà un compte ?{' '}
          <Link
            href={`/auth/login${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ''}`}
            className="text-amber-600 hover:text-amber-800 font-medium transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>

      {/* Légal */}
      <p className="text-xs text-stone-400 text-center mt-4 leading-relaxed">
        En créant un compte, vous acceptez nos{' '}
        <Link href="/cgv" className="underline hover:text-stone-600">CGV</Link> et notre{' '}
        <Link href="/confidentialite" className="underline hover:text-stone-600">
          politique de confidentialité
        </Link>.
      </p>
    </div>
  )
}
