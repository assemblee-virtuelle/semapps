---
title: Inference
---

This service allows you to automatically generate inferences when resources are created, updated or deleted through [LDP](ldp.md).

## Features

- Extract the inverse relations from provided OWL files
- Automatically generate inverse links on create/update/delete operations
- Add or remove the triples directly to the triple store, in a single query
- More inference types are planned in the future

## Dependencies
- [TripleStoreService](triplestore.md)
- [LdpService](ldp.md)

## Install

```bash
$ npm install @semapps/inference --save
```

## Usage

```js
const { InferenceService } = require('@semapps/inference');
const path = require('path');

module.exports = {
  mixins: [InferenceService],
  settings: {
    baseUrl: "http://localhost:3000/",
    ontologies : [
      {
        "prefix": "pair",
        "owl": "http://virtual-assembly.org/ontologies/pair/ontology.ttl",
        "url": "http://virtual-assembly.org/ontologies/pair#"
      },
      ...
    ],
  }
};
```

## Service settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUrl`|`String` | **required**| Base URL of the LDP server |
| `ontologies`| `[Object]`|**required** | List of ontology used (see example above) |

## Notes

- Before adding a reverse link, the service checks that the linked resource exists.

- Naturally, the reverse links are not added when the linked resources is on another server.
