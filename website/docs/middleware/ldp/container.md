---
title: LdpContainerService
---

This service is automatically created by the [LdpService](index) with the key `ldp.container`.

## Actions

The following service actions are available:

### `attach`

Attach a resource to a container

##### Parameters

| Property       | Type     | Default             | Description                                             |
| -------------- | -------- | ------------------- | ------------------------------------------------------- |
| `containerUri` | `String` | **required**        | URI of container to which the resource will be attached |
| `resourceUri`  | `String` | **required**        | URI of resource to attach                               |
| `webId`        | `String` | Logged user's webId | User doing the action                                   |

### `clear`

Delete all the resources attached to a container

##### Parameters

| Property       | Type     | Default             | Description                   |
| -------------- | -------- | ------------------- | ----------------------------- |
| `containerUri` | `String` | **required**        | URI of the container to clear |
| `webId`        | `String` | Logged user's webId | User doing the action         |

### `create`

- Create a new LDP container
- This does **not** create the relative API routes.

##### Parameters

| Property       | Type     | Default             | Description                                   |
| -------------- | -------- | ------------------- | --------------------------------------------- |
| `containerUri` | `String` | **required**        | URI of the container to create                |
| `title`        | `String` |                     | Title of the container                        |
| `description`  | `String` |                     | Description of the container                  |
| `permissions`  | `String` |                     | WAC permissions to apply to the new container |
| `webId`        | `String` | Logged user's webId | User doing the action                         |

### `createAndAttach`

- Create a container and attach it to its parent container(s)
- Recursively create the parent container(s) if they don't exist
- In Pod provider config, the webId is required to find the Pod root

##### Parameters

| Property       | Type     | Default             | Description                                   |
| -------------- | -------- | ------------------- | --------------------------------------------- |
| `containerUri` | `String` | **required**        | URI of the container to create                |
| `title`        | `String` |                     | Title of the container                        |
| `description`  | `String` |                     | Description of the container                  |
| `permissions`  | `String` |                     | WAC permissions to apply to the new container |
| `webId`        | `String` | Logged user's webId | User doing the action                         |

### `detach`

Detach a resource from a container

##### Parameters

| Property       | Type     | Default             | Description                                             |
| -------------- | -------- | ------------------- | ------------------------------------------------------- |
| `containerUri` | `String` | **required**        | URI of container to which the resource will be detached |
| `resourceUri`  | `String` | **required**        | URI of resource to attach                               |
| `webId`        | `String` | Logged user's webId | User doing the action                                   |

### `exist`

Check if a container exists

##### Parameters

| Property       | Type     | Default             | Description               |
| -------------- | -------- | ------------------- | ------------------------- |
| `containerUri` | `String` | **required**        | URI of container to check |
| `webId`        | `String` | Logged user's webId | User doing the action     |

##### Return

`true` or `false`

### `get`

Get the LDP container with all its resources (which are dereferenced)

##### Parameters

| Property                | Type                | Default             | Description                                        |
| ----------------------- | ------------------- | ------------------- | -------------------------------------------------- |
| `containerUri`          | `String`            | **required**        | URI of container                                   |
| `accept`                | `String`            | **required**        | Type to return                                     |
| `filters`               | `Object`            |                     | Key/value with predicates and value                |
| `doNotIncludeResources` | `Boolean`           | false               | If true, does not return the contained resources   |
| `jsonContext`           | `Object`or `String` |                     | JSON-LD context to use when compacting the results |
| `webId`                 | `String`            | Logged user's webId | User doing the action                              |

