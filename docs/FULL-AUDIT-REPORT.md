# Audit SEO Complet — Quai Ouest
> Généré le 19 mars 2026 · Outil : claude-seo (local file analysis)
> Fichier audité : `index.html` (site one-page statique HTML/CSS/JS)

---

## Résumé Exécutif

### 🏆 SEO Health Score : **63 / 100**

| Catégorie | Poids | Score | Contribution |
|-----------|-------|-------|-------------|
| Technical SEO | 22% | 62/100 | 13.6 |
| Content Quality (E-E-A-T) | 23% | 65/100 | 14.9 |
| On-Page SEO | 20% | 75/100 | 15.0 |
| Schema / Structured Data | 10% | 72/100 | 7.2 |
| Performance (Core Web Vitals) | 10% | 55/100 | 5.5 |
| AI Search Readiness (GEO) | 10% | 40/100 | 4.0 |
| Images | 5% | 60/100 | 3.0 |

**Business type détecté** : Local Business — Restaurant bistronomique, catégorie "Fine Dining / Bistro"
**Marché cible** : SEO local (Finistère, Bretagne Nord), requêtes "restaurant Saint-Pol-de-Léon"

### Top 5 Issues Critiques

1. 🔴 **Pas de `<link rel="canonical">`** — risque duplication si déployé sous plusieurs URLs
2. 🔴 **Hero LCP non optimisé** — image hero en `background-image` CSS, aucun preload → LCP estimé > 3s
3. 🔴 **`sameAs` absent du Schema** — Instagram et Facebook non liés au schema → autorité locale faible
4. 🔴 **Mentions légales / Confidentialité vides** (`href="#"`) — problème légal + signal de confiance nul
5. 🔴 **Images toutes en Unsplash (stock)** — E-E-A-T très faible, contenu non authentique pour Google

### Top 5 Quick Wins

1. ✅ Ajouter `<link rel="canonical">` + `<meta name="theme-color">` (5 min)
2. ✅ Ajouter `sameAs` + `image` + `logo` au JSON-LD (10 min)
3. ✅ Ajouter `<link rel="preload" as="image">` pour le hero (2 min)
4. ✅ Corriger `og:type` de `"restaurant"` → `"website"` (2 min)
5. ✅ Corriger `href="tel:+33298290809"` sur le bouton mobile téléphone (2 min)

---

## 1. Technical SEO (62/100)

### ✅ Points forts

| Élément | Statut | Détail |
|---------|--------|--------|
| `<!DOCTYPE html>` | ✅ | Présent |
| `<html lang="fr">` | ✅ | Langue définie |
| `charset="UTF-8"` | ✅ | Encodage correct |
| Viewport meta | ✅ | `width=device-width, initial-scale=1.0` |
| Robots meta | ✅ | `index, follow` |
| Scroll passif | ✅ | `{ passive: true }` sur tous les listeners |
| `prefers-reduced-motion` | ✅ | Implémenté correctement |
| iframe title | ✅ | Google Maps a `title="Localisation..."` |
| rel="noopener noreferrer" | ✅ | Tous les liens externes |

### ❌ Issues identifiées

#### 🔴 CRITIQUE — Canonical absent
```html
<!-- MANQUANT dans <head> : -->
<link rel="canonical" href="https://quaiouest-saintpol.fr">
```
Sans canonical, si le site est accessible via plusieurs URLs (www/sans-www, http/https), Google peut dupliquer les pages et diviser le PageRank.

#### 🔴 CRITIQUE — Pas de sitemap.xml
Fichier `sitemap.xml` absent. Même pour un one-page, une entrée dans le sitemap accélère l'indexation.

#### 🟡 MODÉRÉ — `og:type` incorrect
```html
<!-- ACTUEL (incorrect) : -->
<meta property="og:type" content="restaurant">

<!-- CORRECT : -->
<meta property="og:type" content="website">
```
Le type "restaurant" n'est pas un type Open Graph valide. Utiliser "website" ou intégrer OpenGraph Local Business.

