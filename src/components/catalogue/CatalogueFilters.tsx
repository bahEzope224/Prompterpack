'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type Category = { id: string; name: string; slug: string }

type Props = {
  categories: Category[]
  activeCat: string | null
  activeTri: string | null
}

const TRI_OPTIONS = [
  { value: '',           label: 'Popularité' },
  { value: 'prix-asc',  label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'nouveaute', label: 'Nouveautés' },
]

export function CatalogueFilters({ categories, activeCat, activeTri }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/catalogue?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="space-y-6 sticky top-20">
      {/* Filtre catégorie */}
      <div className="card">
        <p className="text-sm font-medium text-stone-700 mb-3">Catégorie</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setParam('categorie', null)}
            className={`text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
              !activeCat
                ? 'bg-amber-50 text-amber-800 font-medium'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setParam('categorie', cat.slug)}
              className={`text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                activeCat === cat.slug
                  ? 'bg-amber-50 text-amber-800 font-medium'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tri */}
      <div className="card">
        <p className="text-sm font-medium text-stone-700 mb-3">Trier par</p>
        <div className="flex flex-col gap-1">
          {TRI_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setParam('tri', opt.value || null)}
              className={`text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                (activeTri ?? '') === opt.value
                  ? 'bg-amber-50 text-amber-800 font-medium'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Réinitialiser */}
      {(activeCat || activeTri) && (
        <button
          onClick={() => router.push('/catalogue')}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  )
}
