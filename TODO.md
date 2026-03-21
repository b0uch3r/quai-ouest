# TODO — Le Quai Ouest

**Dernière mise à jour** : 21 mars 2026
**État** : Site vitrine en production (GitHub Pages) + App réservation staff (Vercel)

---

## Ce qui EST fait

- [x] Site vitrine complet en HTML/CSS/JS inline (`index.html`)
- [x] Toutes les sections : hero, restaurant, carte midi/soir, galerie, horaires, contact, localisation, footer
- [x] Formulaire de réservation fonctionnel (validation, jours fermés, service midi/soir)
- [x] Formulaire connecté à l'API Vercel → Supabase
- [x] App réservation staff Next.js : login, dashboard, tableau réservations, filtres, export CSV/PDF
- [x] Supabase : tables clients + réservations + notes + staff, RLS activé
- [x] SEO : meta tags, JSON-LD Restaurant avec sameAs, BreadcrumbList, sitemap.xml, robots.txt, llms.txt
- [x] OG + Twitter Cards complets avec image dimensions et alt
- [x] Accessibilité : `<main>`, skip link, `aria-label` nav, keyboard galerie, focus visible, emoji aria-hidden
- [x] Security headers (CSP, HSTS, X-Frame-Options, nosniff, Permissions-Policy)
- [x] CORS restreint, validation Zod, sanitization ilike, erreurs masquées
- [x] Mobile responsive (768px + 480px), hamburger, floating CTA
- [x] Lightbox galerie avec navigation clavier + filtres par catégorie
- [x] Cookie banner, modal mentions légales, page 404
- [x] Print stylesheet, reduced motion, favicon SVG, manifest.json
- [x] Preload hero `fetchpriority="high"`, DNS prefetch, geo metas, `theme-color`

---

## URGENCES (cette semaine)

### ~~U1 · Montée Next.js 14 → 15 (sécurité)~~ ✅ FAIT
- Next.js 15.3, React 19.1, eslint-config-next 15.3
- `cookies()` → `await cookies()` dans supabase-server.ts
- `createClient()` → `await createClient()` dans toutes les API routes + dashboard layout
- `params` → `Promise<{ id: string }>` + `await params` dans routes dynamiques ([id])
- Sanitisation ilike ajoutée dans clients/route.ts (manquante avant)
- Build vérifié : 0 erreurs

### ~~U2 · Mettre à jour jspdf (vulnérabilité DOMPurify XSS)~~ ✅ FAIT
- jspdf 2.5.1 → 4.2.1 (corrige CVE DOMPurify < 3.2.4)
- `npm audit` : 0 vulnérabilités

### ~~U3 · Rate limiting distribué (endpoint public)~~ ✅ FAIT
- Remplacé le `Map` en mémoire par `@upstash/ratelimit` + `@upstash/redis`
- Sliding window 5 req/heure par IP
- **Action requise** : configurer `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` dans les variables d'environnement Vercel
- Créer un compte gratuit sur https://upstash.com → Redis → copier les credentials

---

## TACHES IMPORTANTES (dans les 2 semaines)

### T1 · Générer les favicons PNG
**Pourquoi** : `favicon.svg` existe mais les PNG manquent pour iOS/Safari
**Effort** : 15 min
```
Aller sur realfavicongenerator.net avec favicon.svg
Télécharger favicon-32.png, apple-touch-icon.png, favicon.ico
Mettre à jour les <link> dans index.html
```

### ~~T2 · Convertir les images en WebP~~ ✅ FAIT
- 15 images JPG → 45 fichiers WebP (3 tailles : 400/800/1200px)
- Script `scripts/optimize-images.js` réécrit pour cibler `assets/images/` racine
- ~1.1 Mo économisés sur les tailles medium

### ~~T3 · Ajouter les srcset responsive aux images~~ ✅ FAIT
- 14 balises `<img>` converties en `<picture>` avec `<source type="image/webp" srcset>`
- Tailles responsive : small (400w), medium (800w), large (1200w) pour les images section
- JPG conservés comme fallback
- Attributs `width`/`height` ajoutés (CLS)

