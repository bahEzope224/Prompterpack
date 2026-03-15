import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catégories de packs de prompts IA',
  description: 'Explorez nos catégories de packs : étudiant, freelance, entrepreneur, marketing, tech et RH.',
}

export default async function CategoriesPage() {
  const supabase = createClient()

  // Fetch active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')  // Assuming description field exists; add more if needed (e.g., icon)
    .eq('is_active', true)
    .order('name')

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">Catégories de packs</h1>
          <p className="text-stone-500 text-sm">
            {categories?.length ?? 0} catégorie{categories?.length !== 1 ? 's' : ''} disponible{categories?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid of categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <a
                key={category.id}
                href={`/catalogue?categorie=${category.slug}`}
                className="block p-6 border border-stone-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-medium text-stone-900 mb-2">{category.name}</h2>
                <p className="text-sm text-stone-500">
                  {category.description || 'Découvrez les packs dans cette catégorie.'}
                </p>
              </a>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <p className="text-stone-400 text-sm mb-3">
                Aucune catégorie disponible pour l'instant.
              </p>
              <a href="/catalogue" className="btn-secondary text-sm">
                Voir le catalogue complet
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}