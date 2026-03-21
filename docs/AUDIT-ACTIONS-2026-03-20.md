# AUDIT COMPLET & PLAN D'ACTIONS - Quai Ouest
**Date :** 20 mars 2026
**Statut :** Site en production sur GitHub Pages + Backend Vercel/Supabase

---

## ETAT DES LIEUX RAPIDE

| Element | Statut | Note |
|---------|--------|------|
| Site statique (index.html) | En ligne | 2 310 lignes, monolithique |
| Backend réservations (Vercel) | En ligne | Next.js 14 + Supabase |
| Dashboard Staff | En ligne | /login sur Vercel |
| Mobile responsive | Partiel | 1 seul breakpoint (768px) |
| SEO | Base en place | JSON-LD + meta, mais améliorable |
| Images | Problematique | Nommage, poids, organisation |

---

## 1. PROBLEMES CRITIQUES (A faire immediatement)

### 1.1 Nommage des images - URGENT
**Probleme :** Le dossier `assets/images/image ajouter/` contient des espaces et 22 fichiers avec des noms UUID (ex: `1da1a8f3-...jpg`).
- Les espaces dans les chemins causent des URL encodees (`image%20ajouter/`)
- Les noms UUID sont catastrophiques pour le SEO image
- Un fichier duplique existe : `36575562-...(1).jpg`

**Actions :**
- [ ] Renommer le dossier `image ajouter/` → `galerie/` ou `uploads/`
- [ ] Renommer chaque image avec un nom semantique (ex: `tartare-saumon-terrasse.jpg`)
- [ ] Supprimer le fichier duplique
- [ ] Mettre a jour toutes les references dans `index.html`
- [ ] Mettre a jour `content/gallery.json`

### 1.2 Poids des images - PERFORMANCE
**Probleme :** Les images de la galerie pesent entre 100 KB et 400 KB chacune. Total du dossier `image ajouter/` : **5.4 MB**. Sur mobile en zone cotiere (4G instable), c'est trop lourd.

**Actions :**
- [ ] Convertir toutes les images en **WebP** (gain ~60-70%)
- [ ] Creer 3 tailles par image : `thumbnail` (300px), `medium` (800px), `full` (1600px)
- [ ] Utiliser `<picture>` avec `srcset` pour servir la bonne taille selon l'ecran
- [ ] Objectif : < 80 KB par image en galerie, < 150 KB pour le hero
- [ ] Le dossier `optimized/` existe deja avec 21 fichiers → les utiliser ou regenerer

### 1.3 Formulaire de reservation - FIABILITE
**Probleme :** Le formulaire POST vers `https://quai-ouest.vercel.app/api/reservations/public`. L'URL est hardcodee dans le HTML. Si le backend Vercel tombe, aucun fallback.

**Etat actuel (fonctionnel) :**
- Validation cote client (jours fermes lundi/mardi, email, date future)
- Honeypot anti-spam (`_gotcha`)
- Rate limiting cote serveur (5/heure/IP)
- Insertion Supabase (tables `clients` + `reservations`)

**Actions :**
- [ ] Ajouter un **fallback email** : si le backend repond en erreur, proposer un lien `mailto:quai.ouest29250@gmail.com` pre-rempli
- [ ] Ajouter une **notification email** automatique au restaurant via Resend (cle API dans `.env.example` deja prevue)
- [ ] Ajouter un **email de confirmation** au client
- [ ] Ameliorer le message de succes (ajouter estimation du temps de reponse)
- [ ] Tester la robustesse du rate limiting (in-memory = reset a chaque redeploy)

---

## 2. PROBLEMES IMPORTANTS (A faire cette semaine)

### 2.1 Mobile-First incomplet
**Probleme :** Un seul breakpoint a 768px. Pas de gestion fine pour les petits mobiles (320-375px) ni les tablettes (768-1024px).

