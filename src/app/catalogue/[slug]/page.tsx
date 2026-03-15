import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BuyButton } from '@/components/catalogue/BuyButton'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

// Génère les métadonnées SEO dynamiquement
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('title, short_description')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!product) return { title: 'Pack introuvable' }

  return {
    title: product.title,
    description: product.short_description,
    openGraph: {
      title: product.title,
      description: product.short_description,
      type: 'website',
    },
  }
}

// generateStaticParams s'exécute au build, hors contexte HTTP.
// On utilise le client admin (pas de cookies requis) pour cette fonction uniquement.
export async function generateStaticParams() {
  const { createClient: createAdminClient } = await import('@supabase/supabase-js')
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: products } = await admin
    .from('products')
    .select('slug')
    .eq('status', 'published')

  return (products ?? []).map(p => ({ slug: p.slug }))
}

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  etudiant:    'badge-amber',
  freelance:   'badge-amber',
  entrepreneur:'badge-teal',
  marketing:   'badge-violet',
  'tech-data': 'badge bg-stone-100 text-stone-700',
  rh:          'badge-teal',
}

export default async function ProductPage({ params }: Props) {
  const supabase = createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!product) notFound()

  // Vérifie si l'utilisateur a déjà acheté ce pack
  const { data: { user } } = await supabase.auth.getUser()
  let alreadyOwned = false
  if (user) {
    const { data: access } = await supabase
      .from('user_product_access')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .eq('access_status', 'active')
      .single()
    alreadyOwned = !!access
  }

  const badgeClass = product.categories?.slug
    ? (CATEGORY_BADGE_CLASSES[product.categories.slug] ?? 'badge-amber')
    : 'badge-amber'

  // Parse du contenu inclus (liste de points séparés par \n)
  const includedItems = product.long_description
    ? product.long_description.split('\n').filter(Boolean)
    : []

  // Aperçu : 2 premiers éléments du preview_content (séparés par ---)
  const previewItems = product.preview_content
    ? product.preview_content.split('---').filter(Boolean).slice(0, 2)
    : []

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
          <Link href="/" className="hover:text-stone-600 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-stone-600 transition-colors">Catalogue</Link>
          <span>/</span>
          <span className="text-stone-600 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

          {/* ── Colonne gauche : contenu ── */}
          <div>
            {/* Catégorie + titre */}
            {product.categories && (
              <span className={`${badgeClass} mb-4 inline-flex`}>
                {product.categories.name}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 leading-tight mb-4">
              {product.title}
            </h1>
            <p className="text-stone-600 leading-relaxed mb-6">
              {product.short_description}
            </p>

            {/* Tags formats */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['ChatGPT', 'Claude', 'Gemini'].map(t => (
                <span key={t} className="badge bg-stone-100 text-stone-600">{t}</span>
              ))}
              {product.prompt_count && (
                <span className="badge bg-stone-100 text-stone-600">
                  {product.prompt_count} prompts
                </span>
              )}
              <span className="badge bg-stone-100 text-stone-600">PDF + TXT</span>
            </div>

            {/* Contenu inclus */}
            {includedItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-semibold text-stone-900 mb-4">Ce pack contient</h2>
                <ul className="space-y-3">
                  {includedItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-amber-400 font-semibold mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Aperçu du contenu */}
            {previewItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-semibold text-stone-900 mb-4">Aperçu du contenu</h2>
                <div className="space-y-3">
                  {previewItems.map((item, i) => {
                    const [title, ...rest] = item.trim().split('\n')
                    return (
                      <div key={i} className="card border border-stone-200">
                        <p className="text-xs font-medium text-amber-600 mb-2">{title}</p>
                        <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                          {rest.join(' ')}
                        </p>
                        <div className="mt-3 flex items-center justify-between bg-stone-50 rounded-lg p-2.5">
                          <span className="text-xs text-stone-400">Suite réservée aux acheteurs</span>
                          {!alreadyOwned && (
                            <span className="text-xs text-amber-600 font-medium">Acheter pour accéder →</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* FAQ courte */}
            <div>
              <h2 className="text-base font-semibold text-stone-900 mb-4">Questions fréquentes</h2>
              <div className="space-y-4">
                {[
                  {
                    q: `Avec quels outils IA ces prompts fonctionnent-ils ?`,
                    a: `Tous les prompts sont testés et compatibles avec ChatGPT, Claude et Gemini. Ils fonctionnent avec n'importe quel LLM de dernière génération.`,
                  },
                  {
                    q: `Comment accéder au pack après l'achat ?`,
                    a: `Votre pack est disponible immédiatement dans votre espace membre, dès la confirmation du paiement. Vous pouvez le consulter en ligne et le télécharger en PDF.`,
                  },
                  {
                    q: `Y a-t-il une politique de remboursement ?`,
                    a: `Oui, vous avez 7 jours pour demander un remboursement si le pack ne correspond pas à vos attentes. Contactez-nous via la page contact.`,
                  },
                ].map((faq, i) => (
                  <details key={i} className="card cursor-pointer group">
                    <summary className="text-sm font-medium text-stone-800 cursor-pointer list-none flex items-center justify-between">
                      {faq.q}
                      <span className="text-stone-400 ml-3 flex-shrink-0">+</span>
                    </summary>
                    <p className="text-sm text-stone-600 leading-relaxed mt-3 pt-3 border-t border-stone-100">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* ── Colonne droite : achat ── */}
          <div className="sticky top-20">
            <div className="card border border-stone-200 shadow-sm">
              {/* Prix */}
              <div className="mb-5">
                <p className="text-3xl font-semibold text-stone-900 mb-1">
                  {formatPrice(product.price_amount, product.currency)}
                </p>
                <p className="text-sm text-stone-400">Paiement unique · Accès à vie</p>
              </div>

              {/* CTA */}
              <BuyButton
                productId={product.id}
                productSlug={product.slug}
                alreadyOwned={alreadyOwned}
              />

              <p className="text-xs text-stone-400 text-center mt-3">
                Paiement sécurisé par Stripe
              </p>

              <div className="h-px bg-stone-100 my-4" />

              {/* Récapitulatif */}
              <ul className="space-y-2.5">
                {[
                  ['Format', 'PDF + TXT'],
                  ['Prompts inclus', product.prompt_count ? `${product.prompt_count} prompts` : 'Voir détail'],
                  ['Compatible', 'ChatGPT, Claude, Gemini'],
                  ['Accès', 'Immédiat après paiement'],
                  ['Mises à jour', 'Incluses'],
                ].map(([key, val]) => (
                  <li key={key} className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">{key}</span>
                    <span className="text-stone-800 font-medium">{val}</span>
                  </li>
                ))}
              </ul>

              <div className="h-px bg-stone-100 my-4" />
              <p className="text-xs text-stone-500 leading-relaxed text-center">
                Satisfait ou remboursé sous 7 jours.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
