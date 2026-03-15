-- ============================================================
-- PromptPack — Packs de démonstration
-- À coller dans : Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Récupère les IDs des catégories pour les lier aux produits
DO $$
DECLARE
  cat_etudiant    UUID;
  cat_freelance   UUID;
  cat_entrepreneur UUID;
  cat_marketing   UUID;
  cat_tech        UUID;
  cat_rh          UUID;
BEGIN

  SELECT id INTO cat_etudiant    FROM categories WHERE slug = 'etudiant';
  SELECT id INTO cat_freelance   FROM categories WHERE slug = 'freelance';
  SELECT id INTO cat_entrepreneur FROM categories WHERE slug = 'entrepreneur';
  SELECT id INTO cat_marketing   FROM categories WHERE slug = 'marketing';
  SELECT id INTO cat_tech        FROM categories WHERE slug = 'tech-data';
  SELECT id INTO cat_rh          FROM categories WHERE slug = 'rh';

  -- ──────────────────────────────────────────────
  -- 1. ÉTUDIANT
  -- ──────────────────────────────────────────────
  INSERT INTO products (
    title, slug, short_description, long_description,
    price_amount, currency, status, category_id,
    prompt_count, is_featured, preview_content
  ) VALUES (
    'Pack révision & méthode — Bac+',
    'pack-revision-methode-bac-plus',
    '50 prompts pour résumer des cours, préparer des révisions, structurer des dissertations et gagner du temps sur tous vos travaux universitaires.',
    '20 prompts résumé & synthèse de cours — transformez n''importe quel cours en fiche claire et structurée
15 prompts dissertation & rédaction — introduction, plan, argumentation et conclusion en quelques minutes
10 prompts révision active — génération de questions, quiz, flashcards à partir de vos notes
5 prompts gestion du temps — planification des révisions, priorités et organisation semaine',
    900,
    'EUR',
    'published',
    cat_etudiant,
    50,
    true,
    'Prompt résumé de cours — fiche synthèse
Tu es un assistant pédagogique expert. À partir du cours suivant, génère une fiche de révision structurée avec : les 5 concepts clés, une définition concise pour chacun, les liens entre les concepts, et 3 questions probables d''examen. Cours : [coller votre cours ici]
---
Prompt dissertation — introduction
Tu es un professeur de lettres et philosophie. Rédige une introduction de dissertation en 3 paragraphes sur le sujet suivant : [sujet]. L''introduction doit inclure une accroche originale, une problématique claire et l''annonce d''un plan en 3 parties.'
  );

  -- ──────────────────────────────────────────────
  -- 2. FREELANCE
  -- ──────────────────────────────────────────────
  INSERT INTO products (
    title, slug, short_description, long_description,
    price_amount, currency, status, category_id,
    prompt_count, is_featured, preview_content
  ) VALUES (
    'Pack prospection & contenu créateur',
    'pack-prospection-contenu-createur',
    '80 prompts pour trouver des clients, créer du contenu percutant, optimiser votre personal branding et gagner en productivité au quotidien.',
    '20 prompts prospection — email froid, message LinkedIn, relance et suivi client
20 prompts création de contenu — posts LinkedIn, threads X, articles de blog et newsletters
15 prompts personal branding — bio, positionnement, pitch 30 secondes et page À propos
15 prompts productivité & organisation — gestion du temps, priorités et automatisations
10 prompts gestion client & devis — propositions commerciales, conditions et relances factures',
    1900,
    'EUR',
    'published',
    cat_freelance,
    80,
    true,
    'Prompt prospection — email froid B2B
Tu es un expert en prospection commerciale B2B. Rédige un email froid en 5 phrases maximum pour contacter [type de prospect] dans le secteur [secteur]. L''email doit : commencer par une observation personnalisée sur leur activité, présenter un bénéfice concret (pas une fonctionnalité), et terminer par une question ouverte non intrusive. Ton : direct, professionnel, sans jargon.
---
Prompt contenu — post LinkedIn viral
Tu es un expert en personal branding LinkedIn avec 50 000 abonnés. Rédige un post LinkedIn sur [sujet] qui suit cette structure : accroche choc en 1 ligne (sans commencer par "Je"), développement en 5 points courts avec des retours à la ligne, enseignement clé en gras, question engageante pour les commentaires. Maximum 1 300 caractères.'
  );

  -- ──────────────────────────────────────────────
  -- 3. ENTREPRENEUR
  -- ──────────────────────────────────────────────
  INSERT INTO products (
    title, slug, short_description, long_description,
    price_amount, currency, status, category_id,
    prompt_count, is_featured, preview_content
  ) VALUES (
    'Pack validation & lancement — Solo builder',
    'pack-validation-lancement-solo-builder',
    '60 prompts pour valider une idée de business, définir son positionnement, créer son offre et lancer rapidement sans se perdre dans l''analyse.',
    '15 prompts validation d''idée — analyse de marché, identification de la douleur client et test d''hypothèses
15 prompts positionnement & offre — proposition de valeur unique, pricing et packaging
15 prompts landing page & copywriting — titres, sous-titres, preuves sociales et CTA
15 prompts lancement — stratégie de lancement, liste d''attente, premier client et feedback',
    1500,
    'EUR',
    'published',
    cat_entrepreneur,
    60,
    true,
    'Prompt validation — analyse de la douleur client
Tu es un expert en product-market fit. Pour l''idée suivante : [idée], identifie : la douleur principale que ça résout (en une phrase), qui ressent cette douleur le plus intensément (persona précis), comment ces personnes résolvent le problème aujourd''hui, et pourquoi les solutions actuelles sont insuffisantes. Sois factuel et critique, pas enthousiaste.
---
Prompt offre — proposition de valeur
Tu es un consultant en stratégie produit. Rédige 3 versions de proposition de valeur pour [produit/service] ciblant [persona]. Chaque version doit tenir en une phrase, être orientée résultat (pas fonctionnalité), et utiliser un angle différent : gain de temps, gain d''argent, réduction de risque.'
  );

  -- ──────────────────────────────────────────────
  -- 4. MARKETING
  -- ──────────────────────────────────────────────
  INSERT INTO products (
    title, slug, short_description, long_description,
    price_amount, currency, status, category_id,
    prompt_count, is_featured, preview_content
  ) VALUES (
    'Pack copywriting & email marketing',
    'pack-copywriting-email-marketing',
    '70 prompts pour rédiger des emails qui convertissent, des landing pages percutantes, des publicités efficaces et des séquences d''onboarding.',
    '20 prompts email marketing — séquences de bienvenue, nurturing, relance panier abandonné et upsell
20 prompts landing page — hero section, bénéfices, preuves sociales, FAQ et boutons CTA
15 prompts publicité — accroches Facebook Ads, Google Ads et scripts vidéo
15 prompts storytelling & brand voice — ton de marque, histoire fondatrice et messages clés',
    1700,
    'EUR',
    'published',
    cat_marketing,
    70,
    false,
    'Prompt email — séquence de bienvenue (email 1)
Tu es un expert en email marketing avec un taux d''ouverture moyen de 45%. Rédige le premier email d''une séquence de bienvenue pour [produit/service]. Cet email doit : être envoyé dans les 5 minutes après l''inscription, tenir en moins de 150 mots, créer un lien émotionnel avec le lecteur, et donner une valeur immédiate (conseil, ressource ou accès). Objet de l''email : maximum 7 mots, sans emoji.
---
Prompt landing page — section hero
Tu es un copywriter spécialisé en conversion. Rédige la section hero d''une landing page pour [produit] ciblant [persona]. Fournis : un titre principal (bénéfice en moins de 10 mots), un sous-titre qui précise comment et pour qui (1 phrase), et 3 variantes de bouton CTA orientées action. Évite les mots vagues comme "solution", "innovant" ou "révolutionnaire".'
  );

  -- ──────────────────────────────────────────────
  -- 5. TECH & DATA
  -- ──────────────────────────────────────────────
  INSERT INTO products (
    title, slug, short_description, long_description,
    price_amount, currency, status, category_id,
    prompt_count, is_featured, preview_content
  ) VALUES (
    'Pack code, data & documentation',
    'pack-code-data-documentation',
    '55 prompts pour générer du code propre, analyser des données, automatiser des tâches répétitives et produire une documentation technique claire.',
    '15 prompts génération de code — fonctions, composants, scripts et refactoring
15 prompts analyse de données — exploration, nettoyage, visualisation et interprétation
10 prompts documentation — README, docstrings, commentaires et guides techniques
15 prompts automatisation & debugging — détection de bugs, optimisation et scripts d''automatisation',
    1400,
    'EUR',
    'published',
    cat_tech,
    55,
    false,
    'Prompt code — revue et refactoring
Tu es un senior software engineer spécialisé en [langage]. Analyse le code suivant et fournis : les 3 principaux problèmes de qualité ou performance, une version refactorisée avec des commentaires expliquant chaque changement, et les bonnes pratiques appliquées. Priorise la lisibilité et la maintenabilité. Code : [coller votre code]
---
Prompt data — analyse exploratoire
Tu es un data analyst expert. À partir de la description de ce dataset : [description des colonnes et du contexte], génère le code Python complet pour : charger et inspecter les données (shape, types, valeurs manquantes), produire 5 statistiques descriptives clés, créer 3 visualisations pertinentes avec matplotlib, et lister les 5 questions analytiques les plus importantes à explorer.'
  );

  -- ──────────────────────────────────────────────
  -- 6. RH
  -- ──────────────────────────────────────────────
  INSERT INTO products (
    title, slug, short_description, long_description,
    price_amount, currency, status, category_id,
    prompt_count, is_featured, preview_content
  ) VALUES (
    'Pack CV, candidature & entretien',
    'pack-cv-candidature-entretien',
    '40 prompts pour optimiser votre CV, rédiger des lettres de motivation percutantes, préparer vos entretiens et négocier votre salaire avec confiance.',
    '10 prompts CV — optimisation, mots-clés ATS, mise en valeur des expériences et compétences
10 prompts lettre de motivation — structure, personnalisation et accroche mémorable
10 prompts préparation entretien — questions fréquentes, méthode STAR et questions à poser
10 prompts négociation & suivi — négociation salariale, email de remerciement et relance',
    900,
    'EUR',
    'published',
    cat_rh,
    40,
    false,
    'Prompt CV — optimisation pour les ATS
Tu es un expert RH et chasseur de têtes avec 10 ans d''expérience. Analyse mon CV pour le poste de [intitulé du poste] chez [type d''entreprise]. Identifie : les 5 mots-clés manquants par rapport à l''offre d''emploi, les expériences sous-valorisées à reformuler avec des chiffres, et les éléments à supprimer car ils nuisent à la candidature. Offre d''emploi : [coller l''offre]. Mon CV : [coller le CV]
---
Prompt entretien — méthode STAR
Tu es un coach en développement de carrière. Pour la question d''entretien suivante : "[question]", aide-moi à construire une réponse en méthode STAR (Situation, Tâche, Action, Résultat) à partir de cette expérience : [décrire l''expérience]. La réponse doit durer 2 minutes à l''oral, se terminer par un enseignement tiré de cette expérience, et être adaptée au poste de [intitulé].'
  );

END $$;