#### 🟡 MODÉRÉ — Tags manquants dans `<head>`
```html
<!-- Ajouter : -->
<meta name="theme-color" content="#2C5F7C">
<meta name="geo.region" content="FR-29">
<meta name="geo.placename" content="Saint-Pol-de-Léon">
<meta name="geo.position" content="48.6847;-3.9870">
<meta name="ICBM" content="48.6847, -3.9870">
<link rel="canonical" href="https://quaiouest-saintpol.fr">
```

#### 🟡 MODÉRÉ — Bouton téléphone mobile broken
```html
<!-- ACTUEL (ne compose pas) : -->
<a href="#" class="mobile-phone" aria-label="Appeler">

<!-- CORRECT : -->
<a href="tel:+33298290809" class="mobile-phone" aria-label="Appeler le restaurant Quai Ouest">
```

#### 🟢 FAIBLE — Pas de robots.txt référencé
Créer `/robots.txt` et `/sitemap.xml` avant déploiement.

#### 🟢 FAIBLE — Google Fonts non optimisé
4 familles de polices chargées. Recommandation : ajouter `&display=swap` explicite et limiter à 3 familles. Inter et DM Sans se chevauchent pour les usages.

---

## 2. On-Page SEO (75/100)

### Title Tag
```
Quai Ouest — Restaurant Bistronomique face à la mer | Saint-Pol-de-Léon
```
- Longueur : ~68 chars ✅ (limite : 60-65)
- Localisation présente ✅
- Mot-clé principal "bistronomique" ✅
- **Légèrement trop long** — tronqué dans certains SERPs mobiles

**Suggestion :**
```
Quai Ouest — Bistronomie face à la mer | Saint-Pol-de-Léon
```

### Meta Description
```
Restaurant bistronomique sur la Plage St Anne à Saint-Pol-de-Léon. Cuisine de saison, produits frais et locaux, vue panoramique sur la Baie de Morlaix. Menu anti-gaspi dès 14€. Réservation : 02 98 29 08 09.
```
- Longueur : ~200 chars ⚠️ (idéal : 155-160)
- Prix ✅ · CTA ✅ · Localisation ✅
- **Trop long** — tronqué systématiquement par Google

**Suggestion (156 chars) :**
```
Restaurant bistronomique à Saint-Pol-de-Léon, vue sur la Baie de Morlaix. Cuisine de saison, produits locaux. Menu anti-gaspi 14€. ☎ 02 98 29 08 09.
```

