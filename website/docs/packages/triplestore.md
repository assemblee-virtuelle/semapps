---
title: TripleStore
---

This service allows you to create a TripleStore service wich offer basic interface to interact with Jenna triplestore.

## Features



## Dependencies


## Sub-services


## Install
```bash
$ npm install @semapps/triplestore --save
```

## Usage
```js
const { TripleStoreService } = require('@semapps/triplestore');

module.exports = {
  mixins: [TripleStoreService],
  settings: {
    sparqlEndpoint: http://fuseki:3030/,
    mainDataset: <myDataset>
    jenaUser: <myAdminUser>,
    jenaPassword: <myAdminPassword>
  }
};

```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
|`sparqlEndpoint`|`String`|**required**|root url of fuseki|
|`mainDataset`|`String`| **required**|fuseki's dataset used to persiste triples|
|`jenaUser`|`String`|**required** |fuseki's admin login|
|`jenaPassword`|`String`|**required**|fuseki's admin password|


## Actions

The following service actions are available:
### `query`
* execute a SPARQL Query and return result in accept type provided
* accept can by `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)
};

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `query` | `String`  | null| SPARQL Query to execute |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|
| `accept` | `string` | **required** | type of return |

##### Return
`String` or `Object` depending on accept


### `insert`
* insert triples provided
* triples provided can be `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `Object` or `String`  | null| triples tu insert  |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|
| `contentType` | `string` | text/turtle | type of resource |

##### Return
no return

### `patch`
*  delete triples which have same subject and same predicat of resource provided
* insert triples provided
* 2 opérations in one request
* no supported embended subjects
* triples provided can be `@SemApps/mime-types/constants.MIME_TYPES` (`application/ld+json`,`text/turtle`,`application/n-triples`)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `Object` or `String`  | null| triples tu patch  |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|
| `contentType` | `string` | text/turtle | type of resource |

##### Return
no return

### `delete`
*  delete all triples with this subject

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `uri` | `String`  | null| subject of triples to delete |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|

##### Return
no return

### `countTripleOfSubject`
*  count all triples with this subject

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `uri` | `String`  | null| subject of triples to count |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|

##### Return
`Integer`

### `dropAll`
* delete all triple on dataset

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `webId` | `string` | The webId of the logged user  | webId used to identify user doing action on tripleStore|

##### Return
no return
