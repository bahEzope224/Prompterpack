import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Mini header */}
      <header className="h-14 flex items-center px-6 border-b border-stone-200 bg-white">
        <Link href="/" className="font-semibold text-stone-900 text-[15px]">
          Prompt<span className="text-amber-400">Pack</span>
        </Link>
      </header>

      {/* Contenu centré */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Mini footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-stone-400">
          © {new Date().getFullYear()} PromptPack ·{' '}
          <Link href="/mentions-legales" className="hover:text-stone-600 transition-colors">
            Mentions légales
          </Link>{' '}
          ·{' '}
          <Link href="/confidentialite" className="hover:text-stone-600 transition-colors">
            Confidentialité
          </Link>
        </p>
      </footer>
    </div>
  )
}