### ~~T4 · Ajouter le schema FAQPage~~ ✅ FAIT
- JSON-LD FAQPage ajouté (2e bloc schema, après Restaurant)
- Section FAQ visible avec 6 questions en accordéon `<details>`/`<summary>`
- Section insérée entre Horaires et Contact
- CSS cohérent avec le design existant (couleurs, typographie)

### ~~T5 · Créer une page Politique de confidentialité séparée~~ ✅ FAIT
- `politique-confidentialite.html` créée (9 sections RGPD complètes)
- Lien ajouté dans le footer et dans la modale mentions légales
- Cookie banner mis à jour pour pointer vers la page de confidentialité
- Contenu : responsable traitement, données collectées, base légale, durée (3 ans), destinataires (Supabase EU, Vercel), 6 droits RGPD, exercice des droits, cookies, hébergement

### T6 · Configurer Google Analytics ou Plausible
**Pourquoi** : Aucune donnée de trafic actuellement, impossible de mesurer l'impact
**Effort** : 30 min
```
Option A : Google Analytics 4 (gratuit, complet, cookies)
  → Ajouter le tag gtag.js dans index.html
  → Remplir NEXT_PUBLIC_GA_ID dans .env Vercel

Option B : Plausible (payant, léger, RGPD-friendly, pas de cookie banner)
  → Script 1 ligne, pas de cookies
```

### T7 · Google Search Console + Google Business Profile
**Pourquoi** : Le site n'est probablement pas vérifié auprès de Google
**Effort** : 1h
```
1. Search Console : vérifier le domaine b0uch3r.github.io/quai-ouest/
2. Soumettre le sitemap.xml
3. Google Business Profile : créer/réclamer la fiche
4. Lier le site web à la fiche
5. Demander les premiers avis Google aux clients réguliers
```

---

## GROS CHANTIERS (ce mois-ci)

### GC1 · Intégration email des réservations
**Pourquoi** : Le staff ne reçoit AUCUNE notification quand une réservation arrive via le site
**Effort** : 3-4h
**Impact** : CRITIQUE pour l'opérationnel
```
1. Créer un compte Resend (gratuit 100 emails/jour)
2. RESEND_API_KEY dans .env Vercel
3. Dans public/route.ts, après insert réservation :
   → Envoyer un email au staff (résumé réservation)
   → Envoyer un email de confirmation au client
4. Template email simple, responsive
```

### GC2 · Nom de domaine propre
**Pourquoi** : `b0uch3r.github.io/quai-ouest/` n'est pas pro. Un domaine propre améliore le SEO local.
**Effort** : 1h config + budget ~12€/an
**Options** :
```
- quaiouest-saintpol.fr (recommandé)
- lequaiouest.fr
- quai-ouest-restaurant.fr

Actions :
1. Acheter le domaine (OVH, Gandi, ou Namecheap)
2. Configurer le DNS CNAME vers GitHub Pages
3. Activer HTTPS via GitHub Pages
4. Mettre à jour canonical, OG url, sitemap dans index.html
5. Configurer aussi le sous-domaine staff.quaiouest.fr → Vercel
6. Rediriger l'ancienne URL b0uch3r.github.io vers le nouveau domaine
```

### GC3 · Récupérer les photos Instagram réelles
**Pourquoi** : Le catalogue `content/instagram.json` liste 15+ photos (depuis sept 2025) mais aucune n'est téléchargée (`"downloaded": false`)
**Effort** : 2-3h
```
1. Se connecter au compte Instagram @quaiouest.stpol
2. Télécharger manuellement les 15 meilleures photos (ou via l'API Meta)
3. Les renommer selon la convention (ig-01-date-description.jpg)
4. Les placer dans assets/images/
5. Exécuter optimize-images.js pour générer les WebP
6. Mettre à jour les src dans index.html
7. Remplacer les UUID du dossier "image ajouter" par des noms lisibles
```

