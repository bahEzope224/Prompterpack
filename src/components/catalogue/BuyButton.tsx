'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  productId: string
  productSlug: string
  alreadyOwned: boolean
}

export function BuyButton({ productId, productSlug, alreadyOwned }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Si déjà acheté : bouton d'accès direct
  if (alreadyOwned) {
    return (
      <Link
        href={`/dashboard/library/${productId}`}
        className="btn-primary w-full justify-center py-3 text-[15px]"
      >
        Accéder à mon pack
      </Link>
    )
  }

  async function handleBuy() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Pas connecté : redirige vers login avec retour sur la fiche
    if (!user) {
      router.push(`/auth/login?redirect=/catalogue/${productSlug}`)
      return
    }

    try {
      // Crée une session Stripe Checkout (Sprint 4)
      const res = await fetch('/api/payments/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erreur lors du paiement')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="btn-primary w-full justify-center py-3 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirection…' : 'Acheter maintenant'}
      </button>
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}