You can also pass parameters defined in the [container options](index.md#container-options).

##### Return

Triples, Turtle or JSON-LD depending on `accept` type.

### `getAll`

Get the list of all existing containers

##### Parameters

| Property  | Type     | Default | Description                               |
| --------- | -------- | ------- | ----------------------------------------- |
| `dataset` | `String` |         | Dataset (required in Pod provider config) |

##### Return

Array of URIs

### `getPath`

Get the container path based on the provided resourceType.
For example, if you pass `pair:ProjectType`, it will return `/pair/project-type`.
Ontologies must be previously [registered](../ontologies#register) or the action will throw an error.

##### Parameters

| Property       | Type     | Default      | Description                   |
| -------------- | -------- | ------------ | ----------------------------- |
| `resourceType` | `String` | **required** | URI or prefixed resource type |

##### Return

The path of the container

### `getUris`

Get the list of all resources within a container

##### Parameters

| Property       | Type     | Default      | Description      |
| -------------- | -------- | ------------ | ---------------- |
| `containerUri` | `String` | **required** | URI of container |

##### Return

Array of URIs

### `includes`

Checks if a resource is in the container

##### Parameters

| Property       | Type     | Default             | Description           |
| -------------- | -------- | ------------------- | --------------------- |
| `containerUri` | `String` | **required**        | URI of container      |
| `resourceUri`  | `String` | **required**        | URI of resource       |
| `webId`        | `String` | Logged user's webId | User doing the action |

##### Return

`Boolean`

### `isEmpty`

Checks if a container is empty

##### Parameters

| Property       | Type     | Default             | Description           |
| -------------- | -------- | ------------------- | --------------------- |
| `containerUri` | `String` | **required**        | URI of container      |
| `webId`        | `String` | Logged user's webId | User doing the action |

##### Return

`Boolean`

### `patch`

Attach and/or detach resource(s) from a container

##### Parameters

| Property          | Type     | Default             | Description                                                         |
| ----------------- | -------- | ------------------- | ------------------------------------------------------------------- |
| `containerUri`    | `String` | **required**        | URI of container to which the resource will be attached or detached |
| `triplesToAdd`    | `Array`  |                     | Triples to add, in RDF/JS format. See below for details.            |
| `triplesToRemove` | `Array`  |                     | Triples to remove, in RDF/JS format. See below for details.         |
| `webId`           | `string` | Logged user's webId | User doing the action                                               |

Example usage:

```js
const { triple, namedNode } = require('@rdfjs/data-model');

await this.broker.call('ldp.container.patch', {
  containerUri: 'http://localhost:3002/resources',
  triplesToAdd: [
    triple(
      namedNode('http://localhost:3002/resources'),
      namedNode('http://www.w3.org/ns/ldp#contains'),
      namedNode('http://localhost:3001/resources/my-resource')
    )
  ]
});
```

If the resource being patched is a remote resource, it will be stored locally (with `ldp.remote.store`) before being attached to the container.

### `post`

- Generate an URI, create the resource (calling `ldp.resource.create`), and attach it to a container
- Content type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters

| Property       | Type     | Default             | Description                                       |
| -------------- | -------- | ------------------- | ------------------------------------------------- |
| `resource`     | `Object` | **required**        | Resource to create                                |
| `containerUri` | `String` | **required**        | Container where the resource will be created      |
| `contentType`  | `String` | **required**        | Type of data                                      |
| `slug`         | `String` |                     | Specific ID tu use for URI instead generated UUID |
| `webId`        | `String` | Logged user's webId | User doing the action                             |

The `slug` parameter is ignored if the `resourcesWithContainerPath` setting is `false`.

##### Return

URI of the created resource

## Events

The following events are emitted.

### `ldp.container.attached`

Sent after a resource is attached to a container

##### Payload

| Property       | Type     | Description      |
| -------------- | -------- | ---------------- |
| `containerUri` | `String` | URI of container |
| `resourceUri`  | `String` | URI of resource  |

### `ldp.container.detached`

Sent after a resource is detached from a container

##### Payload

| Property       | Type     | Description      |
| -------------- | -------- | ---------------- |
| `containerUri` | `String` | URI of container |
| `resourceUri`  | `String` | URI of resource  |

### `ldp.container.patched`

Sent after a PATCH operation on the container

##### Payload

| Property       | Type     | Description      |
| -------------- | -------- | ---------------- |
| `containerUri` | `String` | URI of container |
