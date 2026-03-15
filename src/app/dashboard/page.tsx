import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mon espace',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const firstName = profile?.first_name ?? user.email?.split('@')[0] ?? 'vous'

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">
            Bonjour, {firstName} !
          </h1>
          <p className="text-stone-500 text-sm">Bienvenue dans votre espace membre.</p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Packs achetés', value: '0' },
            { label: 'Packs accessibles', value: '0' },
            { label: 'Total dépensé', value: '0 €' },
          ].map(m => (
            <div key={m.label} className="bg-stone-100 rounded-xl p-4">
              <p className="text-2xl font-semibold text-stone-900 mb-1">{m.value}</p>
              <p className="text-sm text-stone-500">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Mes achats */}
        <div>
          <h2 className="text-base font-semibold text-stone-900 mb-4">Mes achats</h2>
          <div className="card text-center py-12">
            <p className="text-stone-400 text-sm mb-4">
              Vous n&apos;avez pas encore acheté de pack.
            </p>
            <a href="/catalogue" className="btn-primary text-sm py-2 px-5">
              Découvrir le catalogue
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