### GC4 · Contenu enrichi "À propos" / E-E-A-T
**Pourquoi** : Google valorise l'expertise, l'expérience, l'autorité. Le site manque de contenu narratif.
**Effort** : 2-3h (entretien avec le restaurateur + rédaction)
**Impact SEO** : +10-15 pts
```
Informations à collecter :
- Nom et parcours du chef (CRUCIAL pour E-E-A-T)
- Histoire du restaurant (année d'ouverture, évolution)
- Philosophie culinaire (engagement local, anti-gaspi)
- Noms des producteurs locaux partenaires
- Anecdotes / ce qui rend le lieu unique

Créer une section "Notre histoire" sur le site ou une page dédiée
```

### ~~GC5 · Nettoyer le dossier images~~ ✅ FAIT
- 7 images UUID utilisées → renommées avec noms descriptifs, déplacées dans `assets/images/`
- 15 images UUID non utilisées → supprimées (3.9 Mo libérés)
- 1 doublon identifié et supprimé
- Alt texts corrigés pour correspondre au contenu réel des images
- Catégories galerie corrigées (bar, lieu, plats, ambiance)
- Dossier "image ajouter" vidé (ne contient plus que .claude/)

---

## BACKLOG (après lancement domaine propre)

### B1 · Blog / Actualités
Un article par mois ("Arrivage de Saint-Jacques", "Menu de Noël", "Notre engagement anti-gaspi") améliore le trafic long-tail et l'E-E-A-T. Peut être un simple fichier HTML par article.

### B2 · Version anglaise minimaliste
Zone touristique (ferry Roscoff, îles). Une page EN avec menu + horaires + contact capterait les touristes. `hreflang` tags pour le SEO.

### B3 · Google Reviews / TripAdvisor widget
Afficher les avis directement sur le site (schema `AggregateRating`) pour le social proof et les rich snippets.

### B4 · Page carte dédiée
Une page `/carte` séparée rankerait sur "menu restaurant Saint-Pol-de-Léon" mieux qu'une section dans une page unique.

### B5 · Système de réservation en ligne complet
Actuellement le formulaire crée une "demande" confirmée manuellement. Envisager : créneaux horaires, confirmation automatique, rappel SMS.

### B6 · PWA (Progressive Web App)
Le `manifest.json` existe déjà. Ajouter un Service Worker pour le cache offline du menu et des horaires.

### B7 · Schema `speakable` pour la recherche vocale
Marquer les sections horaires et contact comme "speakable" pour Google Assistant / Siri.

### B8 · Monitoring
Mettre en place UptimeRobot ou Better Uptime pour alerter si le site tombe. Gratuit pour un seul site.

---

## Priorisation visuelle

```
CETTE SEMAINE          CE MOIS-CI              BACKLOG
─────────────          ──────────              ───────
U1 Next.js 16 🔴       GC1 Email résa 🔴       B1 Blog
U2 jspdf fix 🟠        GC2 Nom domaine 🟠      B2 Anglais
U3 Rate limit 🟠       GC3 Photos IG 🟠        B3 Reviews
T1 Favicons 🟡         GC4 Contenu chef 🟡     B4 Page carte
T2 WebP images 🟡      GC5 Clean images 🟡     B5 Résa avancée
T3 srcset 🟡           T6 Analytics 🟡         B6 PWA
T4 FAQPage 🟡          T7 Search Console 🟡    B7 Speakable
T5 Confidentialité 🟡                          B8 Monitoring
```

---

## Notes

- **L'email `quai.ouest29250@gmail.com`** est le contact public UNIQUEMENT — ne pas utiliser comme admin
- **Design** : garder l'esprit épuré et visuel — peu de texte, impact maximum
- **Le TODO.md d'origine** planifiait une refonte Next.js complète du site — ce n'est PAS nécessaire. Le site HTML statique fonctionne parfaitement et est rapide. Se concentrer sur le contenu et les images.
- **Budget estimé** : domaine (~12€/an) + Plausible (~9€/mois) ou GA4 gratuit + Resend (gratuit < 100 emails/jour)
