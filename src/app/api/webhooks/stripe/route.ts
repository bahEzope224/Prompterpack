import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// IMPORTANT : le body doit être lu en raw pour valider la signature Stripe
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 })
  }

  // 1. Vérifie la signature Stripe — sécurité absolue
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Signature webhook invalide:', err)
    // Logue l'événement invalide
    await supabaseAdmin.from('webhook_events').insert({
      provider: 'stripe',
      event_id: `invalid_${Date.now()}`,
      event_type: 'unknown',
      signature_valid: false,
      processed: false,
    }).catch(() => {}) // ne bloque pas si la table est inaccessible

    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 })
  }

  // 2. Idempotence — vérifie si l'événement a déjà été traité
  const { data: existingEvent } = await supabaseAdmin
    .from('webhook_events')
    .select('id, processed')
    .eq('provider', 'stripe')
    .eq('event_id', event.id)
    .single()

  if (existingEvent?.processed) {
    // Déjà traité — on répond 200 sans retraiter (idempotence)
    return NextResponse.json({ received: true, skipped: true })
  }

  // 3. Enregistre l'événement en base
  if (!existingEvent) {
    await supabaseAdmin.from('webhook_events').insert({
      provider: 'stripe',
      event_id: event.id,
      event_type: event.type,
      signature_valid: true,
      processed: false,
    })
  }

  // 4. Traitement selon le type d'événement
  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefunded(charge)
        break
      }

      default:
        // Événement non géré — on l'ignore proprement
        console.log(`Événement Stripe non géré : ${event.type}`)
    }

    // 5. Marque l'événement comme traité
    await supabaseAdmin
      .from('webhook_events')
      .update({ processed: true })
      .eq('provider', 'stripe')
      .eq('event_id', event.id)

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error(`Erreur traitement webhook ${event.type}:`, error)
    // On retourne 500 — Stripe retentera automatiquement
    return NextResponse.json(
      { error: 'Erreur traitement webhook.' },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { order_id, user_id, product_id } = session.metadata ?? {}

  if (!order_id || !user_id || !product_id) {
    throw new Error(`Métadonnées Stripe manquantes : ${JSON.stringify(session.metadata)}`)
  }

  // Met à jour le statut de la commande
  await supabaseAdmin
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', order_id)

  // Met à jour le paiement
  await supabaseAdmin
    .from('payments')
    .update({
      status: 'paid',
      provider_payment_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
    })
    .eq('provider_session_id', session.id)

  // Accorde l'accès au produit (upsert pour l'idempotence)
  await supabaseAdmin
    .from('user_product_access')
    .upsert(
      {
        user_id,
        product_id,
        order_id,
        access_status: 'active',
        granted_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id' }
    )

  console.log(`✓ Accès accordé — user:${user_id} product:${product_id} order:${order_id}`)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Retrouve la commande via le payment_intent
  const { data: payment } = await supabaseAdmin
    .from('payments')
    .select('order_id')
    .eq('provider_payment_id', paymentIntent.id)
    .single()

  if (payment) {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', payment.order_id)

    await supabaseAdmin
      .from('payments')
      .update({ status: 'failed' })
      .eq('provider_payment_id', paymentIntent.id)
  }
}

async function handleRefunded(charge: Stripe.Charge) {
  if (!charge.payment_intent) return

  const { data: payment } = await supabaseAdmin
    .from('payments')
    .select('order_id')
    .eq('provider_payment_id', charge.payment_intent as string)
    .single()

  if (payment) {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'refunded' })
      .eq('id', payment.order_id)

    await supabaseAdmin
      .from('payments')
      .update({ status: 'refunded' })
      .eq('provider_payment_id', charge.payment_intent as string)

    // Révoque l'accès au produit après remboursement
    await supabaseAdmin
      .from('user_product_access')
      .update({ access_status: 'revoked' })
      .eq('order_id', payment.order_id)
  }
}
