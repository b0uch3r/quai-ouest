# État Général du Site — Le Quai Ouest

> **Date du rapport** : 2026-03-21
> **Auditeur** : WebGuardian Pro — Audit sécurité, performance & maintenance
> **Priorité** : Sécurité > Stabilité > Fonctionnalités

---

## Statut Global

| Paramètre | Valeur |
|---|---|
| **Architecture** | Site vitrine statique (GitHub Pages) + App Next.js (Vercel) |
| **Site vitrine** | `https://b0uch3r.github.io/quai-ouest/` |
| **Espace staff** | `https://quai-ouest.vercel.app/login` |
| **Framework frontend** | HTML5/CSS3/Vanilla JS (site) + Next.js 14.2.35 (app) |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Hébergement** | GitHub Pages (site) + Vercel (app) |
| **Dernière mise à jour code** | 2026-03-21 |
| **État sécurité** | ⚠️ Correctifs appliqués, mises à jour dépendances requises |

---

## Mises à jour en attente

| Composant | Version actuelle | Version disponible | Criticité | Statut | CVE/Advisory |
|-----------|------------------|--------------------|-----------|--------|--------------|
| **next** | 14.2.35 | 16.2.1 | 🔴 CRITIQUE | ⏳ À planifier | GHSA-9g9p, GHSA-h25m, GHSA-ggv3, GHSA-3x4c |
| **eslint-config-next** | 14.2.x | 16.2.1 | 🟠 HAUTE | ⏳ À planifier | GHSA-5j98 (glob injection) |
| **dompurify** (via jspdf) | < 3.2.4 | 3.2.4+ | 🟡 MODÉRÉE | ⏳ À planifier | GHSA-vhxf (XSS) |
| **jspdf** | 2.5.x | 4.2.1 | 🟡 MODÉRÉE | ⏳ Montée majeure | Dépend de dompurify fixe |
| **glob** (via eslint) | 10.x | Fixé en eslint-config-next 16 | 🟠 HAUTE | ⏳ À planifier | GHSA-5j98 |

> **Total vulnérabilités npm audit** : 7 (1 critique, 5 hautes, 1 modérée)
>
> ⚠️ La montée vers Next.js 15/16 est une **breaking change majeure** (App Router v2, React 19). Elle nécessite un passage en staging avec tests complets.

---

## Problèmes de Sécurité Identifiés

### ✅ CORRIGÉS dans cet audit

- [x] **CORS wildcard dans OPTIONS handler** — `/api/reservations/public/route.ts` répondait `Access-Control-Allow-Origin: *` au preflight, permettant potentiellement à n'importe quel domaine de soumettre des réservations. **Corrigé** : restreint à `https://b0uch3r.github.io` uniquement.
- [x] **Absence de security headers** — Aucun header de sécurité configuré. **Corrigé** dans `next.config.js` :
  - `X-Frame-Options: DENY` (protection clickjacking)
  - `X-Content-Type-Options: nosniff` (MIME sniffing)
  - `Strict-Transport-Security: max-age=63072000` (HSTS)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (caméra, micro, géoloc désactivés)
  - `Content-Security-Policy` (script, style, font, connect restreints)
  - `X-Powered-By` désactivé (`poweredByHeader: false`)
