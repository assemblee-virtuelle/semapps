---
slug: semapps-news-2
title: SemApps News N°2
author: Sébastien Rosset, Guillaume Rouyer, Yannick Duthe, Pierre Bouvier
author_title: SemApps Core Team
author_url: https://semapps.org
author_image_url: https://www.virtual-assembly.org/wp-content/uploads/2017/05/cropped-ms-icon-60x60.png
tags: [semapps]
---

It has been over a year since we wrote a newsletter. It is not because nothing was happening, but on the contrary: we were thoroughly on many subjects in parallel and we had trouble making time!

Better late than never, you will find below, a recap of the progress and the latest news of SemApps.

If you fear in the future that you will be weaned from fresh and hectic information, the best is to join us on our discussion channels, which will allow you to follow the progress of the project as it goes ... and interact with the community:

* [SemApps Forum](https://forums.assemblee-virtuelle.org/c/projets/semapps/11)
* [SemApps Chat](https://chat.lescommuns.org/channel/semapps_equipe)
* [SemApps Github](https://github.com/assemblee-virtuelle/semapps)

Do not hesitate (if you have not already done so) to create a profile on [Virtual Assembly Semapps instance](https://archipel.assemblee-virtuelle.org/).

Good reading !

## Technical advances

### WebACL permissions

From [version 0.2.0](https://github.com/assemblee-virtuelle/semapps/pull/653), SemApps integrated the [WebACL standard](https://github.com/solid/web-access-control-spec) at the level of the triple store (Jena Fuseki), the backend and the frontend. This makes it possible to finely define the rights that are granted on a resource, in particular via the interface that we have developed:

![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_0435425a6b90d709e4bdc42396bab033.png)

WebACLs are optional. To activate them at the middleware level, you can read [this documentation](https://semapps.org/docs/middleware/webacl/index). This project was financed by **Les Chemins de la Transition**, **Data Players** and  **Virtual Assembly**.

### Visualisation

#### A lot of ways to visualize semantic datas
In the world of the semantic web, it is easy to separate data, application servers and interfaces. A single SemApps server can thus handle data from a multitude of databases and display them on a variety of interfaces (or frontends).

A good number of frontend components are now available to visualize semantic data: in the form of [calendar](https://app.lescheminsdelatransition.org/Event?view=calendar), [geographic map](https://archipel.assemblee-virtuelle.org/Person?view=map), [mozaic](https://payscreillois.colibris-groupeslocaux.org/Project), [circles](https://cercles.assemblee-virtuelle.org/Circle). All these components are developed in open-source and easily reusable.

In addition to these components available for React / React-Admin, interfaces have also been made in Angular and D3.js.

#### Focus on graph visualisations
![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_1352ffc451af63eb0b05a499282c5767.png)
[Screen of carto of wiki Résilience]

This year was also the opportunity to try a **convergence** between the 3 graph visualization projects within the AV: [**Flodio**](https://www.flod.io/), [**IPGS**](https://github.com/scenaristeur/ipgs/) and [**Grezi**](https://grezi.fr/). From end of 2020, 8 reunions took place.
The result is the [visualisation of the same datas between Flodio and IPGS](https://pad.lescommuns.org/B0pn7WnFSWyO72DQ31NE2w#) and the development of a [common library](https://github.com/scenaristeur/ouiz) to access Semapps data, based on standards.
[More information about the projet of convergence here.](https://pad.lescommuns.org/k52s_XG-TMue-WTaCsy8Hg?view#)

You can finf all de **Flodio** projects  **[here](https://pad.lescommuns.org/Z2JQtVbwRCiccQu_LxK0HA?view)**. There is also a project of [Time filter](https://pad.lescommuns.org/IItNg9meQ92J8dlMqEbujw?view), and a new project about financial semantic cartography (see [documentation](https://pad.lescommuns.org/5fQOek2wQrOpuybWFNI6jg#)).

### Next projects to be carried out by the end of the year

Several major projects are underway and should be completed by the end of the year:

#### Interoperability
Allow different SemApps instances to communicate with each other in a secure manner thanks to the implementation of SOLID specifications. ([Voir le chantier dédié](https://github.com/assemblee-virtuelle/semapps/issues/451), principally financed by **Data Players**.)

#### PODs Solid
Configure SemApps as a provider of [PODs Solid](https://solidproject.org/), with the idea of ​​being able to offer an architecture such as the one presented in [this slides](https://docs.google.com/presentation/d/1RCBjy754e2Fn2HREzjHLBXe0qljOD0Y7D8jbEiO7Fb4/edit) (voluntary work).

#### Connectors
Thanks to funding from Colibris which wishes to open all its data in semantics (and in ActivityPub), we will offer connectors with software as varied as Drupal, YesWiki, Prestashop, Mobilizon, Mattermost, Gogocarto, Discourse ...

## Instances deployed

![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_13786ff444a804940f8b74cfcc2d5eb3.png)
[Screen of "chemins de la transition" instance]

* **Archipel**
    * Knowledge base of virtual assembly
    * [https://archipel.assemblee-virtuelle.org/](https://archipel.assemblee-virtuelle.org/)
* **Colibris Pays Creillois**
    * Knowledge base for a local group of Colibris
    * [https://payscreillois.colibris-groupeslocaux.org/](https://payscreillois.colibris-groupeslocaux.org/)
* **Les Chemins de la Transition**
    * Collaborative Knowledge base + networking platform
    * [https://app.lescheminsdelatransition.org/](https://app.lescheminsdelatransition.org/)
* **Passerelle Normandie**
    * Collaborative Knowledge base of "pays du bocage", a rural area in Orne (61 - Normandie)
    * [https://app.passerellenormandie.fr/](https://app.passerellenormandie.fr/)
* **100 lieux nourriciers**
    * Collaborative Knowledge base about urban agriculture, with AFAUP, Les petits débrouillards, Si t'es jardin, Emmaüs.
    * [https://100lieuxnourriciers.fr/](https://100lieuxnourriciers.fr/)
* **Classe dehors**
    * Collaborative Knowledge base about educational projects
    * [https://classe-dehors.org/](https://classe-dehors.org/)

## Projects under development

![](https://s3.standard.indie.host/pad-lescommuns-org/uploads/upload_fa157fbdbda0bb3e7a064bbadb113ec9.png)

* **Prats de Mollo :**
    * Data boards backed by an electricity board + collaborative knowledge base
* **PETR macon bourgogne :**
    * Knowledge base around third places with semantic search engine
* **A'Urba**
    * Grezi mapping based on Semapps for the Bordeaux Urban Planning Agency (A'Urba).
* **Glocal Low Tech**
    * Mapping the low-tech world
* **Data Food Consortium**
    * Creation of standards for the management of food data and short circuits
* **Organigraph**
    * New interface to represent the organization of VA in the form of circles
    * [https://cercles.assemblee-virtuelle.org](https://cercles.assemblee-virtuelle.org)

## Need to map SemApps instances
We went in a year from a single instance to ten Semapps instances ... It's not yet huge, it's the beginning, but it showed us that it was already [difficult for each contributor of the AV](https://github.com/assemblee-virtuelle/semapps/issues/839) to have a global view of all the instances and to know how to find the URLs of the SemApps of each project to participate. A map was therefore essential.

The answer to this need resulted in a SemApps instance mapping project dubbed ** the carto of cartos **. To achieve this, a new specific SemApps instance was created. We have named this instance [Meta](https://semapps.meta.assemblee-virtuelle.org), and it will carry data from multiple future projects:
* A graph visualization of SemApps instances
* A timeline of the VA
* A semantic lexicon
* AV financial datas
* A carto of carto tools

You can read [documentation](https://pad.lescommuns.org/-ioDLrRJTuCtMh-9xDSjcA?view), [SemApps META instance](https://semapps.meta.assemblee-virtuelle.org/) and [The carto of cartos](https://meta.flod.io)

## Perspective projects

In the coming months, the growing ecosystem should launch more than a dozen great projects involving SemApps, with public, private and citizen actors, including one, or even several at European level.

Some are (very) uncertain like the [DUST project](https://forums.assemblee-virtuelle.org/t/dust-projet-europeen-autour-de-solid/198) for which we have requested a nice funding from the European Commission.

Others like the [SITI project](https://www.virtual-assembly.org/wp-content/uploads/2021/06/Siti-Final-1.pdf) are very well on board and should be funded shortly .

Territorial Information Systems constitute a strong axis for the development of use cases around SemApps: Several projects are underway, in Normandy, in the Béarn dear to our dear Pierre, in the Drôme and elsewhere ...

Thematic information systems constitute the other development axis of SemApps. Several projects around food, Third Places, energy, mobility should also emerge in the coming months.

## Community News

### Tribute to Gabriel Henry
Let's start with some sad news. Gabriel Henry, who was involved at the start of the SemApps adventure, died in September. He drowned, like 8 other people that day, while swimming in the Mediterranean. We thank him deeply for his involvement and wish him rest in peace.

### Newcomers
At its inception, the SemApps community consisted of a core of 6 people: Sébastien, Simon, Niko, Pierre, Gabriel, Guillaume. That was a long time ago ... Since then, thanks to the tremendous work of Yannick in particular, it has grown and now has more than ten people, which is very good news!
You can find [here the SemApps community and the animation](https://forums.assemblee-virtuelle.org/t/animation-de-la-communaute-dev-de-semapps/117) ...

Among them, let us quote in particular:
* **Yannick** : One of the historical figures of the Virtual Assembly! Passionate about graphs, developer of [flod.io](https://www.flod.io/).
* **Thomas** is a developer trainer on Angular and Vue. He entered the adventure through the territorial dimension of Béarn.
* **Bastien** new SemApps developer at Data Players
* **Vincent** has been an independent developer for a few months with the aim of contributing to commons and projects that make sense, he also works on Gogocarto / Transiscope.
* **Vivien** holds a pro free software license in Angers, then worked at PMB service on the development of free software for document management, then mobile and a little graphs and semantics!

[On accueille tou.te.s les nouvelles contributrices et nouveaux contributeurs sur le Forum de l'Assemblée Virtuelle](https://forums.assemblee-virtuelle.org/c/projets/semapps/11)

### The beginners club

- A permanent welcome for new contributors is offered every Monday at 3 p.m. All connection information is available on the [chat / canal @semapps_debutant](https://chat.lescommuns.org/channel/semapps_debutant). It is a moment of welcome for new developers, to discuss their difficulties or to learn together.
- Trainings were offered to beginners on React, Protege and Moleculer.

### Animation of the SemApps community

About twenty interviews were carried out by Yannick with AV partners (developers or not) to find out their wishes for interactions with the SemApps ecosystem.
* See the post [Animation of the Semapps community](https://forums.assemblee-virtuelle.org/t/animation-de-la-communaute-dev-de-semapps/117)

2 one-week residences were also organized during the year 2021 which, for our greatest happiness, allowed us to meet again after so many remote visios and meetings. On the program ... Aperitifs, banquets, workshops, team building, brainstorming, networking, and even family constellations which allowed us to become better aware of our places, roles, desires. (The family constellation is a sensitive, unique and very powerful workshop to be able to readjust, as a collective.)

### Funding
Several funding (services, grants, donations) from multiple sources feed the SemApps roadmap.

The challenge is to make this funding converge around the development of shared building blocks, and thus fuel the development of the community. We maintain an open documentation on this subject that you can find [here](https://pad.lescommuns.org/mjckrHy3TTuXq3qt7XJ9yw#)

We have also set up an [Open Collective](https://opencollective.com/semapps) which should ultimately allow us to catalyze funding and development strategies ... in full transparency!

## And in the ecosystem...

### Virtual Assembly

She celebrated her 10th birthday at [El Capitan](https://elcapitan.fr) (Normandy) last June. On the occasion of this memorable anniversary, she took the opportunity to restructure. It now federates an ecosystem of organizations (and individuals as well but above all organizations), which is reflected in its [new board of directors] (https://www.virtual-assembly.org/organisations-membres/), and [in its new social code](https://www.virtual-assembly.org/code-social-de-l-av/). If you want to join the Virtual Assembly as an organization, [it's here !](https://forums.assemblee-virtuelle.org/c/accueil/adhesion-organisation/48)

### Data Players
Data Players will for its part transform itself into a Cooperative Society of Collective Interest (SCIC) in the coming weeks: More exactly, we will close the SAS and we will create a SCIC.

Having numerous projects based on SemApps, she contributes substantially, via donations, to the development of the Virtual Assembly and to R&D around SemApps. The last one was € 7000, we thank her warmly!

### Sparna
Sparnatural is a search engine that allows humans to make complex queries on semantic information systems.

It allows you to easily build queries of the type:
* I am looking for "People"
    * who * have * "Skills" in [...] and / or [...];
    * who * are * interested * in "Topics" [...] and / or [...];
    * who * live * in the "Region" [...]
    * and who are * looking * for a "Job".

Sparnatural will be used and funded by the Ministry of Culture as well as by the National Library of France.
We are going to integrate it into the ecosystem of SemApps modules.

### Projets of Fada (based on SOLID)

#### Booklice
David, alias Fada or Scenaristeur or [...] depending on the context, develops [many projects based on Solid: [Here](https://scenaristeur.github.io/) or [here](https: // github.com/scenaristeur). Here are a few !)
A [watch / bookmarks utility](https://scenaristeur.github.io/booklice) (see about page for tutorial) based on SOLID!

#### ESS-table
An alternative to Airtable https://scenaristeur.github.io/ess-table

#### Contacts
To stock your contacts https://scenaristeur.github.io/ldp-workspace/

### Virtual Assembly's donation campaign

The Virtual Assembly's organization mainly relies on volunteering. In order to maintain its sustainability, its research and development activities as well as its independance, we count on your donations. The more you contribute regularly, the more our association strengthens economically. In this way, we encourage you to choose monthly donations rather than ponctual ones. In any case, we will be gratefull to benefit from your help :)

* I would like to make a [regular donation](https://www.virtual-assembly.org/faire-un-don/)
* I would like to make a [one-time donation](https://www.virtual-assembly.org/faire-un-don/)
