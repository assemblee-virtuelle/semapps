---
title: Inference
---

This service allows you to automatically generate inferences when resources are created, updated or deleted through [LDP](ldp/index.md).

## Features

- Extract the inverse relations from provided OWL files
- Automatically generate inverse links on create/update/delete operations
- Add or remove the triples directly to the triple store, in a single query
- Option to receive or offer inferences from remote servers (via ActivityPub)
- More inference types are planned in the future

## Dependencies
- [TripleStoreService](triplestore)
- [LdpService](ldp)
- [RelayService](activitypub/relay) (for inferences with remote servers)

## Install

```bash
$ yarn add @semapps/inference
```

## Usage

```js
const { InferenceService } = require('@semapps/inference');

module.exports = {
  mixins: [InferenceService],
  settings: {
    baseUrl: "http://localhost:3000/",
    acceptFromRemoteServers: false,
    offerToRemoteServers: false,
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

| Property                  | Type        | Default      | Description                                                                       |
|---------------------------|-------------|--------------|-----------------------------------------------------------------------------------|
| `baseUrl`                 | `String`    | **required** | Base URL of the LDP server                                                        |
| `acceptFromRemoteServers` | `Boolean`   | false        | Accept inferences from remote servers (require [RelayService](activitypub/relay.md)) |
| `offerToRemoteServers`    | `Boolean`   | false        | Offer inferences to remote servers (require [RelayService](activitypub/relay.md)) |
| `ontologies`              | `[Object] ` | **required** | List of ontology used (see example above)                                         |


## Notes

- Remote inference is currently not available for Pod providers
