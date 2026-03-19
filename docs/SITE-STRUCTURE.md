# Structure du Site — Quai Ouest

> Version 1.0 — 19 mars 2026

---

## 1. Sitemap

```
quai-ouest.fr/
│
├── / ............................ Page d'accueil (one-page principale)
│   ├── #hero ................... Section Hero / Accueil
│   ├── #restaurant ............. Section Le Restaurant
│   ├── #carte .................. Section La Carte / Menus
│   ├── #galerie ................ Section Galerie Photos
│   ├── #infos .................. Section Horaires & Infos pratiques
│   ├── #contact ................ Section Contact / Réservation
│   └── #localisation ........... Section Localisation
│
├── /carte ...................... Page dédiée Carte complète (optionnel)
│   ├── /carte#midi ............. Carte du midi
│   └── /carte#soir ............. Carte du soir
│
├── /evenements ................. Page Événements & Menus spéciaux
│   └── /evenements/saint-valentin .. Exemple : menu Saint-Valentin
│
├── /mentions-legales ........... Mentions légales
├── /politique-confidentialite .. Politique de confidentialité
└── /plan-du-site ............... Plan du site (SEO)
```

### Architecture de navigation

**Navigation principale (header)** :
`Le Restaurant` · `La Carte` · `Galerie` · `Infos` · `Contact` · **[Réserver]**

**Navigation footer** :
`Mentions légales` · `Politique de confidentialité` · `Plan du site` · `Instagram` · `Facebook`

---

## 2. Wireframes textuels

### 2.1 Header / Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo QO]    Le Restaurant  La Carte  Galerie  Infos      │
│                                            Contact  [RÉSERVER] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Comportement** :
- Fixe en haut de page, fond transparent sur le hero → fond blanc avec ombre au scroll
- Logo à gauche, liens centrés, bouton CTA « Réserver » à droite (fond Cognac)
- Mobile : logo centré, hamburger à droite, bouton téléphone à gauche

**Header mobile** :
```
┌─────────────────────────────┐
│  📞   [Logo Quai Ouest]  ☰  │
└─────────────────────────────┘
```

---

