# Direction Artistique — Site web Quai Ouest

> Version 1.0 — 19 mars 2026
> Restaurant Bistronomique Quai Ouest, Saint-Pol-de-Léon (Finistère Nord)

---

## 1. Philosophie de design

Le site du Quai Ouest doit être une **fenêtre ouverte sur la mer**, comme la véranda du restaurant elle-même. On cherche à reproduire digitalement la sensation qu'on éprouve en entrant dans le restaurant : la lumière côtière qui inonde l'espace, l'horizon marin derrière les vitres, la chaleur des matériaux bruts, et la promesse d'une cuisine authentique.

**Mots-clés directeurs** : authenticité, lumière, horizon, terroir, générosité, modernité décontractée.

**Positionnement visuel** : entre le charme brut du granit breton et l'élégance d'une table bistronomique contemporaine. Ni trop rustique, ni trop sophistiqué. Un équilibre « warm minimalism » qui reflète la dualité midi décontracté / soir intimiste du restaurant.

---

## 2. Palette de couleurs

La palette s'inspire directement du paysage visible depuis la terrasse du Quai Ouest : la Baie de Morlaix, les rochers de granit, le ciel changeant du Finistère Nord, et les teintes chaudes de l'intérieur du restaurant.

### Couleurs principales

| Nom | Hex | Usage | Inspiration |
|-----|-----|-------|-------------|
| **Bleu Baie de Morlaix** | `#2C5F7C` | Couleur dominante, navigation, titres principaux | Bleu profond de la mer vu depuis la terrasse |
| **Blanc Écume** | `#F7F5F0` | Arrière-plan principal, espaces de respiration | Écume sur les rochers, crépi blanc de la façade |
| **Granit Léonard** | `#4A4A4A` | Textes courants, éléments structurants | Pierre de granit des encadrements de fenêtres |
| **Ardoise** | `#2D2D2D` | Footer, sections sombres, mode soir | Toits en ardoise de la maison bretonne |

### Couleurs d'accent

| Nom | Hex | Usage | Inspiration |
|-----|-----|-------|-------------|
| **Cognac** | `#A0522D` | Boutons CTA, accents chauds, liens actifs | Cuir cognac des fauteuils du restaurant |
| **Or Chaud** | `#C8956C` | Éléments premium, icônes, filets décoratifs | Lumière dorée des suspensions industrielles |
| **Sable Plage St Anne** | `#E8DFD0` | Fonds secondaires, cartes, sections alternées | Sable de la plage St Anne en contrebas |
| **Hortensia** | `#7B6D8E` | Accent occasionnel, événements spéciaux | Hortensias omniprésents en Bretagne |

### Couleurs fonctionnelles

| Nom | Hex | Usage |
|-----|-----|-------|
| **Succès / Disponible** | `#5A7247` | Boutons de réservation, disponibilité |
| **Alerte / Complet** | `#B85042` | Avertissements, dates complètes |
| **Info** | `#5B8FA8` | Messages informatifs, liens |

### Dégradés

- **Dégradé Horizon** : `#2C5F7C` → `#5B8FA8` → `#F7F5F0` (pour les transitions hero → contenu)
- **Dégradé Crépuscule** : `#C8956C` → `#A0522D` → `#2D2D2D` (pour la section « soirée »)

---

## 3. Typographie

L'association typographique doit refléter le même contraste que le restaurant : un ancrage dans la tradition bretonne avec une touche contemporaine.

### Titres principaux (H1, Hero)

**Playfair Display** — Serif élégante avec personnalité
- Poids : Bold (700) pour les H1, Semi-Bold (600) pour les H2
- Usage : titre du restaurant, nom des sections, hero text
- Raison : évoque la tradition et le raffinement sans être trop formelle, rappelle les enseignes de bistrot

### Titres secondaires (H2, H3)

**DM Sans** — Sans-serif géométrique moderne
- Poids : Medium (500) pour les H3, Bold (700) pour les sous-titres
- Usage : sous-titres, noms de plats, labels de navigation
- Raison : lisibilité, modernité, excellent rendu sur écran

### Corps de texte

