# Architecture technique — Site Le Quai Ouest

**Version** : 1.0
**Date** : 19 mars 2026

---

## 1. Vue d'ensemble

Le site est une application **Next.js** en mode hybride (SSG + ISR) déployée sur **Vercel**. L'architecture est pensée pour être simple, performante et maintenable, adaptée à un site vitrine avec contenu semi-dynamique (flux Instagram).

```
┌─────────────────────────────────────────────────────┐
│                    VISITEUR                          │
│                  (Navigateur)                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  VERCEL CDN                          │
│            (Edge Network global)                     │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Pages SSG   │  │ Pages ISR    │  │ API Routes │ │
│  │ (statiques) │  │ (revalidées) │  │ (serverless│ │
│  │             │  │              │  │  functions) │ │
│  │ - Accueil   │  │ - Galerie    │  │            │ │
│  │ - À propos  │  │   Instagram  │  │ - Contact  │ │
│  │ - Contact   │  │ - Menu du    │  │   form     │ │
│  │ - Mentions  │  │   jour       │  │ - Instagram│ │
│  │   légales   │  │              │  │   proxy    │ │
│  └─────────────┘  └──────┬───────┘  └─────┬──────┘ │
└──────────────────────────┼─────────────────┼────────┘
                           │                 │
              ┌────────────┘                 │
              ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│   Meta Graph API     │      │   Service Email      │
│   (Instagram)        │      │   (Resend / SMTP)    │
└──────────────────────┘      └──────────────────────┘
```

---

## 2. Stack technique détaillée

### 2.1 Runtime et framework

```
Next.js 14+ (App Router)
├── TypeScript 5.x
├── React 18+
├── Node.js 20 LTS (runtime serverless)
└── Turbopack (dev server)
```

**Choix du App Router** : le nouveau paradigme de Next.js permet un meilleur contrôle du rendu (Server Components par défaut), un streaming natif, et une gestion fine du cache avec ISR (Incremental Static Regeneration).

### 2.2 Styling

```
Tailwind CSS 3.4+
├── @tailwindcss/typography     (prose pour contenu rédactionnel)
├── @tailwindcss/aspect-ratio   (ratios d'images)
├── tailwind-merge              (fusion intelligente de classes)
└── clsx                        (classes conditionnelles)
```

**Thème personnalisé** dans `tailwind.config.ts` :
- Palette couleurs : bleu océan, sable, blanc cassé, bois
- Breakpoints : mobile-first (sm: 640, md: 768, lg: 1024, xl: 1280)
- Polices : variable fonts pour performance

### 2.3 Animations

```
Framer Motion 11+
└── Utilisé pour :
    ├── Transitions de page
    ├── Animations au scroll (fade-in, slide-up)
    ├── Lightbox galerie
    └── Micro-interactions (hover, focus)
```

---

## 3. Structure des fichiers

```
QUAI-OUEST/
├── src/
│   ├── app/                        # App Router (Next.js)
│   │   ├── layout.tsx              # Layout racine
│   │   ├── page.tsx                # Page d'accueil
│   │   ├── menu/
│   │   │   └── page.tsx            # Page carte / menu
│   │   ├── galerie/
│   │   │   └── page.tsx            # Galerie photos Instagram
│   │   ├── contact/
│   │   │   └── page.tsx            # Contact et réservation
│   │   ├── a-propos/
│   │   │   └── page.tsx            # À propos du restaurant
│   │   ├── mentions-legales/
│   │   │   └── page.tsx            # Mentions légales
│   │   └── api/
│   │       ├── contact/
│   │       │   └── route.ts        # API envoi formulaire contact
│   │       └── instagram/
│   │           └── route.ts        # API proxy Instagram
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Navigation principale
│   │   │   ├── Footer.tsx          # Pied de page
│   │   │   └── MobileNav.tsx       # Menu hamburger mobile
│   │   ├── home/
│   │   │   ├── Hero.tsx            # Section hero
│   │   │   ├── FeaturedDishes.tsx   # Plats vedettes
│   │   │   └── InstagramFeed.tsx   # Aperçu flux Instagram
│   │   ├── menu/
│   │   │   ├── MenuCategory.tsx    # Catégorie de la carte
│   │   │   └── MenuItem.tsx        # Item individuel
│   │   ├── gallery/
│   │   │   ├── PhotoGrid.tsx       # Grille de photos
│   │   │   └── Lightbox.tsx        # Visionneuse plein écran
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx     # Formulaire de contact
│   │   │   └── Map.tsx             # Carte interactive
│   │   └── ui/
│   │       ├── Button.tsx          # Bouton réutilisable
│   │       ├── Card.tsx            # Carte générique
│   │       ├── Badge.tsx           # Badge / tag
│   │       └── Container.tsx       # Container centré responsive
│   │
│   ├── hooks/
│   │   ├── useInstagram.ts         # Hook fetch données Instagram
│   │   └── useMediaQuery.ts        # Hook responsive
│   │
│   ├── services/
│   │   ├── instagram.ts            # Service appels API Instagram
│   │   └── email.ts                # Service envoi email
│   │
│   ├── lib/
│   │   ├── utils.ts                # Utilitaires généraux (cn, formatDate...)
│   │   └── constants.ts            # Constantes (infos restaurant, liens)
│   │
│   ├── types/
│   │   ├── instagram.ts            # Types données Instagram
│   │   └── menu.ts                 # Types menu / carte
│   │
│   ├── styles/
│   │   └── globals.css             # Styles globaux + directives Tailwind
│   │
│   └── assets/
│       ├── images/                 # Images locales optimisées
│       ├── icons/                  # SVG icons
│       └── fonts/                  # Polices web
│
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg                # Image Open Graph
│   ├── robots.txt
│   └── sitemap.xml
│
├── content/
│   └── menu.json                   # Données de la carte (éditable)
│
├── config/
│   ├── site.ts                     # Métadonnées du site
│   └── navigation.ts               # Structure de navigation
│
├── scripts/
│   ├── fetch-instagram.ts          # Script de récupération Instagram
│   └── optimize-images.ts          # Script optimisation images
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                      # Variables d'environnement (non versionné)
├── .env.example                    # Template des variables
└── .gitignore
```

