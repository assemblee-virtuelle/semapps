---
title: WebAclGroupService
---

## Actions

The following service actions are available:


### `webacl.group.getGroups`
- Returns the list of all groups URIs you have Read access to.
- You can then use those group URIs to give permissions to some resources to the group.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `webId` | `String`  | 'anon' | WebID of the logged user |

##### Return
`Array` : List of all groups have you Read access to.


### `webacl.group.create`
- Create a new group
- Will return a 400 if the group already exists.
- These are the permissions you will get on this new group :
    - If you created it while being logged, you will have Read, Write, Control permissions.
    - If you were not logged in, anonymous users will have Read and Write permissions.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `groupSlug` | `String`  | **required** | Name of the group |
| `webId` | `String`  | 'anon' | WebID of the logged user |

##### Return
`String`: The new group URI


### `webacl.group.addMember`
- Add a new member to an existing group
- If the user is already present in the group, nothing happens.
- If you need to add several members, repeat the request, one member at a time.
- You need Write or Append permission on the group.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `groupUri` | `String` | **required** | URI of group |
| `memberUri` | `String` | **required** | URI of user to be added |
| `webId` | `String`  | 'anon' | WebID of the logged user |

##### Return
Null


### `webacl.group.getMembers`
- Returns the members of the group
- You need Read permission on the group.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `memberUri` | `String` | **required** | URI of user to be added |

##### Return
`Array` : List of members URIs


### `webacl.group.isMember`
- To check if an user belongs to a group.
- You need Read permission on the group.

##### Parameters
| `groupUri` | `String` | **required** | URI of group |
| `memberId` | `String` | **required** | URI of user to check |
| `webId` | `String`  | 'anon' | WebID of the logged user |

##### Return
`Boolean` : True if the user is a member of the group


### `webacl.group.removeMember`
- Remove an user from a given group
- If the user is not a member, nothing happens.
- You need Write permission on the group.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `groupUri` | `String` | **required** | URI of group |
| `memberUri` | `String` | **required** | URI of user to be removed |
| `webId` | `String`  | 'anon' | WebID of the logged user |


### `webacl.group.delete`
- Delete the given group
- You need Write permission on the group.
- This will remove all members, and also will remove all permissions this group had on any resource.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `groupUri` | `String` | **required** | URI of group |
| `webId` | `String`  | 'anon' | WebID of the logged user |


## Events

### `webacl.group.member-added`

Sent when an user is added to a group.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| `uri` | `String` | URI of the resource on which rights were created |

### `webacl.group.member-removed`

Sent when an user is added to a group.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| `uri` | `String` | URI of the resource on which rights were updated |
| `isContainer` | `Boolean` | True if the resource is a container |
| `defaultRightsUpdated` | `Boolean` | True if the resource is a container and some of the default rights of the container were updated |


## API routes

These routes are automatically added to the `api` service.

| Route | Action called | Body |
| ----- | ------------- | ---- |
| `GET /_groups` | `webacl.group.getGroups` | Null |
| `POST /_groups` | `webacl.group.create` | Null |
| `GET /_groups/name_of_the_group`  | `webacl.group.getMembers` | Null |
| `PATCH /_groups/name_of_the_group` | `webacl.group.addMember` | `{ "memberUri": "..." }` |
| `POST /_groups/name_of_the_group` | `webacl.group.removeMember` | `{ "deleteUserUri": "..." }` |
| `DELETE /_groups/name_of_the_group` | `webacl.group.delete` | Null |


## Permissions

Groups have permissions too. You can modify those permissions by using the usual APIs with the URL in the form of `/_acl/_groups/group-name`.
