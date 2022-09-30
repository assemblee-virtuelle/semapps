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
- The [Data Servers](data-servers), which describes the servers to which we want to connect and what they contain.
- The [Data Model](data-model), which describes how we want the data to be displayed in React-Admin.

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
    url: 'http://www.w3.org/ns/ldp#',
  }
];
```

### `jsonContext`

All SPARQL results returned will be framed with this context.

If it is not set, the ontologies set above will be used.


### `returnFailedResources`

If true, the `getMany` method will not fail completely if one resource is missing. 

Missing resources will be returned with only their `@id`.


## Hooks

### useContainers

Returns a list of containers linked with a given resource.

```js
const containers = useContainers(resourceId, serverKeys);
```

#### Parameters

| Property     | Type                | Default      | Description                          |
|--------------|---------------------|--------------|--------------------------------------|
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

| Property     | Type                | Default      | Description                          |
|--------------|---------------------|--------------|--------------------------------------|
| `resourceId` | `String`            | **required** | React-Admin resource ID              |

#### Return value

URI of the container where to create a new resource.


### useDataModel

Get the [data model](data-model) config of the given resource, including data fetched through VoID endpoints.

```js
const dataModel = useDataModel(resourceId);
```

#### Parameters

| Property     | Type       | Default      | Description                          |
|--------------|------------|--------------|--------------------------------------|
| `resourceId` | `String`   | **required** | React-Admin resource ID              |

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
