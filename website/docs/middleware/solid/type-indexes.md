---
title: TypeIndexesService
---

This service automatically create a public [TypeIndex](https://github.com/solid/type-indexes) after a user creation, and it attaches it to its WebID with the `solid:publicTypeIndex` predicate. It will also automatically [register a type](./type-registrations.md#register) for every [controlled LDP container](../ldp/controlled-container.md).

## Actions

The following service actions are available:

### `createAndAttachToWebId`

Create a public TypeIndex and attach it to the given WebID.

##### Parameters

| Property | Type  | Default      | Description                      |
| -------- | ----- | ------------ | -------------------------------- |
| `webId`  | `URI` | **required** | WebID to attach the TypeIndex to |

### `findByWebID`

Get the URL of the Pod attached with the provided WebID

##### Parameters

| Property | Type  | Default      | Description                        |
| -------- | ----- | ------------ | ---------------------------------- |
| `webId`  | `URI` | **required** | WebID the TypeIndex is attached to |

##### Return

The URI of the public TypeIndex

### `migrate`

Go through all existing accounts, create public TypeIndexes, and generate TypeRegistrations for all controlled LDP containers.
