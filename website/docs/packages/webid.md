---
title: WebID
---

This service allows you to create and view WebID-conform profiles.

## Features

- CRUD operations in WebID
- Storage in triple store

## Dependencies

- LdpService
- TripleStoreService

## Install

```bash
$ npm install @semapps/webid --save
```

## Usage

```js
const { ServiceBroker } = require('moleculer');
const { WebIdService } = require('@semapps/webid');

const broker = new ServiceBroker();
broker.createService(WebIdService, {
  settings: {
    ... // See below
  }
});
```

Optionally, you can configure the default routes with moleculer-web:

```js
const { ApiGatewayService } = require('moleculer-web');
const { Routes } = require('@semapps/webid');

broker.createService({
  mixins: [ApiGatewayService],
  settings: {
    routes: [...Routes, /* Other routes here */],
  }
});
```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `usersContainer` | `String` | **required** | URI of the container where WebIDs will be stored |

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