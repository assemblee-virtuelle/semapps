---
title: LdpBinaryService
---

This service is automatically created by the [LdpService](index) to take care of non-RDF (binary) resources. It relies essentially on an [adapter](#adapters), that take care of the actual storage and retrieval of the binaries.

## Settings

| Property  | Type            | Default      | Description                                       |
| --------- | --------------- | ------------ | ------------------------------------------------- |
| `adapter` | `BinaryAdapter` | **required** | The adapter that will store and retrieve binaries |

## Actions

The following service actions are available:

### `store`

This action stores a provided binary (as a stream). It uses the `dataset` provided in the context metadata.

##### Parameters

| Property   | Type             | Default      | Description             |
| ---------- | ---------------- | ------------ | ----------------------- |
| `stream`   | `ReadableStream` | **required** | Binary to store         |
| `mimeType` | `String`         | **required** | MIME-Type of the binary |

### `get`

Get a binary

##### Parameters

| Property      | Type     | Default      | Description               |
| ------------- | -------- | ------------ | ------------------------- |
| `resourceUri` | `String` | **required** | URI of binary to retrieve |

##### Return values

A Binary object with the following properties

| Property   | Type     | Description                                                 |
| ---------- | -------- | ----------------------------------------------------------- |
| `file`     | `String` | The content of the binary                                   |
| `mimeType` | `String` | The MIME-Type of the binary                                 |
| `size`     | `Number` | The size of the binary, in bytes                            |
| `time`     | `Date`   | The date and time when the binary was stored (if available) |

### `delete`

Delete the provided binary

##### Parameters

| Property      | Type     | Default      | Description             |
| ------------- | -------- | ------------ | ----------------------- |
| `resourceUri` | `String` | **required** | URI of binary to delete |

### `isBinary`

Detects if an URI is a binary

##### Parameters

| Property      | Type     | Default      | Description   |
| ------------- | -------- | ------------ | ------------- |
| `resourceUri` | `String` | **required** | URI of binary |

##### Return values

True if the provided URI if a binary

## Adapters

### FsBinaryAdapter

This adapter stores files in the file system. A sub-directory is created for every dataset. The binary meta data are stored in a triple store.

#### Settings

| Property             | Type                 | Default      | Description                                               |
| -------------------- | -------------------- | ------------ | --------------------------------------------------------- |
| `rootDir`            | `String`             | **required** | The root directory where the binaries will be persisted   |
| `baseUrl`            | `String`             | **required** | The base URL of the server                                |
| `maxSize`            | `String` or `Number` | **required** | The max size of files (in bytes or human-readable string) |
| `tripleStoreAdapter` | `TripleStoreAdapter` | **required** | The adapter to store meta data in a triple store          |

### NgBinaryAdapter

This adapter stores files in [NextGraph](https://nextgraph.org).

#### Settings

| Property    | Type                 | Default      | Description                                          |
| ----------- | -------------------- | ------------ | ---------------------------------------------------- |
| `baseUrl`   | `String`             | **required** | The base URL of the server                           |
| `ngAdapter` | `TripleStoreAdapter` | **required** | The NextGraph adapter used by the TripleStoreService |
