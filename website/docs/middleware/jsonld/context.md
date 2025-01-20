---
title: JsonLdContextService
---

This service allows you to manage [JSON-LD contexts](https://www.w3.org/TR/json-ld11/#the-context).

## Actions

The following service actions are available:

### `get`

Get a context which combines all contexts of the registered [ontologies](../ontologies).

##### Return

The combined context

### `getLocal`

Get the local context, which combines a parsed version of all the registered [ontologies](../ontologies), except those with `preserveContextUri: true`.

##### Return

The local context

### `parse`

Parse a JSON-LD context using the [jsonld-context-parser](https://github.com/rubensworks/jsonld-context-parser.js#parse-a-context) library.

##### Parameters

| Property  | Type     | Default      | Description                                                                                                           |
| --------- | -------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `context` | `String` | **required** | Context to be parsed                                                                                                  |
| `options` | `Object` |              | See the [library doc](https://github.com/rubensworks/jsonld-context-parser.js#parse-a-context) for available options. |

##### Return

The parsed context

### `validate`

Validate a given context

##### Parameters

| Property  | Type     | Default      | Description             |
| --------- | -------- | ------------ | ----------------------- |
| `context` | `String` | **required** | Context to be validated |

##### Return

True if the context is valid.
