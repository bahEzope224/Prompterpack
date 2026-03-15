/**
 * Formate un prix en centimes vers une chaîne lisible.
 * Ex: 1900, 'EUR' → '19,00 €'
 */
export function formatPrice(amountInCents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountInCents / 100)
}

/**
 * Génère un slug depuis un texte.
 * Ex: 'Pack Révision & Méthode' → 'pack-revision-methode'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Tronque un texte avec ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Formate une date en français.
 * Ex: '2024-03-12T...' → '12 mars 2024'
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}
