import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-5xl font-semibold text-amber-400 mb-4">404</p>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">Page introuvable</h1>
        <p className="text-stone-500 text-sm mb-8 max-w-xs">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
          <Link href="/catalogue" className="btn-secondary">Voir le catalogue</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
