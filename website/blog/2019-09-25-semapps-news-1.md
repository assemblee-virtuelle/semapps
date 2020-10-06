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

Grâce à la grande souplesse et modularité de React-Admin, ce chantier a vite avancé et vous pouvez le voir sur [ce nouveau site d'Assemblée Virtuelle](https://archipel.assemblee-virtuelle.org) qui a pour vocation de cartographier les projets, acteurs, idées et ressources proches d'Assemblée Virtuelle.

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

Suite à la résidence SemApps en Juin à El Capitan, l'Assemblée Virtuelle et Startin'blox ont affiché leur ambition coopérer de façon plus rapprochée. Cela à donner lieu à la co-organisation d'[un Meet Up le 15 Septembre aux Grands Voisins](https://www.facebook.com/events/609531263097830/). Nous avons eu d'excellent retours, de nouvelles rencontres et même de nouveaux contributeurs ! Même si les participants étaient peu nombreux, ils ont tous saisi le message que nous voulions transmettre. Nous savons de mieux en mieux faire de la médiation sur nos sujets !
Un grands merci à tous les intervenants et les contributeurs bénévoles (Une équipe incroyable <3) de l'evenement !
Nous publierons prochainement les slides et les videos de l'evenement sur notre chaîne youtube!

#### Publication de plusieurs vidéos de présentation de SemApps !

 - Vous trouverez les vidéos du meetup du 20 mai dernier sur [la chaine Youtube de l'Assemblée Virtuelle](https://www.youtube.com/channel/UCg7sYh_Y8cHFT4s82K4SVmA/), avec sous-titres anglais en option.
 - Nous venons de publier  également [la vidéo d'une présentation que nous avons réalisé à l'UTT](https://youtu.be/wjQSKP4DWmM) autour de SemApps et des architectures pair à pair. Voici [un document](https://pad.lescommuns.org/IRs8_6lIS_iucxqiPSXwNA?both) permettant de résumer ces interventions, ainsi que le [Power-point](https://docs.google.com/presentation/d/1lVUx4URcKkV1Z3G4EticbH1uCV_NwtVBlYo5cvqUOOc/edit?usp=sharing) sur lequel se sont appuyés Guillaume et Sébastien. 


## Et dans l'écosystème...

#### YesWiki devient compatible LDP

Une quinzaine de contributeurs de [YesWiki](https://yeswiki.net) se sont retrouvés près d'Avignon en fin septembre et une des nouveautés qui est sortie de cette rencontre est un système d'API qui permet de facilement ajouter, éditer ou supprimer des données via de simples appels HTTP.

YesWiki était déjà compatible web sémantique, avec la possibilité de sortir les données en JSON-LD. Avec cette nouvelle avancée, YesWiki devient un serveur LDP à part entière. Nous espérons pouvoir montrer un exemple prochainement, lorsque la nouvelle version de YesWiki sera sortie.  

A noter aussi que, pendant ce sprint, un petit bot de synchronisation a été développé, qui permet d'écouter un acteur ActivityPub (par exemple Mastodon) et de reposter les données reçues sur un YesWiki. Ce bot est basé sur SemApps et son code source est disponible [ici](https://github.com/reconnexion/yeswiki-synchronizer).

Merci à Sébastien Rosset pour ces 2 avancées majeures !

#### Startin'Blox

Au début de l'été, [Startin'blox](https://startinblox.com/) a lancé la version bêta de [Hubl](https://hubl.world/), un outil pour les organisations composé un chat, un annuaire de profil, un répertoire de mission et un tableau de bord, le tout Solid compatible. 25 communautés sont en train de tester Hubl dont une grande partie du réseau Happy Dev et beaucoup d'autres devraient suivre courant Octobre. L'outil évolue rapidement, tous les jeudi, une mise à jour à lieu en fonction des retours des utilisateurs. On communiquera désormais toutes les évolutions sur [notre compte twitter](https://twitter.com/StartinBlox).

Pour tester Hubl, rdv sur [l'instance communautaire de SiB](https://community.startinblox.com) ou fais toi inviter sur [l'instance de l'Assemblée Virtuelle](https://virtual-assembly.hubl.world/). Tous tes retours sont les bienvenus sur le channel "#Make Hubl Better" :) Depuis l'evenement du 15 Septembre aux Grands Voisins, nous avons un channel dédié à la coopération entre les deux structures : "Av x SIB". Rejoins-nous!

Autre info, si tu galères à expliquer le principe de Solid, Philippe Honigman et Alice Poggioli ont fait [un article de vulgarisation](https://blog.orgtech.fr/un-avenir-solid/). N'hésite pas à faire tourner!

#### SOLID / Inrupt

Depuis Avril, la communauté Solid organise [des evenements](https://www.eventbrite.com/o/solid-project-30026804546) en visio tous les début de mois. Les évenements commencent avec une présentation des mises à jour de la roadmap par Tim Berners Lee, suivis de présentations de différentes initiatives de la communauté. Le 3 Septembre, Alex y a présenté Hubl. Si tu veux toi aussi présenter tes créations tu peux proposer ton intervention par mail à info@solidproject.org.

Mi-Aout, Inrupt annonce la sortie de la version Bêta de son [server solid](https://inrupt.com/products/enterprise-solid-server).

Voici deux groupes de travail où il serait bien d'avoir des représentant de notre écosystème dans la communauté Solid : 
* [Le panel Interoperability toute les mardis à 16h](https://github.com/solid/data-interoperability-panel)
* [Le panel Authorization tous les mercredis à 16h](https://github.com/solid/authorization-panel)
Si tu es intéréssé pour faire ce relais, tiens nous au courant ! 

Si tu veux partager des infos concernant l'écosystème Solid, il existe un channel dédié sur Hubl "Solid Watch" :)
