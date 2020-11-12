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
to install the interface, refer to https://semapps.org/docs/guides/dms use archipelago for better experience
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
    - usage : la liste des ontologies utilisée par le client. doit être identique au serveur. voir /ontologies sur le serveur ci dessous
  - /config/ressources.json
    - usage les ressources avec lesquel vont travailler le client
    ```bash  
    [
      RessourceName: {
        types: ['prefix:Class'],# type affect to this Ressource
        containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'containerName', # url of the container which manage this ressource
        slugField: '?'
      }
    ]
    ```
    - default value
    ```bash  
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
    ```bash  
    [
      {
        "prefix": "pair",# prefix à utiliser pour les classes et les properties pour les serialisation json-ld e les prefix sparql
        "owl": "http://virtual-assembly.org/ontologies/pair/ontology.ttl",# adresse qui fourni un fichier ttl ou rdf qui décrit l'ontologie
        "url": "http://virtual-assembly.org/ontologies/pair#"# namespace complet à utiliser pour le stockage sémantque
      }
    ]
    ```

##### semapps-workbench
cette phase est réalisé par make init sur semapps-workbench mais celle-ci fait également la phase de container ci dessous
```bash  
make init
```

### container
#### Docker
#### Docker-Compose
#### semapps-workbench

### semmapps core link (debog and contributing)
#### link and run
#### contributing
#### semapps-workbench

### production deployement
#### difference whith developpment environnement
##### server
##### app
#### https
#### semapps-workbench
