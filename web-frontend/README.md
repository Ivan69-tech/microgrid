# Microgrid Dashboard - Frontend React

Dashboard moderne pour la simulation d'un EMS off grid, développé avec React + TypeScript + Tailwind CSS.

## Fonctionnalités

- **Monitoring en temps réel** : Affichage des données du système EMS avec refresh automatique
- **Contrôles avancés** : Gestion du PV, simulation ciel clair, contrôle manuel
- **Graphiques interactifs** : Courbes de puissance et SOC avec Recharts
- **Interface moderne** : Design responsive avec Tailwind CSS
- **API REST** : Communication avec le backend FastAPI

## Structure

```
src/
├── components/          # Composants React réutilisables
│   ├── StatusCard.tsx   # Cartes d'affichage des statuts
│   ├── PowerChart.tsx   # Graphique des puissances
│   ├── SOCChart.tsx     # Graphique du SOC
│   └── ControlPanel.tsx # Panneau de contrôle
├── services/            # Services API
│   └── api.ts          # Client API avec axios
├── types/              # Types TypeScript
│   └── index.ts        # Interfaces du système
└── App.tsx             # Composant principal
```

## Technologies

- **React 18** : Framework frontend
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **Recharts** : Bibliothèque de graphiques
- **Axios** : Client HTTP
- **FastAPI** : Backend API (séparé)

## Installation et développement

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm start

# Build pour production
npm run build
```

## Docker

```bash
# Build de l'image
docker build -t microgrid-frontend .

# Ou avec docker-compose
docker-compose -f docker-compose-web.yaml up --build
```

## API Endpoints

Le frontend communique avec le backend via les endpoints suivants :

- `GET /api/status` - Statut du système
- `POST /api/restart` - Redémarrage EMS
- `POST /api/setpvp` - Configuration PV/charge
- `POST /api/setconf` - Configuration système
- `POST /api/controlpv` - Contrôle PV automatique
- `POST /api/simulatepv` - Simulation PV ciel clair
- `POST /api/manual_control` - Contrôle manuel

## Configuration

L'URL de l'API est configurée via la variable d'environnement `REACT_APP_API_URL` (défaut: `http://localhost:3000/api`).
