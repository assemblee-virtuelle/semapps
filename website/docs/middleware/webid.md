---
title: WebID
---

This service allows you to create and view WebID-conform profiles.


## Dependencies

- [LdpService](ldp)


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
    usersContainer: 'http://localhost:3000/users'
  }
};
```

> Note: the users' container must be set through the LdpService


## Settings

| Property         | Type      | Default                                | Description                                      |
|------------------|-----------|----------------------------------------|--------------------------------------------------|
| `baseUrl`        | `String`  | **required** if `podProvider` is true  | Base URL of the instance                         |
| `usersContainer` | `String`  | **required** if `podProvider` is false | URI of the container where WebIDs will be stored |
| `podProvider`    | `Boolean` | false                                  | Set to true if you are setting up a POD provider |


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


### `view`

##### Parameters
| Property  | Type     | Default                      | Description  |
|-----------|----------|------------------------------|--------------|
| `userId`  | `string` | The webId of the logged user | User's slug  |

##### Return
`Object` - User's profile


## Events

The following events are emitted.

### `webid.created`

Sent after a new profile is created.

##### Parameters

`Object` - Created profile