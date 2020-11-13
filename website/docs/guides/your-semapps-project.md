---
title:  initialiser, configurer et déployer votre application semapps
---



### Purpose

 initialiser, configurer et déployer votre application semapps

- configuration des variables d’environnement
- configuration des ontologies, du contexte, des ressource
- projet industrialisé (container + docker-compose)
- branchement au code source du noyau semapps pour débogage et pouvoir contribuer
- déploiement sur un environnement de production (https, config variables d'env)

### Prerequisites

Si vous voulez utiliser des containers
- docker-compose & docker

Si vous ne souhaitez pas utiliser docker-compose
- [NodeJS](https://nodejs.org/en/)

Dans la réalité d'un projet, il est invariablement nececessaire de disposer de plusieurs outils
- Make
- npm ou yarn

### Very short Launch
il existe un moyen de lancer tres rapidement un projet : semapps-workbench https://github.com/assemblee-virtuelle/semapps-workbench
Ce n'est qu'un outil qui facilite les differentes manipuation qui seront vu dans ce guides

pour démarer un projet
* forker le repo git semapps-workbench : cela va être votre repo pour votre projet
* cloner le repo forké sur votre environnement locale
* initialiser un server semapps + initialiser une interface DMS/archipelago + mettre en place l'infrastructure docker
```bash
make init
```
* démarrer le projet complet (resultat sur localhost:5000) + voir les log des éléments de la stack
```bash
make start
make log
```

* OU demarrer le projet en se servant du code semapps local (voir chapitre branchement au code source de semapps) + voir les log des éléments de la stack
```bash  
make start-dev
make log-dev
```
* Si vous etes sur un serveur de production qui bénéficie d'une redirection DNS; démarrer sur un serveur de production  (voir chapitre environnement de production) + voir les log des éléments de la stack
```bash  
make start-prod
make log-prod
```

### init a Project
#### create server, interface and configure them
##### create server and interface
to install the server, refer to https://semapps.org/docs/guides/ldp-server
```bash  
npm install -g moleculer-cli # instalm moleculer client to use moleculer template
moleculer init assemblee-virtuelle/semapps-template-ldp server #init a moleculer server thanks to template
cd server
docker-compose up #start fuseki + jenna
npm run dev
```
to install the interface, refer to https://semapps.org/docs/guides/dms  
you can use archipelago for better experience
```bash  
npx create-react-app client --template @semapps/dms-archipelago #init react applicaiotn thanks to template
cd client
npm start
```
##### environnement configuration
tant que docker n'est pas utilisé, les variables d'encironnment se configurent à travers les ficher .env sur le client et sur le serveur
- client
  - REACT_APP_MIDDLEWARE_URL
    - usage : url du server. le client va utiliser les apis de ce serveur
    - default value : http://localhost:3000/
  - PORT
    - usage : port de demarrage du client
    - default value : 5000
- server
  - SEMAPPS_HOME_URL
    - usage : url du server. Le serveur à besoin de connaitre sa propre adresse pour créer des triplet avec le bon uri
    - default value : http://localhost:3000/
  - SEMAPPS_SPARQL_ENDPOINT
    - usage : url du serveur fuseki
    - default value (only if you ask fuseki install) : http://localhost:3000/
  - SEMAPPS_MAIN_DATASET
    - usage: dataset principale pour stocker les triplets. Il est créé automatiquement si le micro-service fuseky-admin est utilisé et c'est le cas du template
    - default value : localData
  - SEMAPPS_JENA_USER / SEMAPPS_JENA_PASSWORD
    - usage : login et mot de passe du serveur fuseki
    - default value : admin / admin

##### application configuration
- client
  - /config/ontologies.json
    - usage : la liste des ontologies utilisée par le client. doit être identique au serveur. Voir /ontologies sur le serveur ci dessous
  - /config/ressources.json
    - usage les ressources avec lesquel vont travailler le client
    ```javascript  
    [
      RessourceName: {
        types: ['prefix:Class'],// Class affect to this Ressource
        containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'containerName', // url of the container which manage this ressource
        slugField: '?'
      }
    ]
    ```
    - default value
    ```javascript  
    [
      User: {
        types: ['foaf:Person'],
        containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'persons',
        slugField: ['foaf:name', 'foaf:familyName']
      }
    ]
    ```
  - /resources
    - usage : repertoire qui contient les "ecrans" des ressources à afficher/modifier. ces écrans sont à importer dasn App.js. voir REACT-Admin

- server
  - /ontologies.json
    - usage : la liste des ontologies utilisée (doit être identique au client)
    ```javascript  
    [
      {
        "prefix": "pair",// prefix à utiliser pour les classes et les properties pour les serialisation json-ld e les prefix sparql
        "owl": "http://virtual-assembly.org/ontologies/pair/ontology.ttl",// adresse qui fourni un fichier ttl ou rdf qui décrit l'ontologie
        "url": "http://virtual-assembly.org/ontologies/pair#"// namespace complet à utiliser pour le stockage sémantque
      }
    ]
    ```

##### semapps-workbench
cette phase est réalisé par make init sur semapps-workbench mais cette commande fait également la phase de container ci dessous
```bash  
make init
```

### container
#### Docker
vous pouvez vous passer de docker pour déployer des serveur semapps mais cela permet de s'assurer de l'equivalence d'environnment d'execution entre le developpement et la production.
- serveur
  - créer un fichier Dockerfile.dev sur /serveur
  ```
  FROM node:13.14-alpine
  WORKDIR /server/app
  RUN apk add --update --no-cache git bash yarn nano autoconf libtool automake alpine-sdk
  CMD npm install && npm start

  ```
  - vous pouvez lancer le container docker tel quel mais nous vous conseillons de passer par docker-compose. voir chapitre suivant. Si vous lancer le container tel quel il faudra rajouter plusieurs instruction comme la CMD pour lancer le serveur NodeJs et l'ouverture des port ainsi que déclarer les volumes et le mapping de port au lancement du container.

- client
  - créer un fichier Dockerfile sur /client
  ```
  FROM node:13.14-alpine
  WORKDIR /client/app
  RUN apk add --update --no-cache git bash yarn nano autoconf libtool automake alpine-sdk
  CMD npm install && npm start
  ```
  - vous pouvez lancer le container docker tel quel mais nous vous conseillons de passer par docker-compose. voir chapitre suivant. Si vous lancer le container tel quel il faudra rajouter plusieurs instruction comme la CMD pour lancer le serveur NodeJs et l'ouverture des port ainsi que déclarer les volumes et le mapping de port au lancement du container.

#### Docker-Compose
centraliser la configuration de l'environnement et de la pile technique grâce à docker-compose
- créer un fichier docker-compose.yaml à la racine du projet
```
version: '3.5'
services:
  fuseki:
    image: stain/jena-fuseki:3.10.0
    container_name: fuseki-workbench
    volumes:
      - ./data/fuseki:/fuseki
      - ./data/staging:/staging
    ports:
      - "3030:3030"
    expose:
      - "3030"
    networks:
      - semapps
    environment:
      ADMIN_PASSWORD: "admin"
  middleware:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: middleware-workbench
    depends_on:
      - fuseki
    volumes:
      - ./server/:/server/app
    environment:
      - SEMAPPS_SPARQL_ENDPOINT=http://fuseki-workbench:3030/
      - SEMAPPS_MAIN_DATASET=localData
      - SEMAPPS_JENA_USER=admin
      - SEMAPPS_JENA_PASSWORD=admin
      - SEMAPPS_HOME_URL=http://localhost:3000/
    networks:
      - semapps
    ports:
      - "3000:3000"
    expose:
      - "3000"
    command: bash -c "npm rebuild && npm install && npm start"
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    container_name: frontend-workbench
    volumes:
      - ./client:/client/app
    environment:
      - REACT_APP_MIDDLEWARE_URL=http://localhost:3000/
      - PORT=5000
    networks:
      - semapps
    ports:
      - "5000:5000"
    expose:
      - "5000"
    command: bash -c "npm rebuild && npm install --silent && npm start"

networks:
  semapps:
    name: semapps_network
```
- explications
  - fuseki, middleware, frontend sont les 3 container lancés. fuseki reprends la configuration du docker-compose.yml qui est présent sur le repetoir /server
  - build : pointage vers les ficher Dockerfile précédemment créé
  - container_name : [facultatif]  permet de mieux identifier les container dans le cas d'un envirnnment de ravail complexe avec plusieurs autre projet en cours d’exécution sur des container. vous pouvez remplacer workbench par le nom de votre projet
  - volumes :  permet d'établir un lien entre le contenu des répertoires de développement du poste de travail et un repertoire du container. node_modules est volontairement recopié avec le reste du projet ais il n'est pas necessaire de faire npm install en cas d'écolution du package.json car il est réalisé à chaque démarrage des container (voir command)
  - environment : déclaration des variables d'environnement. Elles écrasent les variables définies dans le fichier .env. Si vous utilisez docker-compose, vous n'avez plus besoin des fichier .env.
  - networks : [facultatif] permet de nommer le réseau dans lequel les container peuvent communiquer enssemble. si'il n'est pas précisé docker-compose va créer un réseau par defaut. déclarer un reseau permet de faire communiquer plusieurs stqck docker-compose enssemble ce qui n'est pas possible si docker-compose créé un ressau par defaut pour chaque stack
  - ports : mapping entre le port interne du container et le port externe accessible depuis le poste de travaille
  - expose : ouvertur du port interne du containers
  - command : commande à éxecuter lors du démarrage du container.
- lancer la stack de containers
```bash
docker-compose up
```
- lancer la stack de containers en daemon
```bash
docker-compose up -d
docker-compose logs middleware frontend fuseki
docker-compose down
```
#### semapps-workbench
toutes ces étapes sont inclues dans l'init qui contient également l'étape d'initialisation du projet
```bash  
make init
```
### semmapps core link (debog and contributing)
Votre projet repose sur des composants publiées sur npmjs. Ces composants sont importés lors de l'appl à "npm install". Ces composant sont optimisé pour le déploiement et peuvent est optimisé ce qui complique leur débogage en cas de besoin. Si vous voulez deboguer, experimenter, intervenir, contribuer les composants noyaux de semapps, vous devez établir un lien entre votre projet et le code source des composants.
- cloner le repository de semapps dans le même reprtoire que vous avez créer votre projet
```bash
git clone
```
#### link and run
##### without docker
##### docker-compose
#### contributing
#### semapps-workbench
vous devez cloner le reprtoire semapps manuellement comme indiqué ci dessous
- execution mnauelle si vou n'utiliser pas docker
  - npm
  ```
  make link
  ```
  - yarn
  ```
  make link-yarn
  ```
en passant par docker-compose

### production deployement
#### difference whith developpment environnement
##### server
##### app
#### https
#### semapps-workbench

### developpment tool
- [facultatif] mettre en place un fichier Makefile à la racine pour déclencher plus facilement les executions