**Actions :**
- [ ] Ajouter breakpoints : `480px` (petit mobile), `1024px` (tablette), `1440px` (grand ecran)
- [ ] Verifier le bouton d'appel `02 98 29 08 09` : doit etre cliquable (`tel:+33298290809`) et bien visible sur mobile
- [ ] Tester le formulaire de reservation sur iPhone SE (plus petit ecran courant)
- [ ] Verifier que le menu hamburger fonctionne bien (actuellement 80% width max 360px)
- [ ] Ajouter un bouton flottant "Appeler" sur mobile (en plus du CTA reservation)

### 2.2 Validation du formulaire - AMELIORATION UX
**Actions :**
- [ ] Bloquer les lundis ET mardis (actuellement: lundi/mardi detectes mais le message pourrait etre plus clair)
- [ ] Ajouter un calendrier visuel (`<input type="date">` est deja la, mais un datepicker ameliorerait l'UX)
- [ ] Valider le format telephone francais (`0X XX XX XX XX` ou `+33`)
- [ ] Afficher le service disponible selon le jour choisi (midi seulement certains jours, soir jeudi-samedi)
- [ ] Empecher les dates trop lointaines (max 3 mois a l'avance)
- [ ] Ajouter validation en temps reel (actuellement sur `blur`, ajouter aussi sur `input`)

### 2.3 Dualite midi/soir - MISE EN VALEUR
**Probleme :** Le site ne met pas assez en avant la difference entre le service du midi (60 couverts, decontracte) et du soir (15-20 couverts, degustation intimiste).

**Actions :**
- [ ] Creer une section dediee "Deux ambiances, un meme lieu" avec visuels jour/nuit
- [ ] Ajouter des badges visuels sur la carte : "Midi - 60 couverts" / "Soir - Menu degustation"
- [ ] Mettre en avant le menu degustation du soir comme experience premium
- [ ] Ajouter des photos specifiques ambiance midi vs ambiance soir

---

## 3. SEO & PROFESSIONNALISATION (A faire ce mois)

### 3.1 Nom de domaine personnalise
**Probleme :** L'URL `b0uch3r.github.io/quai-ouest` n'est pas professionnelle.

**Actions :**
- [ ] Acheter un domaine (suggestions : `quaiouest-stpol.fr`, `quaiouest.bzh`, `restaurant-quaiouest.fr`)
- [ ] Configurer le DNS (CNAME vers `b0uch3r.github.io`)
- [ ] Activer HTTPS via GitHub Pages (automatique avec domaine custom)
- [ ] Mettre a jour toutes les URLs canoniques dans le HTML
- [ ] Mettre a jour `sitemap.xml`, `robots.txt`, meta OG
- [ ] Configurer la redirection `www` → domaine nu (ou inverse)
- [ ] Mettre a jour le CORS dans `next.config.js` du backend pour le nouveau domaine

### 3.2 SEO technique
**Actions :**
- [ ] **JSON-LD** : Le schema Restaurant est en place mais verifier les horaires (fermeture lundi/mardi)
- [ ] **Alt texts** : Deja en place et descriptifs (bien) → s'assurer que les nouvelles images auront aussi des alt pertinents
- [ ] **Canonical URL** : Pointe vers `b0uch3r.github.io` → a mettre a jour avec le futur domaine
- [ ] **Sitemap** : N'a qu'une seule URL → ajouter les sections avec ancres (#restaurant, #carte, etc.) si pertinent
- [ ] **Google My Business** : Creer/revendiquer la fiche et y lier le site
- [ ] **Meta descriptions** : Deja en place, verifier la longueur (< 160 caracteres)
- [ ] **Performance** : Viser un score Lighthouse > 90 sur mobile

### 3.3 Referencement local
**Actions :**
- [ ] Ajouter des mots-cles locaux : "Baie de Morlaix", "Finistere", "Bretagne", "bord de mer"
- [ ] Integrer un lien Google Maps direct (deja un embed, mais ajouter un lien "Itineraire")
- [ ] Ajouter les avis Google (widget ou lien vers la page Google)
- [ ] S'inscrire sur les annuaires locaux (TripAdvisor, TheFork, PagesJaunes)

---

## 4. NETTOYAGE & ARCHITECTURE (A faire en parallele)

### 4.1 Structure du projet
**Probleme :** Beaucoup de dossiers vides et de fichiers de planification eparpilles.

**Actions :**
- [ ] Supprimer les dossiers vides inutiles : `facebook/`, `instagram/`, `other/`, `public/`, `config/`
- [ ] Decider si le dossier `src/` (vide) est utile ou a supprimer
- [ ] Consolider la documentation : `docs/` contient 7 fichiers, certains potentiellement obsoletes
- [ ] Nettoyer `content/gallery.json` : beaucoup d'entrees avec `"downloaded": false`
- [ ] Completer `content/menu.json` : plusieurs prix a `null`, sections vides

### 4.2 Code monolithique
**Probleme :** `index.html` fait 2 310 lignes avec tout inline (HTML + CSS + JS).

**Actions (optionnel, si on veut scaler) :**
- [ ] Extraire le CSS dans `styles/main.css`
- [ ] Extraire le JS dans `scripts/main.js`
- [ ] Envisager un pre-processeur CSS (ou rester simple avec du CSS natif)
- [ ] Note : Pour un site single-page statique, le monolithique est acceptable pour la performance (1 seule requete HTTP)

### 4.3 Accessibilite (WCAG)
**Actions :**
- [ ] Ajouter `aria-label` sur le bouton hamburger
- [ ] Ajouter `aria-label` sur les boutons de navigation du lightbox
- [ ] Verifier les contrastes de couleurs (cognac `#C4723A` sur blanc)
- [ ] Ajouter `role="dialog"` au lightbox
- [ ] Tester la navigation au clavier complete

---

## 5. FONCTIONNALITES FUTURES (Phase 2)

### 5.1 Notifications & Communication
- [ ] Email de confirmation automatique au client apres reservation
- [ ] SMS de rappel 24h avant (via Twilio ou equivalent)
- [ ] Integration Instagram feed (API credentials dans `.env.example`, pas encore configure)

### 5.2 Dashboard Staff (Vercel)
- [ ] Tester le login/dashboard existant
- [ ] Ajouter notification push/email quand nouvelle reservation
- [ ] Ajouter un calendrier visuel des reservations
- [ ] Export CSV fonctionne deja → verifier

### 5.3 Ameliorations UX avancees
- [ ] Mode sombre (pour consultation le soir)
- [ ] PWA (installation sur l'ecran d'accueil mobile)
- [ ] Animation de chargement squelette pour la galerie
- [ ] Micro-interactions (hover cards, transitions de page)

---

## PRIORITES RECOMMANDEES

| Priorite | Action | Impact | Effort |
|----------|--------|--------|--------|
| P0 | Renommer images + dossier | SEO + Stabilite | 1h |
| P0 | Optimiser poids images (WebP) | Performance mobile | 2h |
| P0 | Fallback formulaire reservation | Fiabilite | 30min |
| P1 | Breakpoints mobile supplementaires | UX mobile | 2h |
| P1 | Validation formulaire amelioree | UX | 1h |
| P1 | Section dualite midi/soir | Marketing | 2h |
| P2 | Nom de domaine + configuration | Professionnalisme | 1 journee |
| P2 | Google My Business + local SEO | Referencement | 2h |
| P2 | Email confirmation reservation | Communication | 2h |
| P3 | Extraction CSS/JS | Maintenabilite | 1h |
| P3 | Accessibilite WCAG | Conformite | 2h |
| P3 | Instagram feed integration | Marketing | 4h |

---

## FICHIERS CLES A MODIFIER

| Fichier | Raison |
|---------|--------|
| `index.html` | Fichier principal - tout le site |
| `assets/images/image ajouter/` | Renommer dossier + fichiers |
| `content/menu.json` | Completer les prix manquants |
| `content/gallery.json` | Nettoyer les entrees non-telechargees |
| `reservation-app/src/app/api/reservations/public/route.ts` | Ajouter email notification |
| `reservation-app/next.config.js` | Mettre a jour CORS pour nouveau domaine |
| `sitemap.xml` | Mettre a jour URL |
| `robots.txt` | Mettre a jour URL sitemap |

---

*Document genere par QuaiOuest-DevBot — Audit initial du 20 mars 2026*
