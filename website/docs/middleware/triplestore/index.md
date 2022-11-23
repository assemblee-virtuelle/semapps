---
title: TripleStore
---

This service allows you to interface with a Jena Fuseki [triple store](../../triplestore).

## Features

- Basic triplestore operations (Query, Update, Insert, Delete)
- Dataset management

## Sub-services

- [DatasetService](dataset.md)

## Dependencies

- None

## Install

```bash
$ yarn add @semapps/triplestore
```

## Usage

```js
const { TripleStoreService } = require('@semapps/triplestore');

module.exports = {
  mixins: [TripleStoreService],
  settings: {
    url: 'http://localhost:3030/',
    user: 'admin',
    password: 'admin',
    mainDataset: 'myDataSet',
  }
};
```

## Settings

| Property      | Type     | Default      | Description                  |
|---------------|----------|--------------|------------------------------|
| `url`         | `String` | **required** | Jena Fuseki's root URL       |
| `user`        | `String` | **required** | Jena Fuseki's admin login    |
| `password`    | `String` | **required** | Jena Fuseki's admin password |
| `mainDataset` | `String` | **required** | Default dataset              |

## Actions

The following service actions are available:


### `countTripleOfSubject`
- Count all triples associated with a subject

##### Parameters
| Property    | Type     | Default              | Description                            |
|-------------|----------|----------------------|----------------------------------------|
| `uri`       | `String` | **required**         | Subject                                |
| `webId`     | `String` | Logged user's webId  | User doing the action                  |
| `dataset`   | `String` | Main dataset         | Dataset where to execute the operation |
| `graphName` | `String` | Default graph        | Graph where to execute the operation   |

##### Return
`Integer` - Number of triples associated with the given subject


### `deleteOrphanBlankNodes`
- Delete all orphan blank nodes in a given dataset and graph

##### Parameters
| Property    | Type     | Default       | Description                            |
|-------------|----------|---------------|----------------------------------------|
| `dataset`   | `String` | Main dataset  | Dataset where to execute the operation |
| `graphName` | `String` | Default graph | Graph where to execute the operation   |

##### Return
None


### `dropAll`
- Delete all triples on the given dataset

##### Parameters
| Property  | Type     | Default              | Description                            |
|-----------|----------|----------------------|----------------------------------------|
| `webId`   | `String` | Logged user's webId  | User doing the action                  |
| `dataset` | `String` | Main dataset         | Dataset where to execute the operation |

##### Return
None


### `insert`
- Insert a list of triples
- Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property      | Type               | Default             | Description                                                                             |
|---------------|--------------------|---------------------|-----------------------------------------------------------------------------------------|
| `resource`    | `Object`, `String` | **required**        | Triples to insert                                                                       |
| `contentType` | `String`           | `text/turtle`       | Type of data provided (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `webId`       | `String`           | Logged user's webId | User doing the action                                                                   |
| `dataset`     | `String`           | Main dataset        | Dataset where to insert the data                                                        |
| `graphName`   | `String`           | Default graph       | Graph where to insert the data                                                          |

##### Return
None


### `query`
- Execute a SPARQL Query and return result in accept type provided
- SELECT, CONSTRUCT, ASK queries are supported
- Accept triples, turtle or JSON-LD (see `@semapps/mime-types` package)

##### Parameters
| Property  | Type                 | Default             | Description                                                                                             |
|-----------|----------------------|---------------------|---------------------------------------------------------------------------------------------------------|
| `query`   | `String` or `Object` | **required**        | SPARQL query to execute (as a string or [SPARQL.js](https://github.com/RubenVerborgh/SPARQL.js) object) |
| `accept`  | `String`             | **required**        | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`)                        |
| `webId`   | `String`             | Logged user's webId | User doing the action                                                                                   |
| `dataset` | `String`             | Main dataset        | Dataset where to execute the query                                                                      |

##### Return
`String` or `Object` depending on accept


### `update`
- Execute a SPARQL update query
- DELETE, INSERT queries supported (see [specifications](https://www.w3.org/TR/sparql11-update/))

##### Parameters
| Property  | Type                 | Default             | Description                                                                                              |
|-----------|----------------------|---------------------|----------------------------------------------------------------------------------------------------------|
| `query`   | `String` or `Object` | **required**        | SPARQL Update to execute (as a string or [SPARQL.js](https://github.com/RubenVerborgh/SPARQL.js) object) |
| `webId`   | `string`             | Logged user's webId | User doing the action                                                                                    |
| `dataset` | `String`             | Main dataset        | Dataset where to execute the operation                                                                   |

##### Return
None

