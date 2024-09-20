---
title: LdpResourceService
---

This service is automatically created by the [LdpService](index)

## Actions

The following service actions are available:

### `create`

- This action is called internally by `ldp.container.post`
- If called directly, the full URI must be provided in the `@id` of the `resource` object

##### Parameters

| Property      | Type     | Default             | Description                     |
| ------------- | -------- | ------------------- | ------------------------------- |
| `resource`    | `Object` | **required**        | Resource to create (with an ID) |
| `contentType` | `String` | **required**        | Type of provided resource       |
| `webId`       | `String` | Logged user's webId | User doing the action           |

##### Return values

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the created resource |
| `newData`     | `Object` | New value of the resource   |
| `webId`       | `String` | User who did the action     |

### `delete`

Delete the whole resource and detach it from its container

##### Parameters

| Property      | Type     | Default             | Description               |
| ------------- | -------- | ------------------- | ------------------------- |
| `resourceUri` | `String` | **required**        | URI of resource to delete |
| `webId`       | `string` | Logged user's webId | User doing the action     |

##### Return values

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the deleted resource |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |

### `exist`

- Check if a resource exist

##### Parameters

| Property           | Type      | Default             | Description                                                    |
| ------------------ | --------- | ------------------- | -------------------------------------------------------------- |
| `resourceUri`      | `String`  | **required**        | URI of the resource to check                                   |
| `acceptTombstones` | `Boolean` | true                | If false, calling this action on a Tombstone will return false |
| `webId`            | `String`  | Logged user's webId | User doing the action                                          |

##### Return values

`Boolean`

### `generateId`

Finds an unique ID for a resource

##### Parameters

| Property       | Type      | Default      | Description                                          |
| -------------- | --------- | ------------ | ---------------------------------------------------- |
| `containerUri` | `String`  | **required** | URI of the container where to create the resource    |
| `slug`         | `String`  |              | Preferred slug (will be "slugified")                 |
| `isContainer`  | `Boolean` | `false`      | Set to true if you want to generate a container's ID |

##### Return values

Full available URI

### `get`

- Get a resource by its URI
  -A ccept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters

| Property      | Type     | Default             | Description           |
| ------------- | -------- | ------------------- | --------------------- |
| `resourceUri` | `String` | **required**        | URI of the resource   |
| `accept`      | `string` | **required**        | Type to return        |
| `webId`       | `string` | Logged user's webId | User doing the action |

You can also pass any parameter defined in the [container options](./index.md#container-options).

##### Return

Triples, Turtle or JSON-LD depending on `accept` type.

### `getContainers`

Get the list of containers which includes the resource

##### Parameters

| Property      | Type     | Default                             | Description                                     |
| ------------- | -------- | ----------------------------------- | ----------------------------------------------- |
| `resourceUri` | `String` | **required**                        | URI of the resource                             |
| `dataset`     | `String` | **required** in Pod provider config | The dataset in which to look for the containers |

##### Return

An array of containers URIS

### `getTypes`

Get the type(s) of the given resource

##### Parameters

| Property      | Type     | Default      | Description         |
| ------------- | -------- | ------------ | ------------------- |
| `resourceUri` | `String` | **required** | URI of the resource |

##### Return

An array of types

### `patch`

- Partial update of an existing resource. Allow to add and/or remove tripled.
- Takes an array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model)
- You can add blank nodes but not remove them (this is a limitation of the SPARQL specifications for DELETE DATA)
- If you try to modify triples not linked to the PATCH resource, it will throw an error.

##### Parameters

| Property          | Type     | Default             | Description                                                 |
| ----------------- | -------- | ------------------- | ----------------------------------------------------------- |
| `resourceUri`     | `String` | **required**        | URI of resource to update                                   |
| `triplesToAdd`    | `Array`  |                     | Triples to add, in RDF/JS format. See below for details.    |
| `triplesToRemove` | `Array`  |                     | Triples to remove, in RDF/JS format. See below for details. |
| `webId`           | `String` | Logged user's webId | User doing the action                                       |

Example usage:

```js
const { triple, namedNode } = require('@rdfjs/data-model');

await this.broker.call('ldp.resource.patch', {
  containerUri: 'http://localhost:3002/my-resource',
  triplesToAdd: [
    triple(
      namedNode('http://localhost:3002/my-resource'),
      namedNode('http://purl.org/dc/terms/creator'),
      namedNode('http://localhost:3002/alice')
    )
  ]
});
```

##### Return values

| Property         | Type     | Description                         |
| ---------------- | -------- | ----------------------------------- |
| `resourceUri`    | `String` | URI of the updated resource         |
| `triplesAdded`   | `Array`  | Array of triples which were addeed  |
| `triplesRemoved` | `Array`  | Array of triples which were removed |
| `webId`          | `String` | User who did the action             |

### `put`

- Full update of an existing resource
- If some predicates existed but are not provided, they will be deleted.
- Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters

| Property      | Type     | Default             | Description                                                                        |
| ------------- | -------- | ------------------- | ---------------------------------------------------------------------------------- |
| `resource`    | `Object` | **required**        | Resource to update                                                                 |
| `contentType` | `string` | **required**        | Type of resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `string` | Logged user's webId | User doing the action                                                              |

##### Return values

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the updated resource |
| `newData`     | `Object` | New value of the resource   |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |

### `upload`

Upload a given file and return its JSON-LD representation

##### Parameters

| Property      | Type     | Default      | Description                                                                |
| ------------- | -------- | ------------ | -------------------------------------------------------------------------- |
| `resourceUri` | `String` | **required** | URI of the file resource. Will be used when choosing the path of the file. |
| `file`        | `File`   | **required** | File to upload                                                             |

##### Return values

The JSON-LD representation of the uploaded file (using the `semapps:File` predicate).

## Events

The following events are emitted.

### `ldp.resource.created`

Sent after a resource is created.

##### Payload

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the created resource |
| `newData`     | `Object` | New value of the resource   |
| `webId`       | `String` | User who did the action     |

### `ldp.resource.deleted`

Sent after a resource is deleted.

##### Payload

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the deleted resource |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |

### `ldp.resource.patched`

Sent after a resource is patched

##### Payload

| Property         | Type     | Description                                                                                        |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `resourceUri`    | `String` | URI of the updated resource                                                                        |
| `triplesAdded`   | `Array`  | Array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model) |
| `triplesRemoved` | `Array`  | Array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model) |
| `webId`          | `String` | User who did the action                                                                            |

### `ldp.resource.updated`

Sent after a resource is updated (through PUT)

##### Payload

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the updated resource |
| `newData`     | `Object` | New value of the resource   |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |
