# TODO — Projet Site Le Quai Ouest

**Dernière mise à jour** : 19 mars 2026

---

## Phase 1 — Initialisation et collecte (Semaine 1)

- [x] Créer l'arborescence du projet
- [x] Rédiger le README.md
- [x] Rédiger le cahier des charges (SPECS.md)
- [x] Rédiger l'architecture technique (ARCHITECTURE.md)
- [x] Rédiger la stratégie Instagram (INSTAGRAM-STRATEGY.md)
- [x] Créer ce fichier TODO.md
- [ ] Récupérer les photos Instagram des 6 derniers mois (depuis sept. 2025)
- [ ] Télécharger et catégoriser les images récupérées
- [x] Créer le fichier `content/instagram.json` avec les métadonnées
- [x] Créer `content/menu.json` avec les plats connus (prix manquants à confirmer)
- [x] Créer `content/gallery.json` avec index complet des 15 photos IG + FB
- [x] Créer `scripts/optimize-images.js` (génération WebP responsive avec sharp)
- [x] Créer `assets/images/instagram/`, `facebook/`, `optimized/`
- [ ] Collecter les informations manquantes auprès du restaurateur (horaires précis, carte actuelle, histoire)
- [ ] Confirmer le lien entre le compte Instagram et une page Facebook Business

---

## Phase 2 — Design et maquettage (Semaine 2-3)

- [ ] Définir la palette de couleurs et la typographie
- [ ] Créer le design system (composants UI de base)
- [ ] Maquettes wireframe mobile (Figma ou équivalent)
- [ ] Maquettes wireframe desktop
- [ ] Design UI haute fidélité — page d'accueil
- [ ] Design UI haute fidélité — page menu/carte
- [ ] Design UI haute fidélité — galerie photos
- [ ] Design UI haute fidélité — page contact
- [ ] Design UI haute fidélité — page à propos
- [ ] Préparer les assets visuels (logo, favicon, og-image)
- [ ] Validation du design par le restaurateur

---

## Phase 3 — Setup technique (Semaine 3)

- [ ] Initialiser le projet Next.js 14+ avec TypeScript
- [ ] Configurer Tailwind CSS avec le thème personnalisé
- [ ] Configurer ESLint + Prettier
- [ ] Configurer Husky + lint-staged (hooks pre-commit)
- [ ] Créer le fichier `.env.example` avec les variables nécessaires
- [ ] Configurer le repository GitHub
- [ ] Mettre en place le déploiement Vercel (preview + production)
- [ ] Configurer les GitHub Actions (lint, build, tests)

---

## Phase 4 — Développement frontend (Semaine 3-5)

### Layout et navigation
- [ ] Composant Header avec navigation responsive
- [ ] Composant Footer avec horaires et réseaux sociaux
- [ ] Composant MobileNav (menu hamburger)
- [ ] Layout racine (`app/layout.tsx`)
- [ ] Gestion des métadonnées SEO par page

### Page d'accueil
- [ ] Composant Hero (image plein écran + accroche)
- [ ] Section plats vedettes / suggestion du chef
- [ ] Section aperçu Instagram (derniers posts)
- [ ] Section horaires et localisation rapide
- [ ] Call-to-action réservation

### Page Menu / Carte
- [ ] Composant MenuCategory
- [ ] Composant MenuItem (avec prix, tags, allergènes)
- [ ] Intégration des données depuis `content/menu.json`
- [ ] Section formule du midi

### Galerie Photos
- [ ] Composant PhotoGrid (grille responsive)
- [ ] Composant Lightbox (visionneuse plein écran)
- [ ] Filtres par catégorie (plats, ambiance, événements)
- [ ] Lien vers profil Instagram
- [ ] **Filtre par date : afficher uniquement les posts depuis sept. 2025**

### Page Contact & Réservation
- [ ] Composant ContactForm avec validation
- [ ] Composant Map (carte interactive Leaflet ou Google Maps)
- [ ] Affichage des coordonnées complètes
- [ ] Section itinéraire / accès

