# Version administrable — FaZe_Elbossito69

Cette version ajoute un espace `/admin` et une API Node/Express.

## Lancer en local

1. Installer Node.js.
2. Ouvrir un terminal dans ce dossier.
3. Copier `.env.example` vers `.env` et choisir un mot de passe admin.
4. Installer les dépendances : `npm install`
5. Définir `ADMIN_PASSWORD` dans l'environnement (ou charger `.env` avec un outil comme dotenv).
6. Lancer : `npm start`
7. Ouvrir `http://localhost:3000` puis `http://localhost:3000/admin`.

Le projet utilise volontairement `process.env.ADMIN_PASSWORD` : ne mets jamais ton vrai mot de passe dans un fichier JavaScript envoyé au navigateur.

## Mise en ligne

L'hébergement doit supporter Node.js et permettre de définir une variable d'environnement `ADMIN_PASSWORD`.
Le dossier `data/site.json` est utilisé comme stockage simple. Pour un site à forte fréquentation, remplace-le par une vraie base de données.

## Ce que l'admin permet déjà

- Modifier le nom, le slogan et le petit titre de l'accueil
- Modifier les textes « À propos »
- Modifier les liens YouTube, Twitch, TikTok, Instagram, Discord et X
- Modifier les statistiques
- Enregistrer les changements directement dans `data/site.json`

## Important

La protection actuelle est une base de départ pour un petit site : session serveur en mémoire, mot de passe fourni par variable d'environnement. En production, ajoute HTTPS, un gestionnaire de sessions persistant et idéalement une base de données/solution d'authentification.
