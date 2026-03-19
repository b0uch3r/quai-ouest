# Cahier des charges — Site vitrine Le Quai Ouest

**Version** : 1.0
**Date** : 19 mars 2026
**Statut** : Draft

---

## 1. Contexte et présentation

### 1.1 Le restaurant

**Le Quai Ouest** est un restaurant bistronomique situé au **1 Promenade de Penarth, 29250 Saint-Pol-de-Léon** (Finistère, Bretagne). Installé sur la plage Sainte-Anne avec une vue panoramique sur la **Baie de Morlaix**, il propose une cuisine élaborée à partir de **produits frais, locaux et faits maison**, avec une forte identité maritime bretonne.

**Caractéristiques clés :**
- Cuisine bistronomique axée sur les fruits de mer et produits locaux
- Capacité : jusqu'à 80 couverts
- Terrasse avec vue mer
- Menu anti-gaspi en semaine le midi (à partir de 14€)
- Options végétariennes disponibles
- Services : Click & Collect, accès PMR, animaux acceptés, chaises bébé
- Paiement par carte bancaire et espèces

### 1.2 Présence en ligne actuelle

- **Instagram** : [@quaiouest.stpol](https://www.instagram.com/quaiouest.stpol?igsh=MXJyOWFvcWxqNms2bw==) — ~711 abonnés, contenu actif (photos plats, ambiance, menus)
- **Facebook** : [Page Quai Ouest](https://www.facebook.com/p/Quai-Ouest-100068821471690/)
- **Référencement** : présent sur TripAdvisor, PagesJaunes, Restaurant Guru (note 4.5/5)
- **Site web** : aucun site propre actuellement

### 1.3 Objectif du projet

Créer un **site vitrine professionnel** qui :
- Offre une première impression forte et cohérente avec l'identité du restaurant
- Centralise toutes les informations pratiques
- Exploite le contenu Instagram existant comme source de contenu visuel
- Facilite la prise de contact et la réservation
- Améliore le référencement local (SEO)

---

## 2. Périmètre fonctionnel

### 2.1 Pages et sections

#### Page d'accueil
- Hero section avec image plein écran (vue restaurant / plage)
- Accroche et proposition de valeur
- Aperçu de la carte / plat du jour
- Galerie Instagram (dernières publications)
- Call-to-action vers réservation
- Horaires d'ouverture en évidence

#### Page Menu / Carte
- Carte complète du restaurant organisée par catégories (entrées, plats, desserts, boissons)
- Menu du jour / formule midi
- Prix affichés
- Indication des options végétariennes et allergènes
- Mise à jour facilitée (via CMS ou fichier de contenu)

#### Galerie Photos
- Grille de photos alimentée automatiquement par le flux Instagram
- Lightbox pour agrandissement
- Filtres par catégorie (plats, ambiance, événements)
- Lien vers le profil Instagram

#### Page Contact & Réservation
- Formulaire de contact (nom, email, téléphone, message)
- Widget ou lien de réservation (intégration possible avec un service tiers)
- Carte interactive (Google Maps / Leaflet) avec localisation
- Coordonnées complètes : adresse, téléphone, email
- Itinéraire / accès

#### Page À propos
- Histoire du restaurant et de l'équipe
- Philosophie culinaire (produits locaux, fait maison, anti-gaspi)
- Engagement environnemental et local
- Photos de l'équipe et du cadre

#### Footer (global)
- Horaires d'ouverture
- Liens réseaux sociaux (Instagram, Facebook)
- Mentions légales
- Plan du site

### 2.2 Fonctionnalités transversales

- **Responsive design** : mobile-first, adapté tablette et desktop
- **SEO local** : balises Schema.org (Restaurant, LocalBusiness), sitemap, meta tags optimisés
- **Performance** : score Lighthouse > 90, lazy loading images, formats WebP/AVIF
- **Accessibilité** : conformité WCAG 2.1 AA minimum
- **Analytics** : intégration Google Analytics 4 ou Plausible
- **Multilingue** : français par défaut, anglais en option (zone touristique)

---

## 3. Intégration Instagram

### 3.1 Objectif

Récupérer automatiquement le contenu publié sur le compte Instagram **@quaiouest.stpol** pour :
- Alimenter la galerie photos du site
- Afficher les dernières publications sur la page d'accueil
- Extraire des informations sur les menus et plats du jour (si publiés en story/post)

### 3.2 Contrainte temporelle

> **Seules les publications des 6 derniers mois doivent être récupérées** (depuis le 1er septembre 2025). Le contenu antérieur n'est plus représentatif de l'offre actuelle et ne doit pas apparaître sur le site.

### 3.3 Stratégie

Voir le document dédié : [INSTAGRAM-STRATEGY.md](./INSTAGRAM-STRATEGY.md)

**Approche recommandée** : utilisation de la **Meta Graph API (Instagram Graph API)** couplée à un système de cache côté serveur (ISR Next.js) pour limiter les appels API et garantir la performance. Un filtre par date (`timestamp >= 2025-09-01`) est appliqué systématiquement.

### 3.4 Données à récupérer

- URL des images/vidéos
- Légendes (captions)
- Date de publication
- Type de média (image, vidéo, carrousel)
- Permalink vers le post original

---

## 4. Stack technique recommandée

### 4.1 Frontend

| Technologie | Justification |
|---|---|
| **Next.js 14+** (App Router) | SSR/SSG, ISR pour contenu dynamique, SEO optimal |
| **TypeScript** | Typage fort, maintenabilité |
| **Tailwind CSS** | Rapidité de développement, design system cohérent |
| **Framer Motion** | Animations fluides et légères |

### 4.2 Backend / Services

| Technologie | Justification |
|---|---|
| **Next.js API Routes** | Backend léger intégré, serverless |
| **Meta Graph API** | Source officielle pour le contenu Instagram |
| **Nodemailer / Resend** | Envoi d'emails depuis le formulaire de contact |

### 4.3 Infrastructure

| Technologie | Justification |
|---|---|
| **Vercel** | Déploiement optimisé pour Next.js, CDN global, SSL auto |
| **GitHub** | Gestion de version, CI/CD via GitHub Actions |
| **Cloudinary** (optionnel) | Optimisation et transformation d'images |

### 4.4 Outils de développement

- ESLint + Prettier (qualité de code)
- Husky + lint-staged (hooks pre-commit)
- Playwright ou Cypress (tests E2E)

---

## 5. Design et charte graphique

### 5.1 Ambiance visuelle

- **Palette** : tons bleus océan, blancs sableux, touches de bois naturel — reflétant le cadre maritime breton
- **Typographie** : police élégante pour les titres (serif ou display), lisible pour le corps (sans-serif)
- **Imagerie** : photos haute qualité du restaurant, des plats, de la vue mer
- **Style** : épuré, aéré, lumineux — minimalisme chaleureux

### 5.2 Inspirations

- Restaurants haut de gamme en bord de mer
- Sites de bistrots bretons avec identité forte
- Approche "less is more" : le contenu visuel parle de lui-même

---

## 6. Phases du projet et planning

### Phase 1 — Initialisation (Semaine 1)
- Création du projet et de la documentation
- Recherche et collecte d'informations
- Mise en place de l'environnement de développement
- Configuration Instagram API (demande d'accès)

### Phase 2 — Design (Semaine 2-3)
- Maquettes wireframe (mobile + desktop)
- Design UI haute fidélité
- Validation de la charte graphique
- Préparation des assets visuels

### Phase 3 — Développement (Semaine 3-6)
- Setup Next.js + Tailwind + TypeScript
- Développement des composants et pages
- Intégration Instagram API
- Formulaire de contact
- Carte interactive
- SEO et meta tags

### Phase 4 — Contenu (Semaine 5-6)
- Rédaction des textes (à propos, descriptions)
- Intégration de la carte / menu
- Optimisation des images
- Traduction anglaise (si retenue)

### Phase 5 — Tests et mise en ligne (Semaine 7)
- Tests cross-browser et responsive
- Audit Lighthouse (performance, accessibilité, SEO)
- Corrections et ajustements
- Déploiement sur Vercel
- Configuration du nom de domaine

### Phase 6 — Suivi (Semaine 8+)
- Formation du restaurateur à la mise à jour du contenu
- Monitoring analytics
- Ajustements post-lancement

---

## 7. Contraintes et prérequis

- Accès au compte Instagram Business du restaurant (pour l'API Graph)
- Accord du restaurateur sur la charte graphique et le contenu
- Nom de domaine à définir (ex : lequaiouest.fr, quaiouest-saintpol.fr)
- Hébergement email existant ou à mettre en place
- Budget à définir pour le nom de domaine et éventuellement Cloudinary

---

## 8. Critères de succès

- Score Lighthouse > 90 sur les 4 axes (Performance, Accessibilité, Best Practices, SEO)
- Temps de chargement initial < 2 secondes
- Galerie Instagram fonctionnelle et mise à jour automatiquement
- Formulaire de contact opérationnel avec notifications email
- Design validé par le restaurateur
- Référencement local effectif (fiche Google Business liée)
