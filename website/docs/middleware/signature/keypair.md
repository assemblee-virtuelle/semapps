---
title: KeypairService
---

Private/public key pairs management

## Features
- Key pairs management (create, get, delete)
- Get remote actor public key
- Attach public key to new actor
- Automatically generate key pairs and attach the public key to new actors

## Dependencies
- None

## Settings

| Property            | Type     | Default      | Description                                        |
|---------------------|----------|--------------|----------------------------------------------------|
| `actorsKeyPairsDir` | `String` | **required** | Path to where the actor's key pair will be stored. |


## Actions

The following service actions are available.


### `attachPublicKey`

Attach the public key to an actor data.
Use the `https://w3id.org/security#publicKey` predicate.

##### Parameters
| Property   | Type     | Default      | Description            |
|------------|----------|--------------|------------------------|
| `actorUri` | `String` | **required** | URI of the given actor |


### `delete`

Delete the private/public key pair of a given actor.

##### Parameters
| Property   | Type     | Default      | Description       |
|------------|----------|--------------|-------------------|
| `actorUri` | `String` | **required** | URI of the actor  |


### `generate`

Generate the private/public key pair for a given actor.

##### Parameters
| Property   | Type     | Default      | Description                                            |
|------------|----------|--------------|--------------------------------------------------------|
| `actorUri` | `String` | **required** | URI of the actor for which will generate the key pairs |

##### Return
`String` - The generated public key.


### `get`

Get the private/public keys of a given actor

##### Parameters
| Property   | Type     | Default      | Description      |
|------------|----------|--------------|------------------|
| `actorUri` | `String` | **required** | URI of the actor |

##### Return
`Object` with two keys: `publicKey` and `privateKey`.


### `getPaths`

Get the path of the private/public keys of a given actor

##### Parameters
| Property   | Type     | Default      | Description      |
|------------|----------|--------------|------------------|
| `actorUri` | `String` | **required** | URI of the actor |

##### Return
`Object` with two keys: `publicKeyPath` and `privateKeyPath`.


### `getRemotePublicKey`

Get the public key of a remote actor.
Keep it in a local cache.

##### Parameters
| Property   | Type     | Default      | Description             |
|------------|----------|--------------|-------------------------|
| `actorUri` | `String` | **required** | URI of the remote actor |

##### Return
`String` - The public key of the remote actor.
