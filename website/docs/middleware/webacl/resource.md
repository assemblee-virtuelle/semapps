---
title: WebAclResourceService
---

This service is automatically created by the [WebAclService](index) with the key `webacl.ressource`.


## Actions

The following service actions are available:


### `addRights`
- Add some permissions to a resource
- Only available if the user has Control access to the resource.
- Does not take into account the `acl:mode` nor `acl:default` triples that are sent.
  - The only important part is the beginning of the node `:Read` or `"@id":"#Read"` in JSON-LD.
  - Likewise, the `acl:accessTo` and `acl:default` triples are not taken into account either.
  - The presence of the keyword `Default` at the beginning of the node is what decides if we are adding a resource or a default container permission.
-  Be careful, the `@base` or `@prefix` in turtle is important, it needs to match the resource URL you are modifying with this action.

> Please note that the URI of the `@base` or `@prefix` should not include a trailing slash / . Except for the root container !
> Hence, all resources should be modified with a `"@base": "http://server.com/_acl/path/of/resource"` in JSON-LD or `@prefix : <http://server.com/_acl/path/of/resource#>.` in turtle.
> But the root container has to be accessed as follow : `"@base": "http://server.com/_acl/"` or `@prefix : <http://server.com/_acl/#>.`

Here's the format for the `additionalRights` parameter:

```
{
  anon: {
    read: boolean,
    write: boolean,
    append: boolean,
    control: boolean,
  },
  anyUser: {
    read: boolean,
    write: boolean,
    append: boolean,
    control: boolean,
  },
  user: {
    uri: '<URI of user>'
    read: boolean
    write: boolean
    append: boolean
    control: boolean
  },
  group: {
    uri: '<URI of group>'
    read: boolean
    write: boolean
    append: boolean
    control: boolean
  },
  // This is only possible on a container.
  default : {
    anon : { ... same as above },
    anyUser : { ... same as above },
    user : { ... same as above },
    group : { ... same as above },
  }
}
```

The Moleculer action can only process one user and/or group at a time. Repeat the call if you need to add permissions for several users or groups.
Note that this limitation is not present in the `PATCH` HTTP method, but only if you call directly the Moleculer action.

##### Parameters
| Property           | Type       | Default      | Description                                            |
|--------------------|------------|--------------|--------------------------------------------------------|
| `resourceUri`      | `String`   | **required** | URI of the resource to add rights to                   |
| `webId`            | `String`   | 'anon'       | WebID of the logged user                               |
| `additionalRights` | `Object`   |              | Object with the rights to be added (see above)         |
| `addedRights`      | `Array`    |              | Used by the API endpoint. Should not be used directly. |
| `newRights`        | `Object`   |              | Used by the API endpoint. Should not be used directly. |

##### Return
Null


### `awaitReadRights`
- Wait until the given user has the right to read the given resource

##### Parameters
| Property       | Type     | Default      | Description                             |
|----------------|----------|--------------|-----------------------------------------|
| `resourceUri`  | `String` | **required** | URI of the resource                     |
| `webId`        | `String` | **required** | URI of the user                         |
| `timeout`      | `Number` | 10000        | Time to wait (in ms) between each check |

##### Return
Null


### `deleteAllRights`
- Remove all rights on a given resource.

##### Parameters
| Property      | Type     | Default      | Description                          |
|---------------|----------|--------------|--------------------------------------|
| `resourceUri` | `String` | **required** | URI of the resource to add rights to |

##### Return
Null


### `getRights`
- If the user has Control permission on the resource, return all the permissions on that resource.
- If the user doesn't have Control permission, return only the permissions related to the specific user that is doing the request.
- Return the permissions grouped by the Authorization node they belong to.
  - Each resource can have up to 4 Authorization nodes : `#Read` `#Write` `#Append` `#Control`.
  - Each one contains the Agents, AgentClass, and/or AgentGroup that have the permission on the resource.
- Containers that define default permissions can have 4 additional Authorizations : `#DefaultRead` `#DefaultWrite` `#DefaultAppend` `#DefaultControl` that list the default permissions for that container.
  - Only a user that has `Control` access to a container, can see the `#Default` Authorization nodes of that container.
