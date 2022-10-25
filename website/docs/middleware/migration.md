---
title: Migration utilities
---

This package provide utilities to help migrate semantic data.

## Dependencies
- [TripleStoreService](triplestore)
- [LdpService](ldp)

## Install

```bash
$ yarn add @semapps/migration
```

## Usage

```js
const { MigrationService } = require('@semapps/migration');
const path = require('path');

module.exports = {
  mixins: [MigrationService],
  settings: {
    baseUrl: 'http://localhost:3000'
  }
}
```

## Actions

The following service actions are available.


### `clearUserRights`

- Remove all rights associated with a user
- Remove the user from all WebACL groups he may be member of

##### Parameters
| Property      | Type     | Default         | Description                             |
|---------------|----------|-----------------|-----------------------------------------|
| `userUri`     | `String` | **required**    | URI of the user                         |
| `dataset`     | `String` | Default dataset | Dataset where migration will be applied |


### `moveResource`

Move a resource to a new URI. Also move the WebACL rights of the resource.

##### Parameters
| Property         | Type     | Default         | Description                             |
|------------------|----------|-----------------|-----------------------------------------|
| `oldResourceUri` | `String` | **required**    | Resource to move                        |
| `newResourceUri` | `String` | **required**    | New URI of the resource                 |
| `dataset`        | `String` | Default dataset | Dataset where migration will be applied |


### `moveAclGroup`

Move an ACL group to a new URI. Also move the WebACL rights of the group.

##### Parameters
| Property      | Type     | Default         | Description                             |
|---------------|----------|-----------------|-----------------------------------------|
| `oldGroupUri` | `String` | **required**    | Group to move                           |
| `newGroupUri` | `String` | **required**    | New URI of the group                    |
| `dataset`     | `String` | Default dataset | Dataset where migration will be applied |


### `replacePredicate`

Replace an old predicate with a new predicate on the whole dataset.

##### Parameters
| Property       | Type     | Default         | Description                             |
|----------------|----------|-----------------|-----------------------------------------|
| `oldPredicate` | `String` | **required**    | Full URI of predicate to be replaced    |
| `newPredicate` | `String` | **required**    | Full URI of predicate to replace with   |
| `dataset`      | `String` | Default dataset | Dataset where migration will be applied |
