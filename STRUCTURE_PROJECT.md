# 📚 Structure du Projet Lybrairis

## 🎯 Vue d'ensemble
**Lybrairis** est une application de gestion de bibliothèque construite avec **React** et **Vite**. Elle offre une interface complète pour gérer les livres, auteurs, inventaire et analyser les données.

---

## 📁 Architecture Générale

### Structure Racine
```
lybrairis/
├── src/                    # Code source React (Frontend)
├── backend/               # Code serveur (Backend)
├── public/                # Fichiers publics statiques
├── node_modules/          # Dépendances npm
├── package.json           # Dépendances Frontend
├── vite.config.js         # Configuration Vite
├── eslint.config.js       # Configuration ESLint
├── index.html             # Point d'entrée HTML
└── README.md              # Documentation du projet
```

---

## 🎨 Frontend (src/)

### 📋 Pages (src/pages/)
Les pages principales de l'application :

- **`auth/`** - Authentification
  - `Login.jsx` - Page de connexion

- **`dashboard/`** - Tableau de bord principal
  - `Dashboard.jsx` - Vue d'ensemble des statistiques

- **`library/`** - Gestion de la bibliothèque
  - `Library.jsx` - Catalogue des livres
  - `inventory.jsx` - Vue d'inventaire global
  - `GestionInventaire.jsx` - Gestion de l'inventaire
  - `Editeurs.jsx` - Gestion des éditeurs

- **`authors/`** - Gestion des auteurs
  - `Auteurs.jsx` - Liste et gestion des auteurs

- **`analytics/`** - Analyses et statistiques
  - `Analytics.jsx` - Rapports et graphiques

- **`profile/`** - Profil utilisateur
  - `Profile.jsx` - Gestion du profil utilisateur

### 🧩 Composants (src/components/)

- **`Layout/`** - Composants de mise en page
  - `Sidebar.jsx` - Barre latérale de navigation
  - `Topbar.jsx` - Barre supérieure d'en-tête

- **`ui/`** - Composants UI réutilisables
  - `Modal.jsx` - Fenêtre modale
  - `StateCard.jsx` - Carte de statistiques

### 🎭 Contexts (src/contexts/)
- `DataContext.jsx` - Contexte global pour gérer l'état des données

### 🪝 Hooks (src/hooks/)
Dossier pour les hooks personnalisés React

### 🛣️ Routes (src/routes/)
- `AppRoutes.jsx` - Configuration de toutes les routes de l'application
  - Routes publiques : `/login`
  - Routes protégées : `/`, `/dashboard`, `/library`, `/inventory`, etc.

### 🔧 Services (src/services/)
- `storage.js` - Gestion du stockage local et authentification

### 🎨 Styles (src/styles/)
- `globals.css` - Styles globaux de l'application

### 📄 Fichiers Principaux
- `App.jsx` - Composant racine
- `main.jsx` - Point d'entrée JavaScript
- `App.css` - Styles du composant App
- `index.css` - Styles de base

---

## ⚙️ Backend (backend/)

### Structure
```
backend/
├── server.js           # Serveur Express principal
├── package.json        # Dépendances Backend
├── .env               # Variables d'environnement
├── config/            # Configuration (BD, variables globales)
├── controllers/       # Logique métier (handlers des routes)
├── models/            # Modèles de données (Schemas)
├── routes/            # Définition des routes API
└── middleware/        # Middlewares personnalisés
```

---

## 🔌 Dépendances Principales

### Frontend (React)
```json
{
  "dependencies": {
    "react": "^19.2.6",                    // Librairie React
    "react-dom": "^19.2.6",                // Rendu React
    "react-router-dom": "^7.16.0",         // Routage
    "axios": "^1.17.0",                    // Requêtes HTTP
    "tailwindcss": "^4.3.0",               // Framework CSS
    "@tailwindcss/vite": "^4.3.0",         // Intégration Vite
    "framer-motion": "^12.40.0",           // Animations
    "react-hook-form": "^7.77.0",          // Gestion des formulaires
    "recharts": "^3.8.1",                  // Graphiques
    "react-hot-toast": "^2.6.0",           // Notifications
    "lucide-react": "^1.17.0",             // Icônes
    "zod": "^4.4.3"                        // Validation de schémas
  }
}
```

---

## 🚀 Scripts Disponibles

### Développement
```bash
npm run dev          # Lancer le serveur de développement Vite
```

### Production
```bash
npm run build        # Construire l'application pour la production
npm run preview      # Prévisualiser la build
```

### Qualité du code
```bash
npm run lint         # Vérifier et corriger le code avec ESLint
```

---

## 🔐 Système d'Authentification

- Les utilisateurs se connectent via `/login`
- Stockage des données d'authentification via `storage.js`
- Routes protégées avec `PrivateRoute` qui redirige vers login si non authentifié
- Gestion centralisée de l'utilisateur via `DataContext`

---

## 🎨 Design & UI

- **Framework CSS** : Tailwind CSS v4
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Notifications** : React Hot Toast
- **Formulaires** : React Hook Form avec validation Zod

---

## 📡 Communication Frontend-Backend

- **HTTP Client** : Axios pour les requêtes API
- **Patterns** : RESTful API
- **Gestion d'état** : React Context API

---

## 📂 Organisation des Fichiers

| Dossier | Responsabilité |
|---------|--------------|
| `/src/pages` | Pages/écrans complètes |
| `/src/components` | Composants réutilisables |
| `/src/contexts` | État global (Context API) |
| `/src/services` | Logique métier, appels API |
| `/src/routes` | Configuration du routage |
| `/src/styles` | Styles CSS globaux |
| `/backend` | API REST et logique serveur |

---

## 🔄 Flux d'Application

1. **Démarrage** : `main.jsx` → `App.jsx` → `AppRoutes.jsx`
2. **Wrapper Global** : `DataProvider` enveloppe toute l'application
3. **Routage** : Routes protégées par `PrivateRoute`
4. **Composants** : Pages composées de composants réutilisables
5. **Communication** : Services axios + Context API

---

## ✅ Points Clés

- ✅ Application fullstack (Frontend React + Backend Node)
- ✅ Authentification avec routes protégées
- ✅ Gestion d'état centralisée (Context)
- ✅ Design responsive avec Tailwind CSS
- ✅ Animations fluides avec Framer Motion
- ✅ Formulaires validés avec Zod
- ✅ Graphiques d'analyse avec Recharts

---

*Documentation générée pour Lybrairis - Système de Gestion de Bibliothèque*
