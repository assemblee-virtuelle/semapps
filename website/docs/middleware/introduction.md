---
title: Introduction
---

The SemApps middleware rely entirely on [Moleculer](https://moleculer.services/), a microservices framework for NodeJS.
This framework is progressive in the sense that at first all services can be on the same computer, but if you need more
power, you can move them to other servers without much changes. You thus have all the advantages of microservices (clear
architecture, ease of horizontal scaling) without the difficulty of setting up such architecture.

Every building block of SemApps is a Moleculer [service](https://moleculer.services/docs/0.14/services.html), this way 
you can compose the backend that you need, only including the standards that you need. Services are grouped by packages,
which are usually named after a web semantic standard. Each package thus includes one or more services.

The microservice architecture also make it easy to add new services depending on your specific needs. Your services can
call [actions](https://moleculer.services/docs/0.14/actions.html) of SemApps services, or listen to
[events](https://moleculer.services/docs/0.14/events.html) sent by them.

We recommend that you go through Moleculer [documentation](https://moleculer.services/docs/0.14/) to have a good 
understanding of what is going on. After this, it should be easy to configure the services that you need.
