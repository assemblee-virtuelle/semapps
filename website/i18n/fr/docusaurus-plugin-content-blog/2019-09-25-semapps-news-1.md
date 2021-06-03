---
slug: semapps-news-1
title: SemApps News N°1
author: Sébastien Rosset, Gabriel Henry & Valentine Mathieu
author_title: Equipe SemApps
author_url: https://semapps.org
author_image_url: https://www.virtual-assembly.org/wp-content/uploads/2017/05/cropped-ms-icon-60x60.png
tags: [semapps]
---

Bienvenue pour cette première newsletter SemApps, présente pour vous informer des nouveautés d'une manière synthétique et accessible. L'équipe SemApps souhaiterait en publier le plus souvent possible.

La newsletter ci-dessous est basé sur les derniers développements depuis cet été.

## Avancées techniques

#### Amélioration de l'interface

Nous avons travaillé sur le [React-Admin interface](https://marmelab.com/react-admin/) pour qu'elle ressemble à la première version de Semapps, et pour apporter plus de facilité d'utilisation.

Grâce à la flexibilité de **React-Admin**, ce projet a vite avancé. Vous pouvez voir le résultat sur [le nouveau Semapps de l'Assemblée Virtuelle](https://archipel.assemblee-virtuelle.org) pouvant gérer et mettre en synergie des projets, des acteurs, des idées et des ressources liées à l'activité de l'Assemblée virtuelle.

#### Cache LDP

Le service LDP est à présent capable de gérer un cache des ressources du container LDP. Dès qu'une ressource est appelée, le résultat est mis en cache et à la seconde interrogation de cette même ressource, le cache est utilisé, ce qui évite une requête SPARQL sur le triplestore.

#### Signature ActivityPub

L'implementation du protocole ActivityPub est à présent complet suite à l'implémentation de la signature HTTP, qui authentifie l'émetteur de l'activité ActivityPub.

Il est à présent possible de déployer en quelques minutes un serveur basé sur ActivityPub et le faire communiquer avec un compte Mastodon, comme vous pouvez le découvrir dans [ce tutoriel](https://semapps.org/docs/guides/activitypub).

## Nouveautés humaines

#### Jérémy Dufraisse a rejoint l'équipe Semapps

Débutant en développement web et passionné par la coopération dans tous les domaines, Jeremy rejoint l'équipe SemApps, avec pour objectif de s'impliquer davantage, notamment dans la programmation du code de ce logiciel.
Membre du core team Colibris à Lorient, il travaille déjà sur la première version de la plateforme des chemins de la transition, un des projets de l'écosystème SemApps.

#### Gouvernance

En mettant en œuvre les principes de « l'élection par consentement », l'équipe SemApps a non seulement pu définir plusieurs rôles, au regard des besoins effectifs de son organisation, mais aussi remplir les rôles en fonction des compétences identifiées.

Parmi les 13 rôles qui sont sortis, les suivants méritent une attention particulière :
* Onboarding / Inclusion / Accueil : Gabriel HENRY
* Partenaires techniques / Interoperabilité : Simon LOUVET
* Communication : Pierre BOUVIER-MULLER
* Cultivateur d'informations : Guillaume ROUYER
* Coordination avec l'AV : Garbriel HENRY

Grâce à une gouvernance agile, ces rôles bénéficieront d'une révision régulière, afin d'être réajustés si besoin.

#### Pérénité économique

Nous avons porté une attention particulière au rôle de la pérennité économique pour permettre à nos contributeurs de se sentir équitablement récompensés. Nous nous dirigeons vers une autodétermination de nos rétributions respectives.

## Usages

#### Lancement d'un mailer pour La Fabrique des Colibris

La Fabrique des Colibris a demandé à **Reconnexion** de développer un [petit outil](https://alertes.colibris-lafabrique.org/) qui permet aux utilisateurs d'être informés des nouveaux projets par e-mail, en fonction de leur localisation et de leurs intérêts. Lorsqu'un nouveau projet est publié sur la plateforme, il est envoyé à une instance de SemApps. Une activité ActivityPub est ensuite générée, puis envoyée au mailer.

Cette démarche résolument ouverte devrait permettre à l'avenir d'offrir d'autres moyens de se tenir au courant de l'actualité de La Fabrique. D'autres projets avec le mouvement Colibris sont déjà dans les tuyaux...

#### Data Food Consortium migre sous SemApps

Data Food Consortium avait prévu dès le départ de s'appuyer sur un serveur sémantique pour stocker les informations confiées (à l'initiative des propriétaires de ces données : producteur, intermédiaire...) par les différentes plateformes de circuit court (catalogue, stock, logistique, offre commerciale ...).

SemApps a permis de migrer d'une base de données MongoDB vers une base de données sémantique en utilisant les interfaces SPARQL et LDP. Cette migration a mis en évidence toute la rigueur nécessaire à une cohérence sémantique, technique et ontologique dans ce projet, considéré comme assez complexe par nature (authentification OIDC entre plateformes, matching directory plutôt que référentiel d'identité...). Les données sont exploitables par une riche API métier fournie par le serveur qui a été adapté pour communiquer avec SemApps. L'interface web du prototype n'a pas eu besoin d'être repensée (grâce aux API métiers) même si quelques ajustements ont été nécessaires pour lire les données en JSON-LD.

SemApps a donc permis d'atteindre la technologie CFD de phase 2 sans attendre qu'un autre serveur Solid capable de faire des requêtes SPARQL complexes soit opérationnel.

## Evènements

#### Meetup Interoperabilité

Suite à la résidence SemApps à El Capitan courant juin, Virtual Assembly et Startin'blox ont montré leur ambition de coopérer plus étroitement. Cela s'est traduit par la co-organisation d'un [rencontre le 15 septembre aux Grands Voisins](https://www.facebook.com/events/609531263097830/). Nous avons eu d'excellents retours, rencontré de nouvelles personnes et même de nouveaux contributeurs ! Même s'il n'y avait pas autant de participants, ils ont tous saisi le message que nous voulions faire passer. Nous savons méditer de mieux en mieux sur nos sujets ! Un grand merci à tous les intervenants et contributeurs bénévoles (une équipe incroyable <3) présents à l'événement !

#### Publication de quelques vidéos de présentation SemApps
Vous trouverez les vidéos de la réunion du 20 mai sur [la chaîne Youtube de l'Assemblée Virtuelle](https://www.youtube.com/channel/UCg7sYh_Y8cHFT4s82K4SVmA/), avec sous-titres anglais en option.
Nous venons également de publier [la vidéo](https://youtu.be/wjQSKP4DWmM) d'une présentation que nous avons faite à l'UTT sur les SemApps et les architectures peer-to-peer. Voici [un document](https://pad.lescommuns.org/IRs8_6lIS_iucxqiPSXwNA?both) résumant ces interventions, ainsi que [le Power-point](https://docs.google.com/presentation/d/1lVUx4URcKkV1Z3G4EticbH1uCV_NwctqUlYoo /edit?usp=sharing) sur laquelle Guillaume et Sébastien ont basé leur présentation.

## Et dans l'écosystème...

#### YesWiki devient compatible LDP !

Une quinzaine de contributeurs de [YesWiki](https://yeswiki.net) se sont rencontrés près d'Avignon cet automne, et l'une des nouveautés issues de cette rencontre est un système d'API qui permet d'ajouter, modifier ou supprimer facilement des données via de simples appels HTTP.

YesWiki était déjà compatible avec le web sémantique, avec la possibilité de sortir des données en JSON-LD. Avec cette nouvelle avancée, YesWiki devient un serveur LDP à part entière. Nous espérons pouvoir montrer un exemple bientôt, lorsque la nouvelle version de YesWiki sortira.

A noter également que, lors de ce sprint, un petit bot de synchronisation a été développé, qui permet d'écouter un acteur ActivityPub (par exemple Mastodon) et de republier les données reçues sur un YesWiki. Ce bot est basé sur SemApps et son code source est disponible [ici] (https://github.com/reconnexion/yeswiki-synchronizer).

Merci à Sébastien Rosset pour ces 2 avancées majeures !

#### Startin'Blox

Au début de l'été, [Startin'blox](https://startinblox.com/) a lancé la version bêta de [Hubl](https://hubl.world/), un outil développé pour les organisations, composé d'un chat, un répertoire de profils, un répertoire de missions et un tableau de bord, tous compatibles Solid. 25 communautés testent actuellement Hubl, dont une grande partie du réseau Happy Dev et bien d'autres devraient suivre en octobre. L'outil évolue rapidement, avec une mise à jour tous les jeudis en fonction des retours utilisateurs. Désormais nous communiquerons toutes les évolutions sur [notre compte twitter](https://twitter.com/StartinBlox).

Pour tester Hubl, rencontrez-nous sur [l'instance de la communauté SiB](https://community.startinblox.com) ou soyez invité sur [l'instance Virtual Assembly](https://virtual-assembly.hubl.world/). Tous vos retours sont les bienvenus sur la chaîne "#Make Hubl Better" :) Depuis l'événement du 15 septembre aux Grands Voisins, nous avons une chaîne dédiée à la coopération entre les deux structures : "Av x SIB". Venez nous rejoindre !

Autre info, si vous avez du mal à expliquer le principe du Solid, Philippe Honigman et Alice Poggioli ont réalisé [un article](https://blog.orgtech.fr/un-avenir-solid/) vulgarisant ce concept. N'hésitez pas à le faire tourner !

#### SOLID / Inrupt

Depuis avril, la communauté Solid organise des [événements vidéo] (https://www.eventbrite.com/o/solid-project-30026804546) au début de chaque mois. Les événements commencent par une présentation des mises à jour de la feuille de route par Tim Berners Lee, suivie de présentations de diverses initiatives communautaires. Le 3 septembre, Alex y a présenté Hubl. Si vous souhaitez présenter vos propres créations vous pouvez proposer votre intervention par mail à info@solidproject.org.

Mi-août, Inrupt annonce la sortie de la version bêta de son [serveur solide](https://inrupt.com/products/enterprise-solid-server).

Voici deux groupes de travail où il serait bien d'avoir des représentants de notre écosystème dans la communauté Solid :

* [The Interoperability panel](https://github.com/solid/data-interoperability-panel) tous les mardis à 4PM.
* [The Authorization panel](https://github.com/solid/authorization-panel) tous les mercredi 4PM.
Si vous souhaitez partager des informations sur l'écosystème Solid, il existe une chaîne dédiée sur Hubl "Solid Watch" :)

#### Campagne de donnation de l'Assemblée Virtuelle

L'organisation de l'Assemblée Virtuelle repose principalement sur le volontariat. Afin de maintenir sa pérennité, ses activités de recherche et développement ainsi que son indépendance, nous comptons sur vos dons. Plus vous cotisez régulièrement, plus notre association se renforce économiquement. Ainsi, nous vous encourageons à privilégier les dons mensuels plutôt que ponctuels. Dans tous les cas, nous vous serions reconnaissants de bénéficier de votre aide :)

* Je veux faire [un don régulier](https://www.virtual-assembly.org/faire-un-don/)
* Je veux faire [Un don unique](https://www.virtual-assembly.org/faire-un-don/)