### Page À propos
- [ ] Section histoire du restaurant
- [ ] Section philosophie culinaire
- [ ] Section équipe (si photos disponibles)
- [ ] Galerie ambiance / cadre

### Composants UI réutilisables
- [ ] Button, Card, Badge, Container
- [ ] Skeleton loaders
- [ ] Toast / notifications

---

## Phase 5 — Intégrations backend (Semaine 5-6)

### Instagram
- [ ] Script de scraping one-shot (Phase 1 de la stratégie)
- [ ] Optimisation des images téléchargées (sharp → WebP)
- [ ] Création de l'application Meta (quand prêt)
- [ ] Implémentation du service API Instagram (`src/services/instagram.ts`)
- [ ] API route proxy Instagram (`/api/instagram`)
- [ ] Système de renouvellement automatique du token
- [ ] **Filtrage strict : uniquement les posts depuis sept. 2025**

### Formulaire de contact
- [ ] API route `/api/contact` avec validation Zod
- [ ] Intégration service email (Resend ou Nodemailer)
- [ ] Protection anti-spam (honeypot + rate limiting)
- [ ] Email de confirmation au visiteur (optionnel)
- [ ] Tests d'envoi email

---

## Phase 6 — Contenu et SEO (Semaine 6)

- [ ] Rédiger les textes : page d'accueil (accroche, présentation)
- [ ] Rédiger les textes : page à propos (histoire, philosophie)
- [ ] Intégrer la carte/menu complète dans `content/menu.json`
- [ ] Optimiser toutes les images (formats, tailles, alt text)
- [ ] Implémenter les données structurées Schema.org (JSON-LD)
- [ ] Configurer le sitemap.xml et robots.txt
- [ ] Balises meta et Open Graph par page
- [ ] Créer la page mentions légales
- [ ] Traduction anglaise (si retenue)

---

## Phase 7 — Tests et qualité (Semaine 7)

- [ ] Tests cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Tests responsive (mobile, tablette, desktop)
- [ ] Audit Lighthouse (Performance, Accessibilité, SEO, Best Practices)
- [ ] Audit accessibilité (WCAG 2.1 AA)
- [ ] Tests des formulaires (contact, edge cases)
- [ ] Tests de l'intégration Instagram (cache, fallback, erreurs)
- [ ] Vérification des liens et de la navigation
- [ ] Corrections et ajustements

---

## Phase 8 — Mise en production (Semaine 7-8)

- [ ] Configuration du nom de domaine
- [ ] Déploiement production sur Vercel
- [ ] Configuration SSL et redirections
- [ ] Mise en place Google Analytics / Plausible
- [ ] Soumission à Google Search Console
- [ ] Création/mise à jour de la fiche Google Business
- [ ] Lien vers le site depuis les profils Instagram et Facebook
- [ ] Monitoring (UptimeRobot)

---

## Phase 9 — Post-lancement

- [ ] Formation du restaurateur à la mise à jour du menu
- [ ] Documentation d'utilisation simplifiée
- [ ] Suivi analytics (1ère semaine, 1er mois)
- [ ] Collecte de retours utilisateurs
- [ ] Ajustements UX basés sur les données
- [ ] Envisager l'ajout d'un système de réservation en ligne (TheFork, etc.)

---

## Notes

- **Contrainte Instagram** : ne récupérer que les publications depuis le 1er septembre 2025. Le contenu antérieur n'est plus représentatif.
- **Compte Instagram** : [@quaiouest.stpol](https://www.instagram.com/quaiouest.stpol?igsh=MXJyOWFvcWxqNms2bw==)
- Le restaurateur doit valider le design avant le développement (Phase 2)
- Prévoir un budget pour le nom de domaine (~10-15€/an)
- Vérifier si le restaurateur dispose déjà d'un compte Google Business
