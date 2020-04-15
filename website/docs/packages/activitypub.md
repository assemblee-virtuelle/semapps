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

- LdpService

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
    containers: {
      activities: '/activities',
      actors: '/actors',
      objects: '/objects'
    },
    additionalContext: {
      foaf: 'http://xmlns.com/foaf/0.1/'
    }
  }
};
```

Optionally, you can configure the API routes with moleculer-web:

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

### Creating actors on WebID creations

This is done automatically when a `webid.created` event is detected.


## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUri` | `String` | **required** | Base URI of your web server |
| `containers` | `Object` |  | Path of the containers for the `activities`, `actors` and `objects`.
| `additionalContext` | `Object` |  | The ActivityStreams ontology is the base ontology, but you can add more contexts here if you wish.


## Actions

The following service actions are available:

### `getApiRoutes`

##### Return
`Object` - Routes formatted for the Moleculer ApiGateway
