---
title: ActivityPub
---

This service allows you to create an ActivityPub server with data stored in a triple store.

## Features

- Store activities, actors and objects in the triple store
- Handle all kind of ontologies (see `additionalContext` setting)
- Allow to create actors when new [WebIDs](./webid.md) are created
- Currently supported activities:
  - `Create`
  - `Update`
  - `Delete`
  - `Follow`

## Dependencies

- [LdpService](ldp/index.md)
- [WebfingerService](webfinger.md)
- [SignatureService](signature.md)

## Sub-services

- ActivityService
- ActorService
- CollectionService
- FollowService
- InboxService
- ObjectService
- OutboxService

## Install

```bash
$ npm install @semapps/activitypub --save
```

## Usage

```js
const { ActivityPubService } = require('@semapps/activitypub');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: 'http://localhost:3000/',
    additionalContext: {
      foaf: 'http://xmlns.com/foaf/0.1/'
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

### Configure the API routes

```js
const { ApiGatewayService } = require('moleculer-web');

module.exports = {
  mixins: [ApiGatewayService],
  dependencies: ['activitypub'],
  async started() {
    [
      ...(await this.broker.call('activitypub.getApiRoutes')),
      // Other routes here...
    ].forEach(route => this.addRoute(route));
  }
}
```

### Queue federation POSTs

If you want to make sure no data is lost when trying to POST to remote ActivityPub servers, you can set the `queueServiceUrl` settings. 

The [Bull](https://github.com/OptimalBits/bull) task manager will queue the task and you will be able to retry it if it fails.


### Create actors on WebID creations

This is done automatically when a `webid.created` event is detected.


## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUri` | `String` | **required** | Base URI of your web server |
| `additionalContext` | `Object` |  | The ActivityStreams ontology is the base ontology, but you can add more contexts here if you wish.
| `queueServiceUrl` | `String` |  | Redis connection string. If set, the [Bull](https://github.com/OptimalBits/bull) task manager will be used to handle federation POSTs.


## Actions

The following service actions are available:

### `getApiRoutes`

##### Return
`Object` - Routes formatted for the Moleculer ApiGateway
