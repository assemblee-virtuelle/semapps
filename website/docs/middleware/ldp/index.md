---
title: LDP
---

This package allows you to setup LDP direct containers in which LDP resources can be manipulated.

## Features
- Handles triples, turtle and JSON-LD format
- Automatic creation of containers on server start
- Full container management: create, attach resources, detach, clear, delete...

## Dependencies
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [TripleStoreService](../triplestore.md)

## Sub-services
- [LdpResourceService](resource.md)
- [LdpContainerService](container.md)
- LdpCacheCleanerService

## Install

```bash
$ npm install @semapps/ldp --save
```

## Usage

```js
const { LdpService } = require('@semapps/ldp');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    ontologies : [
      {
        prefix: 'rdf',
        url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
      },
      {
        prefix: 'ldp',
        url: 'http://www.w3.org/ns/ldp#',
      },
      ...
    ],
    containers: [
      {
        path: '/resources'
      }
    ],
    defaultContainerOptions: {
      // See below
    }
  }
};

```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUrl`|`String` | **required**| Base URL of the LDP server |
| `ontologies`| `[Object]`|**required** | List of ontology used (see example above) |
| `containers`| `[Object]`| **required** | List of containers to set up, with their options |
| `defaultContainerOptions`| `[Object]`| | Default options for all containers (see below) |

## Container options

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `accept` | `String` | `text/turtle` | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`) |
| `jsonContext` | `[Any]` |  | JSON context to use to format results |
| `dereference`| `[Array]` | `[]` | Properties to dereference, prefixed with their ontology. You can define sub-predicates separated by `/` |
| `queryDepth` | `Integer` | 0 | Depth of blank nodes to dereference (Deprecated. Will be removed in a future minor release.) |
| `newResourcesPermissions` | `Object` or `Function` |  | If the WebACL service is activated, permissions to add to new resources. [See the docs here](../webacl/index.md#default-permissions-for-new-resources) |

## API routes

These routes are automatically added to the `ApiGateway` service.

| Route | Action called |
| -------- | ---- |
| `GET /<container>` | `ldp.container.get` |
| `POST /<container>` | `ldp.resource.post` |
| `GET /<container>/<resource>` | `ldp.resource.get` |
| `PATCH /<container>/<resource>` | `ldp.resource.patch` |
| `PUT /<container>/<resource>` | `ldp.resource.put` |
| `DELETE /<container>/<resource>` | `ldp.resource.delete` |

