# ExpoCarrelage — Gestion de salle d'exposition

Application web interne pour la gestion d'une salle d'exposition de carrelage.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** pour le style
- **Prisma ORM** + **PostgreSQL**
- **iron-session** pour l'authentification
- **Déploiement** : Railway.app

---

## Installation locale

### Prérequis
- Node.js 18+
- PostgreSQL installé localement (ou Docker)

### Étapes

```bash
# 1. Cloner le repo
git clone <URL_DU_REPO>
cd "salle expo"

# 2. Installer les dépendances
npm install

# 3. Copier et configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec votre DATABASE_URL et SESSION_SECRET

# 4. Créer la base de données et pousser le schéma
npm run db:push

# 5. Initialiser les données (membres + mot de passe par défaut)
npm run db:seed

# 6. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur **http://localhost:3000**

**Mot de passe par défaut : `carrelage2026`**
*(À changer immédiatement dans Paramètres → Mot de passe)*

---

## Déploiement sur Railway

### 1. Créer le projet Railway

1. Créer un compte sur [railway.app](https://railway.app)
2. Créer un nouveau projet → **"Deploy from GitHub repo"**
3. Connecter votre dépôt GitHub du projet
4. Railway détecte automatiquement Next.js

### 2. Ajouter PostgreSQL

1. Dans le dashboard Railway → **"New Service"** → **"Database"** → **"PostgreSQL"**
2. Cliquer sur la base → onglet **"Connect"** → copier `DATABASE_URL`

### 3. Variables d'environnement

Dans le dashboard Railway → votre service Next.js → **"Variables"** :

```
DATABASE_URL=<coller la valeur depuis le service PostgreSQL de Railway>
SESSION_SECRET=<une chaîne aléatoire de 32+ caractères>
NODE_ENV=production
```

> **Astuce** : Pour `SESSION_SECRET`, générez une clé avec :
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Configurer le build

Dans Railway → votre service → **"Settings"** :
- **Build Command** : `npm run db:push && npm run db:seed && npm run build`
- **Start Command** : `npm start`

### 5. Déployer

Chaque `git push` sur la branche principale redéploie automatiquement.

---

## Utilisation

### Modules disponibles (Phase 1)

| Module | URL | Description |
|--------|-----|-------------|
| Dashboard | `/dashboard` | Vue d'ensemble + planning semaine |
| Planning | `/planning` | Rotation des tâches hebdomadaires |
| Équipe | `/parametres/equipe` | Gestion des membres (ajout, désactivation, ordre) |
| Mot de passe | `/parametres/mot-de-passe` | Changer le mot de passe partagé |

### Modules Phase 2 (à venir)
- Catalogue références
- Présentoirs & Rotations
- Plan de salle 2D interactif
- Import/Export CSV

---

## Export CSV de sauvegarde

*(Disponible en Phase 3)*

En attendant, vous pouvez exporter les données directement depuis Railway :

```bash
# Via Railway CLI
railway run npx prisma studio
# Puis exporter depuis l'interface Prisma Studio
```

---

## Développement

### Commandes utiles

```bash
npm run dev          # Serveur de développement (port 3000)
npm run build        # Build de production
npm run db:push      # Synchroniser le schéma Prisma avec la BDD
npm run db:seed      # Initialiser les données de base
npm run db:studio    # Interface visuelle de la BDD (Prisma Studio)
```

### Modifier le mot de passe par défaut du seed

Éditer `prisma/seed.ts` :
```ts
const passwordHash = await bcrypt.hash('VOTRE_MOT_DE_PASSE', 10)
```

---

*ExpoCarrelage v1.0 — Phase 1*
*Équipe : Jules, Sylvana, Mathieu, François, Vincent, Laurine, Elisa*
