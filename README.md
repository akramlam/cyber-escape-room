# CyberEscape Room

Une plateforme éducative interactive pour l'apprentissage de la cybersécurité à travers des scénarios immersifs en 3D.

## Structure du Projet

- `backend/` : API Django et logique métier
- `frontend/` : Application React avec Three.js pour le rendu 3D

## Prérequis

- Python 3.8+
- Node.js 16+
- PostgreSQL

## Installation

### Backend

1. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Configurer la base de données :
```bash
python manage.py migrate
```

### Frontend

1. Installer les dépendances :
```bash
cd frontend
npm install
```

2. Lancer l'application :
```bash
npm start
```

## Fonctionnalités

- Scénarios d'apprentissage immersifs en 3D
- Différents types de cybermenaces simulées
- Système de progression et de récompenses
- Tableau de bord des performances
- Interface administrative pour la gestion des contenus
