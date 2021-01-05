---
title: LDP
---

This service allows you to setup LDP direct containers in which resources can be manipulated.

## Features
* Handles triples, turtle and JSON-LD
* Automatic creation of containers on server start
* Full container management: create, attach resources, detach, clear, delete...

## Dependencies
* [TripleStoreService](triplestore.md)

## Sub-services
* LdpContainerService
* LdpResourceService
* CacheCleanerService

## Install

```bash
$ npm install @semapps/ldp --save
```

## Usage

```js
const { LdpService } = require('@semapps/ldp');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    ontologies : [
      {
        prefix: 'rdf',
        url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
      },
      {
        prefix: 'ldp',
        url: 'http://www.w3.org/ns/ldp#',
      },
      ...
    ],
    containers: [
      {
        path: '/resources'
      }
    ],
    defaultContainerOptions: {
      accept: 'text/turtle',
      jsonContext: null,
      queryDepth: 0,
      allowAnonymousEdit: false,
      allowAnonymousDelete: false
    }
  }
};

```

Optionally, you can configure the API routes with moleculer-web:

```js
const { ApiGatewayService } = require('moleculer-web');

module.exports = {
  mixins: [ApiGatewayService],
  dependencies: ['ldp'],
  async started() {
    [
      ...(await this.broker.call('ldp.getApiRoutes')),
      // Other routes here...
    ].forEach(route => this.addRoute(route));
  }
}
```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUrl`|`String` | **required**| Base URL of the LDP server |
| `ontologies`| `[Object]`|**required** | List of ontology used (see example above) |
| `containers`| `[Object]`| **required** | List of containers to set up, with their options |
| `defaultContainerOptions`| `[Object]`| see above | Default options for all containers |


## Actions

The following service actions are available:

### `ldp.resource.get`
* Get a resource by its URI
* Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

:::info
Action accessible through the API
:::
```
GET <serveur>/<container>/identifier
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resourceUri` | `String`  | **required** | uri of getting subject |
| `accept` | `string` | **required** | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `string` | Logged user's webId | User doing the action |
| `queryDepth` | `Integer` | 0 | Depth of resource resolution. Resolves only blank nodes, not objects with IDs. |
| `jsonContext` | `Array`, `Object` or `String` |   | Compact the returned resource with this context. Only works with JSON-LD.  |

##### Return
Triples, Turtle or JSON-LD depending on Accept type.

### `ldp.resource.post`
* Create a resource
* Content-type can be triples, turtle or JSON-LD (see `@semapps/mime-types` package)

:::info 
Action accessible through the API
:::
```
POST <serveur>/<container>
```

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

:::info 
Action accessible through the API
:::
```
PATCH <serveur>/<container>/identifier
```

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

:::info 
Action accessible through the API
:::
```
PUT <serveur>/<container>/identifier
```

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

:::info
Action accessible through the API
:::
```
DELETE <serveur>/<container>/id
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resourceUri` | `String`| **required** | URI of resource to delete |
| `webId` | `string` | Logged user's webId | User doing the action |

##### Return
None

### `ldp.container.attach`
* Attach a resource to a container

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of container to which the resource will be attached |
| `resourceUri` | `String` | **required** | URI of resource to attach |

##### Return
None

### `ldp.container.detach`
* Detach a resource from a container

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | URI of container to which the resource will be detached |
| `resourceUri` | `String` | **required** | URI of resource to attach |

##### Return
None

### `ldp.container.exist`
* Check if container exists

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

##### Return
None

### `ldp.container.get`
* Get all resources attached to a container
* Use the LDP ontology of direct containers

:::info
Action accessible through the API
:::
```
GET <serveur>/<container>
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`  | **required** | URI of container |
| `accept` | `string` | **required** | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `query` | `Object` | null | return only triples which predicate is key and value is value of object parameter|
| `queryDepth` | `Integer` | 0 | Depth of resource resolution. Resolves only blank nodes, not objects with IDs. |
| `jsonContext` | `Array`, `Object` or `String` |   | Compact the returned resource with this context. Only works with JSON-LD.  |
| `webId` | `string` | Logged user's webId  | webId used to identify user doing action on tripleStore|

##### Return
Triples, Turtle or JSON-LD depending on Accept type

### `ldp.getApiRoutes`

##### Return
`Object` - Routes formatted for the Moleculer ApiGateway
