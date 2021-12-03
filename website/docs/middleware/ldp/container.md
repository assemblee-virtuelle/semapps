---
title: LdpContainerService
---

## Actions

The following service actions are available:


### `ldp.container.attach`
* Attach a resource to a container

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of container to which the resource will be attached |
| `resourceUri` | `String` | **required** | URI of resource to attach |


### `ldp.container.detach`
* Detach a resource from a container

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of container to which the resource will be detached |
| `resourceUri` | `String` | **required** | URI of resource to attach |


### `ldp.container.exist`
* Check if a container exists

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of container to check |

##### Return
`true` or `false`


### `ldp.container.create`
* Create a new LDP container

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of the container to create |


### `ldp.container.clear`
* Deletes a container and all its attached resources

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of the container to clear |


### `ldp.container.get`
* Get all resources attached to a container
* Use the LDP ontology of direct containers

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`  | **required** | URI of container |
| `accept` | `string` | **required** | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `filters` | `Object` | null | Return only triples matching all key-value of the provided object |
| `webId` | `string` | Logged user's webId  | webId used to identify user doing action on tripleStore|

You can also pass parameters defined in the [container options](index#container-options).

##### Return
Triples, Turtle or JSON-LD depending on `accept` type.

