---
title: WebID
---

This service allows you to create and view WebID-conform profiles.

## Features

- CRUD operations in WebID
- Storage in triple store

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [LdpService](ldp/index.md)
- [TripleStoreService](triplestore/index.md)

## Install

```bash
$ yarn add @semapps/webid
```

## Usage

```js
const { WebIdService } = require('@semapps/webid');

module.exports = {
  mixins: [WebIdService],
  settings: {
    usersContainer: 'http://localhost:3000/users/'
  }
};
```

## Settings

| Property         | Type     | Default      | Description                                      |
|------------------|----------|--------------|--------------------------------------------------|
| `usersContainer` | `String` | **required** | URI of the container where WebIDs will be stored |

## Actions

The following service actions are available:

### `create`

##### Parameters
| Property     | Type     | Default                         | Description    |
|--------------|----------|---------------------------------|----------------|
| `email`      | `string` | **required**                    | Email address  |
| `nick`       | `string` | First part of the email address | Nickname       |
| `name`       | `string` | name                            | Name           |
| `familyName` | `string` | null                            | Family name    |
| `homepage`   | `string` | null                            | User's website |

##### Return
`Object` - Created profile

### `view`

##### Parameters
| Property  | Type     | Default                      | Description  |
|-----------|----------|------------------------------|--------------|
| `userId`  | `string` | The webId of the logged user | User's slug  |

##### Return
`Object` - User's profile

### `edit`

##### Parameters
| Property     | Type     | Default                      | Description    |
|--------------|----------|------------------------------|----------------|
| `userId`     | `string` | The webId of the logged user | User's slug    |
| `email`      | `string` | null                         | Email address  |
| `nick`       | `string` | null                         | Nickname       |
| `name`       | `string` | name                         | Name           |
| `familyName` | `string` | null                         | Family name    |
| `homepage`   | `string` | null                         | User's website |

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