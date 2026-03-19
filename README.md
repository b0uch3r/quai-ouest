# Le Quai Ouest — Site Vitrine

> Site web vitrine pour le restaurant bistronomique **Le Quai Ouest**, situé sur la Promenade de Penarth à Saint-Pol-de-Léon (Finistère, Bretagne), avec vue panoramique sur la Baie de Morlaix.

---

## Présentation du projet

Ce projet vise à créer un **site vitrine moderne et professionnel** pour le restaurant Le Quai Ouest. Le site mettra en valeur l'identité du restaurant — cuisine bistronomique, produits frais et locaux, cadre exceptionnel face à la mer — tout en offrant une expérience utilisateur fluide et responsive.

### Objectifs principaux

- **Visibilité en ligne** : offrir une présence web professionnelle au restaurant
- **Intégration Instagram** : récupérer et afficher le flux Instagram (@quaiouest.stpol) pour alimenter automatiquement la galerie photos, les menus et les actualités
- **Informations pratiques** : horaires, localisation, contact, réservation
- **Image de marque** : refléter l'ambiance bistronomique et le cadre maritime breton

### Périmètre

Le site comprendra les sections suivantes :
- Page d'accueil avec hero visuel et présentation
- Galerie photos (alimentée par Instagram)
- Menu / Carte du restaurant
- Horaires et informations pratiques
- Formulaire de contact et réservation
- Localisation (carte interactive)

## Informations restaurant

| Donnée | Valeur |
|---|---|
| **Nom** | Quai Ouest |
| **Adresse** | 1 Promenade de Penarth, 29250 Saint-Pol-de-Léon |
| **Téléphone** | 02 98 29 08 09 |
| **Email** | quai.ouest29250@gmail.com |
| **Instagram** | [@quaiouest.stpol](https://www.instagram.com/quaiouest.stpol?igsh=MXJyOWFvcWxqNms2bw==) |
| **Facebook** | [Quai Ouest](https://www.facebook.com/p/Quai-Ouest-100068821471690/) |
| **Cuisine** | Bistronomique, fruits de mer, produits locaux bretons |
| **Capacité** | Jusqu'à 80 couverts |
| **Services** | Terrasse, Click & Collect, menu végétarien, accès PMR |

## Structure du projet

```
QUAI-OUEST/
├── README.md                  # Ce fichier
├── TODO.md                    # Suivi des tâches par phase
├── docs/
│   ├── SPECS.md               # Cahier des charges
│   ├── ARCHITECTURE.md        # Architecture technique
│   └── INSTAGRAM-STRATEGY.md  # Stratégie récupération Instagram
├── src/
│   ├── components/            # Composants réutilisables
│   ├── pages/                 # Pages du site
│   ├── styles/                # Feuilles de style / thème
│   ├── utils/                 # Utilitaires et helpers
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Services (API Instagram, etc.)
│   └── assets/
│       ├── images/            # Images et photos
│       ├── icons/             # Icônes
│       └── fonts/             # Polices personnalisées
├── public/                    # Fichiers statiques
├── scripts/                   # Scripts utilitaires (scraping, build, etc.)
├── config/                    # Configuration (env, API keys, etc.)
└── .github/                   # CI/CD workflows
```

## Stack technique envisagée

- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS
- **CMS / Contenu** : Headless (Instagram API + Markdown)
- **Déploiement** : Vercel
- **Instagram** : Meta Graph API / solution hybride

## Statut

**Phase actuelle : Initialisation du projet**

---

*Projet initié le 19 mars 2026*
