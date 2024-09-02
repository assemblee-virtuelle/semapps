---
title: TypeRegistrationsService
---

This service is automatically created by the [TypeIndexesService](./type-indexes.md).

## Actions

The following service actions are available:

### `register`

Register a type with its container, and attach it to the public TypeIndex linked with the provided WebID. If a TypeRegistration already exist for the container, simply attach the new type.

##### Parameters

| Property       | Type  | Default      | Description                                          |
| -------------- | ----- | ------------ | ---------------------------------------------------- |
| `type`         | `URI` | **required** | The type to register (can be prefixed or a full URI) |
| `containerUri` | `URI` | **required** | The URI of the container associated with this type   |
| `webId`        | `URI` | **required** | WebID of the user with the TypeIndex                 |

### `getByType`

Get a list of TypeRegistrations associated with a given type

##### Parameters

| Property | Type  | Default      | Description                                          |
| -------- | ----- | ------------ | ---------------------------------------------------- |
| `type`   | `URI` | **required** | The type to look for (can be prefixed or a full URI) |
| `webId`  | `URI` | **required** | WebID of the user with the TypeIndex                 |

##### Return

An array of TypeRegistrations

### `findContainersUris`

Get the URIs of all LDP containers associated with a given type.

##### Parameters

| Property | Type  | Default      | Description                                          |
| -------- | ----- | ------------ | ---------------------------------------------------- |
| `type`   | `URI` | **required** | The type to look for (can be prefixed or a full URI) |
| `webId`  | `URI` | **required** | WebID of the user with the TypeIndex                 |

##### Return

An array of LDP containers URIs.

### `getByContainerUri`

Get the TypeRegistration associated with a given LDP container

##### Parameters

| Property       | Type  | Default      | Description                          |
| -------------- | ----- | ------------ | ------------------------------------ |
| `containerUri` | `URI` | **required** | The URI of the container to look for |
| `webId`        | `URI` | **required** | WebID of the user with the TypeIndex |

##### Return

A TypeRegistration

### `addMissing`

Go through all existing accounts and generate TypeRegistrations for all controlled LDP containers.
