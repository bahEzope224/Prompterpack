import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/catalogue/ProductCard'
import { CategoryPill } from '@/components/catalogue/CategoryPill'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PromptPack — Packs de prompts IA prêts à l\'emploi',
  description: 'Des packs de prompts testés et structurés pour ChatGPT, Claude et Gemini. Gagnez des heures chaque semaine.',
}

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: categories }, { data: featuredProducts }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="bg-white border-b border-stone-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
            <span className="badge badge-amber mb-5 inline-flex">
              Packs de prompts IA — accès immédiat
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-5">
              Des prompts prêts à l'emploi,<br className="hidden sm:block" />
              par métier et par usage
            </h1>
            <p className="text-base md:text-lg text-stone-500 mb-8 leading-relaxed max-w-xl mx-auto">
              Gagnez des heures chaque semaine avec des packs de prompts testés, structurés
              et immédiatement exploitables pour ChatGPT, Claude et Gemini.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/catalogue" className="btn-primary px-6 py-3 text-[15px]">
                Voir le catalogue
              </Link>
              <Link href="/auth/register" className="btn-secondary px-6 py-3 text-[15px]">
                Créer un compte
              </Link>
            </div>
            <p className="text-sm text-stone-400 mt-5">
              Accès immédiat · Paiement sécurisé · Sans abonnement
            </p>
          </div>
        </section>

        {/* ── Catégories ── */}
        {categories && categories.length > 0 && (
          <section className="border-b border-stone-200 bg-stone-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-stone-500 mr-1">Parcourir par usage :</span>
                {categories.map(cat => (
                  <CategoryPill key={cat.id} name={cat.name} slug={cat.slug} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Packs en vedette ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-stone-900">Packs populaires</h2>
            <Link href="/catalogue" className="text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors">
              Voir tout →
            </Link>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400">
              <p className="text-sm">Les packs arrivent bientôt — revenez dans quelques jours.</p>
            </div>
          )}
        </section>

        {/* ── Comment ça marche ── */}
        <section className="bg-white border-y border-stone-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <h2 className="text-xl font-semibold text-stone-900 text-center mb-12">
              Simple, immédiat, exploitable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  step: '01',
                  title: 'Choisissez un pack',
                  desc: 'Parcourez le catalogue et sélectionnez le pack adapté à votre usage ou votre métier.',
                },
                {
                  step: '02',
                  title: 'Achetez en un clic',
                  desc: 'Paiement sécurisé par carte via Stripe. Aucun abonnement, aucune surprise.',
                },
                {
                  step: '03',
                  title: 'Accédez immédiatement',
                  desc: 'Votre pack apparaît dans votre espace membre dès la confirmation du paiement.',
                },
              ].map(item => (
                <div key={item.step}>
                  <p className="text-3xl font-semibold text-amber-400 mb-3">{item.step}</p>
                  <p className="font-semibold text-stone-900 mb-2">{item.title}</p>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Réassurance ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Accès à vie', sub: 'Payez une fois, gardez pour toujours' },
              { label: 'Tous les outils IA', sub: 'ChatGPT, Claude, Gemini et plus' },
              { label: 'Format PDF + TXT', sub: 'Téléchargeable et exploitable' },
              { label: 'Remboursé sous 7 jours', sub: 'Si le pack ne vous convient pas' },
            ].map(item => (
              <div key={item.label} className="p-4">
                <p className="font-semibold text-stone-900 text-sm mb-1">{item.label}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="bg-amber-50 border-t border-amber-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-stone-900 mb-3">
              Prêt à gagner du temps ?
            </h2>
            <p className="text-stone-500 mb-7">
              Choisissez votre premier pack et commencez à utiliser l'IA plus efficacement dès aujourd'hui.
            </p>
            <Link href="/catalogue" className="btn-primary px-8 py-3 text-[15px]">
              Découvrir les packs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
