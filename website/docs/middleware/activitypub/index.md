---
title: ActivityPub
---

This service allows you to create an ActivityPub server with data stored in a triple store.

## Features

- Store activities, actors and objects in the triple store
- Allow to create actors when new [WebIDs](../webid.md) are created
- Side effects are supported for `Create`, `Update`, `Delete`, `Follow`, `Like` activities, as well replies

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [LdpService](../ldp)
- [WebfingerService](../webfinger)
- [SignatureService](../signature)

## Sub-services

- ActivityService
- ActivitiesWatcherService
- ActorService
- ApiService
- CollectionService
- FollowService
- InboxService
- LikeService
- ObjectService
- OutboxService
- RegistryService
- ReplyService

## Other services

- [ActivityMappingService](activity-mapping.md)
- RelayService

## Mixins

- [ActivitiesHandlerMixin](activities-handler.md)
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
    queueServiceUrl: null,
    activateTombestones: true,
    like: {
      attachToActorTypes: null
    },
    follow: {
      attachToActorTypes: null
    }
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

### Create actors on account creations

An ActivityPub actor is automatically created when a `auth.registered` event is detected.

By default, it will:

- Append the `as:Person` type, unless another ActivityStreams [actor type](https://www.w3.org/TR/activitystreams-vocabulary/#actor-types) is detected
- Use the slug of the actor as the `as:preferredUsername` property

You can adapt this behaviour to your needs with the `selectActorData` setting.
This function receives the data provided on signup (as JSON-LD), and must return the properties (with their full URI) to be appended.
For example:

```js
const selectActorData = userData => ({
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'https://www.w3.org/ns/activitystreams#Person',
  'https://www.w3.org/ns/activitystreams#name': userData['foaf:name'],
  'https://www.w3.org/ns/activitystreams#preferredUsername': userData['foaf:nick']
});
```

> Note: If no type or `as:preferredUsername` is returned by this function, it will behave as described above.

Additionally, the ActivityPub services will append all the ActivityPub-specific properties (`publicKey`, `followers`, `following`, `likes`...)

## Settings

| Property                     | Type       | Default       | Description                                                                                                                                        |
| ---------------------------- | ---------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUri`                    | `String`   | **required**  | Base URI of your web server                                                                                                                        |
| `selectActorData`            | `Function` |               | Receives the data provided on signup (as JSON-LD), and must return the properties (with full URI) to be appended to the actor profile (see above). |
| `queueServiceUrl`            | `String`   |               | Redis connection string. If set, the [Bull](https://github.com/OptimalBits/bull) task manager will be used to handle federation POSTs.             |
| `activateTombestones`        | `Boolean`  | true          | If true, all deleted resources will be replaced with a [Tombstone](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-tombstone)                |
| `like.attachToActorsTypes`   | `Array`    | All AS actors | The ActivityStreams actors which will be attached a `liked` collection                                                                             |
| `follow.attachToActorsTypes` | `Array`    | All AS actors | The ActivityStreams actors which will be attached a `followers` and `following` collections                                                        |

## Events

The following events are emitted by the different ActivityPub sub-services.

### `activitypub.follow.added`

Sent after an actor follows another one.

##### Payload

| Property    | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `follower`  | `String` | URI of the actor being followed |
| `following` | `String` | URI of the actor following      |

### `activitypub.follow.removed`

Sent after an actor stops following another one.

##### Payload

| Property    | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `follower`  | `String` | URI of the actor not being followed anymore |
| `following` | `String` | URI of the actor following                  |

### `activitypub.inbox.received`

Sent after an actor receives an activity in his inbox.

##### Payload

| Property     | Type      | Description                                |
| ------------ | --------- | ------------------------------------------ |
| `activity`   | `Object`  | Activity payload                           |
| `recipients` | `Array`   | List of recipients URIs                    |
| `local`      | `Boolean` | True if activity was sent by a local actor |

### `activitypub.like.added`

Sent after an actor likes an object

##### Payload

| Property    | Type     | Description       |
| ----------- | -------- | ----------------- |
| `actorUri`  | `String` | URI of the actor  |
| `objectUri` | `String` | URI of the object |

### `activitypub.like.removed`

Sent after an actor stops liking an object

##### Payload

| Property    | Type     | Description       |
| ----------- | -------- | ----------------- |
| `actorUri`  | `String` | URI of the actor  |
| `objectUri` | `String` | URI of the object |

### `activitypub.outbox.posted`

Sent after an actor sends an activity through his outbox.

##### Payload

| Property   | Type     | Description      |
| ---------- | -------- | ---------------- |
| `activity` | `Object` | Activity payload |