### H1
```
Bistronomie face à la mer
```
- Un seul H1 ✅
- ⚠️ Aucun mot-clé géographique dans le H1
- **Suggestion** : `Bistronomie face à la mer — Saint-Pol-de-Léon` ou garder l'accroche et s'assurer que la localisation est dans les 100 premiers mots (elle l'est via le badge ✅)

### Structure des headings
```
H1: Bistronomie face à la mer (hero)
  H2: Le Restaurant
    H3: La Maison / La Terrasse / L'Ambiance du Soir
  H2: La Carte
    H3: Entrées / Plats / Desserts / Pizzas...
  H2: Galerie
  H2: Horaires & Infos
    H3: Horaires d'ouverture / Bon à savoir
  H2: Réservez votre table
    H3: Formulaire de contact
  H2: Comment venir
```
Structure logique et correcte ✅. Les H3 des catégories de menu pourraient être plus SEO-friendly mais ils fonctionnent comme contenu de carte (acceptable).

### Liens internes / Ancres
- Navigation one-page cohérente ✅
- `#localisation` absent de la navigation principale (présent uniquement dans le mobile menu) ⚠️
- Mentions légales et Confidentialité : `href="#"` = **liens cassés** ⚠️

### Densité de mots-clés (estimée)
| Mot-clé | Occurrences | Statut |
|---------|------------|--------|
| Saint-Pol-de-Léon | 5+ | ✅ |
| Baie de Morlaix | 3+ | ✅ |
| bistronomique/bistronomie | 3+ | ✅ |
| produits frais/locaux | 3+ | ✅ |
| fruits de mer | 1-2 | ⚠️ faible |
| restaurant Bretagne/Finistère | 2+ | ✅ |

---

## 3. Schema / Structured Data (72/100)

### Implémentation actuelle
```json
{
  "@type": "Restaurant",
  "name": ✅,
  "telephone": ✅,
  "email": ✅,
  "address": ✅,
  "geo": ✅,
  "servesCuisine": ✅,
  "priceRange": ✅,
  "openingHoursSpecification": ✅,
  "aggregateRating": ✅,
  "acceptsReservations": ✅
}
```

### ❌ Propriétés manquantes (toutes importantes)

#### 🔴 `sameAs` — Crucial pour l'autorité locale
```json
"sameAs": [
  "https://www.instagram.com/quaiouest.stpol/",
  "https://www.facebook.com/p/Quai-Ouest-100068821471690/",
  "https://www.tripadvisor.fr/Restaurant_Review-g660194-d23568654-Reviews-Quai_Ouest.html"
]
```

#### 🔴 `image` — Requis pour les Rich Results
```json
"image": [
  "https://quaiouest-saintpol.fr/images/veranda-vue-mer.jpg",
  "https://quaiouest-saintpol.fr/images/facade.jpg"
]
```

#### 🔴 `logo`
```json
"logo": {
  "@type": "ImageObject",
  "url": "https://quaiouest-saintpol.fr/images/logo-quai-ouest.png"
}
```

#### 🟡 `hasMenu`
```json
"hasMenu": "https://quaiouest-saintpol.fr#carte"
```

#### 🟡 `paymentAccepted` + `currenciesAccepted`
```json
"paymentAccepted": "Cash, Credit Card",
"currenciesAccepted": "EUR"
```

#### 🟡 `amenityFeature`
```json
"amenityFeature": [
  {"@type": "LocationFeatureSpecification", "name": "Terrasse", "value": true},
  {"@type": "LocationFeatureSpecification", "name": "Accès PMR", "value": true},
  {"@type": "LocationFeatureSpecification", "name": "Animaux acceptés", "value": true},
  {"@type": "LocationFeatureSpecification", "name": "Parking", "value": true}
]
```

#### 🟡 `acceptsReservations` — valeur incorrecte
```json
// ACTUEL (string) :
"acceptsReservations": "True"

// CORRECT (boolean) :
"acceptsReservations": true
```

#### 🟢 Opportunité : FAQPage schema
Ajouter un bloc de questions fréquentes (horaires, réservation, parking) avec schema `FAQPage` pour capter les "People Also Ask" de Google.

---

## 4. Performance / Core Web Vitals (55/100)

### LCP (Largest Contentful Paint) — ⚠️ PROBLÈME MAJEUR
**Estimation : > 3.0s (mauvais — cible < 2.5s)**

**Cause principale** : L'image hero est chargée via `background-image` en CSS :
```css
.hero-bg {
  background: url('https://images.unsplash.com/photo-xxx?w=1920&q=80') center/cover;
}
```

Les images CSS ne sont pas éligibles au LCP optimal et **ne peuvent pas être preloadées efficacement** par le navigateur. Le navigateur doit :
1. Télécharger le CSS inline
2. Parser et trouver l'URL
3. Déclencher le téléchargement de l'image

**Fix recommandé** :
```html
<!-- Dans <head> : -->
<link rel="preload" as="image" href="[URL-HERO]" fetchpriority="high">
```
Ou mieux : convertir le hero en `<img>` avec `fetchpriority="high"`.

### CLS (Cumulative Layout Shift) — ✅ Bon
- `aspect-ratio` défini sur les images de contenu → pas de layout shift
- Animations CSS `transform` only → ✅
- **Risque** : Google Fonts sans `font-display: swap` explicite → peut causer FOUT

### INP (Interaction to Next Paint) — ✅ Acceptable
- Pas de librairies JS lourdes ✅
- Scroll listeners passifs ✅
- ⚠️ Gallery filter avec `setTimeout` pas optimal pour animations

### Ressources tierces (impact estimé)

| Ressource | Impact | Recommandation |
|-----------|--------|----------------|
| Google Fonts (4 familles) | ~400ms | Réduire à 2-3 familles, auto-héberger |
| Unsplash images (~10) | ~1-3s | Remplacer par images locales WebP |
| Google Maps iframe | ~500ms | Charger au clic (lazy iframe) |

### Recommandations Performance

```html
<!-- 1. Preload image hero -->
<link rel="preload" as="image" href="/images/hero-veranda.webp" fetchpriority="high">

<!-- 2. Précharger les fonts critiques -->
<link rel="preload" href="[url-playfair-latin]" as="font" crossorigin>

<!-- 3. DNS prefetch pour Unsplash (temporaire) -->
<link rel="dns-prefetch" href="https://images.unsplash.com">
```

```javascript
// 4. Lazy load de l'iframe Google Maps
// Remplacer par un chargement au clic ou à l'IntersectionObserver
```

---

## 5. Images (60/100)

### Alt texts — ✅ Globalement bon

| Image | Alt text | Statut |
|-------|---------|--------|
| Hero bg (div) | `aria-label="Vue panoramique..."` | ✅ |
| Restaurant images (3) | Descriptifs et contextuels | ✅ |
| Gallery (9 images) | Tous présents et descriptifs | ✅ |
| Lightbox image | `"Photo agrandie"` | ⚠️ générique |

### Formats et optimisation — ❌ À corriger

**Problème** : Toutes les images sont des URLs Unsplash (temporaires, stock).

En production :
- ❌ Pas de format WebP/AVIF
- ❌ Pas de `srcset` pour les images responsive
- ❌ Pas de `sizes` attribute
- ❌ Hero image ~1920px chargée sur mobile (gaspillage)

**Implémentation responsive recommandée :**
```html
<img
  src="/images/facade-800.webp"
  srcset="/images/facade-400.webp 400w,
          /images/facade-800.webp 800w,
          /images/facade-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Façade du restaurant Quai Ouest en pierre de granit"
  loading="lazy"
  width="800"
  height="600"
>
```

### Lazy loading — ✅ Correct
Toutes les images non-hero ont `loading="lazy"` ✅

---

## 6. Content Quality / E-E-A-T (65/100)

### Experience (Expérience) — 60/100
- ✅ Contenu authentique sur le lieu (véranda, vue mer, granit breton)
- ✅ Prix réels affichés
- ✅ Informations pratiques complètes
- ❌ Photos toutes stock (Unsplash) — signal très négatif pour E-E-A-T
- ❌ Pas de témoignages clients directs (quotes, noms)
- ❌ Pas de dates de publication / mises à jour

### Expertise (Expertise) — 65/100
- ✅ Descriptions culinaires précises (Panko, clémentine, morilles, Pomme Anna...)
- ✅ Mention des techniques (cuit sur peau, farce fine, glace artisanale)
- ✅ Philosophie culinaire mentionnée (anti-gaspi, local, fait maison)
- ❌ **Pas de nom de chef** — signal d'expertise majeur absent
- ❌ **Pas d'histoire du restaurant** (quand ouvert, par qui, pourquoi)

### Authoritativeness (Autorité) — 65/100
- ✅ 4.5/5 · 503 avis (Restaurant Guru)
- ✅ Liens vers réseaux sociaux actifs
- ❌ Source de notation : Restaurant Guru (faible autorité SEO). Ajouter Google Reviews et TripAdvisor
- ❌ Aucun article de presse, distinction, mention extérieure
- ❌ Liens entrants (backlinks) non mesurables en local mais sûrement faibles pour un nouveau site

### Trustworthiness (Confiance) — 70/100
- ✅ Adresse physique complète et vérifiable
- ✅ Téléphone et email présents
- ✅ Coordonnées GPS dans le schema
- ❌ **Mentions légales vides** (`href="#"`) — obligation légale en France
- ❌ **Page Confidentialité vide** — non conforme RGPD
- ❌ Formulaire de contact sans backend réel (simulation JS)

### Readability
- ✅ Paragraphes courts et scannables
- ✅ Hiérarchie visuelle claire
- ✅ Police 16px, interlignage 1.6
- ✅ Contraste couleurs globalement correct (Granit #4A4A4A sur blanc → ratio ~10:1)
- ⚠️ Contraste `opacity: 0.5` sur textes secondaires potentiellement insuffisant (vérifier < 4.5:1)

---

## 7. AI Search Readiness / GEO (40/100)

### Crawlabilité des bots IA
- ❌ Pas de `robots.txt` → comportement des bots IA non défini
- ❌ Pas de `llms.txt` → absence d'instructions pour les LLMs
- ✅ Contenu HTML statique → facilement indexable par les crawlers IA

### Citabilité (passage-level)

| Question type | Réponse présente | Qualité |
|---------------|-----------------|---------|
| "Horaires Quai Ouest" | ✅ Tableau HTML | Bonne |
| "Menu et prix Quai Ouest" | ✅ Liste complète | Bonne |
| "Comment réserver" | ✅ Téléphone + formulaire | Bonne |
| "Adresse Quai Ouest" | ✅ Plusieurs endroits | Bonne |
| "Parking Quai Ouest" | ✅ Mentionné | Passable |
| "Accès PMR" | ✅ Mentionné | Passable |
| "Histoire du restaurant" | ❌ Absente | Mauvaise |
| "Chef / équipe" | ❌ Absent | Mauvaise |
| "Spécialités" | ✅ Partiellement | Passable |

### Optimisations GEO recommandées

```html
<!-- 1. Ajouter llms.txt à la racine -->
<!-- /llms.txt -->
```

```json
// 2. Ajouter FAQPage schema
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quels sont les horaires du restaurant Quai Ouest ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le Quai Ouest est ouvert du mercredi au dimanche. Midi : 12h-14h. Soir : jeudi, vendredi, samedi 19h-21h30. Fermé lundi et mardi."
      }
    },
    {
      "@type": "Question",
      "name": "Comment réserver une table au Quai Ouest ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Par téléphone au 02 98 29 08 09 ou via le formulaire de contact sur notre site. Réservation conseillée pour le soir."
      }
    },
    {
      "@type": "Question",
      "name": "Où est situé le restaurant Quai Ouest ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "1 Promenade de Penarth, Plage St Anne, 29250 Saint-Pol-de-Léon, Finistère, Bretagne."
      }
    }
  ]
}
```

```
// 3. Créer /llms.txt
# Quai Ouest — Restaurant Bistronomique
> Restaurant bistronomique face à la Baie de Morlaix, Saint-Pol-de-Léon (29250), Finistère

## Informations essentielles
- Adresse : 1 Promenade de Penarth, Plage St Anne, 29250 Saint-Pol-de-Léon
- Téléphone : 02 98 29 08 09
- Horaires : Mer-Dim midi (12h-14h), Jeu-Sam soir (19h-21h30)
- Cuisine : Bistronomique, produits frais et locaux, fruits de mer
- Menu anti-gaspi : à partir de 14€ (mer-ven midi)
```

---

## 8. Accessibilité (Bonus)

### ✅ Points forts
- `prefers-reduced-motion` correctement géré
- `aria-label` sur les éléments interactifs (hero, hamburger, scroll-top, iframe)
- Labels de formulaire liés aux inputs (`for`/`id`) ✅
- `tabindex="-1"` sur le honeypot ✅
- Couleurs contrastées pour le contenu principal ✅

### ❌ Points faibles
- **Hamburger menu** : `aria-expanded` absent sur `<button class="mobile-toggle">`
- **Gallery items** : éléments `<div>` cliquables sans `role="button"` ni `tabindex="0"`
- **Lightbox** : pas de focus trap (accessibilité clavier)
- **Bouton mobile téléphone** : `href="#"` au lieu de `href="tel:..."`
- **Textes à faible contraste** : `opacity: 0.5` et `opacity: 0.7` peuvent passer sous le seuil WCAG AA (4.5:1)

---

## Annexe : Inventaire des ressources externes

| Ressource | URL | Type | Remplacer en prod |
|-----------|-----|------|-------------------|
| Hero image | images.unsplash.com/photo-1514933... | Image JPG | ✅ Oui — fb-06 |
| Restaurant 1 | images.unsplash.com/photo-1555396... | Image JPG | ✅ Oui — fb-02 |
| Restaurant 2 | images.unsplash.com/photo-1514933... | Image JPG | ✅ Oui — fb-06 |
| Restaurant 3 | images.unsplash.com/photo-1520250... | Image JPG | ✅ Oui — fb-07 |
| Gallery (9) | images.unsplash.com/... | Images JPG | ✅ Oui — photos IG |
| Google Fonts | fonts.googleapis.com | CSS+Fonts | ⚠️ Optionnel |
| Google Maps | google.com/maps/embed | iFrame | 🔄 Garder + lazy |
| Open Graph image | images.unsplash.com/... | Image | ✅ Remplacer |
