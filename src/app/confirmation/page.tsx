import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commande confirmée',
}

type Props = {
  searchParams: { session_id?: string }
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id } = searchParams

  if (!session_id) redirect('/dashboard')

  // Vérifie que l'utilisateur est connecté
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Récupère la session Stripe pour confirmer le paiement
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch {
    redirect('/dashboard')
  }

  if (session.payment_status !== 'paid') {
    redirect('/dashboard')
  }

  // Récupère les détails de la commande
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      total_amount,
      currency,
      created_at,
      status,
      order_items (
        product_id,
        unit_price,
        products (
          title,
          slug,
          categories (name)
        )
      )
    `)
    .eq('stripe_session_id', session_id)
    .single()

  const product = order?.order_items?.[0]?.products as any
  const category = product?.categories?.name

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <div className="card text-center">
          {/* Icône succès */}
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <span className="text-green-500 text-2xl font-semibold">✓</span>
          </div>

          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Commande confirmée !
          </h1>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            Votre pack est disponible immédiatement dans votre espace membre.
          </p>

          {/* Récapitulatif commande */}
          {order && (
            <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-stone-900 text-sm leading-snug">
                    {product?.title ?? 'Pack PromptPack'}
                  </p>
                  {category && (
                    <span className="badge badge-amber mt-1.5 text-[11px]">
                      {category}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-stone-900 text-sm flex-shrink-0 ml-3">
                  {formatPrice(order.total_amount, order.currency)}
                </p>
              </div>

              <div className="border-t border-stone-200 pt-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Référence</span>
                  <span className="text-stone-700 font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Date</span>
                  <span className="text-stone-700">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-stone-500">Statut</span>
                  <span className="badge badge-success text-[11px]">Payé</span>
                </div>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="btn-primary w-full justify-center py-2.5">
              Accéder à mon espace membre
            </Link>
            <Link href="/catalogue" className="btn-secondary w-full justify-center py-2.5">
              Voir d&apos;autres packs
            </Link>
          </div>

          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            Un email de confirmation a été envoyé à {session.customer_email}.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
