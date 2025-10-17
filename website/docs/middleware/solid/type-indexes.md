---
title: TypeIndexService
---

This service automatically create a public [TypeIndex](https://github.com/solid/type-indexes) after a user creation, and it attaches it to its WebID with the `solid:publicTypeIndex` predicate. It will also automatically [register a type](./type-registrations.md#register) for every [controlled LDP container](../ldp/controlled-container.md).

## Actions

The following service actions are available:

### `getContainersUris`

Get the URIs of all LDP containers associated with a given type.

##### Parameters

| Property | Type  | Default      | Description                                          |
| -------- | ----- | ------------ | ---------------------------------------------------- |
| `type`   | `URI` | **required** | The type to look for (can be prefixed or a full URI) |
| `webId`  | `URI` | **required** | WebID of the user with the TypeIndex                 |

##### Return

An array of LDP containers URIs.

### `getTypes`

Get the types associated with a given LDP container.

##### Parameters

| Property       | Type  | Default      | Description                          |
| -------------- | ----- | ------------ | ------------------------------------ |
| `containerUri` | `URI` | **required** | The URI of the container to look for |
| `webId`        | `URI` | **required** | WebID of the user with the TypeIndex |

##### Return

A TypeRegistration
