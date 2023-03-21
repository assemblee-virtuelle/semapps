# SemApps

SemApps (from *Sem*antic *App*lications) is a semantic web toolbox, allowing to create applications compliant with most major semantic web specifications: LDP, SPARQL, ActivityPub, WAC, WebID. 

## What's in the box ?

We provide tools on several layers:

- [Middleware](#middleware)
- [Triple store](#triple-store)
- [Frontend](#frontend)

### Middleware

This is where all the semantic web standards are implemented.

- [LDP](https://semapps.org/docs/middleware/ldp)
- [ActivityPub](https://semapps.org/docs/middleware/activitypub)
- [WAC / WebACL](https://semapps.org/docs/middleware/webacl)
- [Webfinger](https://semapps.org/docs/middleware/webfinger)
- [WebId](https://semapps.org/docs/middleware/webid)
- [HTTP Signature](https://semapps.org/docs/middleware/signature)

We use the [Moleculer](https://moleculer.services/) micro-service framework to help create modular backends.

[More information...](https://semapps.org/docs/middleware)

### Triple store

We have customized the [Jena Fuseki](https://jena.apache.org/documentation/fuseki2/) triplestore to make it compliant with the WAC (WebACL) standards.

It is available as a Docker image on [Docker Hub](https://hub.docker.com/orgs/semapps/repositories)

[More information...](https://semapps.org/docs/triplestore)

### Frontend

We are providing many components to ease the development of web applications based on the [React-Admin](https://marmelab.com/react-admin/) framework.

Our [Semantic Data Provider](https://semapps.org/docs/frontend/semantic-data-provider/), which eases the communication with a semantic web server (through SPARQL and LDP), can be used with other view engines and frameworks.

[More information...](https://semapps.org/docs/frontend)

## Open-source softwares powered by SemApps

Since SemApps is just a toolbox, products can be built upon it. Here are the main open-source products:

- [Archipelago](https://github.com/assemblee-virtuelle/archipelago)
- [ActivityPods](https://github.com/assemblee-virtuelle/activitypods)
- [OrganiGraph](https://github.com/assemblee-virtuelle/organigraph)

## Websites powered by SemApps

Here are some examples of websites made with SemApps:

- [Les Chemins de la Transition](https://lescheminsdelatransition.org/)
- [Archipel](https://archipel.assemblee-virtuelle.org/)
- [Cercles Jardiniers du Nous](https://cercles.jardiniersdunous.org)
- [100 lieux nourriciers](https://100lieuxnourriciers.fr/)

> Feel free to open a PR to add your own website here.

## Visit the SemApps' website for more information

- [Homepage](https://semapps.org)
- [Team](https://semapps.org/docs/team)
- [Guides](https://semapps.org/docs/guides/ldp-server)
- [Middleware](https://semapps.org/docs/middleware)
- [Frontend](https://semapps.org/docs/frontend)
- [Triplestore](https://semapps.org/docs/triplestore)
- [How to contribute](https://semapps.org/docs/contribute/code)
