# Plan d'Action SEO — Quai Ouest
> Basé sur l'audit du 19 mars 2026 · Score actuel : 63/100 · Cible : 85/100

---

## 🔴 CRITIQUE — À corriger avant mise en ligne

### C1 · Canonical tag manquant
**Impact** : Duplication de contenu si plusieurs URLs → pénalité ranking
**Effort** : 5 min
```html
<!-- Dans <head>, après <meta name="robots"> : -->
<link rel="canonical" href="https://quaiouest-saintpol.fr">
```

### C2 · Bouton téléphone mobile non fonctionnel
**Impact** : UX + conversion mobile perdus
**Effort** : 2 min
```html
<!-- Ligne 1438 — remplacer href="#" par : -->
<a href="tel:+33298290809" class="mobile-phone" aria-label="Appeler le Quai Ouest">
```

### C3 · og:type incorrect
**Impact** : Mauvais affichage lors des partages réseaux sociaux
**Effort** : 1 min
```html
<!-- Ligne 15 — remplacer : -->
<meta property="og:type" content="website">
```

### C4 · sameAs absent du Schema JSON-LD
**Impact** : Autorité locale faible, Knowledge Graph incomplet
**Effort** : 5 min
```json
// Ajouter dans le bloc JSON-LD (après "acceptsReservations") :
"sameAs": [
  "https://www.instagram.com/quaiouest.stpol/",
  "https://www.facebook.com/p/Quai-Ouest-100068821471690/",
  "https://www.tripadvisor.fr/Restaurant_Review-g660194-d23568654-Reviews-Quai_Ouest.html"
],
"image": "https://quaiouest-saintpol.fr/images/veranda-vue-mer.jpg",
"logo": "https://quaiouest-saintpol.fr/images/logo-quai-ouest.png"
```

### C5 · acceptsReservations : corriger le type
**Impact** : Validation schema.org
**Effort** : 1 min
```json
"acceptsReservations": true  // boolean, pas string "True"
```

### C6 · Créer les pages Mentions légales et Confidentialité
**Impact** : Obligation légale France (CNIL) + signal de confiance Google
**Effort** : 30 min (contenu) + 10 min (HTML)
- Remplacer `href="#"` par `href="/mentions-legales.html"` et `href="/politique-confidentialite.html"`
- Créer ces deux pages avec le contenu légal approprié

---

## 🟡 HAUTE PRIORITÉ — À corriger dans la semaine

### H1 · Preload image hero (LCP critique)
**Impact** : LCP estimé passe de >3s à ~1.5s → passage de "Poor" à "Good"
**Effort** : 5 min
```html
<!-- Dans <head>, premier élément après <title> : -->
<link rel="preload"
      as="image"
      href="/images/fb-06-2025-10-veranda-vue-mer.webp"
      fetchpriority="high">
```
> ⚠️ Faire dès que l'image fb-06 est disponible et optimisée en WebP

### H2 · Remplacer les images Unsplash par les photos réelles
**Impact** : E-E-A-T +20 pts, authenticité, confiance Google
**Effort** : 30 min (une fois les photos disponibles)
| Position | Image actuelle | Remplacer par |
|----------|---------------|---------------|
| Hero bg | Unsplash restaurant | `fb-06` véranda vue mer |
| Restaurant bloc 1 | Unsplash façade | `fb-02` ou `ig-01` façade pierre |
| Restaurant bloc 2 | Unsplash terrasse | `fb-06` véranda |
| Restaurant bloc 3 | Unsplash lounge | `fb-07` salon lounge |
| OG image | Unsplash | `fb-06` ou `ig-04` côte de bœuf |
| Gallery (9) | Unsplash | Photos IG/FB cataloguées |

