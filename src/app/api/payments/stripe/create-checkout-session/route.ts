import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/client'

export async function POST(request: Request) {
  try {
    // 1. Vérifie que l'utilisateur est connecté
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour acheter.' },
        { status: 401 }
      )
    }

    // 2. Récupère le produit depuis la base
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId manquant.' }, { status: 400 })
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, title, slug, price_amount, currency, status')
      .eq('id', productId)
      .eq('status', 'published')
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 })
    }

    // 3. Vérifie que l'utilisateur n'a pas déjà ce pack
    const { data: existingAccess } = await supabaseAdmin
      .from('user_product_access')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .eq('access_status', 'active')
      .single()

    if (existingAccess) {
      return NextResponse.json(
        { error: 'Vous possédez déjà ce pack.' },
        { status: 409 }
      )
    }

    // 4. Crée la commande en base (statut pending)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total_amount: product.price_amount,
        currency: product.currency,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Erreur création commande:', orderError)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande.' },
        { status: 500 }
      )
    }

    // 5. Crée la ligne de commande
    await supabaseAdmin.from('order_items').insert({
      order_id: order.id,
      product_id: product.id,
      unit_price: product.price_amount,
      quantity: 1,
      line_total: product.price_amount,
    })

    // 6. Crée la Checkout Session Stripe
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.title,
              metadata: { product_id: product.id },
            },
            unit_amount: product.price_amount, // déjà en centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: order.id,
        user_id: user.id,
        product_id: product.id,
      },
      success_url: `${appUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/catalogue/${product.slug}?cancelled=true`,
    })

    // 7. Lie la session Stripe à la commande
    await supabaseAdmin
      .from('orders')
      .update({
        status: 'awaiting_payment',
        stripe_session_id: session.id,
      })
      .eq('id', order.id)

    // 8. Crée l'entrée paiement en base
    await supabaseAdmin.from('payments').insert({
      order_id: order.id,
      provider: 'stripe',
      provider_session_id: session.id,
      status: 'pending',
      amount: product.price_amount,
      currency: product.currency,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Erreur create-checkout-session:', error)
    return NextResponse.json(
      { error: 'Erreur serveur inattendue.' },
      { status: 500 }
    )
  }
}
