import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — Questions fréquentes',
  description: 'Toutes les réponses à vos questions sur PromptPack : paiement, accès, formats, remboursement.',
}

const FAQ_SECTIONS = [
  {
    title: 'Les packs et le contenu',
    items: [
      {
        q: `Qu'est-ce qu'un pack de prompts ?`,
        a: `Un pack de prompts est une collection de requêtes rédigées et testées pour des outils IA comme ChatGPT, Claude ou Gemini. Chaque prompt est conçu pour vous donner un résultat précis et exploitable immédiatement.`,
      },
      {
        q: `Avec quels outils IA ces prompts fonctionnent-ils ?`,
        a: `Tous nos prompts sont testés et compatibles avec ChatGPT (GPT-4 et supérieur), Claude (Anthropic) et Gemini (Google). Ils fonctionnent avec n'importe quel LLM de dernière génération.`,
      },
      {
        q: `Les prompts sont-ils en français ?`,
        a: `Oui, tous nos packs sont intégralement en français. Les prompts produisent des résultats en français par défaut.`,
      },
      {
        q: `Comment sont structurés les packs ?`,
        a: `Chaque pack est organisé par thématiques et use cases. Vous recevez les prompts au format PDF (lisible et imprimable) et TXT (facile à copier-coller directement dans votre outil IA).`,
      },
    ],
  },
  {
    title: 'Achat et paiement',
    items: [
      {
        q: `Comment se passe le paiement ?`,
        a: `Le paiement est sécurisé par Stripe, le standard du paiement en ligne. Vous payez une seule fois par carte bancaire. Aucun abonnement, aucun frais caché.`,
      },
      {
        q: `Est-ce que je peux acheter plusieurs packs ?`,
        a: `Oui, vous pouvez acheter autant de packs que vous le souhaitez. Chaque achat est indépendant et vous donne un accès permanent au contenu.`,
      },
      {
        q: `Y a-t-il une facture ?`,
        a: `Oui, une confirmation de commande est envoyée par email après chaque achat. Une facture détaillée est disponible dans votre espace membre.`,
      },
    ],
  },
  {
    title: 'Accès et téléchargement',
    items: [
      {
        q: `Quand est-ce que j'accède à mon pack après l'achat ?`,
        a: `L'accès est immédiat. Dès que le paiement est confirmé, votre pack apparaît dans votre espace membre. Vous pouvez le consulter en ligne ou le télécharger.`,
      },
      {
        q: `Mon accès expire-t-il ?`,
        a: `Non, l'accès est permanent. Vous pouvez consulter et télécharger votre pack à tout moment, sans limite de durée.`,
      },
      {
        q: `Puis-je accéder à mes packs sur plusieurs appareils ?`,
        a: `Oui, il vous suffit de vous connecter à votre compte depuis n'importe quel appareil pour accéder à tous vos achats.`,
      },
    ],
  },
  {
    title: 'Remboursement et support',
    items: [
      {
        q: `Quelle est la politique de remboursement ?`,
        a: `Nous offrons une garantie de remboursement sous 7 jours. Si le pack ne correspond pas à vos attentes, contactez-nous via la page contact et nous vous remboursons sans question.`,
      },
      {
        q: `Comment vous contacter en cas de problème ?`,
        a: `Utilisez le formulaire de contact sur notre site. Nous répondons dans les 24 heures en semaine.`,
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-semibold text-stone-900 mb-3">Questions fréquentes</h1>
          <p className="text-stone-500">
            Vous ne trouvez pas votre réponse ?{' '}
            <Link href="/contact" className="text-amber-600 hover:underline">
              Contactez-nous
            </Link>.
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_SECTIONS.map(section => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <details key={i} className="card cursor-pointer group">
                    <summary className="text-sm font-medium text-stone-800 cursor-pointer list-none flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-stone-400 flex-shrink-0 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="text-sm text-stone-600 leading-relaxed mt-3 pt-3 border-t border-stone-100">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/catalogue" className="btn-primary px-8 py-3">
            Voir le catalogue
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