### H3 · Ajouter les balises géo dans le head
**Impact** : SEO local, géo-ciblage
**Effort** : 3 min
```html
<meta name="geo.region" content="FR-29">
<meta name="geo.placename" content="Saint-Pol-de-Léon">
<meta name="geo.position" content="48.6847;-3.9870">
<meta name="ICBM" content="48.6847, -3.9870">
<meta name="theme-color" content="#2C5F7C">
```

### H4 · Corriger la meta description (trop longue)
**Impact** : Affichage SERP correct → meilleur CTR
**Effort** : 3 min
```html
<!-- Max 160 chars : -->
<meta name="description" content="Restaurant bistronomique à Saint-Pol-de-Léon, vue sur la Baie de Morlaix. Cuisine de saison, produits locaux. Menu anti-gaspi 14€. ☎ 02 98 29 08 09.">
```

### H5 · Ajouter image srcset + width/height sur les images
**Impact** : CLS + performance mobile
**Effort** : 20 min (3 images restaurant + 9 galerie)
```html
<!-- Exemple pour les images restaurant : -->
<img
  src="/images/facade-800.webp"
  srcset="/images/facade-400.webp 400w, /images/facade-800.webp 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="800" height="600"
  alt="Façade du restaurant Quai Ouest"
  loading="lazy">
```

### H6 · Ajouter `aria-expanded` sur le bouton hamburger
**Impact** : Accessibilité WCAG 2.1 AA
**Effort** : 5 min
```html
<!-- Ligne 1453 : -->
<button class="mobile-toggle" id="mobileToggle"
        aria-label="Ouvrir le menu"
        aria-expanded="false"
        aria-controls="mobileMenu">

<!-- Dans le JS, après toggle : -->
mobileToggle.setAttribute('aria-expanded',
  mobileMenu.classList.contains('open').toString());
```

---

## 🟢 MOYENNE PRIORITÉ — Dans le mois

### M1 · Créer sitemap.xml + robots.txt
**Impact** : Indexation accélérée
**Effort** : 15 min

```xml
<!-- /sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://quaiouest-saintpol.fr/</loc>
    <lastmod>2026-03-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

```
# /robots.txt
User-agent: *
Allow: /
Sitemap: https://quaiouest-saintpol.fr/sitemap.xml
```

### M2 · Ajouter FAQPage schema
**Impact** : Capture des "People Also Ask" + AI Overviews
**Effort** : 20 min
Voir section 7 du FULL-AUDIT-REPORT.md pour le JSON-LD complet.
Questions à couvrir : horaires, réservation, adresse, menu anti-gaspi, parking, accès PMR.

### M3 · Ajouter hasMenu, paymentAccepted, amenityFeature au schema
**Impact** : Rich Results plus complets dans Google
**Effort** : 10 min
Voir section 3 du FULL-AUDIT-REPORT.md.

### M4 · Lazy load Google Maps iframe
**Impact** : Performance, temps de chargement initial
**Effort** : 15 min
```html
<!-- Remplacer le chargement direct par un clic-to-load : -->
<div class="map-placeholder" id="mapPlaceholder">
  <img src="/images/map-preview.jpg" alt="Voir la carte - Quai Ouest, Saint-Pol-de-Léon">
  <button onclick="loadMap()">Afficher la carte</button>
</div>
<div id="mapContainer" style="display:none">
  <iframe src="[url]" ...></iframe>
</div>
```

### M5 · Créer llms.txt
**Impact** : AI Search readiness
**Effort** : 15 min
```
# Quai Ouest
> Restaurant bistronomique, 1 Promenade de Penarth, Plage St Anne, 29250 Saint-Pol-de-Léon

## Informations clés
- Téléphone : 02 98 29 08 09
- Email : quai.ouest29250@gmail.com
- Horaires : Mercredi au dimanche midi (12h-14h), jeudi au samedi soir (19h-21h30)
- Cuisine : Bistronomique, produits frais et locaux bretons, fruits de mer
- Menu anti-gaspi : à partir de 14€ (mercredi au vendredi midi)
- Capacité : 60 couverts midi, 15-20 couverts soir
- Services : Terrasse vue mer, accès PMR, animaux acceptés, parking gratuit

