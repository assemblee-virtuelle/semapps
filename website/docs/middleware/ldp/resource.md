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

| Property      | Type     | Default             | Description                                                                                 |
| ------------- | -------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `resource`    | `Object` | **required**        | Resource to create (with an ID)                                                             |
| `contentType` | `String` | **required**        | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `String` | Logged user's webId | User doing the action                                                                       |

##### Return values

| Property      | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `resourceUri` | `String` | URI of the created resource |
| `newData`     | `Object` | New value of the resource   |
| `webId`       | `String` | User who did the action     |

### `delete`

- Delete the whole resource and detach it from its container

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

- Finds an unique ID for a resource

##### Parameters

| Property       | Type     | Default      | Description                                       |
| -------------- | -------- | ------------ | ------------------------------------------------- |
| `containerUri` | `String` | **required** | URI of the container where to create the resource |
| `slug`         | `String` |              | Preferred slug (will be "slugified")              |

##### Return values

Full URI available

### `get`

- Get a resource by its URI
  -Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters

| Property      | Type     | Default             | Description                                                                      |
| ------------- | -------- | ------------------- | -------------------------------------------------------------------------------- |
| `resourceUri` | `String` | **required**        | URI of the resource                                                              |
| `accept`      | `string` | **required**        | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `string` | Logged user's webId | User doing the action                                                            |

You can also pass any parameter defined in the [container options](./index.md#container-options).

##### Return

Triples, Turtle or JSON-LD depending on `accept` type.

### `patch`

- Partial update of an existing resource. Allow to add and/or remove tripled.
- Accept either a SPARQL Update (with INSERT DATA and/or DELETE DATA) or an array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model)
- You can add blank nodes but not remove them (this is a limitation of the SPARQL specifications for DELETE DATA)
- If you try to modify triples not linked to the PATCH resource, it will throw an error.

##### Example query

```sparql
PREFIX as: <https://www.w3.org/ns/activitystreams#>
INSERT DATA {
  <http://localhost:3000/actor/virtual-assembly> as:name "Virtual Assembly" .
  <http://localhost:3000/actor/virtual-assembly> as:location [
     a as:Place ;
     pair:label "Paris"
  ] .
};
DELETE DATA {
  <http://localhost:3000/actor/virtual-assembly> as:name "VirtualAssembly" .
};
```

##### Parameters

| Property          | Type     | Default             | Description                                                                                        |
| ----------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| `resourceUri`     | `String` | **required**        | URI of resource to update                                                                          |
| `sparqlUpdate`    | `String` |                     | SPARQL query with INSERT DATA and/or DELETE DATA operations                                        |
| `triplesToAdd`    | `Array`  |                     | Array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model) |
| `triplesToRemove` | `Array`  |                     | Array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model) |
| `webId`           | `String` | Logged user's webId | User doing the action                                                                              |

##### Return values

| Property          | Type     | Description                                                                                        |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `resourceUri`     | `String` | URI of the updated resource                                                                        |
| `triplesToAdd`    | `Array`  | Array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model) |
| `triplesToRemove` | `Array`  | Array of triples conforming with the [RDF.js data model](https://github.com/rdfjs-base/data-model) |
| `webId`           | `String` | User who did the action                                                                            |

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