- [x] **Injection ilike dans la recherche** — Le paramètre `q` était injecté directement dans un filtre `ilike` sans échappement des caractères `%`, `_`, `\`. **Corrigé** : sanitization + limite 100 chars.
- [x] **Validation de date insuffisante** — Le champ `date` acceptait toute chaîne non vide. **Corrigé** : regex stricte `YYYY-MM-DD` + vérification que la date n'est pas dans le passé + validation d'existence réelle de la date.
- [x] **Fuite d'informations Supabase** — Les messages d'erreur PostgreSQL/Supabase étaient renvoyés au client (structure interne DB). **Corrigé** : messages génériques `"Erreur serveur"` côté client, détails loggués côté serveur.
- [x] **Input length non limité** — Nom, email, message sans limite de longueur. **Corrigé** : limites strictes (nom 100, email 254, téléphone 20, message 1000 chars).
- [x] **`rel="noopener"` sans `noreferrer`** — 9 liens externes corrigés en `rel="noopener noreferrer"`.

### ⚠️ À SURVEILLER

- [ ] **Rate limiting in-memory** — Le rate limiter `/api/reservations/public` utilise un `Map` en mémoire. Sur Vercel serverless, chaque invocation peut être sur une instance différente, rendant le rate limiting potentiellement inefficace. **Recommandation** : migrer vers Vercel KV ou Upstash Redis pour un rate limiting distribué.
- [ ] **Pas de CSRF token** — L'endpoint public repose uniquement sur CORS + honeypot. Pour un restaurant de cette taille, le risque est faible, mais un token CSRF serait plus robuste.
- [ ] **Pas de rate limiting sur `/login`** — Supabase gère le rate limiting côté serveur, mais ajouter un limiteur applicatif serait prudent.
- [ ] **CSP côté GitHub Pages** — GitHub Pages ne permet pas de configurer les headers HTTP. Le site statique est donc sans CSP. Risque limité car il n'y a pas de données sensibles côté statique.
- [ ] **`NEXT_PUBLIC_GOOGLE_MAPS_KEY`** — Si activée, cette clé sera exposée côté client. Utiliser des restrictions HTTP Referrer dans la console Google Cloud.

### ✅ POINTS POSITIFS

- [x] **Aucun secret/token/clé API exposé** dans le code source client
- [x] **`.env` correctement dans `.gitignore`** — pas de fuite de credentials
- [x] **RLS (Row Level Security) activé** sur toutes les tables Supabase
- [x] **Service role key séparée** — `SUPABASE_SERVICE_ROLE_KEY` (non `NEXT_PUBLIC_`) utilisée uniquement côté serveur
- [x] **Honeypot anti-spam** fonctionnel sur le formulaire public
- [x] **Validation Zod** sur tous les endpoints d'API
- [x] **Auth middleware** protège toutes les routes `/dashboard/*`
- [x] **Whitelist de colonnes triables** — protection contre l'injection dans les paramètres de tri

---

## Actions Recommandées Immédiates

### Priorité CRITIQUE (à faire dans les 7 jours)

1. **Planifier la montée Next.js 15/16** en staging
   - Tester l'app complète (login, dashboard, réservations, export)
   - Vérifier la compatibilité avec `@supabase/ssr` et React 19
   - Déployer en preview Vercel avant la production
   - `npm audit fix --force` après migration

2. **Mettre à jour `jspdf` vers v4** pour corriger la vulnérabilité DOMPurify XSS
   - Impact : le module d'export PDF pourrait nécessiter des ajustements d'API

### Priorité HAUTE (à faire dans les 14 jours)

3. **Générer les assets favicon manquants**
   - `favicon-32.png` et `apple-touch-icon.png` depuis `favicon.svg`
   - Utiliser [realfavicongenerator.net](https://realfavicongenerator.net)

4. **Configurer Google Search Console** pour le domaine `b0uch3r.github.io/quai-ouest/`

5. **Implémenter un rate limiting distribué** (Vercel KV / Upstash Redis) sur l'endpoint public

### Priorité MOYENNE (à faire dans les 30 jours)

6. **Activer Google Analytics ou Plausible** (le placeholder `NEXT_PUBLIC_GA_ID` existe déjà)
7. **Convertir les images en WebP** — le script `scripts/optimize-images.js` existe, l'exécuter avec la génération WebP
8. **Nettoyer le dossier `assets/images/image ajouter/`** — renommer en `uploads/` ou supprimer les fichiers non utilisés

---

## Plan de Mise à Jour Next.js (breaking change)

| Étape | Action | Risque |
|-------|--------|--------|
| 1 | Backup complet du repo + snapshot Vercel | Nul |
| 2 | Créer branche `feat/nextjs-16-migration` | Nul |
| 3 | `npm install next@16 react@19 react-dom@19 eslint-config-next@16` | ⚠️ Breaking |
| 4 | Mettre à jour les imports `cookies()` → async (`await cookies()`) | ⚠️ API change |
| 5 | Vérifier les API routes (route handlers stables) | Faible |
| 6 | Tester : login, dashboard, réservations, export CSV/PDF | Obligatoire |
| 7 | Déployer en Preview Vercel | Nul |
| 8 | Valider, merger, déployer en production | Nul |
| **Date cible** | **Sous 7 jours** | |

---

## Inventaire Technique Complet

### Site Vitrine (GitHub Pages)
| Élément | Détail |
|---------|--------|
| Fichier principal | `index.html` (2421 lignes, inline CSS+JS) |
| Framework | Aucun (HTML5 + Vanilla JS) |
| Fonts | Google Fonts (Playfair Display, DM Sans) |
| Images | 12 images JPG (~8 MB total, optimisation WebP recommandée) |
| SEO | Meta tags complets, JSON-LD Restaurant, sitemap.xml, robots.txt |
| Accessibilité | WCAG 2.1 AA (skip link, landmarks, aria-labels, focus visible, keyboard) |
| SSL | ✅ Forcé par GitHub Pages |

### Application Réservations (Vercel)
| Élément | Détail |
|---------|--------|
| Framework | Next.js 14.2.35 (App Router) |
| Langage | TypeScript 5.5 (strict mode) |
| Auth | Supabase Auth (email/password) |
| Base de données | Supabase PostgreSQL (4 tables, RLS) |
| Validation | Zod schemas sur tous les endpoints |
| CSS | Tailwind CSS 3.4 |
| Dépendances | 13 prod + 8 dev |

### Fichiers de Configuration
| Fichier | État |
|---------|------|
| `robots.txt` | ✅ Correct (Disallow /config, /scripts, /content) |
| `sitemap.xml` | ✅ Correct (1 URL, lastmod 2026-03-20) |
| `manifest.json` | ✅ Créé (PWA-ready) |
| `favicon.svg` | ✅ Créé (ancre SVG) |
| `.env.example` | ✅ Documenté (aucun secret) |
| `.gitignore` | ✅ Complet (.env, node_modules, .next, .claude) |

---

## Notes & Risques Résiduels

1. **GitHub Pages ne supporte pas les headers HTTP personnalisés** — Le site statique est donc sans CSP, HSTS, ou X-Frame-Options. Ce risque est acceptable car le site ne traite aucune donnée sensible (le formulaire POST va vers Vercel).

2. **Le rate limiting in-memory est un faux sentiment de sécurité** sur une architecture serverless. Il fonctionne en dev mais pas en production multi-instances. À migrer vers Redis/KV.

3. **Le dossier `assets/images/image ajouter/` contient des noms UUID** peu lisibles. Risque fonctionnel (espaces dans le chemin = URL encoding nécessaire). Migration recommandée vers `uploads/`.

4. **La colonne `formspree_id`** dans la table `reservations` est un vestige de l'ancien système. Elle peut être supprimée par migration SQL.

5. **L'email `quai.ouest29250@gmail.com`** est utilisé correctement comme contact public uniquement — il n'est PAS utilisé pour l'authentification admin.

---

*Rapport généré par WebGuardian Pro — Prochaine revue recommandée : 2026-04-21*