**Inter** — Sans-serif humaniste
- Poids : Regular (400) pour le texte, Medium (500) pour l'emphase
- Taille : 16px base, 18px pour les descriptions longues
- Interlignage : 1.6
- Usage : descriptions, paragraphes, informations pratiques
- Raison : lisibilité optimale, excellent support des caractères accentués

### Accent / Écriture

**Caveat** ou **Dancing Script** — Manuscrite décontractée
- Usage TRÈS limité : un mot d'accroche, signature du chef, citation
- Ne jamais utiliser pour des blocs de texte
- Raison : touche personnelle, rappelle l'écriture sur ardoise du restaurant

### Hiérarchie des tailles

```
Hero titre :      48px / 56px (mobile / desktop)
H1 :              36px / 44px
H2 :              28px / 32px
H3 :              22px / 24px
Corps :           16px / 16px
Petite légende :  13px / 14px
Navigation :      15px / 16px (DM Sans Medium, lettres espacées +0.5px)
```

---

## 4. Ambiance visuelle — Mood board textuel

### Atmosphère globale

Imaginez : vous arrivez sur le site et la première chose que vous voyez, c'est cette vue depuis la véranda — l'océan derrière les tables dressées, la lumière naturelle qui se diffuse à travers la verrière, les suspensions noires industrielles qui ponctuent l'espace comme des phares dans la brume.

### Textures et motifs

- **Granit** : texture subtile en arrière-plan de certaines sections (très légère, en opacité 5-8%)
- **Vagues** : motif SVG de vagues douces utilisé comme séparateur entre les sections (au lieu de lignes droites)
- **Ardoise** : effet tableau noir pour la section menu/carte (fond `#2D2D2D` avec typographie craie)
- **Lin/Toile** : texture toile subtile pour les fonds de section « sable »

### Photographie

- **Lumière naturelle** obligatoire — pas de flash ni de filtres saturés
- **Tons chauds** : lumière dorée d'après-midi ou de soirée
- **Profondeur de champ** : flou d'arrière-plan pour les photos de plats, netteté sur le sujet
- **La mer en arrière-plan** : toujours suggérer la vue mer même dans les photos d'intérieur
- **Cadrage** : angles légèrement plongeants pour les plats, perspectives larges pour la terrasse

### Iconographie

- Style : **line icons** fins (stroke 1.5-2px) en `#2C5F7C`
- Thèmes : ancre marine, coquillage, vague, fourchette-couteau, verre à vin, soleil
- Pas de clipart ni d'icônes trop détaillées — rester dans la sobriété

---

## 5. Sections du site et contenu

### 5.1 Hero / Accueil

**Objectif** : immersion immédiate — le visiteur doit « sentir » le restaurant en 3 secondes.

**Visuel** : Photo plein écran (ou vidéo courte en boucle) de la véranda avec vue mer — idéalement la photo FB-06 (terrasse avec suspensions et vue océan) ou le reel IG-05 (coucher de soleil). Overlay léger en dégradé sombre en bas pour la lisibilité du texte.

**Contenu superposé** :
- Logo Quai Ouest
- Accroche : *« Bistronomie face à la mer »* ou *« La Baie de Morlaix dans votre assiette »*
- Sous-titre : *« Restaurant bistronomique — Saint-Pol-de-Léon »*
- CTA principal : « Réserver une table » (bouton Cognac)
- CTA secondaire : « Découvrir la carte » (lien discret)

**Animation** : léger parallaxe au scroll sur la photo hero, le texte reste fixe un instant avant de suivre.

### 5.2 Le Restaurant

**Objectif** : raconter l'histoire, l'ambiance, l'équipe.

**Structure** :
- Introduction : quelques lignes sur la philosophie (produits frais, locaux, faits maison)
- **Deux colonnes alternées** (texte + photo) :
  - La maison : bâtiment de caractère en pierre de granit sur la Plage St Anne (photo FB-02/FB-05)
  - La terrasse : véranda vitrée panoramique sur la Baie de Morlaix (photo FB-06)
  - Le salon : espace lounge avec fauteuils cuir face à la mer (photo FB-07)
  - L'esprit : bistronomie décontractée le midi, ambiance cosy le soir (photo IG-06 lumières)
