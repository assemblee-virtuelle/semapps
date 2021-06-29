---
title: WebACL
---

This package allows you to handle rights through the [WebACL standard](https://github.com/solid/web-access-control-spec).

## Features
- View and modify rights of any resources
- Automatically add rights when LDP resources, LDP containers or ActivityPub collections are created
- Create ACL groups, manage members of these groups

## Dependencies
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [TripleStoreService](../triplestore.md)

## Sub-services
- [WebAclResourceService](resource.md)
- [WebAclGroupService](group.md)
- [GroupsManagerBot](groups-manager.md) (optional)
- WebAclCacheCleanerService

## Install

```bash
$ npm install @semapps/webacl --save
```

## Usage

```js
const { WebAclService } = require('@semapps/webacl');

module.exports = {
  mixins: [WebAclService],
  settings: {
    baseUrl: 'http://localhost:3000/'
  }
};
```

This service must be used with an instance of Fuseki which can handle WebAcl.
We recommend to use the image `semapps/jena-fuseki-webacl` ([see page on Docker Hub](https://hub.docker.com/r/semapps/jena-fuseki-webacl))

You will also need to add the WebAcl middleware to the broker settings.

```js
// moleculer.config.js
const { WebAclMiddleware } = require('@semapps/webacl');

module.exports = {
  middlewares: [
    WebAclMiddleware
  ]
};
```

The WebAclMiddleware:
- Protects the actions of the LDP service
- Automatically updates ACL when LDP resources, LDP containers or ActivityPub collections are added or removed.

## Caching

If you wish to properly cache the WebAcl and improve performances, we recommend that you add a Cacher middleware before the WebACL middleware.

```js
// moleculer.config.js
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');

module.exports = {
  middlewares: [
    CacherMiddleware(...cacherConfig)
    WebAclMiddleware,
  ]
};
```

See the [Moleculer caching documentation](https://moleculer.services/docs/0.14/caching.html) to know what options can be passed.


## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUrl`|`String` | **required**| Base URL of the LDP server |


## General notes

- The SemApps middleware will always connect to the SPARQL endpoint with a Basic Authorization header containing the `admin` user and its password.
- If the middleware is doing a query on behalf of a SemApps user, it will send the WebID URI of this user in the HTTP header `X-SemappsUser`.
- If no user is logged-in and the middleware is making a request as a public (anonymous) user, then the `X-SemappsUser` header will be sent with the value `anon`.
- If to the contrary, the middleware is modifying the ACLs, it will send no header, or a header with the `X-SemappsUser` set to `system`.
