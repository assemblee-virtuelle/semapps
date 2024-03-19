---
title: Data Servers
---

The `dataServers` config passed to the semantic data provider describes the servers to which we want to connect and what
they contain. Most of these information can be guessed from the VoID endpoint(s).

## Configuration with VoID endpoints

```js
const dataServers = {
  server1: {
    baseUrl: 'http://localhost:3000',
    default: true, // Default server (used for the creation of resources)
    authServer: true // Server where users are autenticated
  },
  server2: {
    baseUrl: 'http://localhost:3001'
  }
};
```

## Configuration without VoID endpoints

If the server you want to connect to doesn't have a VoID endpoint, you will need to specify manually the name of the
server, its SPARQL endpoint as well as the containers

```js
const dataServers = {
  server1: {
    baseUrl: 'http://localhost:3000',
    default: true,
    authServer: true,
    // Informations required if no VoID endpoint are available
    name: 'Server 1',
    sparqlEndpoint: 'http://localhost:3000/sparql',
    containers: {
      server1: {
        'foaf:Person': ['/users']
      }
    }
  },
  server2: {
    baseUrl: 'http://localhost:3001',
    name: 'Server 2',
    sparqlEndpoint: 'http://localhost:3001/sparql',
    containers: {
      server2: {
        'foaf:Person': ['/users']
      }
    }
  }
};
```

> You can set `void: false` to prevent the semantic data provider from unnecessarily fetching a VoID endpoint.

## Mirrors

If a server is [mirroring](../../middleware/sync/mirror.md) another server, the VoID endpoint will show this information and
the semantic data provider will automatically adapt its requests. If no VoID endpoint is available, you can indicate
manually the mirrored data like this:

```js
const dataServers = {
  server1: {
    baseUrl: 'http://localhost:3000',
    default: true,
    authServer: true,
    name: 'Server 1',
    sparqlEndpoint: 'http://localhost:3000/sparql',
    containers: {
      server1: {
        'foaf:Person': ['/users']
      },
      // Data on server2 mirrored on server1
      server2: {
        'foaf:Person': ['/users']
      }
    }
  },
  server2: {
    baseUrl: 'http://localhost:3001',
    name: 'Server 2',
    sparqlEndpoint: 'http://localhost:3001/sparql',
    containers: {
      server2: {
        'foaf:Person': ['/users']
      }
    }
  }
};
```

> If many servers are mirroring each others, you can use the `priority` config to help the semantic data provider
> choose which servers to request first. Enter a number for each server and the server with the highest number will
> be chosen.

## POD providers

If a server you wish to connect to is a POD provider, you should set `pod: true`. The `baseUrl` and the `sparqlEndpoint`
config will be obtained after the user connects to his POD. A `proxyUrl` config will also be obtained automatically: it
is the URL through which requests can be made using HTTP signatures.

```js
const dataServers = {
  server1: { ... },
  server2: { ... },
  pod: {
    pod: true,
    containers: {
      'pair:Person': [
        '/contacts'
      ]
    },
    // Calculated automatically after user login
    baseUrl: null,
    sparqlEndpoint: null,
    proxyUrl: null
  }
}
```
