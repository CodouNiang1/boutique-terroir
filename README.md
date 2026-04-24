# 🌿 Boutique Terroir Local

E-commerce pour une coopérative agricole — Projet MongoDB / FastAPI / React

## Architecture

```
boutique-terroir/
├── backend/              → FastAPI + Motor (MongoDB async) — port 8000
├── frontend-client/      → React (Vite) — port 3000
├── frontend-admin/       → React (Vite) — port 3001
└── docker-compose.yml    → Orchestration complète
```

## 🚀 Lancement (Docker)

```bash
# 1. Cloner / se placer dans le projet
cd boutique-terroir

# 2. Lancer tout l'environnement
docker-compose up --build

# 3. Accès
# Boutique client  → http://localhost:3000
# Panel admin      → http://localhost:3001
# API (docs)       → http://localhost:8000/docs
# MongoDB          → localhost:27017
```

## 🛑 Arrêter

```bash
docker-compose down          # Arrêter
docker-compose down -v       # Arrêter + supprimer les données MongoDB
```

## 🔧 Développement local (sans Docker)

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Client
```bash
cd frontend-client
npm install
npm run dev    # http://localhost:5173
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev    # http://localhost:5174
```

## 📋 Fonctionnalités

### Côté Client
- Catalogue produits avec filtres par catégorie et recherche
- Affichage du stock (rupture, faible stock)
- Panier avec ajout/suppression/modification quantité
- Simulation de commande avec décrémentation du stock
- Affichage des produits les plus vendus (bonus)

### Côté Admin
- Dashboard avec KPIs (CA total, nb commandes, ruptures)
- Graphique CA par catégorie (Recharts)
- Top 5 produits vendus
- Gestion complète des produits (CRUD)
- Historique des commandes avec filtre par client
- Détail de chaque commande expandable

### Automatique
- 15 produits seedés au démarrage (si collection vide)
- 1 commande aléatoire générée toutes les 60 secondes

## 📡 Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /products | Liste des produits |
| GET | /products/{id} | Un produit |
| GET | /products/admin/low-stock | Stock < 5 |
| POST | /products | Créer un produit |
| PUT | /products/{id} | Modifier un produit |
| DELETE | /products/{id} | Supprimer un produit |
| POST | /orders | Passer une commande |
| GET | /orders | Toutes les commandes |
| GET | /orders/client/{nom} | Commandes d'un client |
| GET | /orders/stats/ca-par-categorie | CA agrégé |
| GET | /orders/stats/top-produits | Top 5 produits |
