---
title: Ontologies
---

This package provides [ontologies](https://www.ontotext.com/knowledgehub/fundamentals/what-are-ontologies/) management utilities.

## Features

- Manage ontologies with prefixes, OWL files and JSON-LD contexts
- Allow static (hard-coded) or dynamic ontologies registration
- Allow to find ontologies prefixes through [prefix.cc](https://prefix.cc)
- Integrate core ontologies used by SemApps services

## Dependencies

- [JsonLdService](./jsonld)

## Sub-services

- OntologiesRegistryService

## Install

```bash
$ yarn add @semapps/ontologies
```

## Usage

```js
const { OntologiesService } = require('@semapps/ontologies');

module.exports = {
  mixins: [OntologiesService],
  settings: {
    ontologies: [
      {
        prefix: 'ont1',
        url: 'https://www.w3.org/ns/ontology1#',
        owl: 'https://www.w3.org/ns/ontology1.ttl',
        jsonldContext: 'https://www.w3.org/ns/ontology1.ttl', // Can also be a array or an object
        preserveContextUri: false // If true, the jsonldContext won't be merged in the local context file
      }
    ],
    persistRegistry: false,
    setingsDataset: 'settings'
  }
};
```

### Persisting registry

Any services can call the [`register`](#register) action to add new ontologies.

By default, the ontologies registry is not persisted. It is kept in memory and so the `register` action must be called again on every restart.

If you wish ontologies to be persisted, you must set the `persistRegistry` setting to `true`.

By default, they will be persisted in a dataset named `settings` (the same used by the `auth.account` service).
If you wish to use another dataset name, you can change the `settingsDataset` setting.

## Settings

| Property          | Type      | Default    | Description                                                             |
| ----------------- | --------- | ---------- | ----------------------------------------------------------------------- |
| `ontologies`      | `[Array]` |            | List of ontology used (see above for format).                           |
| `persistRegistry` | `Boolean` | false      | If true, ontologies will be persisted in a dataset                      |
| `settingsDataset` | `String`  | "settings" | The dataset where to persist ontologies (if `persistRegistry` is true ) |

## Core ontologies

These ontologies can be imported individually using their prefixes, or as `coreOntologies`.

| Prefix    | Namespace                                   |
| --------- | ------------------------------------------- |
| `acl`     | http://www.w3.org/ns/auth/acl#              |
| `as`      | https://www.w3.org/ns/activitystreams#      |
| `dc`      | http://purl.org/dc/terms/                   |
| `foaf`    | http://xmlns.com/foaf/0.1/                  |
| `ldp`     | http://www.w3.org/ns/ldp#                   |
| `rdf`     | http://www.w3.org/1999/02/22-rdf-syntax-ns# |
| `rdfs`    | http://www.w3.org/2000/01/rdf-schema#       |
| `schema`  | http://schema.org/                          |
| `sec`     | https://w3id.org/security#                  |
| `semapps` | http://semapps.org/ns/core#                 |
| `skos`    | http://www.w3.org/2004/02/skos/core#        |
| `vcard`   | http://www.w3.org/2006/vcard/ns#            |
| `void`    | http://rdfs.org/ns/void#                    |
| `xsd`     | http://www.w3.org/2001/XMLSchema#           |

## Actions

The following service actions are available:

### `findPrefix`

Fetch [prefix.cc](https://prefix.cc) to find the prefix of the provided URI.

##### Parameters

| Property | Type     | Default      | Description                           |
| -------- | -------- | ------------ | ------------------------------------- |
| `url`    | `String` | **required** | URI of the ontology or of a predicate |

##### Return

The prefix, or `null` if no prefix was found.

### `get`

Return a registered ontology by its prefix

##### Parameters

| Property | Type     | Default      | Description            |
| -------- | -------- | ------------ | ---------------------- |
| `prefix` | `String` | **required** | Prefix of the ontology |

##### Return

The ontology, or `null` if no ontology with this prefix or namespace was registered.

### `getPrefixes`

Return the registered prefixes as an object.

##### Return

An object with the prefix in keys, and the associated URLs in values.

### `getRdfPrefixes`

Return the registered ontologies' prefixes as a string to be used in SPARQL queries.

##### Return

A string of type `PREFIX ont1: <https://www.w3.org/ns/ontology1#>`, split with new lines.

### `list`

Return the registered ontologies

##### Return

An array of object, formatted as above.

### `register`

Register a new ontology.

##### Parameters

| Property             | Type                          | Default      | Description                                                                                                                           |
| -------------------- | ----------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `prefix`             | `String`                      | **required** | Prefix of the ontology                                                                                                                |
| `namespace`          | `String`                      | **required** | Namespace of the ontology                                                                                                             |
| `owl`                | `String`                      |              | URL of the OWL file (used by the [InferenceService](./inference.md))                                                                  |
| `jsonldContext`      | `String`, `Array` or `Object` |              | JSON-LD context associated with the ontology. Can be an URL, a array or an object                                                     |
| `preserveContextUri` | `Boolean`                     | false        | If true, the `jsonldContext` will not be merged in the local context file. Works only if jsonldContext is an URL or an array of URLs. |
| `overwrite`          | `Boolean`                     | false        | If true, any existing ontology with the same prefix and URL will be overwritten                                                       |
