export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="h-14 flex items-center px-6 border-b border-stone-200 bg-white">
        <a href="/" className="font-semibold text-stone-900 text-[15px]">
          Prompt<span className="text-amber-400">Pack</span>
        </a>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-4 text-center">
        <p className="text-xs text-stone-400">
          © 2024 PromptPack ·{' '}
          <a href="/mentions-legales" className="hover:text-stone-600">Mentions légales</a>
          {' · '}
          <a href="/confidentialite" className="hover:text-stone-600">Confidentialité</a>
        </p>
      </footer>
    </div>
  )
}
