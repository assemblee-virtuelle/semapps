---
title: Introduction
---

SemApps currently relies on Apache's [Jena Fuseki](https://jena.apache.org/documentation/fuseki2/) triplestore. Other 
triplestore could be supported in the future, but it would require to adapt the [TripleStoreService](../middleware/triplestore/index.md).

To be able to offer public SPARQL endpoint which take into account WebACL permissions, we have developed a class which 
checks the rights of each triples before returning them. The WebACL triples themselves should be stored on a graph named 
`http://semapps.org/webacl`. You can have more information about this class by reading [this page](webacl-implementation).

If you have activated the [MirrorService](../middleware/sync/mirror), mirrored data are also stored on their own graph,
named `http://semapps.org/mirror`. This allows to easily differentiate local data from cached data, and thus improve
performances of SPARQL queries.


## Dataset creation

Jena Fuseki does not persist graphs by default, so it requires additional configuration for each dataset. To create a
new dataset with the right configuration, you should use the `triplestore.dataset.create` action, eventually with the
`secure: true` parameter if you wish to activate WebACL. 

Note that this will work only if you use the Docker image below.


## Docker image

We have created a [semapps/jena-fuseki-webacl](https://hub.docker.com/repository/docker/semapps/jena-fuseki-webacl) 
image which includes the class to check permissions. You should use it if you use WebACL permissions or the mirror
service.

Here is an example of a docker-compose.yml configuration file:

```yaml
version: '3.5'
services:
  fuseki:
    image: semapps/jena-fuseki-webacl
    container_name: fuseki
    volumes:
      - ./data/fuseki:/fuseki
    ports:
      - "3030:3030"
    expose:
      - "3030"
    environment:
      ADMIN_PASSWORD: "change-me"
```

## Maintenance tasks

- [Migrating datasets](migrating-datasets)
- [Compacting datasets](compacting-datasets)
- [Moving datasets](moving-datasets)
