---
title: ActivityPub
---

This service allows you to create an ActivityPub server with data stored in a triple store.

## Features

- CRUD operations in WebID
- Storage in triple store

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

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUri` | `String` | **required** | Base URI of your web server |
| `containers` | `Object` |  | Path of the containers for the `activities`, `actors` and `objects`.
| `additionalContext` | `Object` |  | The ActivityStreams ontology is the base ontology, but you can add more contexts here if you wish.


## Actions

The following service actions are available:

### `create`

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `email` | `string` | **required** | Email address |
| `nick` | `string` | First part of the email address | Nickname |
| `name` | `string` | name | Name |
| `familyName` | `string` | null | Family name |
| `homepage` | `string` | null | User's website |

##### Return
`Object` - Created profile

### `view`

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `userId` | `string` | The webId of the logged user | User's slug  |

##### Return
`Object` - User's profile

### `edit`

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `userId` | `string` | The webId of the logged user | User's slug  |
| `email` | `string` | null | Email address |
| `nick` | `string` | null | Nickname |
| `name` | `string` | name | Name |
| `familyName` | `string` | null | Family name |
| `homepage` | `string` | null | User's website |

##### Return
`Object` - Modified profile

### `list`

##### Return
`String` - LDP container with all registered users

## Events

The following events are emitted.

### `webid.created`

Sent after a new profile is created.

##### Parameters

`Object` - Created profile