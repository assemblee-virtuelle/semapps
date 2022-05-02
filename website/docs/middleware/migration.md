---
title: Migration utilities
---

This package provide utilities to help migrate semantic data.

## Dependencies
- [TripleStoreService](triplestore.md)
- [LdpService](ldp/index.md)

## Install

```bash
$ npm install @semapps/migration --save
```

## Usage

```js
const { MigrationService } = require('@semapps/migration');
const path = require('path');

module.exports = {
  mixins: [MigrationService]
}
```

## Actions

### `replacePredicate`

Replace an old predicate with a new predicate on the whole dataset.

##### Parameters
| Property       | Type     | Default         | Description                                         |
|----------------|----------|-----------------|-----------------------------------------------------|
| `oldPredicate` | `String` | **required**    | Predicate to be replaced (with prefix or full URL)  |
| `newPredicate` | `String` | **required**    | Predicate to replace with (with prefix or full URL) |
| `dataset`      | `String` | Default dataset | Dataset where migration will be applied             |


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
