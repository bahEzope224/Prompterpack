import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

type Category = { name: string; slug: string } | null

type Product = {
  id: string
  title: string
  slug: string
  short_description: string
  price_amount: number
  currency: string
  prompt_count: number | null
  is_featured: boolean
  categories: Category
}

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  etudiant:    'badge-amber',
  freelance:   'badge-amber',
  entrepreneur:'badge-teal',
  marketing:   'badge-violet',
  'tech-data': 'badge bg-stone-100 text-stone-700',
  rh:          'badge-teal',
}

export function ProductCard({ product }: { product: Product }) {
  const badgeClass = product.categories?.slug
    ? (CATEGORY_BADGE_CLASSES[product.categories.slug] ?? 'badge-amber')
    : 'badge-amber'

  return (
    <article className="card flex flex-col group hover:border-stone-300 transition-colors duration-150">
      {/* Catégorie + featured */}
      <div className="flex items-center justify-between mb-3">
        {product.categories && (
          <span className={badgeClass}>{product.categories.name}</span>
        )}
        {product.is_featured && (
          <span className="badge-success text-[11px]">Populaire</span>
        )}
      </div>

      {/* Titre */}
      <h3 className="font-semibold text-stone-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors">
        {product.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-stone-500 leading-relaxed flex-1 mb-4">
        {product.short_description}
      </p>

      {/* Meta */}
      {product.prompt_count && (
        <p className="text-xs text-stone-400 mb-4">
          {product.prompt_count} prompts inclus
        </p>
      )}

      {/* Prix + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <span className="text-xl font-semibold text-stone-900">
          {formatPrice(product.price_amount, product.currency)}
        </span>
        <Link
          href={`/catalogue/${product.slug}`}
          className="btn-primary text-sm py-2 px-4"
        >
          Voir le pack
        </Link>
      </div>
    </article>
  )
}
