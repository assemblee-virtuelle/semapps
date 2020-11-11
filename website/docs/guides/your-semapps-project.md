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

Si vous voulez utiliser des container
- docker-copose & docker

Si vous ne souhaitez pas utiliser docker-compose
- [NodeJS](https://nodejs.org/en/)

Dans la réalité d'un projet, il est invariablement nececessaire de disposer de plusieurs outils
- Make
- npm ou yarn

### Very short Launch
il existe un moyen de lancer tres rapidement un projet : semapps-workbench https://github.com/assemblee-virtuelle/semapps-workbench
Ce n'est qu'un outil qui facilite les differentes manipuation qui seront vu dans ce guides

pour démarer un projet
forker le repo git semapps-workbench : cela va être votre repo pour votre projet
clonner le repo forké sur votre environnment locale
make init : initialiser un server semapps, une interface DMS+archipelago, mettre en place l'infrastructure docker
make start : démarrer le projet complet (resultat sur localhost:5000) / make log pour voir les log des elements de la stack
make start-dev : demarrer le projet en se servant du code semapps local (voir chapitre branchement au code source de semapps) / make log-dev pour voir les log des elements de la stack
make start-prod : demarrer sur un serveur de production  (voir chapitre environnment de production) / make log-prod pour voir les logs des elements de la stack

### init a Project
#### create server, interface and configure them
##### create server and interface
##### les variables d'environnement
##### les configuration applicatives
##### semapps-workbench

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
