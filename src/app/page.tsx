import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/catalogue/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompterpack - Packs de prompts IA pour booster votre productivité',
  description: 'Découvrez nos packs de prompts IA adaptés à votre profil : étudiant, freelance, entrepreneur, marketing, tech et RH. Gagnez du temps et optimisez votre utilisation de l\'IA.',
}

export default async function LandingPage() {
  const supabase = createClient()

  // Fetch categories for section
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4)  // Show top 4 featured

  return (
    <>
      <Navbar />
      <main className="bg-stone-50">
        {/* Hero Section */}
        <section className="bg-amber-100 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Boostez votre productivité avec nos packs de prompts IA
            </h1>
            <p className="text-xl text-stone-600 mb-8 max-w-3xl mx-auto">
              Des prompts prêts à l'emploi pour étudiants, freelances, entrepreneurs, marketeurs, tech et RH. Gagnez du temps et maximisez l'impact de l'IA dans votre quotidien.
            </p>
            <Link href="/catalogue" className="btn-primary text-lg px-8 py-3">
              Découvrir les packs
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-semibold text-stone-900 mb-8 text-center">
              Explorez par catégorie
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.map(category => (
                <Link
                  key={category.id}
                  href={`/catalogue?categorie=${category.slug}`}
                  className="block p-4 bg-white border border-stone-200 rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="text-lg font-medium text-stone-900">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Packs Section */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-semibold text-stone-900 mb-8 text-center">
              Nos packs phares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/catalogue" className="btn-secondary text-sm">
                Voir tout le catalogue
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-amber-200 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-semibold text-stone-900 mb-4">
              Prêt à transformer votre utilisation de l'IA ?
            </h2>
            <p className="text-lg text-stone-600 mb-6">
              Rejoignez des milliers d'utilisateurs qui gagnent du temps chaque jour grâce à nos prompts optimisés.
            </p>
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Commencer gratuitement
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}