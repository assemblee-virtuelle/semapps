---
title: LDP
---

This service allows you to set up LDP Direct Containers Interface in which subject (with their predicats and objects) can be manipulated.

## Features
* Container can manage multiple class subject


## Dependencies
* tripleStore

## Sub-services
* LdpContainerService
* LdpresourceService

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
        prefix: <myOntology1Prefix>,
        url: <myOntology1RootUrl>
      },
      {
        prefix: <myOntology2Prefix>,
        url: <myOntology2RootUrl>
      },
      {
        prefix: <myOntology2Prefix>,
        url: <myOntology3RootUrl>
      },
    ]
    containers: [<Container1>,<Container2>]
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
| `baseUrl`|`String` | **required**| root of url used to generate subject uri|
| `ontologies`| array of `Object`|**required** | list of ontology used.|
| `containers`| array of `String`| **required**| list of containers to set up. relativ url begining  whith `/`|


## Actions

The following service actions are available:
### `ldp.resource.get`
* get a subject by it uri
* accept can by `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)

:::info Actions accessible through the API
:::
```
GET <serveur>/<container>/identifier
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resourceUri` | `String`  | **required** | uri of getting subject |
| `accept` | `string` | **required** | type of return |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|
| `queryDepth` | `Integer` | 0| Object uri resolution. Only embended resolution (not http uri)|
| `jsonContext` | `Array` or `Object` `String` | 0| overide Context computed thanks to Ontology|

##### Return
`String` or `Object` depending on accept

### `ldp.resource.post`
* create a subject
* contentType can by `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)

:::info Actions accessible through the API
:::
```
POST <serveur>/<container>
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `String` or `Object`  | **required** | resource to create |
| `contentType` | `string` | **required** | type of resource |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|
| `containerUri` | `string` | **required** | uri of container where the resource will have to be create|
| `slug` | `String` | null | specific id tu use instead automatic uuid|

##### Return
`String` : uri of subject created

### `ldp.resource.patch`
* update an existing subject. If not exist, same as post
* persisted triple with the same subject but differents predicate than resource still existing.
* contentType can by `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)

:::info Actions accessible through the API
:::
```
PATCH <resourceUri>
PATCH <serveur>/<container>/identifier
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `String` or `Object`  | **required** | resource to create |
| `contentType` | `string` | **required** | type of resource |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|

##### Return
`String` : uri of subject patched

### `ldp.resource.put`
* update an existing subject. If not exist, same as post
* persisted triple with the same subject but differents predicate than resource are deleted.
* contentType can by `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)

:::info Actions accessible through the API
:::
```
PUT <resourceUri>
PUT <serveur>/<container>/identifier
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `String` or `Object`  | **required** | resource to create |
| `contentType` | `string` | **required** | type of resource |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|

##### Return
`String` : uri of subject put

### `ldp.resource.delete`
* delete subject : all triples with this subject

:::info
Actions accessible through the API
:::
```
DELETE <resourceUri>
DELETE <serveur>/<container>/identifier
```

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resourceUri` | `String`| **required** | resource uri to delete |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|

##### Return
no return



### `ldp.container.attach`
* attach a subject to a containers

:::info
Action Not accessible through the API
:::


##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | uri of container in which resource will be attached |
| `resourceUri` | `String` | **required**   |uri of resource to attach|

##### Return
no return

### `ldp.container.detach`
* detach a subject to a containers

:::info
Action Not accessible through the API
:::
##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | uri of container in which resource will be detached |
| `resourceUri` | `String` | **required**   |uri of resource to detach|

##### Return
no return

### `ldp.container.exist`
* check container exists linked to an uri

:::info
Action Not accessible through the API
:::
##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | uri container to check |

##### Return
no return

### `ldp.container.create`
* create a container linked to an uri

:::info
Action Not accessible through the API
:::
##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`| **required** | uri to link with new container |

##### Return
no return

### `ldp.container.get`
* get all subject attached in to a container. This subject usually posted on this container.

:::info Actions accessible through the API
:::
```
GET <serveur>/<container>
```
uri of container where the resource will have to be create

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `containerUri` | `String`  | **required** | uri of container containing subject |
| `accept` | `string` | **required** | type of return |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|
| `query` | `Object` | null | return only triples which predicate is key and value is value of object parameter|
| `queryDepth` | `Integer` | 0| Object uri resolution. Only embended resolution (not http uri)|
| `jsonContext` | `Array` or `Object` `String` | null | overide Context computed thanks to Ontology|

##### Return
`String` or `Object` depending on accept

### `ldp.getApiRoutes`

##### Return
`Object` - Routes formatted for the Moleculer ApiGateway
