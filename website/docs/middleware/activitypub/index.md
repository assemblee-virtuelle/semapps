---
title: ActivityPub
---

This service allows you to create an ActivityPub server with data stored in a triple store.

## Features

- Store activities, actors and objects in the triple store
- Allow to create actors when new [WebIDs](../webid.md) are created
- Currently supported activities:
  - `Create`
  - `Update`
  - `Delete`
  - `Follow`

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [LdpService](../ldp)
- [WebfingerService](../webfinger)
- [SignatureService](../signature)

## Sub-services

- ActivityService
- ActorService
- CollectionService
- FollowService
- InboxService
- LikeService
- ObjectService
- OutboxService
- ProxyService
- ReplyService
- RegistryService

## Other services
- [ActivityMappingService](activity-mapping.md)

## Mixins
- [ActivitiesHandlerMixin](activities-handler.md)
- ControlledCollectionMixin
- BotMixin

## Install

```bash
$ yarn add @semapps/activitypub
```

## Usage

```js
const { ActivityPubService } = require('@semapps/activitypub');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: 'http://localhost:3000/',
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    dispatch: {
      queueServiceUrl: null
    },
    like: {
      attachToObjectTypes: null,
      attachToActorTypes: null
    },
    follow: {
      attachToActorTypes: null
    },
    reply: {
      attachToObjectTypes: null
    },
  }
};
```

### Configure the LDP containers

The containers for actors and objects are handled through the LDP service. You need to define containers with ActivityStreams's actors and objects in the `acceptedTypes`. Alternatively, you can load the default containers from the `@semapps/activitypub` package as below:

```js
const { LdpService } = require('@semapps/ldp');
const { containers: apContainers } = require('@semapps/activitypub');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: process.env.SEMAPPS_HOME_URL,
    containers: ['/my-container', ...apContainers]
  }
};
```


### Queue federation POSTs

If you want to make sure no data is lost when trying to POST to remote ActivityPub servers, you can set the `dispatch.queueServiceUrl` settings. 

The [Bull](https://github.com/OptimalBits/bull) task manager will queue the task and you will be able to retry it if it fails.


### Create actors on WebID creations

This is done automatically when a `webid.created` event is detected.


## Settings

| Property                     | Type                | Default         | Description                                                                                                                            |
|------------------------------|---------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `baseUri`                    | `String`            | **required**    | Base URI of your web server                                                                                                            |
| `jsonContext`                | `String` or `Object` | 'https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'                | The ActivityStreams ontology is the base ontology, but you can add more contexts here if you wish.                                     |
| `dispatch.queueServiceUrl`   | `String`            |                 | Redis connection string. If set, the [Bull](https://github.com/OptimalBits/bull) task manager will be used to handle federation POSTs. |
| `like.attachToObjectTypes`   | `Array`             | All AS objects  | The ActivityStreams objects which will be attached a `likes` collection                                                                |
| `like.attachToActorsTypes`   | `Array`             | All AS actors   | The ActivityStreams actors which will be attached a `liked` collection                                                                 |
| `follow.attachToActorsTypes` | `Array`             | All AS actors   | The ActivityStreams actors which will be attached a `followers` and `following` collections                                            |
| `reply.attachToObjectTypes`  | `Array`             | All AS objects  | The ActivityStreams objects which will be attached a `replies` collection                                                              |


## Events

The following events are emitted by the different ActivityPub sub-services.

### `activitypub.follow.added`
Sent after an actor follows another one.

##### Payload
| Property    | Type     | Description                     |
|-------------|----------|---------------------------------|
| `follower`  | `String` | URI of the actor being followed |
| `following` | `String` | URI of the actor following      |

### `activitypub.follow.removed`
Sent after an actor stops following another one.

##### Payload
| Property    | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| `follower`  | `String` | URI of the actor not being followed anymore |
| `following` | `String` | URI of the actor following                  |


### `activitypub.inbox.received`
Sent after an actor receives an activity in his inbox.

##### Payload
| Property     | Type     | Description             |
|--------------|----------|-------------------------|
| `activity`   | `Object` | Activity payload        |
| `recipients` | `Array`  | List of recipients URIs |


### `activitypub.like.added`
Sent after an actor likes an object

##### Payload
| Property    | Type     | Description       |
|-------------|----------|-------------------|
| `actorUri`  | `String` | URI of the actor  |
| `objectUri` | `String` | URI of the object |


### `activitypub.like.removed`
Sent after an actor stops liking an object

##### Payload
| Property    | Type     | Description       |
|-------------|----------|-------------------|
| `actorUri`  | `String` | URI of the actor  |
| `objectUri` | `String` | URI of the object |


### `activitypub.outbox.posted`
Sent after an actor sends an activity through his outbox.

##### Payload
| Property     | Type     | Description             |
|--------------|----------|-------------------------|
| `activity`   | `Object` | Activity payload        |
