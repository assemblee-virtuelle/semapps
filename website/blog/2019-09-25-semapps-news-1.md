---
slug: semapps-news-1
title: SemApps News N°1
author: Sébastien Rosset & Gabriel Henry
author_title: SemApps Core Team
author_url: https://semapps.org
author_image_url: https://www.virtual-assembly.org/wp-content/uploads/2017/05/cropped-ms-icon-60x60.png
tags: [semapps]
---

Bienvenue dans cette première newsletter de SemApps qui a pour vocation de vous permettre d'être tenu au courant facilement de nos avancées. Elle a pour vocation d'être éditée de manière régulière, tous les 2-3 mois.

Cette newsletter-là vous rend compte des nouveautés depuis cet été.

<!--truncate-->

## Avancées techniques

#### Amélioration de l'interface

Nous avons effectué un travail au niveau de l'interface en [React-Admin](https://marmelab.com/react-admin/) pour qu'elle ressemble à celle de la version 1 de SemApps et offre plus de convivialité 

Grâce à la grande souplesse et modularité de React-Admin, ce chantier a vite avancé et vous pouvez le voir sur ce nouveau site d'Assemblée Virtuelle qui a pour vocation de cartographier les projets, acteurs, idées et ressources proches d'Assemblée Virtuelle.

#### Cache LDP

Le service LDP de SemApps gère maintenant le cache des ressources et containers LDP. Dès qu'une ressource est appelée, le résultat est mis en cache et la seconde fois où elle est demandée, le résultat en cache sera servi sans avoir besoin de faire la requête SPARQL nécessaire pour aller 

#### Signature ActivityPub

L'implémentation dans SemApps du protocole ActivityPub est maintenant terminée avec l'implémentation des signatures HTTP, qui permet d'authentifier l'émetteur d'activités ActivityPub.

Il est maintenant possible de déployer en quelques minutes un serveur ActivityPub basé sur SemApps et de le faire communiquer avec un compte Mastodon, ainsi que vous pourrez le découvrir dans [ce tutoriel](https://semapps.org/docs/guides/activitypub).


## Avancées humaines

#### Jérémy Dufraisse nous a rejoint

#### Travail sur la gouvernance

- Définition de rôles
- Election sans candidat
- Gouvernance agile: mise à jour régulière des rôles

#### Travail sur la pérennité économique

- Importance
- Projet de SCIC


## Usages

#### Lancement du mailer La Fabrique des Colibris

La Fabrique des Colibris a fait appel à Reconnexion pour développer un petit [outil](https://alertes.colibris-lafabrique.org/) permettant aux utilisateurs d'être notifié des nouveaux projets par email, selon sa localisation et ses intérêts. Lorsqu'un nouveau projet est publié sur la plateforme, celui-ci est envoyé sur une instance de SemApps. Une activité ActivityPub est alors générée, qui est transmise au mailer.

Cette approche résolument ouverte devrait permettre à l'avenir de proposer d'autres moyens d'être tenus au courant des nouveautés de la Fabrique. D'autres projets sont d'ores et déjà dans les cartons avec le mouvement Colibris...

#### Data Food Consortium migre vers SemApps

- Demander à Simon ?


## Evénements

#### Meetup Interopérabilité

- Contexte
- Slides disponibles ici
- Vidéos si dispos

#### Le vidéos du meetup de juin sont disponibles !

- Liens


## Et dans l'écosystème...

#### YesWiki devient compatible LDP

Une quinzaine de contributeurs de [YesWiki](https://yeswiki.net) se sont retrouvés près d'Avignon en fin septembre et une des nouveautés qui est sortie de cette rencontre est un système d'API qui permet de facilement ajouter, éditer ou supprimer des données via de simples appels HTTP.

YesWiki était déjà compatible web sémantique, avec la possibilité de sortir les données en JSON-LD. Avec cette nouvelle avancée, YesWiki devient un serveur LDP à part entière, ainsi que le montre cette interface SemApps qui utilise un YesWiki comme base de donnée.

A noter aussi que, pendant ce sprint, un petit bot de synchronisation a été développé, qui permet d'écouter un acteur ActivityPub (par exemple Mastodon) et de reposter les données reçues sur un YesWiki. Ce bot est basé sur SemApps et son code source est disponible [ici](https://github.com/reconnexion/yeswiki-synchronizer).

#### Startin'Blox

Demander à Alice ?

#### SOLID / Inrupt

Demander à Alice ou reprendre la newsletter "This Month in SOLID" https://solidproject.org/newsletter
