# Stratégie d'intégration Instagram — Le Quai Ouest

**Version** : 1.0
**Date** : 19 mars 2026

---

## 1. Compte cible

- **Profil** : [@quaiouest.stpol](https://www.instagram.com/quaiouest.stpol?igsh=MXJyOWFvcWxqNms2bw==)
- **Type** : Compte professionnel / Business
- **Contenu** : Photos de plats, ambiance restaurant, menus, événements
- **Abonnés** : ~711

### Contrainte temporelle importante

> **Seules les publications des 6 derniers mois doivent être récupérées** (depuis septembre 2025). Le contenu antérieur n'est plus représentatif de l'offre actuelle du restaurant et ne doit pas apparaître sur le site.

Cette contrainte s'applique à :
- La galerie photos du site
- Les aperçus Instagram sur la page d'accueil
- Toute extraction de contenu (menus, plats du jour, etc.)

Un filtre par date (`timestamp >= 2025-09-01`) doit être systématiquement appliqué lors de la récupération des données.

---

## 2. Options techniques

### Option A — Meta Graph API (recommandée)

L'API officielle de Meta pour accéder au contenu Instagram.

#### Prérequis
1. Le compte Instagram doit être un **compte Business** ou **Creator** (lié à une page Facebook)
2. Créer une **application Meta** sur [developers.facebook.com](https://developers.facebook.com)
3. Obtenir un **token d'accès longue durée** (60 jours, renouvelable automatiquement)
4. Permissions nécessaires : `instagram_basic`, `instagram_manage_insights`, `pages_show_list`

#### Endpoints utiles

```
# Récupérer les médias du compte
GET /{ig-user-id}/media
  ?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp
  &since=2025-09-01
  &limit=50

# Récupérer les détails d'un média
GET /{media-id}
  ?fields=id,caption,media_type,media_url,permalink,timestamp,children

# Récupérer les enfants d'un carrousel
GET /{media-id}/children
  ?fields=id,media_type,media_url
```

#### Avantages
- Solution officielle et stable
- Accès fiable aux données (images, captions, dates)
- Pas de risque de blocage
- Données structurées et paginées

#### Inconvénients
- Nécessite un compte Business lié à Facebook
- Process de review de l'app Meta (peut prendre quelques jours)
- Token à renouveler (automatisable)
- Pas d'accès aux Stories (sauf pour les comptes propres avec permissions étendues)

#### Implémentation

```typescript
// src/services/instagram.ts

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

const INSTAGRAM_CUTOFF_DATE = '2025-09-01T00:00:00Z';

export async function fetchInstagramFeed(): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  const url = new URL(`https://graph.instagram.com/v19.0/${userId}/media`);
  url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
  url.searchParams.set('limit', '50');
  url.searchParams.set('access_token', token!);

  const response = await fetch(url.toString(), { next: { revalidate: 1800 } });
  const data = await response.json();

  // Filtre strict : uniquement les 6 derniers mois (depuis sept. 2025)
  return data.data.filter((media: InstagramMedia) =>
    new Date(media.timestamp) >= new Date(INSTAGRAM_CUTOFF_DATE)
  );
}
```

---

### Option B — Scraping via Puppeteer / Playwright (fallback)

Scraping direct du profil Instagram public.

#### Approche
1. Naviguer vers `https://www.instagram.com/quaiouest.stpol/`
2. Extraire les URLs des images et les métadonnées depuis le DOM
3. Filtrer par date (> septembre 2025)
4. Stocker les résultats dans un fichier JSON local

#### Script de scraping

```typescript
// scripts/fetch-instagram.ts

import { chromium } from 'playwright';

async function scrapeInstagram() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.instagram.com/quaiouest.stpol/', {
    waitUntil: 'networkidle'
  });

  // Scroll pour charger plus de posts
  // Extraire les données des posts
  // Filtrer par date >= sept. 2025
  // Sauvegarder en JSON

  await browser.close();
}
```

#### Avantages
- Pas besoin d'accès API / compte Business
- Accès à tout le contenu public visible
- Pas de dépendance à Meta

#### Inconvénients
- **Fragile** : cassable à chaque mise à jour d'Instagram
- **Violation des CGU** d'Instagram (risque de blocage)
- Pas de pagination fiable
- Dates de publication pas toujours accessibles
- Maintenance lourde

> **Recommandation** : cette option n'est à utiliser qu'en dernier recours ou en phase de prototypage rapide. Elle ne doit pas être la solution de production.

---

### Option C — Service tiers (compromis)

Utiliser un service d'agrégation Instagram qui gère la complexité de l'API.

#### Services envisageables

| Service | Modèle | Caractéristiques |
|---|---|---|
| **Behold** (behold.so) | Freemium | Widget Instagram, API JSON, facile à intégrer |
| **EmbedSocial** | Payant | Widgets, modération, analytics |
| **Curator.io** | Freemium | Agrégation multi-réseaux, widget personnalisable |
| **Elfsight** | Freemium | Widget Instagram plug-and-play |

#### Avantages
- Mise en place rapide
- Pas de gestion de token
- Interface d'administration souvent incluse
- Support et maintenance assurés

#### Inconvénients
- Coût mensuel (5-30€/mois selon le service)
- Moins de contrôle sur le rendu
- Dépendance à un service tiers
- Données possiblement limitées

---

## 3. Stratégie recommandée

### Approche hybride en 2 temps

#### Phase 1 — Prototype rapide (semaine 1-2)
1. **Scraping one-shot** du profil Instagram avec Playwright
2. Extraction des photos des 6 derniers mois (depuis septembre 2025)
3. Téléchargement et stockage local des images dans `src/assets/images/instagram/`
4. Création d'un fichier `content/instagram.json` avec les métadonnées
5. Affichage statique sur le site (pas d'appels API en production)

Ce fichier JSON aura cette structure :

```json
{
  "lastFetch": "2026-03-19T10:00:00Z",
  "cutoffDate": "2025-09-01T00:00:00Z",
  "posts": [
    {
      "id": "xxx",
      "imageUrl": "/images/instagram/post-001.webp",
      "originalUrl": "https://www.instagram.com/p/xxx/",
      "caption": "Notre plateau de fruits de mer du jour...",
      "date": "2026-03-15",
      "category": "plat",
      "tags": ["fruits-de-mer", "plateau", "breton"]
    }
  ]
}
```

#### Phase 2 — Intégration API officielle (semaine 3-4)
1. Configuration du compte Business Instagram (si pas déjà fait)
2. Création de l'application Meta et obtention des permissions
3. Implémentation du service API avec cache ISR
4. Filtrage automatique par date (> sept. 2025)
5. Renouvellement automatique du token via un cron job ou une API route

#### Transition
- Le fichier `content/instagram.json` sert de cache de fallback
- Si l'API échoue, le site affiche les données du cache local
- Le script de scraping peut être relancé manuellement pour rafraîchir le cache

---

## 4. Catégorisation du contenu

Pour enrichir la galerie, les posts Instagram seront catégorisés (manuellement ou via analyse des captions) :

| Catégorie | Description | Usage sur le site |
|---|---|---|
| `plat` | Photos de plats et assiettes | Galerie, page menu |
| `menu` | Photos de la carte / ardoise | Page menu |
| `ambiance` | Vue restaurant, terrasse, mer | Page accueil, à propos |
| `equipe` | Photos de l'équipe, cuisine | Page à propos |
| `evenement` | Soirées spéciales, événements | Page accueil (actualités) |
| `produit` | Produits bruts, arrivages | Page à propos |

---

## 5. Gestion des images

### Pipeline d'optimisation

```
Image Instagram (JPEG, variable)
    │
    ▼
Script d'optimisation (sharp)
    │
    ├── Format WebP (qualité 80%)
    ├── Redimensionnement :
    │   ├── Thumbnail : 400x400 (grille galerie)
    │   ├── Medium : 800x800 (lightbox mobile)
    │   └── Large : 1200x1200 (lightbox desktop)
    │
    └── Métadonnées EXIF supprimées
```

### Stockage

- **Phase 1** : images stockées dans `public/images/instagram/`
- **Phase 2** : images servies directement depuis l'URL Instagram via Next/Image (proxy et optimisation automatique) ou via Cloudinary

---

## 6. Renouvellement du token (Phase 2)

Le token d'accès longue durée Meta expire après 60 jours. Pour éviter une interruption :

```typescript
// src/app/api/instagram/refresh-token/route.ts

export async function GET() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  const response = await fetch(
    `https://graph.instagram.com/refresh_access_token` +
    `?grant_type=ig_refresh_token` +
    `&access_token=${currentToken}`
  );

  const data = await response.json();
  // Stocker le nouveau token (Vercel env vars API ou KV store)

  return Response.json({
    success: true,
    expires_in: data.expires_in
  });
}
```

**Automatisation** : un cron job Vercel (ou GitHub Actions) déclenche le refresh toutes les 50 jours.

---

## 7. Variables d'environnement

```env
# .env.example

# Instagram API (Phase 2)
INSTAGRAM_USER_ID=
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=

# Contrainte temporelle
INSTAGRAM_CUTOFF_DATE=2025-09-01

# Email (formulaire de contact)
RESEND_API_KEY=
CONTACT_EMAIL_TO=quai.ouest29250@gmail.com
```

---

## 8. Plan d'action

| Étape | Action | Durée | Dépendance |
|---|---|---|---|
| 1 | Script de scraping one-shot | 1 jour | — |
| 2 | Téléchargement et catégorisation des images (6 derniers mois) | 1 jour | Étape 1 |
| 3 | Création du fichier instagram.json | 0.5 jour | Étape 2 |
| 4 | Intégration galerie statique sur le site | 1 jour | Étape 3 |
| 5 | Demande d'accès API Meta | 1-5 jours (review) | Accord restaurateur |
| 6 | Implémentation service API + cache | 1 jour | Étape 5 |
| 7 | Mise en place refresh token automatique | 0.5 jour | Étape 6 |
| 8 | Bascule galerie statique → dynamique | 0.5 jour | Étape 6 |
