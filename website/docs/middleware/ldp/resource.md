---
title: LdpResourceService
---

## Actions

The following service actions are available:


### `ldp.resource.get`
* Get a resource by its URI
* Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resourceUri` | `String`  | **required** | uri of getting subject |
| `accept` | `string` | **required** | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `string` | Logged user's webId | User doing the action |

You can also pass parameters defined in the [container options](index#container-options).

##### Return
Triples, Turtle or JSON-LD depending on `accept` type.


### `ldp.container.post`
* Create a resource
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `String` or `Object`  | **required** | Resource to create |
| `containerUri` | `string` | **required** | Container where the resource will be created |
| `contentType` | `string` | **required** | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `string` | Logged user's webId  | User doing the action |
| `slug` | `String` |  | Specific ID tu use for URI instead generated UUID |

##### Return
`String` : URI of the created resource


### `ldp.resource.patch`
* Partial update of an existing resource. Only the provided predicates will be replaced.
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `String` or `Object`  | **required** | Resource to update |
| `contentType` | `string` | **required** | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `string` | Logged user's webId | User doing the action |

##### Return
`String` : URI of the updated resource


### `ldp.resource.put`
* Full update of an existing resource
* If some predicates existed but are not provided, they will be deleted.
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `String`, `Object`  | **required** | Resource to update |
| `contentType` | `string` | **required** | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `string` | Logged user's webId | User doing the action |

##### Return
`String` : URI of the updated resource


### `ldp.resource.delete`
* Delete the whole resource and detach it from its container

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resourceUri` | `String`| **required** | URI of resource to delete |
| `webId` | `string` | Logged user's webId | User doing the action |
