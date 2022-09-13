---
title: Mirror
---

This service enables your server to become a mirror of one or more other SemApps servers, and/or to offer the option to other SemApps servers to mirror you.

Only public data can be mirrored. If your server is using the [WebAclService](webacl/index.md), then the anonymous `acl:Read` permission should be set for the data to be mirrored.

## Dependencies

- [ActivityPubService](activitypub/index.md)
- [LdpService](ldp/index.md)
- [WebfingerService](webfinger.md)
- [VoidService](void.md)

## Install

```bash
$ yarn add @semapps/mirror
```

## Dataset migration

If you were running a previous version of the middleware and/or of Jena Fuseki (before July 2022), you will need to migrate your dataset(s) configuration(s).

- If your Docker containers are running, stop them
```
docker-compose down
```

- Remove the current image version of the Docker image
```
docker image rm -f semapps/jena-fuseki-webacl
```

- Pull the newer version from Docker Hub
```
docker image pull semapps/jena-fuseki-webacl 
```

- Run the following command to launch the migration
```
docker run -v "$(pwd)"/data/fuseki:/fuseki --entrypoint /docker-migration-entrypoint.sh semapps/jena-fuseki-webacl
```

> **Warning**: the volume can be different on your setup. It has to be the exact same as the volumes line of the `fuseki` service present in your docker-compose file.

- You can check that everything went well with the migration by starting the shell environment of the fuseki service (`docker-compose exec fuseki bash`), and doing `cat /fuseki/configuration/migration.log`. If you see some errors in this file, or if your dataset configuration files were not standard and you had modified them, then you need to do the migration manually. you can find the previous version of your configuration files with the extension `.bak`. To see the format of the dataset configuration you want to achieve manually, please refer to the templates [here](https://github.com/assemblee-virtuelle/semapps/tree/next/src/jena/fuseki-docker/migration/templates).

- You can now restart your Docker containers. Fuseki should be ready to support the mirror service.
```
docker-compose up -d
```

## Usage

```js
const { MirrorService } = require('@semapps/mirror');

module.exports = {
  mixins: [MirrorService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    servers: ['https://otherserver.com'], // Optional. Other servers you want to mirror
    acceptFollowers: true // Default value
  }
};
```

## Settings

| Property          | Type      | Default      | Description                                                                         |
|-------------------|-----------|--------------|-------------------------------------------------------------------------------------|
| `baseUrl`         | `String`  | **required** | Base URL of the server                                                              |            
| `servers`         | `Array`   |              | List of servers URLs you want to mirror (optional)                                  |
| `acceptFollowers` | `Boolean` | true         | Set to false if you want to mirror others, but not offer mirroring service yourself |


## Setting up the `Relay` bot

An important step is also to make sure that your server has a container that accepts `Application` type.
The mirror service will create an ActivityPub actor there, with the name `relay`.
You could put the actor in the `/users` container, or in a dedicated `/bots` container.

```js
const containers = [{
  path: '/users',
  acceptedTypes: ['pair:Person', 'Application'], // The Application type is important
  blankNodes: ['sec:publicKey'],
  excludeFromMirror: true
}];
```
You also most probably want to use the option `excludeFromMirror: true`. It will hide this container from the mirroring servers.

If other containers need to be hidden and not available for mirroring, you can use this option too for them.

The mirroring service works with or without the WebAclService on. If you do not have WebAcl activated, the option `excludeFromMirror` is a simple way to hide containers.


## What's going on ?

The service works automatically. At first launch, the public data of all the servers listed for mirroring are downloaded (via the LDP protocol) and inserted into a separate graph named `http://semapps.org/mirror`.

Then your server will follow the ActivityPub `relay` actor(s) of the remote server(s) you are mirroring.

Everytime some data changes occur on the remote server(s), your server will receive ActivityPub activities and will update its local mirror of the data accordingly.

The `http://semapps.org/mirror` graph is not directly editable through LDP, but can be fetched with the `ldp.resource.get` action or via the SPARQL endpoint.


### LDP containers PATCH

When attaching a remote resource to a local LDP container with the `PATCH` method, if the remote server has not been mirrored yet locally, the mirror service will mirror only that resource.

It will then periodically refresh that resource's data (using a simple fetch on the LDP resource) to keep it in sync with the remote server.

If the remote server is mirrored, then the resource will be kept up-to-date thanks to the ActivityPub activities sent by the `relay` bots.

This feature is thus independent of the mirror service and is always active when the LDP service is running.
