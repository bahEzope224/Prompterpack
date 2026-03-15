# Prompterpack

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black.svg?style=flat&logo=next.js)](https://nextjs.org/) [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg?style=flat&logo=supabase)](https://supabase.com/) [![Stripe](https://img.shields.io/badge/Stripe-Payments-blueviolet.svg?style=flat&logo=stripe)](https://stripe.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-UI-blue.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## Description

Prompterpack est une plateforme e-commerce pour la vente de packs de prompts IA prêts à l'emploi. Les packs sont adaptés à différents profils (étudiants, freelances, entrepreneurs, marketing, tech, RH) et visent à booster la productivité avec des outils comme ChatGPT, Claude et Gemini.

Le site utilise le **App Router** de Next.js pour une navigation fluide, Supabase pour la gestion de la base de données, l'authentification et le stockage, et Stripe pour les paiements sécurisés. Les prompts sont protégés contre la revente via RLS, URLs signées et watermarking.

Projet développé en 2026, avec un focus sur la sécurité, la monétisation et l'expérience utilisateur.

## Fonctionnalités

- **Catalogue de produits** : Liste filtrable par catégorie, tri (prix, nouveauté), avec cartes produits.
- **Pages dynamiques** : Détails produits (`/catalogue/[slug]`), dashboard utilisateur pour accès aux achats.
- **Authentification** : Inscription/connexion via Supabase (email/mot de passe, potentiellement OAuth).
- **Paiements** : Intégration Stripe pour checkout sécurisé, avec gestion des commandes et paiements en base.
- **Protection anti-revente** : 
  - Row Level Security (RLS) sur les tables Supabase.
  - URLs signées temporaires pour downloads (expire en 1h).
  - Watermarking personnalisé sur PDFs (avec user ID/email).
- **Filtres et catégories** : Sidebar pour filtres, page catégories dédiée.
- **Landing page** : Hero, sections catégories, packs phares, CTA.
- **Admin** : Client Supabase admin pour inserts sécurisés (bypass RLS).
- **Autres** : Confirmation paiement, not-found page, footer/navbar personnalisés.

## Stack Technique

- **Frontend/Backend** : Next.js 14.2.15 (App Router, Server Components).
- **Base de données & Auth** : Supabase (PostgreSQL, RLS activé).
- **Paiements** : Stripe (checkout sessions).
- **CSS/UI** : Tailwind CSS, Geist fonts (sans/mono).
- **Outils** : TypeScript, pdf-lib (pour watermarking), @supabase/ssr & @supabase/supabase-js.
- **Environnement** : Node.js 20+.


## Prérequis

Avant de commencer, vérifiez que vous avez installé sur votre machine :

| Outil | Version minimum | Vérifier |
|---|---|---|
| Node.js | 18.17.0 | `node --version` |
| npm | 9.x | `npm --version` |
| Git | 2.x | `git --version` |

Si Node.js n'est pas installé : [nodejs.org](https://nodejs.org) → télécharger la version **LTS**.

---

## Étape 1 — Récupérer le projet

```bash
# Cloner le dépôt (ou décompresser le zip fourni)
git clone https://github.com/votre-compte/promptpack.git
cd promptpack

# Installer toutes les dépendances
npm install
```

> Si vous partez d'un zip : décompressez-le, ouvrez un terminal dans le dossier `promptpack/`, puis lancez `npm install`.

---

## Étape 2 — Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte (gratuit)
2. Cliquez **New project** → choisissez un nom et un mot de passe de base de données → **Create project**
3. Attendez ~2 minutes que le projet soit prêt
4. Dans le menu gauche : **Settings → API**
5. Notez ces deux valeurs (vous en aurez besoin à l'étape 4) :
   - **Project URL** → ressemble à `https://abcdefgh.supabase.co`
   - **anon public** → longue clé commençant par `eyJ...`

### Créer le schéma de base de données

1. Dans Supabase, menu gauche : **SQL Editor**
2. Cliquez **New query**
3. Ouvrez le fichier `supabase-schema.sql` fourni dans le projet
4. Copiez tout son contenu et collez-le dans l'éditeur
5. Cliquez **Run** (ou `Ctrl+Entrée`)
6. Vous devriez voir "Success" — les tables sont créées

### Configurer le Storage (pour les fichiers des packs)

1. Dans Supabase, menu gauche : **Storage**
2. Cliquez **New bucket**
3. Nom : `pack-contents`
4. **Décochez** "Public bucket" → le bucket doit être **privé**
5. Cliquez **Create bucket**

---

## Étape 3 — Créer le compte Stripe

1. Allez sur [stripe.com](https://stripe.com) et créez un compte (gratuit)
2. Depuis le dashboard Stripe, activez le **mode test** (toggle en haut à droite)
3. Menu gauche : **Developers → API keys**
4. Notez ces deux valeurs :
   - **Publishable key** → commence par `pk_test_...`
   - **Secret key** → commence par `sk_test_...`

> Pour le webhook Stripe (Sprint 4), vous aurez aussi besoin du **Webhook signing secret**. Ce n'est pas nécessaire pour l'instant.

---

## Étape 4 — Configurer les variables d'environnement

Copiez le fichier exemple :

```bash
cp .env.local.example .env.local
```

Ouvrez `.env.local` avec votre éditeur et remplissez chaque valeur :

```env
# Supabase (récupérées à l'étape 2)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (récupérées à l'étape 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   ← laisser vide pour l'instant, complété au Sprint 4

# Resend (laisser vide pour l'instant, complété au Sprint 4)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Important :** le fichier `.env.local` est dans `.gitignore` — il ne sera jamais envoyé sur Git. Ne partagez jamais vos clés secrètes.

---

## Étape 5 — Lancer le projet en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

Vous devriez voir la page d'accueil de PromptPack.

---

## Étape 6 — Ajouter votre premier pack (test)

Pour vérifier que tout fonctionne, ajoutez un pack de test directement dans Supabase :

1. Dans Supabase, menu gauche : **Table Editor**
2. Ouvrez la table `categories` → vérifiez que les catégories sont bien là (insérées par le schéma SQL)
3. Ouvrez la table `products` → cliquez **Insert row** et remplissez :
   - `title` : `Pack test — Freelance`
   - `slug` : `pack-test-freelance`
   - `short_description` : `Un pack de test pour valider l'installation.`
   - `price_amount` : `1900` (= 19,00 €, en centimes)
   - `currency` : `EUR`
   - `status` : `published`
   - `is_featured` : `true`
   - `prompt_count` : `50`
4. Sauvegardez et rechargez [localhost:3000](http://localhost:3000)

Votre pack doit apparaître sur la page d'accueil et dans le catalogue.

---

## Structure du projet

```
promptpack/
├── .env.local.example       ← Modèle des variables d'environnement
├── .env.local               ← Vos vraies clés (jamais committé)
├── .gitignore               ← Fichiers exclus de Git
├── requirements.txt         ← Liste lisible des dépendances
├── supabase-schema.sql      ← Schéma complet de la base de données
├── package.json             ← Dépendances npm
├── tailwind.config.ts       ← Configuration Tailwind CSS
├── next.config.js           ← Configuration Next.js
├── middleware.ts             ← Protection des routes (auth + rôles)
└── src/
    ├── app/                 ← Pages (Next.js App Router)
    │   ├── page.tsx         ← Page d'accueil
    │   ├── layout.tsx       ← Layout global
    │   ├── globals.css      ← Design system CSS
    │   ├── not-found.tsx    ← Page 404
    │   ├── catalogue/       ← Liste des packs + fiche produit
    │   ├── auth/            ← Connexion / inscription (Sprint 3)
    │   ├── dashboard/       ← Espace membre (Sprint 5)
    │   └── admin/           ← Back-office (Sprint 6)
    ├── components/
    │   ├── layout/          ← Navbar, Footer
    │   └── catalogue/       ← ProductCard, Filters, BuyButton...
    ├── lib/
    │   ├── supabase/        ← Clients Supabase (browser + server)
    │   └── utils.ts         ← Fonctions utilitaires
    └── types/
        └── database.ts      ← Types TypeScript du schéma Supabase
```

---

## Commandes utiles

```bash
# Démarrer en développement
npm run dev

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Vérifier le linting
npm run lint

# Builder pour la production
npm run build

# Lancer en mode production (après build)
npm start
```

---

## État d'avancement des sprints

| Sprint | Contenu | Statut |
|---|---|---|
| S1 — Fondations | Structure, Supabase, auth middleware, Navbar/Footer | ✅ Livré |
| S2 — Catalogue | Accueil, catalogue, fiche produit, FAQ | ✅ Livré |
| S3 — Auth | Inscription, connexion, reset password | ✅ Livré |
| S4 — Paiement | Stripe, webhooks, attribution d'accès | 🔜 Prochain |
| S5 — Espace membre | Dashboard, mes achats, téléchargement | ⬜ À venir |
| S6 — Admin | CRUD produits/catégories, commandes, users | ⬜ À venir |

---

## Déploiement sur Vercel (quand vous êtes prêt)

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Connectez votre dépôt GitHub
3. Vercel détecte automatiquement Next.js
4. Dans **Settings → Environment Variables**, ajoutez toutes les variables de votre `.env.local`
5. Cliquez **Deploy**

Chaque `git push` sur la branche `main` déclenchera un nouveau déploiement automatique.

---

## Problèmes courants

**`Module not found` après npm install**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Erreur Supabase "Invalid API key"**
→ Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local` correspondent exactement aux valeurs de votre projet Supabase (Settings → API).

**La page s'affiche mais les packs n'apparaissent pas**
→ Vérifiez dans Supabase que le champ `status` de vos produits est bien `published` (pas `draft`).

**Erreur "relation does not exist"**
→ Le schéma SQL n'a pas été exécuté. Retournez à l'étape 2 et relancez `supabase-schema.sql` dans l'éditeur SQL de Supabase.


## Contact

Pour questions : [bahibrahimatalibe@gmail.com] ou ouvrez une issue sur GitHub.

Merci d'utiliser Prompterpack ! 🚀