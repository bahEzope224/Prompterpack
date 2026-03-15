import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'PromptPack — Packs de prompts IA prêts à l\'emploi',
    template: '%s | PromptPack',
  },
  description: 'Des packs de prompts testés et structurés pour ChatGPT, Claude et Gemini. Gagnez des heures chaque semaine.',
  openGraph: {
    title: 'PromptPack — Packs de prompts IA prêts à l\'emploi',
    description: 'Des packs de prompts testés et structurés pour ChatGPT, Claude et Gemini.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  )
}
