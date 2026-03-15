import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/catalogue/ProductCard'
import { CatalogueFilters } from '@/components/catalogue/CatalogueFilters'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catalogue de packs de prompts IA',
  description: 'Découvrez tous nos packs de prompts classés par usage : étudiant, freelance, entrepreneur, marketing, tech et RH.',
}

type SearchParams = {
  categorie?: string
  tri?: 'prix-asc' | 'prix-desc' | 'nouveaute'
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createClient()

  // Catégories pour les filtres
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')

  // Requête produits avec filtres
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('status', 'published')

  // Filtre catégorie
  if (searchParams.categorie) {
    const cat = categories?.find(c => c.slug === searchParams.categorie)
    if (cat) query = query.eq('category_id', cat.id)
  }

  // Tri
  switch (searchParams.tri) {
    case 'prix-asc':
      query = query.order('price_amount', { ascending: true })
      break
    case 'prix-desc':
      query = query.order('price_amount', { ascending: false })
      break
    case 'nouveaute':
      query = query.order('created_at', { ascending: false })
      break
    default:
      // Popularité par défaut : featured en premier, puis date
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products } = await query

  const activeCat = searchParams.categorie ?? null
  const activeTri = searchParams.tri ?? null

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">Catalogue de packs</h1>
          <p className="text-stone-500 text-sm">
            {products?.length ?? 0} pack{(products?.length ?? 0) > 1 ? 's' : ''} disponible{(products?.length ?? 0) > 1 ? 's' : ''}
            {activeCat && categories && (
              <> dans <span className="text-stone-700 font-medium">
                {categories.find(c => c.slug === activeCat)?.name}
              </span></>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
          {/* Sidebar filtres */}
          <aside>
            <CatalogueFilters
              categories={categories ?? []}
              activeCat={activeCat}
              activeTri={activeTri}
            />
          </aside>

          {/* Grille produits */}
          <div>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-stone-400 text-sm mb-3">
                  Aucun pack dans cette catégorie pour l'instant.
                </p>
                <a href="/catalogue" className="btn-secondary text-sm">
                  Voir tous les packs
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