### 2.2 Section Hero

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              [PHOTO PLEIN ÉCRAN — VÉRANDA VUE MER]          │
│                                                             │
│                    ───── Logo ─────                         │
│                                                             │
│              « Bistronomie face à la mer »                  │
│                                                             │
│         Restaurant bistronomique — Saint-Pol-de-Léon        │
│               Plage St Anne, Baie de Morlaix                │
│                                                             │
│        [ Réserver une table ]    Découvrir la carte →       │
│                                                             │
│                         ▼ (scroll indicator)                │
└─────────────────────────────────────────────────────────────┘
```

**Notes** :
- Photo : FB-06 (véranda vue mer) ou vidéo loop du reel IG-05 (coucher de soleil)
- Overlay dégradé sombre en bas (rgba(0,0,0,0.3) → transparent)
- Hauteur : 100vh (plein écran)
- Flèche de scroll animée en bas

---

### 2.3 Section Le Restaurant

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     Le Restaurant                           │
│            ~~~~~~~~ (vague SVG) ~~~~~~~~                    │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │                  │  │                                  │ │
│  │   [Photo façade  │  │  Une maison de granit, les pieds │ │
│  │    FB-02/FB-05]  │  │  dans le sable...                │ │
│  │                  │  │                                  │ │
│  │                  │  │  Le Quai Ouest vous accueille    │ │
│  │                  │  │  dans un bâtiment de caractère   │ │
│  │                  │  │  face à la Baie de Morlaix.      │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────┐ │
│  │                                  │  │                  │ │
│  │  Le midi, notre véranda vitrée   │  │  [Photo terrasse │ │
│  │  baignée de lumière accueille    │  │   FB-06]         │ │
│  │  60 convives face à l'océan.     │  │                  │ │
│  │                                  │  │                  │ │
│  │  Le soir, l'ambiance se fait     │  │                  │ │
│  │  plus intime, chandelles et      │  │                  │ │
│  │  lumière tamisée pour 15 à 20    │  │                  │ │
│  │  couverts privilégiés.           │  │                  │ │
│  └──────────────────────────────────┘  └──────────────────┘ │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │                  │  │                                  │ │
│  │   [Photo lounge  │  │  Notre salon, avec ses fauteuils │ │
│  │    FB-07]        │  │  face aux fenêtres panoramiques, │ │
│  │                  │  │  est l'endroit rêvé pour un      │ │
│  │                  │  │  cocktail avant le dîner.        │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │         « Produits frais, locaux et faits maison »      ││
│  │                                                         ││
│  │   🐟 Poissons du jour     🥬 Légumes de saison         ││
│  │   🧀 Fromages locaux      🍷 Vins de terroir           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Section La Carte / Menus

```
┌─────────────────────────────────────────────────────────────┐
│                        [FOND ARDOISE]                       │
│                                                             │
│                        La Carte                             │
│              Une cuisine de saison,                         │
│                entre terre et mer                           │
│                                                             │
│         ┌─────────────┐  ┌─────────────┐                   │
│         │  ☀️  MIDI    │  │  🌙  SOIR   │  ← Toggle        │
│         └─────────────┘  └─────────────┘                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  ⭐ MENU ANTI-GASPI — à partir de 14€                  ││
│  │  Entrée + Plat ou Plat + Dessert                        ││
│  │  (Mercredi au vendredi midi)                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ── Entrées ──────────────────────────────────────────────  │
│                                                             │
│  Noix de Saint-Jacques Panko                                │
│  au miel et clémentine .......................... 16€       │
│                                                             │
│  Pressé de Foie Gras Maison                                 │
│  Glace Artisanale à l'oignon .................... 18€       │
│                                                             │
│  ── Plats ────────────────────────────────────────────────  │
│                                                             │
│  ┌────────────────────┐                                     │
│  │ [Photo côte bœuf   │  Côte de Bœuf (à partir de 1,5kg) │
│  │  IG-04]            │  Frites maison et sauces           │
│  │                    │  Pour 2 personnes ............ XX€  │
│  └────────────────────┘                                     │
│                                                             │
│  Filet de Lieu jaune cuit sur peau                          │
│  Coulis crustacés, légumes de saison ............ XX€       │
│                                                             │
│  Médaillon de canard, farce fine                            │
│  aux morilles, Pomme Anna ....................... XX€       │
│                                                             │
│  ── Desserts ─────────────────────────────────────────────  │
│                                                             │
│  Tentation aux fruits rouges                                │
│  sur biscuit à la pistache ...................... XX€       │
│                                                             │
│  Choux crème diplomate au chocolat                          │
│  Tuile sarrazin, Glace Vanille .................. XX€       │
│                                                             │
│  ── Pizzas 🍕 ───────────────────────────────────────────── │
│  (Disponibles le midi)                                      │
│                                                             │
│  [Liste des pizzas...]                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  📋 Télécharger la carte complète (PDF)                 ││
│  │  ℹ️ Carte susceptible d'évoluer selon les arrivages     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Mode Soir** (quand on bascule) :
- Le fond passe du gris ardoise au noir doux
- Couleurs d'accent : Or Chaud au lieu de Cognac
- Carte plus courte, menus dégustation mis en avant
- Ambiance « lumière tamisée » dans les photos

---

