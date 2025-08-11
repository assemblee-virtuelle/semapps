---
title: PermissionsService
---

This service is automatically created by the [LdpService](index.md) with the key `permissions`. It is used by the LdpService, but also by other services, to check if a given user has the right to access a resource with a given mode. It does not do anything, but relies on authorizers that will do the check (for example against [WebACL permissions](../webacl/)).

## Actions

The following service actions are available:

### `addAuthorizer`

Add a new authorizer

##### Parameters

| Property     | Type     | Default      | Description                                                        |
| ------------ | -------- | ------------ | ------------------------------------------------------------------ |
| `actionName` | `String` | **required** | Full name of the Moleculer action to be called                     |
| `priority`   | `Number` | 10           | The priority in regard to other authorizers (1 = highest priority) |

### `has`

Calls every registered authorizers. When one of them returns true, return true. If none of them returns true, return false.

##### Parameters

| Property | Type     | Default      | Description                                                                      |
| -------- | -------- | ------------ | -------------------------------------------------------------------------------- |
| `uri`    | `String` | **required** | URI of the resource to check                                                     |
| `type`   | `String` | "resource"   | The type of provided resource. Can be "resource", "container" or "custom"        |
| `mode`   | `String` | "acl:Read"   | The mode to check. Can be "acl:Read", "acl:Append", "acl:Write" or "acl:Control" |
| `webId`  | `String` | **required** | The WebID of the user to check                                                   |

##### Return value

`true` if one of the authorizer returned `true`, `false` otherwise.

### `check`

Calls the `has` action. If it returns false, throws a 403 (Forbidden) error.

##### Parameters

| Property | Type     | Default      | Description                                                                      |
| -------- | -------- | ------------ | -------------------------------------------------------------------------------- |
| `uri`    | `String` | **required** | URI of the resource to check                                                     |
| `type`   | `String` | "resource"   | The type of provided resource. Can be "resource", "container" or "custom"        |
| `mode`   | `String` | "acl:Read"   | The mode to check. Can be "acl:Read", "acl:Append", "acl:Write" or "acl:Control" |
| `webId`  | `String` | **required** | The WebID of the user to check                                                   |