- Section « L'équipe » : photo du chef/équipe si disponible, courte présentation

**Tonalité** : chaleureuse, accueillante, sans prétention. Laisser parler le lieu.

### 5.3 La Carte / Menus

**Objectif** : donner envie, informer sur les prix, mettre en avant le menu anti-gaspi.

**Structure** :
- **Bandeau d'introduction** : « Une cuisine de saison, entre terre et mer » avec fond ardoise (#2D2D2D)
- **Distinction Midi / Soir** avec un toggle ou des onglets visuels
  - Midi : ambiance lumineuse (fond clair), carte complète + menu du jour + **menu anti-gaspi à 14€** (mise en avant)
  - Soir : ambiance tamisée (fond plus sombre), carte réduite, menus dégustation
- **Catégories** : Entrées, Plats (Mer / Terre), Desserts, Carte des vins
- **Plats signatures** en vedette : côte de bœuf, Saint-Jacques Panko, lieu jaune (avec photo si dispo)
- **Menus événementiels** : section dédiée (Saint-Valentin, Nouvel An, etc.)
- **Note légale** : « Les prix et la carte peuvent évoluer selon les arrivages et la saison »

**Design** : effet ardoise de restaurant pour les titres de catégorie, typographie manuscrite pour les noms de plats.

### 5.4 Galerie Photos

**Objectif** : montrer l'expérience visuelle complète.

**Structure** :
- Grille masonry responsive (3 colonnes desktop, 2 tablette, 1 mobile)
- Intégration du feed Instagram en temps réel (@quaiouest.stpol) via widget ou API
- Catégories filtrables : « Nos plats », « La vue », « L'ambiance », « Événements »
- Lightbox au clic avec navigation
- Lien vers le compte Instagram en bas : « Suivez-nous sur Instagram »

### 5.5 Horaires & Infos pratiques

**Objectif** : répondre aux questions pratiques sans friction.

**Contenu** :
- Horaires d'ouverture : tableau visuel clair (semaine par semaine)
  - Mention des variations saisonnières (été vs automne/hiver)
  - Fermetures annuelles
- Capacité : 60 couverts midi / 15-20 couverts soir (réservation recommandée)
- Accessibilité : accès PMR, parking, animaux acceptés
- Informations pratiques : mode de paiement, tenue (décontractée)

### 5.6 Contact / Réservation

**Objectif** : convertir — transformer le visiteur en client.

**Structure** :
- **CTA de réservation proéminent** : téléphone (02 98 29 08 09), lien réservation en ligne
- Formulaire de contact simple : nom, email, téléphone, message, date souhaitée
- Email : quai.ouest29250@gmail.com
- Liens réseaux sociaux : Instagram, Facebook
- Horaires de réponse
- Widget Google Reviews / TripAdvisor (note moyenne)

### 5.7 Localisation

**Objectif** : faciliter l'accès physique.

**Contenu** :
- Carte interactive (Google Maps / Mapbox) avec pin personnalisé (logo Quai Ouest)
- Adresse complète : 1 Promenade de Penarth, Plage St Anne, 29250 Saint-Pol-de-Léon
- Indications d'accès :
  - Depuis Morlaix (20 min)
  - Depuis Brest (45 min)
  - Depuis Roscoff / Embarcadère Île de Batz (10 min)
- Parking : informations stationnement
- Photo aérienne ou illustration du chemin d'accès

---

## 6. Éléments de design distinctifs

### Le fil conducteur « Ligne d'horizon »