---

## 4. Stratégie de rendu

| Page | Méthode | Revalidation | Justification |
|---|---|---|---|
| Accueil | ISR | 1 heure | Contenu semi-dynamique (Instagram) |
| Menu / Carte | ISR | 24 heures | Changements peu fréquents |
| Galerie | ISR | 30 minutes | Flux Instagram à jour |
| Contact | SSG | — | Contenu statique |
| À propos | SSG | — | Contenu statique |
| Mentions légales | SSG | — | Contenu statique |

L'ISR (Incremental Static Regeneration) permet de servir des pages statiques tout en les re-générant en arrière-plan à intervalles réguliers, combinant ainsi performance et fraîcheur du contenu.

---

## 5. Gestion du contenu

### 5.1 Menu / Carte

Le menu est stocké dans un fichier `content/menu.json` structuré ainsi :

```json
{
  "categories": [
    {
      "name": "Entrées",
      "items": [
        {
          "name": "Huîtres de la Baie de Morlaix",
          "description": "Servies sur lit d'algues, citron et vinaigre échalote",
          "price": 14,
          "tags": ["fruits de mer", "local"],
          "allergens": ["mollusques"]
        }
      ]
    }
  ],
  "formules": [
    {
      "name": "Menu du midi anti-gaspi",
      "description": "Entrée + Plat ou Plat + Dessert",
      "price": 14
    }
  ]
}
```

Ce format permet une mise à jour facile sans toucher au code, et pourrait évoluer vers un CMS headless (Sanity, Strapi) si besoin.

### 5.2 Contenu Instagram

Les données Instagram sont récupérées via l'API et mises en cache côté serveur (voir INSTAGRAM-STRATEGY.md). Le cache est invalidé selon la stratégie ISR.

---

## 6. API Routes

### POST /api/contact

Reçoit les données du formulaire de contact et envoie un email au restaurant.

```typescript
// Payload attendu
{
  name: string;
  email: string;
  phone?: string;
  message: string;
  date?: string;      // Date souhaitée (réservation)
  guests?: number;    // Nombre de couverts
}
```

**Protections** : rate limiting, validation Zod, honeypot anti-spam, CAPTCHA optionnel.

### GET /api/instagram

Proxy vers l'API Meta Graph. Retourne les dernières publications Instagram formatées. Utilise un cache en mémoire ou Redis pour éviter de dépasser les limites de l'API.

---

## 7. SEO et métadonnées

### Schema.org (JSON-LD)

Chaque page inclura des données structurées adaptées :

- **Restaurant** : nom, adresse, téléphone, cuisine, horaires, coordonnées GPS
- **Menu** : structure HasMenu avec les items
- **LocalBusiness** : avis, note agrégée
- **BreadcrumbList** : fil d'Ariane

### Balises meta

- `<title>` et `<meta description>` uniques par page
- Open Graph (og:title, og:description, og:image)
- Twitter Cards
- Canonical URLs
- Hreflang (si multilingue)

---

## 8. Performance

### Objectifs Lighthouse

| Métrique | Cible |
|---|---|
| Performance | > 95 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 95 |
| LCP | < 1.5s |
| FID | < 50ms |
| CLS | < 0.05 |

### Optimisations prévues

- **Images** : Next/Image avec lazy loading, formats WebP/AVIF, srcset responsive
- **Fonts** : `next/font` avec preload et font-display: swap
- **Code splitting** : automatique avec App Router
- **Prefetching** : liens internes préchargés automatiquement
- **Compression** : Brotli via Vercel Edge

---

## 9. Sécurité

- Variables sensibles dans `.env.local` (jamais versionnées)
- Headers de sécurité via `next.config.ts` (CSP, X-Frame-Options, etc.)
- Rate limiting sur les API routes
- Validation stricte des inputs (Zod)
- HTTPS obligatoire (Vercel)

---

## 10. Monitoring et analytics

- **Google Analytics 4** ou **Plausible** (privacy-first) pour le trafic
- **Vercel Analytics** pour les Web Vitals
- **Sentry** (optionnel) pour le tracking d'erreurs
- **UptimeRobot** pour le monitoring de disponibilité
