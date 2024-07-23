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