## Spécialités
- Côte de bœuf (à partir de 1,5 kg)
- Noix de Saint-Jacques Panko au miel et clémentine
- Filet de Lieu jaune cuit sur peau, coulis crustacés
```

### M6 · Ajouter un contenu riche "À propos" (E-E-A-T)
**Impact** : E-E-A-T +15 pts, différenciation concurrentielle
**Effort** : 1h (copywriting) + 30min (dev)
Contenu à ajouter :
- Histoire du restaurant (quand ouvert, par qui)
- **Nom et photo du chef** (signal d'expertise majeur)
- Philosophie culinaire approfondie
- Engagements locaux (producteurs nommés si possible)

### M7 · Optimiser la police Google Fonts
**Impact** : LCP -200ms
**Effort** : 20 min
```html
<!-- Réduire à 3 familles + subset latin : -->
<link href="https://fonts.googleapis.com/css2?
  family=Playfair+Display:ital,wght@0,400;0,700;1,400
  &family=Inter:wght@400;500
  &family=Caveat:wght@500
  &subset=latin
  &display=swap" rel="stylesheet">
```

---

## 🔵 BACKLOG — Après lancement

### B1 · Ajouter Google Reviews widget
Remplacer la note Restaurant Guru par un widget Google Reviews officiel (schema AggregateRating avec source Google).

### B2 · Implémenter `speakable` schema
Pour la voice search (Google Assistant, Siri) — marquer les sections horaires et contact comme "speakable".

### B3 · Sous-page `/carte` dédiée
Une page dédiée à la carte (pas seulement une section) permettrait de ranker sur "menu restaurant Saint-Pol-de-Léon".

### B4 · Blog / Actualités
Même 1 article par mois ("Arrivée des Saint-Jacques", "Menu de Noël", "Notre engagement anti-gaspi") améliore considérablement l'E-E-A-T et le trafic long tail.

### B5 · Internationalisation (EN)
Zone touristique (îles bretonnes, ferry Roscoff) — une version anglaise minimaliste (horaires, menu, contact) capterait des touristes étrangers.

### B6 · Google Business Profile
Lier le site à la fiche Google Business (si pas encore fait) et demander des avis Google.

---

## Récapitulatif priorisation

| # | Action | Priorité | Effort | Impact SEO |
|---|--------|----------|--------|------------|
| C1 | Canonical tag | 🔴 Critique | 5 min | +5 pts |
| C2 | Tel: mobile button | 🔴 Critique | 2 min | UX |
| C3 | og:type fix | 🔴 Critique | 1 min | Social |
| C4 | sameAs schema | 🔴 Critique | 5 min | +8 pts local |
| C5 | acceptsReservations bool | 🔴 Critique | 1 min | Schema |
| C6 | Mentions légales | 🔴 Critique | 40 min | Legal + Trust |
| H1 | Preload hero | 🟡 Haute | 5 min | LCP +8 pts |
| H2 | Photos réelles | 🟡 Haute | 30 min | E-E-A-T +15 pts |
| H3 | Balises géo | 🟡 Haute | 3 min | Local +3 pts |
| H4 | Meta desc longueur | 🟡 Haute | 3 min | CTR +? |
| H5 | srcset images | 🟡 Haute | 20 min | CWV +5 pts |
| M1 | sitemap + robots | 🟢 Moyen | 15 min | Crawl |
| M2 | FAQPage schema | 🟢 Moyen | 20 min | AI +10 pts |
| M5 | llms.txt | 🟢 Moyen | 15 min | GEO +8 pts |
| M6 | Contenu chef/histoire | 🟢 Moyen | 1.5h | E-E-A-T +10 pts |

**Score projeté post-corrections critiques + hautes : ~80/100**
**Score projeté post-backlog complet : ~88/100**
