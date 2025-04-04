---
title: Data Model
---

The `dataModel` config passed to the semantic data provider describes how we want the data to be displayed in React-Admin.

## Usage

In the config below `User` is the name of the React-Admin [resource](https://marmelab.com/react-admin/doc/3.19/Resource.html).
All the configs are solely for this given resource.

```js
const dataModel = {
  User: {
    types: 'foaf:Person',
    list: {
      servers: '@all',
      containers: [],
      blankNodes: [],
      blankNodesDepth: 2.
      forceArray: [],
      predicates: [],
      filter: {},
      fetchContainer: false,
      explicitEmbedOnFraming: true,
    },
    create: {
      server: '@default',
      container: null,
    },
    fieldsMapping: {
      title: 'foaf:name'
    }
  },
  Document: { ... }
};
```

## Parameters

| Property                      | Type                | Default      | Description                                                                                                                                                                                                       |
| ----------------------------- | ------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types`                       | `Array` or `String  | **required** | Type(s) of resources to fetch or create                                                                                                                                                                           |
| `list.servers`                | `Array` or `String` | "@all"       | The servers where to fetch the resource.                                                                                                                                                                          |
| `list.containers`             | `Array`             |              | Full URL(s) of the container(s) to fetch. If specified, will bypass the `list.servers` config.                                                                                                                    |
| `list.blankNodes`             | `Array`             |              | Predicates listed are blank nodes and will be dereferenced in SPARQL queries. Automatically set if VoID endpoints are found.                                                                                      |
| `list.blankNodesDepth`        | `Integer`           |              | If no blank nodes are indicated above, the SPARQL query will automatically search for blank nodes 2-level deep. Setting this parameter to `0` is equivalent to `blankNodes: []` (no blank nodes will be returned) |
| `list.forceArray`             | `Array`             |              | Predicates listed will be turned to arrays if they are simple strings. Used by for reified relationship. To be deprecated.                                                                                        |
| `list.predicates`             | `Array`             |              | Will only fetch the given predicates (and the `@type`). [Benchmark](https://github.com/assemblee-virtuelle/semapps/pull/1026)                                                                                     |
| `list.filter`                 | `Object`            |              | React-Admin permanent filter applied to all requests. [Docs](https://marmelab.com/react-admin/doc/3.19/List.html#filter-permanent-filter)                                                                         |
| `list.fetchContainer`         | `Boolean`           | false        | If true, the data provider will fetch the LDP containers instead of doing a SPARQL request.                                                                                                                       |
| `list.explicitEmbedOnFraming` | `Boolean`           | true         | If false, improve performances by not including the `@embed` rule in post-request JSON-LD framing                                                                                                                 |
| `create.server`               | `String`            | "@default"   | The server where to create new resources.                                                                                                                                                                         |
| `create.container`            | `String`            |              | Full URL of the container where to create new resources. If specified, will bypass the `create.server` config.                                                                                                    |
| `fieldsMapping.title`         | `String`            |              | The predicate of the title. Required by several components.                                                                                                                                                       |

## Servers special keys

For the `list.servers` and `create.server` config, you can use either the server key (the main key defined in the dataServers config) or the following special keys:

- `@default`: The server with the config `default: true`
- `@auth`: The server with the config `authServer: true`
- `@pod`: The server with the config `pod: true`

For the `list.servers` config, you can use these additional special keys:

- `@all`: All the servers defined
- `@remote`: All servers which are not the default server
