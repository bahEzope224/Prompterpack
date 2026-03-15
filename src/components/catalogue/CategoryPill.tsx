import Link from 'next/link'

export function CategoryPill({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/catalogue?categorie=${slug}`}
      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm
                 bg-white border border-stone-200 text-stone-700
                 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50
                 transition-colors duration-150"
    >
      {name}
    </Link>
  )
}
