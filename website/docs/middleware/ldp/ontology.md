---
title: LdpOntologyService
---

This service is automatically created by the [LdpService](index) with the key `ldp.ontology`.

It loads a list of ontologies that follow this format:

```json
{
  "prefix": "ont1",
  "url": "https://www.w3.org/ns/ontology1#",
  "owl": "https://www.w3.org/ns/ontology1.ttl",
  "jsonld": "https://www.w3.org/ns/ontology1.ttl",
  "preserveContextUri": true
}
```

See the [`register`](#register) action for details.

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

### `getByPrefix`

Return a registered ontology by its prefix

##### Parameters

| Property | Type     | Default      | Description            |
| -------- | -------- | ------------ | ---------------------- |
| `prefix` | `String` | **required** | Prefix of the ontology |

##### Return

The ontology, or `null` if no ontology with this prefix was registered.

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
| `url`                | `String`                      | **required** | URL of the ontology                                                                                                                   |
| `owl`                | `String`                      |              | URL of the OWL file (used by the [InferenceService](../inference.md))                                                                 |
| `jsonldContext`      | `String`, `Array` or `Object` |              | JSON-LD context associated with the ontology. Can be an URL, a array of URLs or an object                                             |
| `preserveContextUri` | `Boolean`                     | false        | If true, the `jsonldContext` will not be merged in the local context file. Works only if jsonldContext is an URL or an array of URLs. |
| `overwrite`          | `Boolean`                     | false        | If true, any existing ontology with the same prefix and URL will be overwritten                                                       |
