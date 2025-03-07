---
title: Data Servers
---

The `dataServers` config passed to the semantic data provider describes the servers to which we want to connect and what
they contain. These information can be guessed from the various [plugins](../plugins.md) we provide.

## Example

```js
const dataServers = {
  server1: {
    name: 'Server 1',
    baseUrl: 'http://localhost:3000',
    default: true,
    authServer: true,
    sparqlEndpoint: 'http://localhost:3000/sparql',
    containers: [
      {
        path: '/users'
        types: ['foaf:Person']
      }
    ]
  }
};
```

## Properties

| Property         | Type      | Default      | Description                                                                     |
| ---------------- | --------- | ------------ | ------------------------------------------------------------------------------- |
| `baseUrl`        | `String`  | **required** | Base URL of the storage                                                         |
| `name`           | `String`  |              | Name of the storage. Can be used by components and hooks.                       |
| `default`        | `Boolean` | false        | If true, is marked as the default server                                        |
| `authServer`     | `Boolean` | false        | If true, the server is the one against which the user is authenticated          |
| `pod`            | `Boolean` | false        | If true, the server is a Solid storage                                          |
| `sparqlEndpoint` | `String`  |              | If defined, the data provider will use it by default when fetching list of data |
| `containers`     | `Array`   |              | Array of containers in the storage. See below for more information.             |

## Container properties

The `containers` property of the data server is an array of objects with the following properties:

| Property         | Type     | Default      | Description                                                                          |
| ---------------- | -------- | ------------ | ------------------------------------------------------------------------------------ |
| `path`           | `String` | **required** | Path of the container, relative to the baseUrl of the storage                        |
| `types`          | `String` |              | Classes accepted in the container. If a prefix is used, it will be turned to an URI. |
| `label`          | `Object` |              | An object with the language as the key, and the name of the container as the value   |
| `labelPredicate` | `String` |              | The predicate to use for the label of the contained resources.                       |
| `shapeTreeUri`   | `String` |              | URL of the shape tree associated with the container.                                 |
| `uri`            | `String` |              | If not provided, will be automatically calculated based on the path and the baseUrl  |
| `server`         | `String` |              | If not defined, will automatically be set on the key of the storage                  |
