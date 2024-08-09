---
title: Semantic Data Provider
---

## Installation

```bash
npm install @semapps/semantic-data-provider
```

## Usage

```jsx
import { Admin } from 'react-admin';
import { dataProvider, httpClient } from '@semapps/semantic-data-provider';

const App = () => (
  <Admin
    dataProvider={dataProvider({
      httpClient,
      dataServers: { ... },
      resources: { ... },
      ontologies: { ... },
      jsonContext: 'http://localhost:3000/context.json',
      returnFailedResources: false
    })}
  >
    <Resource name="Project" ... />
    <Resource name="Organization" ... />
  </Admin>
);
```

The semantic data provider rely on two important configuration:

- The [Data Servers](data-servers.md), which describes the servers to which we want to connect and what they contain.
- The [Data Model](data-model.md), which describes how we want the data to be displayed in React-Admin.

## Settings

### `httpClient`

HTTP client used to fetch data. Same type as the [fetchJson utility](https://marmelab.com/react-admin/doc/3.19/DataProviders.html#adding-custom-headers) of React-Admin.

We recommend to use the `httpClient` exported from the `@semapps/semantic-data-provider` package.

### `dataServers`

See the [Data servers](data-servers) page.

### `resources`

See the [Data model](data-model) page.

### `ontologies`

List of ontologies used to format or select SPARQL data. Format:

```js
const ontologies = [
  {
    prefix: 'rdf',
    url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
  },
  {
    prefix: 'ldp',
    url: 'http://www.w3.org/ns/ldp#'
  }
];
```

### `jsonContext`

All SPARQL results returned will be framed with this context.

If it is not set, the ontologies set above will be used.

### `returnFailedResources`

If true, the `getMany` method will not fail completely if one resource is missing.

Missing resources will be returned with their `id` and `_error: true`.

## Filters

When using React-Admin [filters](https://marmelab.com/react-admin/doc/3.19/List.html#filter-permanent-filter), in the `List` components or the `ReferenceArrayInput`, there are special keywords that you can use:

### `_predicates`

Return only the given predicates instead of the full resource.

For example, `{ _predicates: ['foaf:name']}` will return only the name of a list of users.

> Note: The `@type` is always returned because it is needed by React-Admin.

### `_servers`

Select the [data servers](data-servers.md) that you want to query, bypassing the config in the [data model](data-model.md).

You can use the server keys or [special keywords](data-model.md#servers-special-keys).

### `blankNodes`

Choose the blank nodes you want to dereference, bypassing the config in the [data model](data-model.md) or the VOID endpoint.

For example, `{ blankNodes: [] }` will not dereference any blank nodes for the given resources.

This is useful if you don't need the values of the blank nodes and want to increase performances.

### `q`

Do a full-text search on the resources.

For example, `{ q: "sem" }` will return all resources with the characters "sem" in string-types values.

### `sparqlWhere`

Allow to make advanced search by providing a [SPARQL.js](https://github.com/RubenVerborgh/SPARQL.js)-formatted array that will be appended to the `WHERE` query.

Here's an example to fetch ActivityStreams events after a given date:

```js
{
  sparqlWhere: [
    {
      type: 'bgp',
      triples: [
        {
          subject: { termType: 'Variable', value: 's1' },
          predicate: { termType: 'NameNode', value: 'https://www.w3.org/ns/activitystreams#startTime' },
          object: { termType: 'Variable', value: 'startTime' }
        }
      ]
    },
    {
      type: 'filter',
      expression: {
        type: 'operation',
        operator: '>',
        args: [
          {
            termType: 'Variable',
            value: 'startTime'
          },
          {
            termType: 'Literal',
            datatype: {
              termType: 'NamedNode',
              value: 'http://www.w3.org/2001/XMLSchema#dateTime'
            },
            value: '2022-11-17T10:20:13+05:30'
          }
        ]
      }
    }
  ];
}
```

> Note: In the above example, the variable `s1` is the URI of a LDP resource.

## Custom methods

In addition to regular [React-Admin methods](https://marmelab.com/react-admin/DataProviderWriting.html#data-provider-methods), we provide custom methods that are specific to linked data. These can be accessed with the `useDataProvider` hook.

### `patch`

Patch a resource with a SPARQL-Update (`application/sparql-update`) operation.

#### Parameters

| Property                 | Type     | Default      | Description                                                                                        |
| ------------------------ | -------- | ------------ | -------------------------------------------------------------------------------------------------- |
| `resourceId`             | `String` | **required** | React-Admin resource ID                                                                            |
| `params.id`              | `String` | **required** | URI of the resource to patch                                                                       |
| `params.triplesToAdd`    | `[Quad]` |              | Triples to insert, formatted with the [RDFJS data model](https://github.com/rdfjs-base/data-model) |
| `params.triplesToRemove` | `[Quad]` |              | Triples to delete, formatted with the [RDFJS data model](https://github.com/rdfjs-base/data-model) |

### `refreshConfig`

Refresh the dymamically loaded config (VOID endpoint and, for Pods, the user config)

## Hooks

### useContainers

Returns a list of containers linked with a given resource.

```js
const containers = useContainers(resourceId, serverKeys);
```

#### Parameters

| Property     | Type                | Default      | Description                          |
| ------------ | ------------------- | ------------ | ------------------------------------ |
| `resourceId` | `String`            | **required** | React-Admin resource ID              |
| `serverKeys` | `Array` or `String` | "@all"       | The servers where the containers are |

#### Return value

Array of containers URIs.

### useCreateContainer

Get the URI of the container where to create a new resource.

```js
const createContainerUri = useCreateContainer(resourceId);
```

#### Parameters

| Property     | Type     | Default      | Description             |
| ------------ | -------- | ------------ | ----------------------- |
| `resourceId` | `String` | **required** | React-Admin resource ID |

#### Return value

URI of the container where to create a new resource.

### useCreateContainerUri

Get the URI of the container where to create a new resource.

```js
const getContainerUri = useCreateContainer();
const createContainerUri = getContainerUri(resourceId);
```

#### Return value

Function to get the URI of the container where to create a new resource

| Property     | Type     | Default      | Description             |
| ------------ | -------- | ------------ | ----------------------- |
| `resourceId` | `String` | **required** | React-Admin resource ID |

### useDataModel

Get the [data model](data-model) config of the given resource, including data fetched through VoID endpoints.

```js
const dataModel = useDataModel(resourceId);
```

#### Parameters

| Property     | Type     | Default      | Description             |
| ------------ | -------- | ------------ | ----------------------- |
| `resourceId` | `String` | **required** | React-Admin resource ID |

#### Return value

The [data model](data-model) config of the given resource.

### useDataModels

Get the [data model](data-model) config of all the resources, including data fetched through VoID endpoints.

```js
const dataModel = useDataModels();
```

### useDataServers

Get the [data servers](data-servers) config, including data fetched through VoID endpoints.

```js
const dataServers = useDataServers();
```

## Utilities

### `getOrCreateWsChannel`

This function adheres to the [Solid Notification Protocol](https://solidproject.org/TR/notifications-protocol), specifically the [WebSocketChannel2023](https://solid.github.io/notifications/websocket-channel-2023) specification. It creates a WebSocket that conforms to this specification.

#### Parameters

| Param Position | Property      | Type       | Default      | Description                                                                                                                                                                                                                                                                  |
| -------------- | ------------- | ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1              | `fetch`       | `Function` | **required** | A React Admin fetch function. You can obtain it using `const { fetch } = useDataProvider()`.                                                                                                                                                                                 |
| 2              | `resourceUri` | `string`   | **required** | The URI of the resource to subscribe to.                                                                                                                                                                                                                                     |
| 3              | `options`     | `object`   |              | Options to pass to `createSolidNotificationChannel` if the channel does not exist yet. Refer to the [documentation of the features in the spec](https://solidproject.org/TR/notifications-protocol#notification-features) for more details. See `CreateSolidChannelOptions`. |

#### `CreateSolidChannelOptions` Interface

| Property     | Type                | Default                | Description                                                                           |
| ------------ | ------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `type`       | `string`            | `WebSocketChannel2023` | The type of channel. The default and only supported option is `WebSocketChannel2023`. |
| `closeAfter` | `number`            |                        | Time in milliseconds after which the channel should close.                            |
| `startIn`    | `number`            |                        | Time in milliseconds to wait before starting the channel.                             |
| `startAt`    | `string` (ISO 8601) |                        | ISO 8601 timestamp indicating when to start the channel.                              |
| `endAt`      | `string` (ISO 8601) |                        | ISO 8601 timestamp indicating when to end the channel.                                |
| `rate`       | `number`            |                        | The rate in milliseconds at which notifications should be sent at most.               |

### `createWsChannel`

This function operates similarly to `getOrCreateWsChannel` but always creates a new channel, even if a channel for the same resource (but potentially with different options) is already open. The newly created channel is not registered in the cache used by `getOrCreateWsChannel`.

### `createSolidNotificationChannel`

This function is used internally by `getOrCreateWsChannel` and `createWsChannel` to create a WebSocket channel object conforming to the Solid Notification Protocol.
