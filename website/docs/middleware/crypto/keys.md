---
title: KeysService
---

Private/public key pairs management

## Features

- Key pairs management (create, get, delete)
- Get remote actor public keys
- Attach public key to new actor
- Automatically generate key pairs and attach the public key to new actors.
- Support for RSA and ED25519 key types.
- Keys are stored in the controlled `/key` container, public keys in the `/public-key` container. `PUT` and `PATCH` operations are disabled on the containers. `DELETE` will trigger the deletion of the corresponding public key and webId references.

## Supported Key Types

- RSA
- ED25519

Keys are stored in the controlled `keys` container.
RSA keys have the `@type` `[crypto.Key_Types.RSA`, `crypto.KEY_TYPES.VERIFICATION_METHOD]`.
ED25519 keys have the `@type` `[crypto.Key_Types.ED25519, crypto.KEY_TYPES.VERIFICATION_METHOD]`.

### Key Format

##### RSA Key Format

```js
{
  "@id": "https://semapps.example/key/123",
  "@type": [Key_Types.RSA, KEY_TYPES.VERIFICATION_METHOD],
  "owner": "https://example.com/users/123",
  "controller": "https://example.com/users/123",
  "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n....",
  "privateKeyPem": "-----BEGIN PRIVATE KEY-----\n....",
  "rdfs:seeAlso": "https://example.com/public-key/123"
}
```

##### ED25519 Key Format

```js
{
  "@id": "https://semapps.example/key/123",
  "@type": [Key_Types.ED25519, KEY_TYPES.VERIFICATION_METHOD],
  "owner": "https://semapps.example/users/123",
  "controller": "https://semapps.example/users/123",
  "publicKeyMultibase": "<public key",
  "secretKeyMultibase": "<secret key>",
  "rdfs:seeAlso": "https://example.com/public-key/123"
}
```

- `rdfs:seeAlso` is a reference to the public key resource in the `/public-key` container.
- Public keys have the same format with omitted `privateKeyPem` `secretKeyMultibase` and `rdfs:seeAlso` fields.
- Public and private key URIs have the same slug.

## Dependencies

- [Ontologies](../ontologies)

## Settings

| Property            | Type      | Default      | Description                                                                                                                   |
| ------------------- | --------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `actorsKeyPairsDir` | `string`  | **required** | Path to where the actor's key pair will be stored (for deprecated service and migration purposes). Usually set to `"/actors"` |
| `settingsDataset`   | `string`  | `"settings"` | Name of the settings dataset                                                                                                  |
| `podProvider`       | `boolean` | `false`      | If the service is operating in a pod provider environment.                                                                    |

## Actions

The following service actions are available.

### `getByType`

Get list of all public-private key pairs of a given key type for an actor. Looks for keys in the `keys` container. If none of the requested type is available, `[]` is returned.

##### Parameters

