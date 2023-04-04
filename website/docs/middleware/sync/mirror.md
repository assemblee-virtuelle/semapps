---
title: MirrorService
---

This service enables your instance to [mirror](https://en.wikipedia.org/wiki/Mirror_site) the public data of other SemApps instances.
Data will be cached in a named graph and will be kept updated through ActivityPub.


## Dependencies

- [ActivityPubService](../activitypub)
- [LdpService](../ldp)
- [WebfingerService](../webfinger)


## Sub-services

- [SynchronizerService](synchronizer.md)


## Usage

```js
const { MirrorService } = require('@semapps/sync');

module.exports = {
  mixins: [MirrorService],
  settings: {
    graphName: 'http://semapps.org/mirror',
    servers: ['https://otherserver.com'] // Other servers you want to mirror
  }
};
```


### Dataset migration

If you were running a previous version of Jena Fuseki (before July 2022), you will need to migrate your dataset(s)
configuration(s). First remove the current version of the docker image:

```
docker image rm -f semapps/jena-fuseki-webacl
```

Then follow the guide on dataset migration [here](../../triplestore/migrating-datasets).


## Settings

| Property    | Type      | Default                     | Description                                                                                                                                             |
|-------------|-----------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `graphName` | `String`  | "http://semapps.org/mirror" | Named graph where mirrored data are stored. If you change this value, you should also change the `mirrorGraphName` settings of the [LdpService](../ldp) |            
| `servers`   | `Array`   |                             | List of servers URLs you want to mirror on start                                                                                                        |


## Actions

The following service actions are available:

### `mirror`

Download the public data of the server and insert them into the local mirror graph.
Then follow the `relay` actor of the server to be kept updated of changes.
If the `relay` actor is already being followed, an error will be returned.
This action is automatically called on start if you provide the `servers` setting.

##### Parameters
| Property    | Type      | Default      | Description                 |
|-------------|-----------|--------------|-----------------------------|
| `serverUrl` | `string`  | **required** | URL of the server to mirror |

##### Return
The URL of the remote relay actor.


### LDP containers PATCH

When attaching a remote resource to a local LDP container with the `PATCH` method, if the remote server has not been mirrored yet locally, the MirrorService will mirror only that resource.

It will then periodically refresh that resource's data (using a simple fetch on the LDP resource) to keep it in sync with the remote server.

If the remote server is mirrored, then the resource will be kept up-to-date thanks to the ActivityPub activities sent by the `relay` actors.

This feature is thus independent of the mirror service and is always active when the LDP service is running.