### 2.5 Section Galerie Photos

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      Galerie                                │
│                                                             │
│   [Tous]  [Nos plats]  [La vue]  [L'ambiance]  [Events]    │
│                                                             │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│   │          │ │          │ │          │                     │
│   │  Photo   │ │  Photo   │ │  Photo   │                    │
│   │  grande  │ │  moyenne │ │  moyenne │                    │
│   │          │ │          │ │          │                     │
│   │          │ ├──────────┤ ├──────────┤                    │
│   │          │ │          │ │          │                     │
│   ├──────────┤ │  Photo   │ │  Photo   │                    │
│   │          │ │          │ │  grande  │                     │
│   │  Photo   │ │          │ │          │                     │
│   │          │ │          │ │          │                     │
│   └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│            [ Voir plus ] ou scroll infini                    │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  📸 Suivez-nous sur Instagram @quaiouest.stpol      │   │
│   │  [Feed Instagram en temps réel — derniers 6 posts]  │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.6 Section Horaires & Infos pratiques

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  Horaires & Infos                            │
│                                                             │
│  ┌────────────────────────────┐  ┌────────────────────────┐ │
│  │  📅 HORAIRES D'OUVERTURE   │  │  📌 BON À SAVOIR       │ │
│  │                            │  │                        │ │
│  │  Lundi ......... Fermé     │  │  🍽️ 60 couverts (midi)  │ │
│  │  Mardi ......... Fermé     │  │  🕯️ 15-20 couverts     │ │
│  │  Mercredi ... 12h–14h      │  │     (soir, intimiste)  │ │
│  │  Jeudi ...... 12h–14h      │  │                        │ │
│  │             19h–21h30      │  │  ♿ Accès PMR           │ │
│  │  Vendredi .. 12h–14h       │  │  🅿️ Parking gratuit     │ │
│  │             19h–21h30      │  │  🐕 Animaux acceptés    │ │
│  │  Samedi .... 12h–14h       │  │  💳 CB acceptée         │ │
│  │             19h–21h30      │  │                        │ │
│  │  Dimanche .. 12h–14h       │  │  📞 Réservation         │ │
│  │                            │  │     conseillée le soir │ │
│  │  ⚠️ Horaires susceptibles   │  │                        │ │
│  │  de varier selon saison    │  │                        │ │
│  └────────────────────────────┘  └────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │          ⭐ Menu Anti-Gaspi à partir de 14€             ││
│  │     Entrée + Plat ou Plat + Dessert — du mer. au ven.  ││
│  │              Le midi uniquement                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.7 Section Contact / Réservation

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                 Réservez votre table                         │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │                          │  │                          │ │
│  │  📞 02 98 29 08 09       │  │  FORMULAIRE DE CONTACT   │ │
│  │  (Appeler directement)   │  │                          │ │
│  │                          │  │  Nom : [____________]    │ │
│  │  📧 quai.ouest29250      │  │  Email : [___________]   │ │
│  │     @gmail.com           │  │  Tél : [____________]    │ │
│  │                          │  │  Date : [📅__________]   │ │
│  │  ┌────────┐ ┌────────┐  │  │  Nb pers. : [___]       │ │
│  │  │ Insta  │ │  Face  │  │  │  Midi ○  Soir ○          │ │
│  │  └────────┘ └────────┘  │  │  Message :               │ │
│  │                          │  │  [___________________]   │ │
│  │  ┌──────────────────┐   │  │  [___________________]   │ │
│  │  │  ⭐ 4.5/5        │   │  │                          │ │
│  │  │  503 avis        │   │  │  [ Envoyer ma demande ]  │ │
│  │  │  TripAdvisor     │   │  │                          │ │
│  │  └──────────────────┘   │  │                          │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.8 Section Localisation

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Comment venir                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │              [CARTE INTERACTIVE]                         ││
│  │              Google Maps / Mapbox                        ││
│  │                                                         ││
│  │          📍 Pin personnalisé (logo QO)                   ││
│  │                                                         ││
│  │              Vue satellite + terrain                     ││
│  │              Zoom sur Plage St Anne                      ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  🚗 En      │ │  🚢 Depuis  │ │  🚌 Transport│           │
│  │  voiture    │ │  Roscoff    │ │  en commun  │           │
│  │             │ │             │ │             │           │
│  │  Depuis     │ │  10 min     │ │  Ligne bus  │           │
│  │  Morlaix :  │ │  par la     │ │  ou car     │           │
│  │  20 min     │ │  côte       │ │  depuis     │           │
│  │  (D58)      │ │             │ │  Morlaix    │           │
│  │             │ │  Depuis     │ │             │           │
│  │  Depuis     │ │  l'Île de   │ │             │           │
│  │  Brest :    │ │  Batz :     │ │             │           │
│  │  45 min     │ │  ferry +    │ │             │           │
│  │  (N12)      │ │  10 min     │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  1 Promenade de Penarth — Plage St Anne                     │
│  29250 Saint-Pol-de-Léon — Finistère, Bretagne              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.9 Footer

```
┌─────────────────────────────────────────────────────────────┐
│  [FOND ARDOISE #2D2D2D]                                     │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │              │ │              │ │                      │ │
│  │  [Logo QO]   │ │  Navigation  │ │  Contact             │ │
│  │              │ │              │ │                      │ │
│  │  Bistronomie │ │  Le Restaur. │ │  📞 02 98 29 08 09   │ │
│  │  face à la   │ │  La Carte    │ │  📧 quai.ouest29250  │ │
│  │  mer         │ │  Galerie     │ │     @gmail.com       │ │
│  │              │ │  Infos       │ │                      │ │
│  │              │ │  Contact     │ │  📍 1 Prom. Penarth  │ │
│  │              │ │  Réserver    │ │  29250 St-Pol-de-L.  │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                             │
│  ─── (ligne d'horizon SVG) ─────────────────────────────── │
│                                                             │
│  © 2026 Quai Ouest · Mentions légales · Confidentialité     │
│  Réalisation : [Crédit]        [Instagram] [Facebook]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Flux utilisateur principal

```
Arrivée sur le site
       │
       ▼
    [Hero]  ──→  Impression « wow » en 3 secondes
       │
       ├── CTA « Réserver » ──→ Section Contact (ancre #contact)
       │
       ├── CTA « La carte » ──→ Section Carte (ancre #carte)
       │
       ▼
  [Le Restaurant]  ──→  Comprendre le lieu, l'ambiance
       │
       ▼
    [La Carte]  ──→  Voir les plats, les prix, le menu anti-gaspi
       │
       ▼
    [Galerie]  ──→  Envie visuelle renforcée
       │
       ▼
  [Horaires & Infos]  ──→  Vérifier disponibilité
       │
       ▼
  [Contact / Réserver]  ──→  CONVERSION : réservation ou appel
       │
       ▼
  [Localisation]  ──→  Planifier la venue
```

**Objectif conversion** : chaque section doit contenir un lien/bouton « Réserver » accessible sans scroll excessif. Le bouton flottant sur mobile garantit un accès permanent.

---

## 4. SEO & Performance

### Balises meta essentielles
```html
<title>Quai Ouest — Restaurant Bistronomique face à la mer | Saint-Pol-de-Léon</title>
<meta name="description" content="Restaurant bistronomique sur la Plage St Anne à Saint-Pol-de-Léon. Cuisine de saison, produits frais et locaux, vue panoramique sur la Baie de Morlaix. Menu anti-gaspi dès 14€. Réservation : 02 98 29 08 09.">
```

### Données structurées (Schema.org)
- Type : `Restaurant`
- Adresse, téléphone, horaires, coordonnées GPS
- Menu (lien vers PDF ou page /carte)
- Avis agrégés (TripAdvisor, Google)
- Photos (OpenGraph pour partage réseaux sociaux)

### Performance
- Images : format WebP avec fallback JPEG, lazy loading
- Fonts : preload des polices principales (Playfair Display, Inter)
- Vidéo hero : chargement différé, poster image en premier
- Objectif : Core Web Vitals au vert (LCP < 2.5s, CLS < 0.1)
