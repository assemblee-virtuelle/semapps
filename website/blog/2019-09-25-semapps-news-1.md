---
slug: semapps-news-1
title: SemApps News N°1
author: Sébastien Rosset & Gabriel Henry
author_title: SemApps Core Team
author_url: https://semapps.org
author_image_url: https://www.virtual-assembly.org/wp-content/uploads/2017/05/cropped-ms-icon-60x60.png
tags: [semapps]
---

Welcome to this first SemApps newsletter, designed to keep you informed of our progress, in a synthetic and accessible way. The SemApps team plans to publish it on a regular basis, every 2-3 months.

The newsletter below reports on the latest developments since this summer.

## Technical advances

#### Improvement of the interface

We have done some work on the [React-Admin interface](https://marmelab.com/react-admin/) to make it look like the first version of SemApps, and to offer more user-friendliness.

Thanks to the great flexibility and modularity of React-Admin, this project has progressed quickly. You can see it on [this new Virtual Assembly website](https://archipel.assemblee-virtuelle.org) which aims at mapping projects, actors, ideas and resources related to the Virtual Assembly.

#### LDP cache

SemApps LDP service is now able to manage the cache of LDP resources and containers. As soon as a resource is called, the result is cached and the second time it is requested, the cached result will be served without the need to make the SPARQL request necessary to fetch the information from the Triple Store (Fuseky).

#### Signature ActivityPub

The implementation in SemApps of the ActivityPub protocol is now complete with the implementation of HTTP signatures, which authenticates the issuer of ActivityPub activities.

It is now possible to deploy in a few minutes an ActivityPub server based on SemApps and make it communicate with a Mastodon account, as you will discover in [this tutorial](https://semapps.org/docs/guides/activitypub).

## Human Advances

#### Jérémy Dufraisse has joined us

New to web development and passionate about it, Jeremy joins the SemApps team, aiming to get more involved, especially in programming this software's code. 
Member of the Colibris core team in Lorient, he's already working on The Paths of Transition's platform v.0, one of SemApps ecosystem's projects.

#### Work on governance

By implementing the principles of election by consent, SemApps team was not only able to define several roles, regarding to the effective needs of its organization, but also to fill the roles according to the competencies that were identified.

Among the 13 roles that came out, the following ones deserve a particular attention : 
* Onboarding / Inclusion / Welcoming role - Gabriel HENRY : gabriel.henry@lilo.org
* Technical partnership / Interoperability role : Simon LOUVET
* Communication role : Pierre BOUVIER-MULLER
* Information gardening/Informational heritage role : Guillaume ROUYER
* The Virtual Assembly's coordination role : Garbriel HENRY

Thanks to an agile governance, these roles will benefits from a regular review, in order to be reajusted if needed. 

#### Work on economic sustainability

We have paid particular attention to the role of economic sustainability to enable our contributors to feel fairly rewarded. We are moving towards a self-determination of our respective retributions.

## Uses

#### Launch of the mailer La Fabrique des Colibris

La Fabrique des Colibris called upon *Reconnexion to develop a [small tool  ](https://alertes.colibris-lafabrique.org/) that allows users to be notified of new projects by email, depending on their location and interests. When a new project is published on the platform, it is sent to an instance of SemApps. An ActivityPub activity is then generated, and then sent to the mailer.

This resolutely open approach should allow in the future to provide other ways to be kept up to date with the latest news from the Fabrique. Other projects with the Colibris movement are already in the pipeline...

#### Data Food Consortium migrates to SemApps

Data Food Consortium had planned from the beginning to rely on a semantic server to store the information entrusted (at the initiative of the owners of this data : producer, intermediary ...) by the various platforms of short circuit (catalog, stock, logistics, commercial offer ...).

Semapps allowed to migrate from a MongoDB base to a semantic base using SPARQL and LDP interfaces. This migration highlighted all the rigor necessary for a semantic, technical and ontological consistency in this project, considered as quite complex by nature (OIDC authentication between platforms, matching directory rather than identity repository ...). The Data is mineable by rich business api provided by the business server which has been adapted to communicate with Semapps and work in a semantic way. The prototype's Web interface did not need to be redesigned (thanks to the business APIs) even if some adjustments were necessary to read the data in json-ld.

LDP atomic api and SPARQL researches are now possible for all future uses.

Semapps has therefore helped to reach phase 2 CFD technology without waiting for another Solid server capable of making complex SPARQL queries to be operational.

## Events

#### Meetup Interoperability

Following the SemApps residency in El Capitan during June, the Virtual Assembly and Startin'blox showed their ambition to cooperate more closely. This resulted in the co-organization of [a Meet Up on September 15th at Les Grands Voisins](https://www.facebook.com/events/609531263097830/). We had excellent feedbacks, met new people and even new contributors ! Even if there were only a few participants, they all grasped the message we wanted to convey. We know how to mediate better and better on our subjects ! A big thank you to all the interveners and volunteer contributors (an incredible team <3) present at the event ! We will soon publish the slides and videos of the event on our youtube channel !

#### Publication of several SemApps presentation videos!
You will find the May 20th meeting videos on [the Virtual Assembly's Youtube channel](https://www.youtube.com/channel/UCg7sYh_Y8cHFT4s82K4SVmA/), with English subtitles in option.
We have also just published [the video](https://youtu.be/wjQSKP4DWmM) of a presentation we made at UTT about SemApps and peer-to-peer architectures. Here is [a document](https://pad.lescommuns.org/IRs8_6lIS_iucxqiPSXwNA?both)  summarizing these interventions, as well as [the Power-point](https://docs.google.com/presentation/d/1lVUx4URcKkV1Z3G4EticbH1uCV_NwtVBlYo5cvqUOOc/edit?usp=sharing) on which Guillaume and Sébastien based their presentation.

## And in the ecosystem...

#### YesWiki becomes LDP compatible

About fifteen [YesWiki](https://yeswiki.net) contributors met near Avignon at the end of September, and one of the new features that came out of this meeting is an API system that allows you to easily add, edit or delete data via simple HTTP calls.

YesWiki was already semantic web compatible, with the ability to output data in JSON-LD. With this new breakthrough, YesWiki becomes a full-fledged LDP server. We hope to be able to show an example soon, when the new version of YesWiki is released.

Also note that, during this sprint, a small synchronization bot has been developed, which allows to listen to an ActivityPub actor (for example Mastodon) and to repost the received data on a YesWiki. This bot is based on SemApps and its source code is available [here](https://github.com/reconnexion/yeswiki-synchronizer).

Thanks to Sébastien Rosset for these 2 major advances!

#### Startin'Blox

At the beginning of the summer, [Startin'blox](https://startinblox.com/) launched the beta version of [Hubl](https://hubl.world/), a tool developed for organizations, composed of a chat, a profile directory, a mission directory and a dashboard, all Solid compatible. 25 communities are currently testing Hubl, including a large part of the Happy Dev network and many more are expected to follow in October. The tool is evolving quickly, with an update every Thursday based on user feedbacks. From now on we will communicate all the evolutions on [our twitter account](https://twitter.com/StartinBlox).

To test Hubl, meet us on [the SiB community instance](https://community.startinblox.com) or get invited on [the Virtual Assembly instance](https://virtual-assembly.hubl.world/). All your feedbacks are welcome on the "#Make Hubl Better" channel :) Since the September 15th event at Les Grands Voisins, we have a channel dedicated to the cooperation between the two structures: "Av x SIB". Come and join us !

Other info, if you're struggling to explain the principle of Solid, Philippe Honigman and Alice Poggioli have made [an article](https://blog.orgtech.fr/un-avenir-solid/) vulgarizing this concept. Don't hesitate to make it run !

#### SOLID / Inrupt

Since April, the Solid community has been organizing [video events] (https://www.eventbrite.com/o/solid-project-30026804546) at the beginning of every month. The events start with a presentation of the roadmap updates by Tim Berners Lee, followed by presentations of various community initiatives. On September 3rd, Alex presented Hubl there. If you want to present your own creations you can suggest your intervention by email to info@solidproject.org.

Mid-August, Inrupt announces the release of the Beta version of its [solid server](https://inrupt.com/products/enterprise-solid-server).

Here are two working groups where it would be nice to have representatives from our ecosystem in the Solid community :

* [The Interoperability panel](https://github.com/solid/data-interoperability-panel) every Tuesday at 4PM.
* [The Authorization panel](https://github.com/solid/authorization-panel) every Wednesday at 4PM.
If you want to share information about the Solid ecosystem, there is a dedicated channel on Hubl "Solid Watch" :)



