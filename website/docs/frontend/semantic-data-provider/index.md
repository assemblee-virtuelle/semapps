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
      jsonContext: 'http://localhost:3000/context.json'
    })}
  >
    <Resource name="Project" ... />
    <Resource name="Organization" ... />
  </Admin>
);
```

The semantic data provider rely on two important configuration:
- The [Data Servers](data-servers), which describes the servers to which we want to connect and what they contain. Most of these information can be guessed from the VOID endpoint(s).
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

If set, all SPARQL results returned will be framed with this context.

If not set, the ontologies set above will be set.