Une ligne horizontale subtile, légèrement ondulée (rappelant l'horizon marin), parcourt le site comme un leitmotiv. Elle sert de séparateur entre les sections, remplaçant les traditionnelles lignes droites. En SVG animé, elle ondule très légèrement au scroll.

### La « Marée » de fond

Le fond du site utilise un dégradé vertical très subtil qui passe du blanc au sable puis au bleu très pâle, comme le reflet de la mer et du ciel sur les murs blancs du restaurant. Cela crée une sensation de profondeur et de mouvement sans être distrayant.

### L'ardoise digitale

La section carte/menu utilise un fond sombre (#2D2D2D) avec une texture d'ardoise très discrète, rappelant les ardoises à menu qu'on voit sur la photo de la terrasse (FB-06). Les titres de catégories sont en Caveat (manuscrite), comme écrits à la craie.

### Le granit en texture

Certaines sections utilisent en arrière-plan une texture de granit gris très diluée (opacité 3-5%), rappelant les murs en pierre du bâtiment. Visible uniquement de près, elle ajoute de la matière sans alourdir.

### Navigation inspirée d'une boussole

Le menu de navigation pourrait intégrer un petit symbole de boussole/rose des vents à côté du logo, renforçant le lien avec la mer et l'orientation. La rose des vents pointe vers l'Ouest (« Quai Ouest »).

---

## 7. Micro-interactions et animations

### Au chargement
- Logo Quai Ouest : apparition douce (fade-in 0.8s + légère translation vers le haut)
- Photo hero : zoom-out subtil (scale de 1.05 à 1.0 sur 2s) — effet cinématographique

### Au scroll
- **Parallaxe doux** : la photo hero défile à 60% de la vitesse du contenu
- **Fade-in progressif** : les sections apparaissent au fur et à mesure (IntersectionObserver, transition 0.4s)
- **Ligne d'horizon animée** : l'ondulation du SVG séparateur s'active quand il entre dans le viewport
- **Photos** : léger effet de zoom (1.0 → 1.03) au survol des vignettes de la galerie

### Interactions utilisateur
- **Bouton « Réserver »** : au survol, le fond passe de Cognac à Or Chaud avec une transition douce (0.3s)
- **Onglets Midi/Soir** : transition couleur de fond (clair vers sombre) avec fondu croisé du contenu
- **Menu mobile** : slide-in depuis la droite avec overlay semi-transparent sur fond (backdrop-blur)
- **Cartes de plats** : légère élévation (box-shadow) au survol
- **Liens de navigation** : soulignement qui « coule » de gauche à droite comme une vague

### Animations de détail
- Icône téléphone : légère rotation au survol (comme un combiné qui sonne)
- Scroll-to-top : bouton en forme de coquillage ou d'ancre
- Loader (si nécessaire) : animation d'une vague minimaliste
- Curseur personnalisé (desktop) : petit cercle avec point central, rappelant un hublot

### Principes d'animation
- **Durée** : 0.2s–0.6s maximum (jamais plus d'1s sauf hero)
- **Easing** : `cubic-bezier(0.25, 0.1, 0.25, 1)` — naturel et fluide
- **Respect des préférences** : `prefers-reduced-motion: reduce` → désactiver toutes les animations
- **Performance** : uniquement `transform` et `opacity` pour les animations (pas de layout shifts)

---

## 8. Responsive & Mobile

- **Mobile-first** : 70%+ du trafic restaurant est mobile
- **Breakpoints** : 375px (mobile), 768px (tablette), 1024px (desktop), 1440px (large)
- **Navigation mobile** : hamburger menu avec logo centré
- **Hero mobile** : photo recadrée en portrait (focus sur la vue mer et une table)
- **Carte/Menu** : format accordéon plutôt qu'onglets sur mobile
- **Bouton réservation flottant** : sticky en bas de l'écran sur mobile (téléphone + réservation)
- **Galerie** : défilement horizontal (swipe) plutôt que grille sur mobile

---

## 9. Résumé de l'identité visuelle

```
QUAI OUEST — Bistronomie face à la mer

Palette    : Bleu Baie (#2C5F7C) · Blanc Écume (#F7F5F0) · Granit (#4A4A4A)
             Ardoise (#2D2D2D) · Cognac (#A0522D) · Or Chaud (#C8956C)
Typo       : Playfair Display (titres) · DM Sans (sous-titres) · Inter (corps)
Ambiance   : Lumière côtière · Warm minimalism · Granit et bois · Vue mer
Mots-clés  : Authenticité · Terroir · Horizon · Convivialité · Saison
```