| Property  | Type     | Default          | Description                                                                       |
| --------- | -------- | ---------------- | --------------------------------------------------------------------------------- |
| `keyType` | `string` | **required**     | URI of the key type. For options, see [Supported Key Types](#supported-key-types) |
| `webId`   | `string` | `ctx.meta.webId` | The webId of the actor for whom the keys are to be queried.                       |

##### Return

`Array` - List of all public-private key pairs for the given actor and key type.

### `getOrCreateWebIdKeys`

Get list of all public-private key pairs for an actor that are published in the actor's webId. Looks for keys in the `keys` container. **If none of the requested type is available, a new one is crated and returned**.

##### Parameters

| Property  | Type     | Default          | Description                                                                       |
| --------- | -------- | ---------------- | --------------------------------------------------------------------------------- |
| `keyType` | `string` | **required**     | URI of the key type. For options, see [Supported Key Types](#supported-key-types) |
| `webId`   | `string` | `ctx.meta.webId` | The webId of the actor for whom the keys are to be queried.                       |

##### Return

`Array` - List of all public-private key pairs for the given actor. Keys in format as described in [Key Format](#key-format).

### `getSigningMultikeyInstance`

Returns a signing key instance for a given keyId or key type. If no key is available, a new one is created.
Currently supports Ed25519Multikey only.
The returned object is a `@digitalbazaar/ed25519-multikey` instance.

##### Parameters

| Property    | Type     | Default             | Description                                                                                                                                                    |
| ----------- | -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keyType`   | `string` | `KEY_TYPES.ED25519` | URI of the key type. Only `KEY_TYPES.ED25519` is supported.                                                                                                    |
| `webId`     | `string` | `ctx.meta.webId`    | The webId of the actor for whom the keys are to be queried.                                                                                                    |
| `keyId`     | `string` | `undefined`         | The keyId of the key to be returned (will be resolved).                                                                                                        |
| `keyObject` | `object` | `undefined`         | The key object to use. If neither keyId nor keyObject is provided, will choose the first key available through [getOrCreateWebIdKeys](#getOrCreateWebIdKeys) . |
| `webId`     | `string` | `ctx.meta.webId`    | The webId of the actor for whom the key is to be queried.                                                                                                      |

##### Return

A `@digitalbazaar/ed25519-multikey` instance.

### `createKeyForActor`

Generates key for requested type and stores it in the `/key` container.
If `publishKey` is true (default), it will publish the public key in the `/public-key` container.
If `attachToWebId` is true, it will also publish the key and attach the key to the webId document.

##### Parameters

| Property        | Type      | Default      | Description                                                                                                  |
| --------------- | --------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `keyType`       | `string`  | **required** | URI of the key type. For options, see [Supported Key Types](#supported-key-types)                            |
| `webId`         | `string`  | **required** | The webId of the actor for whom the key is to be created.                                                    |
| `attachToWebId` | `boolean` | `false`      | If true, the public key will be attached to the webId document and published in the `/public-key` container. |
| `publishKey`    | `boolean` | `true`       | If true, the public key will be published in the `/public-key` container.                                    |

##### Return

The key resource as located in the `/key` container.

### `attachPublicKeyToWebId`

Attaches a given key to the webId document.
If the key is not published yet, it will be published in the `/public-key` container.
If the key is a RSA key and another RSA key is attached already, the old one will be replaced.

##### Parameters

| Property    | Type     | Default      | Description                                                        |
| ----------- | -------- | ------------ | ------------------------------------------------------------------ |
| `webId`     | `string` | **required** | URI of the actor's webId                                           |
| `keyId`     | `string` | `undefined`  | URI of the key to attached (will be resolved).                     |
| `keyObject` | `string` | `undefined`  | The private key object to attach. Needs to have an `@id` location. |

##### Return

Returns nothing.

### `detachFromWebId`

Detaches a given public key from the webId document.

##### Parameters

| Property      | Type     | Default      | Description                           |
| ------------- | -------- | ------------ | ------------------------------------- |
| `webId`       | `string` | **required** | URI of the actor's webId              |
| `publicKeyId` | `string` | **required** | URI of the public key to be detached. |

##### Return

Returns nothing.

### `publishPublicKeyLocally`

Given a local key (stored in `/key` either given by `keyId` URI or resolved as `keyObject` param), add the public key part to the `/public-key` container.

##### Parameters

| Property    | Type     | Default          | Description                                         |
| ----------- | -------- | ---------------- | --------------------------------------------------- |
| `webId`     | `string` | `ctx.meta.webId` | webId of the actor                                  |
| `keyId`     | `string` | `undefined`      | URI of the private key resource (will be resolved). |
| `keyObject` | `string` | `undefined`      | Resolved private key resource.                      |

##### Return

The public key URI.

### `delete`

Delete the private/public key pair of a given actor.
Removes webId references and the corresponding public key.

##### Parameters

| Property    | Type     | Default          | Description                                         |
| ----------- | -------- | ---------------- | --------------------------------------------------- |
| `webId`     | `string` | `ctx.meta.webId` | webId of the actor.                                 |
| `keyId`     | `string` | `undefined`      | URI of the private key resource (will be resolved). |
| `keyObject` | `string` | `undefined`      | Resolved private key resource.                      |

##### Return

Returns nothing.

### `getRemotePublicKeys`

Get the public keys of a remote actor by [key type](#supported-key-types).
Keep it in local cache. Queries the remote actor's webId document and looks for keys in the `publicKey` and the `assertionMethod` fields. Does not filter outdated keys.

Note that key types are not very standardized yet, so filtering by key types other than RSA might not work as
expected for other implementations.

##### Parameters

| Property       | Type              | Default         | Description                                           |
| -------------- | ----------------- | --------------- | ----------------------------------------------------- |
| `webId`        | `string`          | **required**    | WebId of the remote actor.                            |
| `keyType`      | `string \| null ` | `KEY_TYPES.RSA` | Key type to request. If `null`, return all available. |
| `forceRefetch` | `boolean`         | `false`         | If `true` will not use the cache to look up key.      |

##### Return

`object[]` - Public keys of the remote actor of the requested type.

### `getPublicKeyObject`

Returns the public key part of a given key resource, removing secret parts.

##### Parameters

| Property    | Type     | Default     | Description                                         |
| ----------- | -------- | ----------- | --------------------------------------------------- |
| `keyId`     | `string` | `undefined` | URI of the private key resource (will be resolved). |
| `keyObject` | `string` | `undefined` | Alternatively, resolved private key resource.       |
