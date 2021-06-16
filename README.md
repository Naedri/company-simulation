# Simulation basée sur le web

Tuteur : Remous Aris Koutsiamanis ([remous-aris.koutsiamanis@imt-atlantique.fr](mailto:remous-aris.koutsiamanis@imt-atlantique.fr))

## Objectif

L’objectif de ce projet est d’acquérir de l’expérience dans la conception, la création et l’interaction
avec des API Web, des bibliothèques de traitement et de visualisation des données afin de présenter
un tableau de bord interactif pour les données.

## Contexte, problématique

Le projet s’inscrit dans le contexte d’un simulateur d’événements discrets basé sur le web qui peut
être utilisé dans l’enseignement des étudiants en informatique.

Le sujet simulé sera une entreprise simple (matières premières, machines de production, personnel,
produits fabriqués, coûts, profits, etc.) mais le système développé devrait être suffisamment général
pour être facilement modifié et étendu pour fonctionner avec des simulateurs structurés de manière
analogue sur d’autres sujets. Le simulateur lui-même sera fourni par le tuteur.

Le travail concerne à la fois le côté serveur et le côté client d’une application. Plus précisément, la
partie serveur crée, gère et fournit un accès à la simulation tout en fournissant une API REST pour
accéder à la simulation et à ces fonctionnalités de gestion.

Le côté client accède à l’API REST pour gérer et interagir avec la simulation et l’utilise pour permettre
aux utilisateurs d’interagir et d’afficher des informations concernant la simulation dans un
navigateur Web.

Les fonctionnalités qui devraient être fournies sont :

- Créer, démarrer, arrêter une simulation.
- Configurer les paramètres de la simulation.
- Stocker les paramètres de configuration de la simulation (dans une base de données simple)
  pour permettre de rejouer exactement la même simulation.
- Récupérer des informations en direct par sondage (client pull) et en continu (server push).
- Présenter/afficher des informations à l’aide de graphiques interactifs (pour l’exemple de
  simulateur donné).
- Interagir avec la simulation (demander et appliquer des modifications).
- Fournir un accès authentifié aux utilisateurs (stocké dans une base de données).
  - Un minimum de deux catégories d’utilisateurs est nécessaire pour chaque simulation :
    - Les propriétaires de la simulation peuvent créer, modifier, supprimer, démarrer,
      arrêter et interagir (recevoir les informations, demander que des changements soient
      apportés pendant l’exécution) avec la simulation.
    - Les utilisateurs de la simulation peuvent uniquement interagir avec une simulation.
      2/2

Dans le cadre de ces étapes, les étudiants devront décider d’une manière flexible de représenter les
entités dans la simulation et de les rendre accessibles via l’API REST.

## Phases et Livrables

### Sprint 1

- Concevoir :
  - La représentation du modèle de simulation et les interactions possibles avec celui-ci :
    - Créer, démarrer, arrêter, modifier les paramètres, obtenir des informations,
      demander et appliquer des modifications.
  - La représentation de l’authentification (utilisateurs, permissions).
- Implémenter :
  - La gestion d’une simulation en cours dans le serveur.
  - La persistance / le stockage des informations de la simulation dans le serveur.
  - L’API REST.

### Sprint 2

- Mettre en œuvre une interface web pour accéder à l’API REST.
- Afficher des exemples d’informations provenant de la simulation.
- Permettre d’interagir avec la simulation.
- Implémenter l’accès authentifié.

## Environnement technologique (langage, outils dev, matériel spécifique ?)

- Serveur : en Python ou JavaScript ou **TypeScript** (mais autres possibles après validation du
  tuteur).
  - Base de données : Choix libre.
  - Simulateur d’entreprises : Fourni par le tuteur.
- Client : JavaScript ou **Typescript et React** (mais autres possibles après validation du tuteur).
  - Compatibilité des navigateurs Safari, Firefox et Chrome.

## Livrables

- Code source du projet avec :
  - Documentation.
  - Versionnement (Github/Gitlab/autre).
- Propositions d’amélioration.
- Évaluations des résultats.

## How to use the app ?

### Downloading the repository

In a terminal, download the repository.

```bash
git clone https://github.com/Naedri/company-simulation.git
cd company-simulation/
```
### Create a database
Create a PostgreSQL database. We recommend using elephantsql.com for convenience. Run the script in server/database/initBase.sql to create the necessary tables. 

#### Local variables

Add the following *.env.local* files in your projet :

1. `company-simulation/server/.env.local`
    - which includes the following ElephantSQL data :
        - `DB_USER=xxx`
        - `DB_HOST=yyyyyyy.db.elephantsql.com`
        - `DB_DATABASE=xxx`
        - `DB_PASSWORD=dddddd`
        - `DB_PORT=5432`
        - `SECRET=your-secret-for-token`
2. `company-simulation/client/.env.local`
    - which includes the following NextJS data :
        - `NEXT_PUBLIC_API_URL=http://localhost:3000`

### Launching the app

#### Launching the server

In a terminal, install dependencies, initialize the database and then launch the server.

```bash
cd ./server/
npm install
npm run start
```
You will need to add NODE_ENV=dev in your environnment variables for local development.
```bash
NODE_ENV=dev npm run start
```
#### Launching the client

In another terminal, install dependencies then launch the client.

```bash
cd ./client/
npm install
npm run dev
```

#### Seeing the result

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
After to have been logging, you can read the swagger documentation to the following page : [http://localhost:3000/docs/](http://localhost:3000/docs/). 
