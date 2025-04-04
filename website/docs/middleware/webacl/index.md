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
- [TripleStoreService](../triplestore)

## Sub-services

- [WebAclResourceService](resource.md)
- [WebAclGroupService](group.md)
- WebAclCacheCleanerService

## Bots

- [AuthorizerBot](authorizer.md)
- [GroupsManagerBot](groups-manager.md)

## Install

```bash
$ yarn add @semapps/webacl
```

## Usage

```js
const { WebAclService } = require('@semapps/webacl');

module.exports = {
  mixins: [WebAclService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    superAdmins: ['http://localhost:3000/users/myself']
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
    WebAclMiddleware({
      baseUrl: 'http://localhost:3000/', // Should be the same as the WebAclService
      podProvider: false, // Default value
      graphName: 'http://semapps.org/webacl' // Default value
    })
  ]
};
```

The WebAclMiddleware:

- Protects the actions of the LDP service
- Automatically updates ACL when LDP resources, LDP containers or ActivityPub collections are added or removed.
- Supports capability-based access to a resource, when a controller issued a capability. See the [Verifiable Credentials](../crypto/verifiable-credentials.md#issuing-and-verifying-capabilities) documentation and the [example](../crypto/verifiable-credentials.md#example-issuing-and-verifying-a-capability-chain) with a `apods:hasAuthorization` acl authorization. For capability chains, every capability in the chain must contain an authorization to the requested resource.

### Secured and unsecured dataset

It is important to know if your Fuseki dataset is secured with WebACL or not.

- If you use a secured dataset without the WebACL service and middleware, you will get permission errors every time you try to access a container or resource, because Fuseki will not find the appropriate WebACL triples and will thus assume you do not have the permission to do the action.
- If you use a unsecured data with the WebACL service and middleware, you will get the error `Error when starting the webAcl service: the main dataset is not secure. see dataset.create`.

Here are some important notes:

- To create a new secured dataset, you should use the [Dataset](../triplestore/dataset.md) service, and more specifically the `dataset.create` action with the param `secure: true`. It will load the appropriate config.
- If you create a new dataset through the Fuseki frontend, it will **not** be secured.
- You should never use the `DROP+ALL` command on a secured dataset, as it will break all the internal config. Use `CLEAR+ALL` instead.
- Removing a dataset through the Fuseki frontend will not remove the data and will create problems if you create a new dataset with the same name. So to correctly remove a dataset, you should do a `rm -Rf` on the two folders in the `databases` folders: datasetName and datasetNameAcl.

### Caching

If you wish to properly cache the WebAcl and improve performances, we recommend that you add a Cacher middleware before the WebACL middleware.

```js
// moleculer.config.js
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');

module.exports = {
  middlewares: [
    CacherMiddleware(...cacherConfig),
    WebAclMiddleware({
      baseUrl: 'http://localhost:3000/',
      podProvider: false, // Default value
      graphName: 'http://semapps.org/webacl' // Default value
    })
  ]
};
```

See the [Moleculer caching documentation](https://moleculer.services/docs/0.14/caching.html) to know what options can be passed.

### Default permissions for new resources

By default, new resources are created with these rights:

- If the resource is created by an anonymous user:
  - `acl:Read` and `acl:Write` permissions are granted to all users
- If the resource is created by an authenticated user:
  - `acl:Read` permission is granted to anonymous users
  - `acl:Write` and `acl:Control` permissions are granted to the creator
- If the resource is created by the system (direct calls from other services):
  - `acl:Read` permission is granted to anonymous users
  - `acl:Write` permission is granted to authenticated users

If you wish to change these options, you can set the `newResourcesPermissions` parameter in [LdpService's `defaultContainerOptions`](../ldp#settings), or to a particular container.

This `newResourcesPermissions` parameter can be:

- An object in the form expected by the `additionalRights` parameters of the [`webacl.resource.addRights`](resource.md#addrights) action (with keys "anon", "anyUser", "user", "group").
- A function which receives the WebID of the creator (or "anon" if the user is not authenticated, or "system"), and the `ctx` object and returns an object in the same shape.

## Settings

| Property      | Type      | Default                     | Description                                                                                                                                     |
| ------------- | --------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl`     | `String`  | **required**                | Base URL of the LDP server                                                                                                                      |
| `graphName`   | `Array`   | "http://semapps.org/webacl" | Graph where the ACL triples are stored. If you change this, you should also change the config of the WebAclMiddleware.                          |
| `podProvider` | `Boolean` | false                       | Set to true if you are setting up a POD provider.                                                                                               |
| `superAdmins` | `Array`   |                             | Array of users' URIs you want to give super-admins rights (all permissions on all resources). This only works if you have a root LDP container. |

## General notes

- The SemApps middleware will always connect to the SPARQL endpoint with a Basic Authorization header containing the `admin` user and its password.
- If the middleware is doing a query on behalf of a SemApps user, it will send the WebID URI of this user in the HTTP header `X-SemappsUser`.
- If no user is logged-in and the middleware is making a request as a public (anonymous) user, then the `X-SemappsUser` header will be sent with the value `anon`.
- If to the contrary, the middleware is modifying the ACLs, it will send no header, or a header with the `X-SemappsUser` set to `system`.
