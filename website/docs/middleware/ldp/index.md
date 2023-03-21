---
title: LDP
---

This package allows you to setup [LDP](https://www.w3.org/TR/ldp-primer/) containers in which LDP resources can be manipulated.

## Features
- Handles triples, turtle and JSON-LD format
- Automatic creation of containers on server start
- Full container management: create, attach resources, detach, clear, delete...

## Dependencies
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [TripleStoreService](../triplestore)

## Sub-services
- [LdpResourceService](resource.md)
- [LdpContainerService](container.md)
- LdpRegistryService
- LdpCacheService

## Mixins
- [ControlledContainerMixin](controlled-container)
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
        path: '/resources',
        // Specific container options (See below)
      }
    ],
    defaultContainerOptions: {
      // See below
    }
  }
};

```

## Settings

| Property                   | Type         | Default                     | Description                                                              |
|----------------------------|--------------|-----------------------------|--------------------------------------------------------------------------|
| `baseUrl`                  | `String`     | **required**                | Base URL of the LDP server                                               |
| `ontologies`               | `[Array]`    | **required**                | List of ontology used (see example above)                                |
| `containers`               | `[Object]`   | **required**                | List of containers to set up, with their options (see below)             |
| `defaultContainerOptions`  | `[Object]`   |                             | Default options for all containers (see below)                           |
| `mirrorGraphName`          | `String`     | "http://semapps.org/mirror" | Name of the RDF graph where to store mirrored data                       |
| `podProvider`              | `[Boolean]`  | false                       | Set to true if your server is a POD provider                             |
| `preferredViewForResource` | `Function`   |                             | Function called to generate a redirect to the preferred view (see below) |


## Container options

The following options can be set for each container, or they can be set in the `defaultContainerOptions` settings.

| Property                  | Type                   | Default       | Description                                                                                                                                            |
|---------------------------|------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `accept`                  | `String`               | "text/turtle" | Type to return (`application/ld+json`, `text/turtle` or `application/n-triples`)                                                                       |
| `acceptedTypes`           | `Array`                |               | RDF classes accepted in this container. This is not enforced but used by some services to identify containers.                                         |
| `excludeFromMirror`       | `Boolean`              | false         | If true, other servers will not be able to [mirror](../mirror) this container.                                                                         |
| `jsonContext`             | `Any`                  |               | JSON context to use to format results                                                                                                                  |
| `dereference`             | `Array`                |               | Blank nodes to dereference, prefixed with their ontology. You can define sub-predicates separated by `/`                                               |
| `queryDepth`              | `Integer`              | 0             | Depth of blank nodes to dereference (Deprecated. Will be removed in a future minor release.)                                                           |
| `permissions`             | `Object` or `Function` |               | If the WebACL service is activated, permissions of the container itself                                                                                |
| `newResourcesPermissions` | `Object` or `Function` |               | If the WebACL service is activated, permissions for new resources. [See the docs here](../webacl/index.md#default-permissions-for-new-resources)       |
| `readOnly`                | `Boolean`              | false         | Do not set `POST`, `PATCH`, `PUT` and `DELETE` routes for the container and its resources                                                              |
| `preferredView`           | `String`               |               | A part of the final URL for redirecting to the preferred view of the resource (see below).                                                             |
| `controlledActions`       | `Object`               |               | Use custom actions instead of the LDP ones (post, list, get, create, put, patch, delete). Used by the [ControlledContainerMixin](controlled-container) |


## API routes

These routes are automatically added to the `ApiGateway` service.

| Route                            | Action called         |
|----------------------------------|-----------------------|
| `GET /<container>`               | `ldp.container.get`   |
| `POST /<container>`              | `ldp.container.post`  |
| `PATCH /<container>`             | `ldp.container.patch` |
| `GET /<container>/<resource>`    | `ldp.resource.get`    |
| `PATCH /<container>/<resource>`  | `ldp.resource.patch`  |
| `PUT /<container>/<resource>`    | `ldp.resource.put`    |
| `DELETE /<container>/<resource>` | `ldp.resource.delete` |

> Note: If the `readOnly` container option is set (see above), only `GET` routes are added.


## Redirecting to a frontend app

When a browser visits the URL of an LDP resource, for example https://data.yourserver.com/users/alice, with an `Accept` 
header containing `text/html`, you have the ability to redirect the browser to your preferred view on the frontend 
of your application.

In order to configure this feature, you should add the following configurations :

1. For each container that you want to setup a redirect, add the `preferredView` option:

```js
const containers = [
  {
    path: '/users',
    preferredView: '/Person/',
    // Other container options...
  },
  { ... }
];
```

2. Set the `preferredViewForResource` setting with a function like this one which will receive the `preferredView` option set above:

```js
function preferredViewForResource(resourceUri, containerPreferredView) {
  if (!containerPreferredView) return resourceUri;
  return 'https://yourfrontend.com' + containerPreferredView + encodeURIComponent(resourceUri) + '/show'
}
```

The function should return the redirect link. It can be async. Return `resourceUri` if you want to cancel the redirect.
