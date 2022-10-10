---
title: LdpContainerService
---

## Actions

The following service actions are available:


### `ldp.container.attach`
* Attach a resource to a container

##### Parameters
| Property       | Type     | Default      | Description                                             |
|----------------|----------|--------------|---------------------------------------------------------|
| `containerUri` | `String` | **required** | URI of container to which the resource will be attached |
| `resourceUri`  | `String` | **required** | URI of resource to attach                               |


### `ldp.container.detach`
* Detach a resource from a container

##### Parameters
| Property       | Type     | Default      | Description                                             |
|----------------|----------|--------------|---------------------------------------------------------|
| `containerUri` | `String` | **required** | URI of container to which the resource will be detached |
| `resourceUri`  | `String` | **required** | URI of resource to attach                               |

### `ldp.container.patch`
* Attach and/or detach resource(s) from a container
* the format of the `update`string is as follow:
```
PREFIX ldp: <http://www.w3.org/ns/ldp#>
INSERT DATA { <http://url/of/container> ldp:contains <http://url/of/resource/to/attach>. };
DELETE DATA { <http://url/of/container> ldp:contains <http://url/of/resource/to/detach>. };
```
Any remote RDF resource can be attached to a container, given that its server can answer a GET request on it that returns its content in Turtle format.
This means that even other LDP servers than semapps can have their resources linked to a container.

##### Parameters
| Property       | Type     | Default      | Description                                                             |
|----------------|----------|--------------|-------------------------------------------------------------------------|
| `containerUri` | `String` | **required** | URI of container to which the resource will be detached                 |
| `update`       | `String` | **required** | SPARQL UPDATE string contains INSERT DATA and/or DELETE DATA statements |
| `contentType`  | `String` | **optional** | must be `application/sparql-update`)                                    |

### `ldp.container.exist`
* Check if a container exists

##### Parameters
| Property       | Type     | Default      | Description               |
|----------------|----------|--------------|---------------------------|
| `containerUri` | `String` | **required** | URI of container to check |

##### Return
`true` or `false`


### `ldp.container.create`
* Create a new LDP container

##### Parameters
| Property       | Type     | Default      | Description                    |
|----------------|----------|--------------|--------------------------------|
| `containerUri` | `String` | **required** | URI of the container to create |


### `ldp.container.clear`
* Deletes a container and all its attached resources

##### Parameters
| Property       | Type     | Default      | Description                   |
|----------------|----------|--------------|-------------------------------|
| `containerUri` | `String` | **required** | URI of the container to clear |


### `ldp.container.get`
* Get all resources attached to a container
* Use the LDP ontology of direct containers

##### Parameters
| Property       | Type     | Default             | Description                                                                      |
|----------------|----------|---------------------|----------------------------------------------------------------------------------|
| `containerUri` | `String` | **required**        | URI of container                                                                 |
| `accept`       | `string` | **required**        | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `filters`      | `Object` | null                | Return only triples matching all key-value of the provided object                |
| `webId`        | `string` | Logged user's webId | webId used to identify user doing action on tripleStore                          |

You can also pass parameters defined in the [container options](index.md#container-options).

##### Return
Triples, Turtle or JSON-LD depending on `accept` type.


### `ldp.container.post`
* Generate an URI, create the resource (calling `ldp.resource.create`), and attach it to a container
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property       | Type     | Default             | Description                                                                                 |
|----------------|----------|---------------------|---------------------------------------------------------------------------------------------|
| `resource`     | `Object` | **required**        | Resource to create                                                                          |
| `containerUri` | `string` | **required**        | Container where the resource will be created                                                |
| `contentType`  | `string` | **required**        | Type of provided resource (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`        | `string` | Logged user's webId | User doing the action                                                                       |
| `slug`         | `String` |                     | Specific ID tu use for URI instead generated UUID                                           |

##### Return
`String` : URI of the created resource
