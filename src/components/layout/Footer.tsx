import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-semibold text-stone-900 mb-2">
              Prompt<span className="text-amber-400">Pack</span>
            </p>
            <p className="text-sm text-stone-500 leading-relaxed">
              Des prompts IA testés et prêts à l'emploi pour gagner du temps chaque jour.
            </p>
          </div>

          {/* Produit */}
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Produit</p>
            <ul className="space-y-2">
              <li><Link href="/catalogue" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Catalogue</Link></li>
              <li><Link href="/categories" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Catégories</Link></li>
              <li><Link href="/faq" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Compte</p>
            <ul className="space-y-2">
              <li><Link href="/auth/register" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Créer un compte</Link></li>
              <li><Link href="/auth/login" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Connexion</Link></li>
              <li><Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Mon espace</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Légal</p>
            <ul className="space-y-2">
              <li><Link href="/mentions-legales" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Confidentialité</Link></li>
              <li><Link href="/cgv" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">CGV</Link></li>
              <li><Link href="/contact" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} PromptPack. Tous droits réservés.
          </p>
          <p className="text-xs text-stone-400">
            Paiement sécurisé par Stripe · Accès immédiat après achat
          </p>
        </div>
      </div>
    </footer>
  )
}
