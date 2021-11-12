---
slug: semapps-news-2
title: SemApps News N°2
author: Sébastien Rosset, Guillaume Rouyer, Yannick Duthe, Pierre Bouvier
author_title: SemApps Core Team
author_url: https://semapps.org
author_image_url: https://www.virtual-assembly.org/wp-content/uploads/2017/05/cropped-ms-icon-60x60.png
tags: [semapps]
---

Cela fait plus d'un an que nous n'avons pas écrit de newsletter. Ce n'est pas parce qu'il ne se passait rien, mais au contraire : on était à fond sur de nombreux sujets en parallèle et on a eu du mal à dégager du temps !

Mieux vaut tard que jamais, vous trouverez ci-dessous, un récapitulatif des avancées et des dernières actualités de SemApps.

Si vous craignez à l'avenir d'être sevrés d'informations fraiches et trépidantes, le mieux est de nous rejoindre sur nos canaux de discussions, lesquels vous permettront de suivre au fil de l'eau l'évolution du projet... et d'interagir avec la communauté :

* [Forum SemApps au sein de celui de l'Assemblée virtuelle](https://forums.assemblee-virtuelle.org/c/projets/semapps/11)
* [Chat SemApps sur celui des Communs](https://chat.lescommuns.org/channel/semapps_equipe)
* [Github SemApps](https://github.com/assemblee-virtuelle/semapps)

N'hésitez par ailleurs pas (si ce n'est déja fait) à vous créer un profil sur [l'instance SemApps de l'Assemblée Virtuelle](https://archipel.assemblee-virtuelle.org/) : Elle n'est ni très belle, ni très fonctionnelle, mais permet tout de même de tester un type d'utilisation possible de SemApps.

Bonne lecture !

## Avancées techniques

### Gestion des WebACL

Depuis la [version 0.2.0](https://github.com/assemblee-virtuelle/semapps/pull/653) sortie avant l'été, SemApps intègre le [standard WebACL](https://github.com/solid/web-access-control-spec) au niveau du triple store (Jena Fuseki), du backend et du frontend. Cela permet de définir finement les droits qu'on accorde sur une ressource, notamment via l'interface que nous avons développée :

![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_0435425a6b90d709e4bdc42396bab033.png)

Les WebACL sont optionnels. Pour les activer au niveau du middleware, vous pouvez lire [cette documentation](https://semapps.org/docs/middleware/webacl/index). Ce chantier a été financé par Les Chemins de la Transition, Data Players et l'Assemblée Virtuelle.

### Visualisation

Dans le monde du web sémantique, il est aisé de dissocier les données, des serveurs applicatifs et des interfaces. Un même serveur SemApps peut ainsi manipuler des données en provenance d'une multitude de bases de données et les afficher sur une diversité d'interfaces (ou frontends).

Un bon nombre de composants frontend sont maintenant disponibles pour visualiser les données sémantiques: sous forme de [calendrier](https://app.lescheminsdelatransition.org/Event?view=calendar), de [carte géographique](https://archipel.assemblee-virtuelle.org/Person?view=map), de [mozaique](https://payscreillois.colibris-groupeslocaux.org/Project), en [cercles](https://cercles.assemblee-virtuelle.org/Circle). Tous ces composants sont développés en open-source et facilement réutilisables.

Outre ces composants disponibles pour React / React-Admin, des interfaces ont aussi été réalisées en Angular et en D3.js.

#### Focus sur les interfaces de visualisation en graphes
![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_1352ffc451af63eb0b05a499282c5767.png)
[Copie écran de la carto du wiki Résilience]

Cette année a été aussi l'occasion de tenter une **convergence** entre les 3 projets de visualisation graphe au sein de l'AV : [**Flodio**](https://www.flod.io/), [**IPGS**](https://github.com/scenaristeur/ipgs/) et [**Grezi**](https://grezi.fr/). Depuis fin 2020, nous avons organisé 8 réunions pour voir là où nous pouvions converger.
Cela a débouché sur la création de [visualisation communes des mêmes données entre Flodio et IPGS](https://pad.lescommuns.org/B0pn7WnFSWyO72DQ31NE2w#) et sur le développement d'une [librairie commune](https://github.com/scenaristeur/ouiz) pour accéder aux données Semapps, en se basant sur les standards.
[Plus d'infos sur ce projet de convergence ici.](https://pad.lescommuns.org/k52s_XG-TMue-WTaCsy8Hg?view#)

Vous trouverez la liste des projets de **Flodio**  **[ici](https://pad.lescommuns.org/Z2JQtVbwRCiccQu_LxK0HA?view)**, ainsi que des chantiers en cours concernent la création d'un [Filtre temporel](https://pad.lescommuns.org/IItNg9meQ92J8dlMqEbujw?view), et un projet de cartographie sémantique des flux financiers (voir [la documentation](https://pad.lescommuns.org/5fQOek2wQrOpuybWFNI6jg#)).

### Prochains chantiers devant être réalisés d'ici à la fin de l'année

Plusieurs gros chantiers sont en cours et devraient aboutir d'ici à la fin de l'année :

#### Interopérabilité
Permettre à différentes instances SemApps de communiquer entre elles de manière sécurisée grâce à l'implémentation des spécifications SOLID. ([Voir le chantier dédié](https://github.com/assemblee-virtuelle/semapps/issues/451), principalement financé par Data Players.)

#### PODs Solid
Configurer SemApps sous forme de fournisseur de [PODs Solid](https://solidproject.org/), avec l'idée de pouvoir proposer une architecture telle que celle présentée dans [ces slides](https://docs.google.com/presentation/d/1RCBjy754e2Fn2HREzjHLBXe0qljOD0Y7D8jbEiO7Fb4/edit) (chantier réalisé bénévolement).

#### Connecteurs
Grâce à un financement de Colibris qui souhaite ouvrir toutes ses données en sémantique (et en ActivityPub), nous allons proposer des connecteurs avec des logiciels aussi variés que Drupal, YesWiki, Prestashop, Mobilizon, Mattermost, Gogocarto, Discourse ...

## Instances déployées

![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_13786ff444a804940f8b74cfcc2d5eb3.png)
[Image de l'instance des chemins de la transition]

* **Archipel**
    * Base de connaissances de l'Assemblée Virtuelle
    * [https://archipel.assemblee-virtuelle.org/](https://archipel.assemblee-virtuelle.org/)
* **Colibris Pays Creillois**
    * Base de connaissances pour un groupe local Colibris
    * [https://payscreillois.colibris-groupeslocaux.org/](https://payscreillois.colibris-groupeslocaux.org/)
* **Les Chemins de la Transition**
    * Base de connaissances collaborative + plateforme de mise en relation
    * [https://app.lescheminsdelatransition.org/](https://app.lescheminsdelatransition.org/)
* **Passerelle Normandie**
    * Description : Base de connaissances collaborative du pays du bocage, un territoire rural dans l'Orne (61 - Normandie)
    * [https://app.passerellenormandie.fr/](https://app.passerellenormandie.fr/)
* **100 lieux nourriciers**
    * Description : Base de connaissances collaborative autour de l'agriculture urbaine, en partenariat avec l'AFAUP, les petits débrouillards, Si t'es jardin, Emmaüs.
    * [https://100lieuxnourriciers.fr/](https://100lieuxnourriciers.fr/)
* **Classe dehors**
    * Description : Base de connaissances collaborative autour de projets pédagogiques
    * [https://classe-dehors.org/](https://classe-dehors.org/)

## Projets en cours de développement

![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_fa157fbdbda0bb3e7a064bbadb113ec9.png)

Sébastien: On est sûr de vouloir mettre des liens vers des sites non-terminés ? Quel intérêt pour l'abonné ? Le client est-il OK? Perso je ferai juste une liste rapide, sans préciser plus.

* **Prats de Mollo :**
    * **Description :** Régies de données adossée à une régie électrique + base de connaissance collaborative
    * **Accès :** https://energiesdeprats.fr/
* **PETR macon bourgogne :**
    * **Description :** Base de connaissance autour des tiers-lieux avec moteur de recherche sémantique
    * **Accès :** https://app.petr-msb.data-players.com/
* **A'Urba**
    * **Description :** Cartographie Grezi basée sur Semapps pour l'Agence urbanisme bordeaux (A'Urba).
    * **Accès :** Pas encore de démo
* **Glocal Low Tech**
    * **Description :** Cartographie du monde des low-tech
    * **Accès :** https://semapps.gl.assemblee-virtuelle.org/
* **Data Food Consortium**
    * **Description :** Création de standards pour la gestion des données alimentaires et circuit court
    * **Accès :** https://www.datafoodconsortium.org/fr/
* **Organigraph**
    * Nouvelle interface pour représenter l'organisation de l'AV sous forme de cercles
    * [https://cercles.assemblee-virtuelle.org](https://cercles.assemblee-virtuelle.org)

## Besoin de cartographier les instances SemApps
Nous sommes passé en un an d'une seule instance à une dizaine d'instances Semapps... Ce n'est pas encore énorme, c'est le début, mais cela nous a montré qu'il était déjà [difficile pour chaque contributeur de l'AV](https://github.com/assemblee-virtuelle/semapps/issues/839) d'avoir une vue globale de toutes les instances et de savoir retrouver les URL des SemApps de chaque projet pour participer. Une carto s'imposait donc.

La réponse à ce besoin a donné un projet de cartographie des instances SemApps surnomé **la carto des cartos**. Pour la réaliser, une nouvelle instance SemApps spécifique a été créée. Nous avons nommé cette instance [Meta](https://semapps.meta.assemblee-virtuelle.org), et elle portera les données de multiples futurs projets :  
* Une visualisation en graphe des instances SemApps
* Une frise chronologique de l'AV
* Un lexique sémantique
* Les données financières de l'AV
* Une carto des outils carto

Voir la [documentation](https://pad.lescommuns.org/-ioDLrRJTuCtMh-9xDSjcA?view), [l'instance SemApps META](https://semapps.meta.assemblee-virtuelle.org/) et [la carto des cartos](https://meta.flod.io)

## Projets en perpective

Dans les mois qui viennent, l'écosystème qui se développe devrait lancer plus d'une dizaine de beaux projets impliquant SemApps, avec des acteurs publics, privés et citoyens, dont un, voire plusieurs à l'échelle européenne.

Certains sont (très) incertains comme le projet [DUST](https://forums.assemblee-virtuelle.org/t/dust-projet-europeen-autour-de-solid/198) pour lequel nous avons demandé un joli financement à la commission européenne.

D'autres comme le [projet SITI](https://www.virtual-assembly.org/wp-content/uploads/2021/06/Siti-Final-1.pdf) sont très bien embarqués et devraient être financés sous peu.

Les Systèmes d'information territoriaux constituent un axe fort pour le développement de cas d'usage autour de SemApps : Plusieurs projets sont en cours, en Normandie, dans le Béarn cher à notre cher Pierre, dans la Drôme et ailleurs ...

Les systèmes d'informations thématiques constituent l'autre axe de développement de SemApps. Plusieurs projets autour de l'alimentation, des Tiers-Lieux, de l'énergie, de la mobilité devraient émerger également dans les mois à venir.

## Actualités de la communauté

### Hommage à Gabriel Henry
Commençons par une triste nouvelle. Gabriel Henry, qui s'était impliqué au début de l'aventure SemApps est décédé au mois de septembre. Il s'est noyé, comme 8 autres personnes ce jour là, alors qu'il se baignait en Méditerranée. Nous le remercions profondément pour l'implication dont il a fait preuve et lui souhaitons de reposer en paix.

### Les nouveaux venus
A ses débuts, la communauté de SemApps était constituée d'un noyau de 6 personnes : Sébastien, Simon, Niko, Pierre, Gabriel, Guillaume. C'était il y a longtemps ... Depuis, grâce au formidable travail de Yannick notamment, elle s'est étoffée et compte à l'heure actuelle plus d'une dizaine de personnes, ce qui est une très bonne nouvelle !
Vous trouverez [ici la liste des personnes embarquées ou sur le point de l'être](https://forums.assemblee-virtuelle.org/t/animation-de-la-communaute-dev-de-semapps/117) ...

Parmi elles, citons notamment :
* **Yannick** : L'un des personnages historiques de l'Assemblée Virtuelle ! Passionné de graphes, développeur de [flod.io](https://www.flod.io/).
* **Thomas** est formateur développeur sur Angular et Vue. Il est entré dans l'aventure par la dimension territoriale béarnaise
* **Bastien** nouveau développeur SemApps chez Data Players
* **Vincent** est développeur indépendant depuis quelques mois avec le souci de contribuer à des communs et des projets qui ont du sens, il travaille sur Gogocarto/Transiscope également.
* **Vivien** est titulaire d'une licence pro logiciel libre à Angers, puis a bossé à PMB service sur le développement de logiciels libre de gestion documentaire, puis du mobile et un peu de graphes et de sémantique !

[On accueille tou.te.s les nouvelles contributrices et nouveaux contributeurs sur le Forum de l'Assemblée Virtuelle](https://forums.assemblee-virtuelle.org/c/projets/semapps/11)

### Le club des débutants

- Une permanence d'accueil des contributeurs débutants est proposée tous les Lundi à 15h. Toutes les informations de connexion sont disponible sur le [chat des communs](https://chat.lescommuns.org/), canal @semapps_debutant.
C'est un moment d'accueil pour les nouveaux développeurs, échanger de leurs difficultés ou pour apprendre ensemble.
- Des formations ont été proposées aux débutants sur React, Protégé et Moleculer.

### Animation de la communauté SemApps

**Une vingtaine d'interviews** ont été réalisées par Yannick avec des partenaires AV (developpeurs ou non) pour connaitre leurs souhaits d'interactions avec l'écosystème SemApps. Voir le post [Animation de la communauté Semapps](https://forums.assemblee-virtuelle.org/t/animation-de-la-communaute-dev-de-semapps/117)

**2 résidences** d'une semaines ont par ailleurs été organisées au cours de l'année 2021 qui, pour notre plus grand bonheur, nous ont permis de nous retrouver après tant de visios et de réunions à distance. Au programme ... Apéros, banquets, ateliers, team building, brainstorming, networking, et même des constellations familiales qui nous ont permis de mieux prendre conscience de nos places, rôles, envies. (La constellation familiale est un atelier sensible, singulier et très puissant pour pouvoir se réajuster, en tant que collectif.)

### Financements
Plusieurs financements (des prestations, des subventions, des dons) en provenance de multiples sources permettent d'alimenter la feuille de route de SemApps.

L'enjeu est de faire converger ces financements autour du développement de briques mutualisées, et d'alimenter ainsi le développement du commun. Nous entretenons une documentation ouverte à ce sujet que vous pouvez retrouver [ici](https://pad.lescommuns.org/mjckrHy3TTuXq3qt7XJ9yw?both#)

On a par ailleurs mis en place un [Open Collective](https://opencollective.com/semapps) qui devrait nous permettre à terme de catalyser les financements et les stratégies de développement ... en toute transparence !

## Et dans l'écosystème...

### Assemblée Virtuelle

Elle a fêté ses 10 ans à [El Capitan](https://elcapitan.fr) (Normandie) en juin dernier. A l'occasion de cet anniversaire mémorable, elle en a profité pour se restructurer. Elle fédère désormais un écosystème d'organisations (et d'individus aussi mais surtout d'organisations), ce qui se reflète dans son [nouveau conseil d'administration](https://www.virtual-assembly.org/organisations-membres/), et [dans son nouveau code social](https://www.virtual-assembly.org/code-social-de-l-av/). Si vous souhaitez rejoindre l'Assemblée Virtuelle en tant qu'organisation, [ça se passe ici !](https://forums.assemblee-virtuelle.org/c/accueil/adhesion-organisation/48)

### Data Players
Data Players va de son côté se transformer de son côté en Société Coopérative d'Intérêt Collectif (SCIC) dans les prochaines semaines : Plus exactement, on va fermer la SAS et on va créer une SCIC.

Ayant de nombreux projets basés sur SemApps, elle contribue substantiellement, via des dons, au développement de l'Assemblée Virtuelle et à la R&D autour de SemApps. Le dernier était de 7000€, nous la remercions chaleureusement !

### Sparna
Sparnatural est un moteur de recherche qui permet aux humains de faire des requêtes complexes sur des systèmes d'information sémantiques.

Il permet de construire facilement des requêtes du type :
* Je recherche des "Personnes"
    * qui *disposent de* "Compétences" en [...] et/ou [...] ;
    * qui *s'intéressent* aux "Topics" [...] et/ou [...] ;
    * qui *habitent* dans la "Région" [...]
    * et qui sont *à la recherche* d'un "Emploi".

Sparnatural va être utilisé et financé par le ministère de la culture ainsi que par la Bibliothèque Nationale de France.
Nous allons de notre côté l'intégrer dans l'écosystème des modules SemApps.

### Les projets de Fada (basés sur SOLID)

#### Booklice
David, alias Fada ou Scenaristeur ou [...] en fonction des contextes, développe [de nombreux projets basés sur Solid : [Ici](https://scenaristeur.github.io/) ou [ici](https://github.com/scenaristeur). En voici quelques uns !)
Un [utilitaire de veille / bookmarks](https://scenaristeur.github.io/booklice) (voir page à propos pour tuto) basé sur SOLID !

#### ESS-table
Pour remplacer Airtable https://scenaristeur.github.io/ess-table

#### Contacts
Pour stocker vos contacts https://scenaristeur.github.io/ldp-workspace/

#### Campagne de donnation de l'Assemblée Virtuelle

L'organisation de l'Assemblée Virtuelle repose principalement sur le volontariat. Afin de maintenir sa pérennité, ses activités de recherche et développement ainsi que son indépendance, nous comptons sur vos dons. Plus vous cotisez régulièrement, plus notre association se renforce économiquement. Ainsi, nous vous encourageons à privilégier les dons mensuels plutôt que ponctuels. Dans tous les cas, nous vous serions reconnaissants de bénéficier de votre aide :)

* Je veux faire [un don régulier](https://www.virtual-assembly.org/faire-un-don/)
* Je veux faire [Un don unique](https://www.virtual-assembly.org/faire-un-don/)
