---
title: TripleStore
---

This service allows you to interface with a [Jena Fuseki](https://jena.apache.org/documentation/fuseki2/) triple store.

## Features
* Basic triple store operations
  * Query
  * Update
  * Insert
  * Delete
* Basic utilities
  * Count number of triples of a subject
  * Drop all triples in a dataset

## Dependencies

- None

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
    sparqlEndpoint: 'http://localhost:3030/',
    mainDataset: 'myDataSet',
    jenaUser: 'admin',
    jenaPassword: 'admin'
  }
};
```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `sparqlEndpoint`|`String`|**required** | Jena Fuseki's root URI |
| `mainDataset`|`String`| **required** | Used dataset |
| `jenaUser`| `String` | **required** | Jena Fuseki's admin login |
| `jenaPassword` | `String` | **required** | Jena Fuseki's admin password |

## Actions

The following service actions are available:

### `triplestore.query`
* Execute a SPARQL Query and return result in accept type provided
* SELECT, CONSTRUCT, ASK queries are supported
* Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `query` | `String`  | null| SPARQL query to execute |
| `accept` | `String` | **required** | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `String` | Logged user's webId | User doing the action |

##### Return
`String` or `Object` depending on accept

### `triplestore.update`
* Execute a SPARQL update query
* DELETE, INSERT queries supported (see [specifications](https://www.w3.org/TR/sparql11-update/))

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `query` | `String`  | null| SPARQL Update to execute |
| `webId` | `string` | Logged user's webId | User doing the action |

##### Return
None

### `triplestore.insert`
* Insert a list of triples
* Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `resource` | `Object`, `String` | **required** | Triples to insert  |
| `contentType` | `String` | `text/turtle` | Type of data provided (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId` | `String` | Logged user's webId | User doing the action |

##### Return
None

### `delete`
*  Delete all triples associated with a subject

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `uri` | `String`  | **required** | Subject |
| `webId` | `String` | Logged user's webId | User doing the action |

##### Return
None

### `triplestore.countTripleOfSubject`
* Count all triples associated with a subject

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `uri` | `String`  | **required** | Subject |
| `webId` | `String` | Logged user's webId | User doing the action |

##### Return
`Integer` - Number of triples associated with the given subject

### `triplestore.dropAll`
* Delete all triples on the dataset

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `webId` | `String` | Logged user's webId | User doing the action |

##### Return
None
