---
slug: semapps-news-2
title: SemApps News N°2
author: Pierre Bouvier-Muller, Guillaume Rouyer & Sébastien Rosset
author_title: SemApps Core Team
author_url: https://semapps.org
author_image_url: https://www.virtual-assembly.org/wp-content/uploads/2017/05/cropped-ms-icon-60x60.png
tags: [semapps]
---

Si vous lisez cette lettre de nouvelle, vous étiez probablement présent au meet-up du mois de Mai.
Souvenez-vous en Mai 2020 nous organisions la première présentation officielle de la première version de SemApps. Nous en avions profité pour créer une instance avec les profils que vous aviez rempli lors de l'inscription... et donc les adresses mails.

C'était une instance de test qui nous a seulement servi le temps du meet-up car les données ont depuis été effacées et si vous souhaitez retrouver un compte sur notre réseau, il faudra vous créer un profil : https://archipel.assemblee-virtuelle.org/

La petite surprise, c'est qu'il n'est pas forcément nécessaire de se crééer un nouveau compte, car nous utilisons l'OIDC (outil d'authentification) des communs.


## Avancées techniques 

### Middleware (SemApps core)

#### Intégration des WebACL

Depuis la [version 0.2.0](https://github.com/assemblee-virtuelle/semapps/pull/653) sortie il y a quelques jours, SemApps intègre le [protocole WebACL](https://github.com/solid/web-access-control-spec) au niveau du triple store (Jena Fuseki), du backend et du frontend.
Les WebACL sont optionnels. Ils ont été activés sur https://archipel.assemblee-virtuelle.org.

#### Image Docker
Côté Jena Fuseki, nous avons créé une [image Docker](https://hub.docker.com/r/semapps/jena-fuseki-webacl) disponible publiquement. Cela permetra potentiellement à d'autres logiciels de profiter de ce développement.

#### Cache

#### Relations réifiées 

### Archipel

#### Intégration de nouveaux concepts de l'Ontologie PAIR
Intégration de l'ontologie PAIR, avec de nouveaux concepts et de nouvelles relations. On peut désormais créer des groupes, des tâches, des statuts, des rôles. A propos des rôles, il nous a fallu créer la possiblité de créer des relations réifiées (appelées également relations ternaires) qui ouvrent un nouveau champ de possibilités : Par exemple, au lieu de simplement dire que Seb a une compétence en développement web, on peut spécifier qu'il a une compétence **de niveau expert** en développement web.

#### Intégration du concept de Page
On peut désormais créer des pages sur Archipel .. 

#### Développement de nouvelles interfaces
* Vue mozaïque
* Vue calendrier
* Vue Graphe
* Vue organigramme

## Instances déployées

* [Archipel Assemblée Virtuelle](https://archipel.assemblee-virtuelle.org/) : Base de connaissances de l'Assemblée Virtuelle
* Colibris Pays Creillois : Base de connaissances collaborative communautaire
* [Les Chemins de la Transition](https://app.lescheminsdelatransition.org/) : Base de connaissances collaborative + plateforme de mise en relation
* Passerelle Normandie : * Classe-dehors : Base de connaissances collaborative d'un territoire
* 100 lieux nourriciers : Base de connaissances collaborative autour de l'agriculture urbaine
* [Classe-dehors](https://classe-dehors.org/) : Base de connaissances collaborative autour de projets pédagogiques
* Fabrique des mobilités : Visualisation graphe de plusieurs wikis
* Appel à communs Resilience des territoires : Visualisation graphe d'un wiki
* [Cartographie des instances SemApps](https://fluidlog.gitlab.io/cartosemapps/)

## Projets en cours de développement
* Prats de Mollo : Régies de données adossée à une régie électrique + base de connaissance collaborative
* PETR macon bourgogne : Base de connaissance autour des tiers-lieux avec moteur de recherche sémantique
* Agence urbanisme bordeaux (A'Urba).
* Glocal Low Tech
* Data Food Consortium. 
* [Organigraph](https://cercles.assemblee-virtuelle.org)

## Projets à venir
Dans les mois qui viennent, l'écosystème qui se développe autour de SemApps devrait lancer plus d'une dizaine de beaux projets avec des acteurs publics, privés et citoyens, dont un à l'échelle européenne. 

 


## Avancées humaines

### Le club des débutants

## Evénements
### Résidence en janvier
Les contributrices et contributeurs du projet se sont retrouvés du 5 au 8 Janvier au coliving El Capitan pour 4 jours de travail et de retrouvailles intenses. 
Nous étions émus et ravis d'avoir la chance de nous retrouver après tant de visios et de réunions à distance.

Les ateliers étaient riches et denses, nous avons eu la chance de vivre une constellation familiale qui nous a permis d'enreichir la rétrospective de ces derniers mois, de mieux prendre conscience de notre place, de nos rôles, de nos envies.
La constellation familiale est un atelier sensible, singulier et très puissant pour pouvoir se réajuster, en tant que collectif.

La vie à El Capitan est toujours aussi douce, nous étions ravi de pouvoir profiter du passage de nombreux voisins.

### Présentation de SemApps au FOSDEM
En février dernier nous avons eu la chance de pouvoir présenter SemApps au FOSDEM, la plus grosse conférence européenne autour des l'open-source. 

### 10 ans de l'Assemblée Virtuelle
Nous nous sommes à nouveau retrouvés à El Capitan à l'occasion des 10 ans de l'Assemblée Virtuelle pour une semaine d'ateliers et de soirées endiablées qui nous ont permis de nous reconnecter et de tisser de nouveaux liens.  

## Et dans l'écosystème...


