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
- [TripleStoreService](../triplestore/index.md)

## Sub-services
- [LdpResourceService](resource.md)
- [LdpContainerService](container.md)
- LdpCacheCleanerService

## Mixins
- [DocumentTaggerMixin](document-tagger.md)

## Install

```bash
$ yarn add @semapps/ldp
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
      }
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

| Property | Type       | Default | Description                                                                       |
| -------- |------------| ------- |-----------------------------------------------------------------------------------|
| `baseUrl`| `String`   | **required**| Base URL of the LDP server                                                    |
| `ontologies`| `[Array]`  |**required** | List of ontology used (see example above)                                  |
| `containers`| `[Object]` | **required** | List of containers to set up, with their options                          |
| `defaultContainerOptions`| `[Object]` | | Default options for all containers (see below)                            |
| `preferredViewForResource`| `function` | | function called to generate a redirect to the preferre view (see below)  |

## Container options

| Property                  | Type                   | Default       | Description                                                                                                                                            |
|---------------------------|------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `accept`                  | `String`               | `text/turtle` | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`)                                                                       |
| `jsonContext`             | `[Any]`                |               | JSON context to use to format results                                                                                                                  |
| `dereference`             | `[Array]`              | `[]`          | Blank nodes to dereference, prefixed with their ontology. You can define sub-predicates separated by `/`                                               |
| `queryDepth`              | `Integer`              | 0             | Depth of blank nodes to dereference (Deprecated. Will be removed in a future minor release.)                                                           |
| `permissions`             | `Object` or `Function` |               | If the WebACL service is activated, permissions of the container itself                                                                                |
| `newResourcesPermissions` | `Object` or `Function` |               | If the WebACL service is activated, permissions to add to new resources. [See the docs here](../webacl/index.md#default-permissions-for-new-resources) |
| `readOnly`                | `Boolean`              | `false`       | Do not set `POST`, `PATCH`, `PUT` and `DELETE` routes for the container and its resources                                                              |
| `preferredView`                  | `String`               |  | A part of the final URL for redirecting to the preferred view of the resource. Each container can have a different prefix that you will concatenate with the rest to form a full URL, see the `preferredViewForResource` below.                                                                 |

## API routes

These routes are automatically added to the `ApiGateway` service.

| Route | Action called |
| -------- | ---- |
| `GET /<container>` | `ldp.container.get` |
| `POST /<container>` | `ldp.container.post` |
| `PATCH /<container>` | `ldp.container.patch` |
| `GET /<container>/<resource>` | `ldp.resource.get` |
| `PATCH /<container>/<resource>` | `ldp.resource.patch` |
| `PUT /<container>/<resource>` | `ldp.resource.put` |
| `DELETE /<container>/<resource>` | `ldp.resource.delete` |

> Note: If the `readOnly` container option is set (see above), only `GET` routes are added.

## Redirect of LDP GET to preferred view on the frontend server

When a browser visits the URL of an LDP resource, by example https://data.yourFrontEndServer.com/users/test with an Accept header containing `text/html`, you have the ability to redirect the browser to your preferred view on the frontend of your application.

In order to configure this feature, you should add the following configurations :

in your `ldp.service.js` file that bootstraps your LDP service, add this setting :
```
   preferredViewForResource : async function(resourceUri, containerPreferredView) {
      if (!containerPreferredView) return resourceUri;
      return 'https://yourFrontEndServer.com'+containerPreferredView+encodeURIComponent(resourceUri)+'/show'
    }
```
It is a function that should return the redirect link. optionally this function can be async.
Return `resourceUri` if you want to cancel the redirect.

and in your `containers.js` config file, for each container that you want a redirect for, add this setting (example for users): 
```
  {
    path: '/users',
    acceptedTypes: ['pair:Person'],
    preferredView: '/Person/',
    dereference: ['sec:publicKey', 'pair:hasLocation/pair:hasPostalAddress'],
  },
```
