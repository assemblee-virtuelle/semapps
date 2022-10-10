---
title: LdpResourceService
---

## Actions

The following service actions are available:


### `ldp.resource.get`
* Get a resource by its URI
* Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property      | Type     | Default             | Description                                                                      |
|---------------|----------|---------------------|----------------------------------------------------------------------------------|
| `resourceUri` | `String` | **required**        | uri of getting subject                                                           |
| `accept`      | `string` | **required**        | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `string` | Logged user's webId | User doing the action                                                            |

You can also pass parameters defined in the [container options](./index.md#container-options).

##### Return
Triples, Turtle or JSON-LD depending on `accept` type.


### `ldp.resource.create`
* This action is called internally by `ldp.container.post`
* If called directly, the full URI must be provided in the `resource` object

##### Parameters
| Property      | Type     | Default             | Description                                                                                 |
|---------------|----------|---------------------|---------------------------------------------------------------------------------------------|
| `resource`    | `Object` | **required**        | Resource to create (with an ID)                                                             |
| `contentType` | `String` | **required**        | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `String` | Logged user's webId | User doing the action                                                                       |

##### Return values
| Property      | Type     | Description                 |
|---------------|----------|-----------------------------|
| `resourceUri` | `String` | URI of the created resource |
| `newData`     | `Object` | New value of the resource   |
| `webId`       | `String` | User who did the action     |


### `ldp.resource.patch`
* Partial update of an existing resource. Only the provided predicates will be replaced.
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property      | Type                 | Default             | Description                                                                                 |
|---------------|----------------------|---------------------|---------------------------------------------------------------------------------------------|
| `resource`    | `String` or `Object` | **required**        | Resource to update                                                                          |
| `contentType` | `String`             | **required**        | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `String`             | Logged user's webId | User doing the action                                                                       |

##### Return values
| Property      | Type     | Description                 |
|---------------|----------|-----------------------------|
| `resourceUri` | `String` | URI of the updated resource |
| `newData`     | `Object` | New value of the resource   |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |


### `ldp.resource.put`
* Full update of an existing resource
* If some predicates existed but are not provided, they will be deleted.
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property      | Type               | Default             | Description                                                                                 |
|---------------|--------------------|---------------------|---------------------------------------------------------------------------------------------|
| `resource`    | `String`, `Object` | **required**        | Resource to update                                                                          |
| `contentType` | `string`           | **required**        | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `string`           | Logged user's webId | User doing the action                                                                       |

##### Return values
| Property      | Type     | Description                 |
|---------------|----------|-----------------------------|
| `resourceUri` | `String` | URI of the updated resource |
| `newData`     | `Object` | New value of the resource   |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |


### `ldp.resource.delete`
* Delete the whole resource and detach it from its container

##### Parameters
| Property      | Type     | Default             | Description               |
|---------------|----------|---------------------|---------------------------|
| `resourceUri` | `String` | **required**        | URI of resource to delete |
| `webId`       | `string` | Logged user's webId | User doing the action     |

##### Return values
| Property      | Type     | Description                 |
|---------------|----------|-----------------------------|
| `resourceUri` | `String` | URI of the deleted resource |
| `oldData`     | `Object` | Old value of the resource   |
| `webId`       | `String` | User who did the action     |
