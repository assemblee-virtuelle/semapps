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

If you were running a previous version of Jena Fuseki (before July 2022), you will need to migrate your dataset(s) 
configuration(s). First remove the current version of the docker image:

```
docker image rm -f semapps/jena-fuseki-webacl
```

Then follow the guide on dataset migration [here](../triplestore/migrating-datasets).

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
