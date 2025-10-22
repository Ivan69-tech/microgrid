# Microgrid Dashboard - Version Web Moderne

Dashboard moderne pour la simulation d'un EMS off grid, développé avec **FastAPI + React + TypeScript**.

## 🚀 Technologies

- **Backend** : FastAPI (Python)
- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Graphiques** : Recharts
- **Containerisation** : Docker + Docker Compose

## 📁 Structure du projet

```
microgrid/
├── web-backend/           # API FastAPI
│   ├── main.py           # Application principale
│   ├── requirements.txt  # Dépendances Python
│   └── Dockerfile       # Image Docker backend
├── web-frontend/         # Application React
│   ├── src/              # Code source React
│   │   ├── components/   # Composants réutilisables
│   │   ├── services/     # Services API
│   │   ├── types/        # Types TypeScript
│   │   └── App.tsx       # Composant principal
│   ├── package.json      # Dépendances Node.js
│   └── Dockerfile       # Image Docker frontend
├── controller/           # Backend EMS existant
└── docker-compose-web.yaml # Orchestration Docker
```

## 🎯 Fonctionnalités

### Identiques au dashboard Streamlit

- ✅ **Monitoring temps réel** : Données EMS avec refresh automatique
- ✅ **Contrôles PV** : Automatique, simulation ciel clair, manuel
- ✅ **Configuration système** : Paramètres BESS, Genset, PV
- ✅ **Graphiques** : Courbes de puissance et SOC
- ✅ **Status réseau** : Indicateur blackout/réseau stable
- ✅ **Interface intuitive** : Même logique que Streamlit

### Améliorations modernes

- 🚀 **Performance** : React + FastAPI plus rapides
- 📱 **Responsive** : Interface adaptative mobile/desktop
- 🎨 **Design moderne** : Tailwind CSS avec gradients
- 🔧 **Maintenabilité** : TypeScript + composants modulaires
- 🐳 **Déploiement** : Docker multi-stage optimisé

## 🛠️ Installation et utilisation

### Option 1 : Docker Compose (Recommandé)

```bash
# Démarrer tous les services
docker-compose -f docker-compose-web.yaml up --build

# Accéder au dashboard
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
# EMS: http://localhost:8001
```

### Option 2 : Développement local

#### Backend

```bash
cd web-backend
pip install -r requirements.txt
python main.py
```

#### Frontend

```bash
cd web-frontend
npm install
npm start
```

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`.env`):

```
REACT_APP_API_URL=http://localhost:3000/api
```

**Backend** (dans `main.py`):

```python
EMS_HOST = "http://ems:8000"  # URL du système EMS
```

## 📊 API Endpoints

| Méthode | Endpoint              | Description              |
| ------- | --------------------- | ------------------------ |
| `GET`   | `/api/status`         | Statut du système        |
| `POST`  | `/api/restart`        | Redémarrage EMS          |
| `POST`  | `/api/setpvp`         | Configuration PV/charge  |
| `POST`  | `/api/setconf`        | Configuration système    |
| `POST`  | `/api/controlpv`      | Contrôle PV automatique  |
| `POST`  | `/api/simulatepv`     | Simulation PV ciel clair |
| `POST`  | `/api/manual_control` | Contrôle manuel          |

## 🎨 Interface utilisateur

### Composants principaux

- **StatusCard** : Affichage des valeurs système
- **PowerChart** : Graphiques de puissance (BESS, Genset, PV, Load)
- **SOCChart** : Graphique du SOC de la batterie
- **ControlPanel** : Panneau de contrôle avec toggles et formulaires
- **SystemInfoCard** : Informations de configuration

### Design

- **Couleurs** : Palette moderne avec gradients
- **Responsive** : Grid adaptatif mobile/desktop
- **Animations** : Transitions fluides et hover effects
- **Accessibilité** : Contraste et navigation clavier

## 🔄 Migration depuis Streamlit

### Avantages de la version web

1. **Performance** : React plus rapide que Streamlit
2. **Maintenabilité** : Code modulaire et typé
3. **Déploiement** : Docker multi-stage optimisé
4. **Scalabilité** : Architecture microservices
5. **Review** : Code plus facile à reviewer

### Compatibilité

- ✅ **Même logique métier** : Identique au Streamlit
- ✅ **Mêmes contrôles** : Tous les toggles et formulaires
- ✅ **Mêmes graphiques** : Courbes identiques avec Recharts
- ✅ **Même backend** : Utilise le même système EMS

## 🚀 Déploiement en production

### Optimisations Docker

- **Multi-stage build** : Images optimisées
- **Nginx** : Serveur web performant
- **Static files** : Cache des assets
- **Health checks** : Monitoring des services

### Sécurité

- **CORS** : Configuration restrictive en production
- **HTTPS** : Certificats SSL/TLS
- **Environment variables** : Secrets externalisés

## 📈 Monitoring et logs

```bash
# Logs des services
docker-compose -f docker-compose-web.yaml logs -f

# Logs spécifiques
docker-compose -f docker-compose-web.yaml logs -f web-frontend
docker-compose -f docker-compose-web.yaml logs -f web-backend
```

## 🔧 Développement

### Hot reload

```bash
# Frontend en mode développement
cd web-frontend
npm start

# Backend en mode développement
cd web-backend
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

### Tests

```bash
# Tests frontend
cd web-frontend
npm test

# Tests backend
cd web-backend
pytest
```

## 📝 Notes de développement

- **TypeScript** : Typage strict pour éviter les erreurs
- **Composants** : Architecture modulaire et réutilisable
- **API** : Interface REST claire et documentée
- **Docker** : Images optimisées et sécurisées
- **CI/CD** : Prêt pour l'intégration continue

Cette version web moderne offre les mêmes fonctionnalités que votre dashboard Streamlit, mais avec une architecture plus
maintenable et performante, parfaite pour le review et le déploiement en production.
