---
title: SPARQL endpoint
---

This service allows you to offer a public query-only [SPARQL](https://fr.wikipedia.org/wiki/SPARQL) endpoint, deployed
on the `/sparql` path. It channels all requests to the [TripleStoreService](./triplestore/index.md).


## Dependencies
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [TripleStoreService](./triplestore/index.md)

## Install

```bash
$ yarn add @semapps/sparql-endpoint
```

## Usage

```js
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const path = require('path');

module.exports = {
  mixins: [SparqlEndpointService],
  settings: {
    defaultAccept: 'text/turtle',
    podProvider: false,
    ignoreAcl: false
  }
}
```

| Property        | Type      | Default       | Description                                                             |
|-----------------|-----------|---------------|-------------------------------------------------------------------------|
| `defaultAccept` | `String`  | "text/turtle" | Format of the results. Can also be "application/ld+json".               |
| `podProvider`   | `Boolean` | false         | If true, the service will setup one SPARQL endpoint per POD.            |
| `ignoreAcl`     | `Boolean` | false         | If true, all requests made through this endpoint will not check WebACLs |