- If their exist some additional permissions on the resource/container, inherited from a parent container, they will be displayed at the end of the file, with fully-qualified URIs.
  - Likewise, you can distinguish between the default permissions that concern the container you queried the ACL for, and the default permissions that are inherited.

##### Parameters
| Property      | Type     | Default       | Description                                                                |
|---------------|----------|---------------|----------------------------------------------------------------------------|
| `resourceUri` | `String` | **required**  | URI of the resource to check rights                                        |
| `accept`      | `String` | `text/turtle` | Type of content we want to receive. `application/ld+json` or `text/turtle` |
| `webId`       | `String` | 'anon'        | WebID of the logged user                                                   |

##### Return
Turtle or JSON-LD. See above.


### `hasRights`
- Checks if a user (or the logged-in user) has some rights on a resource.

##### Parameters
| Property      | Type     | Default                                                   | Description                              |
|---------------|----------|-----------------------------------------------------------|------------------------------------------|
| `resourceUri` | `String` | **required**                                              | URI of the resource to check rights      |
| `rights`      | `Object` | `{ read: true, append: true, write: true, delete: true }` | Object with the rights you want to check |
| `webId`       | `String` | 'anon'                                                    | WebID of the logged user                 |

##### Return
An object containing the permissions you asked for:
```
{
  read: boolean,
  write: boolean,
  append: boolean,
  control: boolean
}
```


### `refreshContainersRights`
- Remove all rights from the containers and add those defined in the containers `permissions` option

##### Return
Null


### `removeRights`
- This action can only be called by other Moleculer services.
- If you remove a right which doesn't exist, no error will be thrown.

##### Parameters
| Property      | Type     | Default      | Description                                  |
|---------------|----------|--------------|----------------------------------------------|
| `resourceUri` | `String` | **required** | URI of the resource                          |
| `rights`      | `Object` | **required** | Object with the rights to remove (see above) |

##### Return
Null


### `setRights`
- Change all the permissions of a resource so that they become like in the document that is sent by the user.
- Only available if the user has Control access to the resource.
- The former permissions that are not present in the document will be removed.
- Regarding the format of the HTTP payload, the same rules as `addRights` apply.
- This action can hardly be called directly as a Moleculer action.

##### Parameters
| Property      | Type     | Default      | Description                                            |
|---------------|----------|--------------|--------------------------------------------------------|
| `resourceUri` | `String` | **required** | URI of the resource to add rights to                   |
| `webId`       | `String` | 'anon'       | WebID of the logged user                               |
| `newRights`   | `Array`  |              | Used by the API endpoint. Should not be used directly. |

##### Return
Null


## Events

### `webacl.resource.created`

Sent when the ACL for a new resource or container are created.

##### Parameters
| Property | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| `uri`    | `String` | URI of the resource on which rights were created |

### `webacl.resource.updated`

Sent when the ACL for a resource or container are updated.

##### Parameters
| Property               | Type      | Description                                                                                      |
|------------------------|-----------|--------------------------------------------------------------------------------------------------|
| `uri`                  | `String`  | URI of the resource on which rights were updated                                                 |
| `isContainer`          | `Boolean` | True if the resource is a container                                                              |
| `defaultRightsUpdated` | `Boolean` | True if the resource is a container and some of the default rights of the container were updated |

### `webacl.resource.deleted`

Sent when the ACL for a resource or container are deleted.

##### Parameters
| Property | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| `uri`    | `String` | URI of the resource on which rights were deleted |


## API routes

These routes are automatically added to the `ApiGateway` service.

| Route                                         | Action called               | Body                                  |
|-----------------------------------------------|-----------------------------|---------------------------------------|
| `GET /_acl/path/of/container/or/resource`     | `webacl.resource.getRights` | Null                                  |
| `GET /_rights/path/of/container/or/resource`  | `webacl.resource.hasRights` | Null                                  |
| `POST /_rights/path/of/container/or/resource` | `webacl.resource.hasRights` | `{ "rights": { "read": true, ... } }` |
| `PATCH /_acl/path/of/container/or/resource`   | `webacl.resource.addRights` | Turtle or JSON-LD authorizations      |
| `PUT /_acl/path/of/container/or/resource`     | `webacl.resource.setRights` | Turtle or JSON-LD authorizations      |
