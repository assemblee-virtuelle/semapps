---
title: HTTP & LD Signature
---

This service implements the [HTTP Signature](https://tools.ietf.org/html/draft-cavage-http-signatures-12) and 
[Linked Data Signature](https://ldapwiki.com/wiki/Linked%20Data%20Signatures) protocols, which allow to send messages 
in a secure way between servers. It is used in particular with the [ActivityPub](activitypub) federation 
mechanism.


## Features
- Generate actors key pair
- Sign and verify HTTP signature
- Build and verify HTTP digest
- Authenticate server-to-server interactions (ApiGateway)
- Sign and verify LD signature (*not implemented yet*)

## Dependencies
- None


## Install

```bash
$ yarn add @semapps/signature
```


## Usage

```js
const { SignatureService } = require('@semapps/signature');
const path = require('path');

module.exports = {
  mixins: [SignatureService],
  settings: {
    actorsKeyPairsDir: path.resolve(__dirname, '../actors')
  }
}
```

## Authentication

If you wish users to be able to authenticate themselves through HTTP signature (for server-to-server interactions), but still want to allow regular authentication with JWT token, you can configure the API service like this:

```js
const ApiGatewayService = require('moleculer-web');

const ApiService = {
  mixins: [ApiGatewayService],
  settings: { ... },
  methods: {
    authenticate(ctx, route, req, res) {
      if (req.headers.signature) {
        return ctx.call('signature.authenticate', {route, req, res});
      } else {
        return ctx.call('auth.authenticate', {route, req, res});
      }
    },
    authorize(ctx, route, req, res) {
      if (req.headers.signature) {
        return ctx.call('signature.authorize', {route, req, res});
      } else {
        return ctx.call('auth.authorize', {route, req, res});
      }
    }
  }
}
```

## Settings

| Property            | Type     | Default      | Description                                        |
|---------------------|----------|--------------|----------------------------------------------------|
| `actorsKeyPairsDir` | `String` | **required** | Path to where the actor's key pair will be stored. |


## Actions

The following service actions are available.


### `authenticate`

To be used with the ApiGateway (see above)


### `authorize`

To be used with the ApiGateway (see above)


### `deleteActorKeyPair`

Delete the private/public key pair of a given actor.

##### Parameters
| Property   | Type     | Default      | Description       |
|------------|----------|--------------|-------------------|
| `actorUri` | `String` | **required** | URI of the actor  |


### `getActorPublicKey`

Get the public key of a given actor

##### Parameters
| Property   | Type     | Default      | Description      |
|------------|----------|--------------|------------------|
| `actorUri` | `String` | **required** | URI of the actor |

##### Return
`String` - The actor's public key.


### `generateActorKeyPair`

Generate the private/public key pair for a given actor.

##### Parameters
| Property   | Type     | Default      | Description                                            |
|------------|----------|--------------|--------------------------------------------------------|
| `actorUri` | `String` | **required** | URI of the actor for which will generate the key pairs |

##### Return
`String` - The generated public key.


### `generateSignatureHeaders`

Generate a HTTP signature based on the actor's private key and the body of the message.

##### Parameters
| Property   | Type     | Default      | Description                                                                                     |
|------------|----------|--------------|-------------------------------------------------------------------------------------------------|
| `url`      | `String` | **required** | URL of the request to sign                                                                      |
| `method`   | `String` | **required** | HTTP method of the request to sign                                                              |
| `body`     | `String` |              | Data to be sent. This is used to build the Digest string. If it is JSON, it must be stringified |
| `actorUri` | `String` | **required** | URI of the actor for which will generate the signature                                          |

##### Return
`Object` - HTTP headers with `Date` and `Signature` properties, plus `Digest` if a body is provided.


### `verifyDigest`

Verify that the digest of the header is valid.

##### Parameters
| Property  | Type     | Default      | Description                                                  |
|-----------|----------|--------------|--------------------------------------------------------------|
| `headers` | `Object` | **required** | Headers of the message (with or without a `Digest` property) |
| `body`    | `String` | **required** | Data to the message. If it is JSON, it must be stringified   |

##### Return
`String` - The generated public key.


### `verifyHttpSignature`

Fetch remote actor's public key and verify that the signature in the headers has been generated by this actor.

##### Parameters
| Property  | Type     | Default      | Description                                              |
|-----------|----------|--------------|----------------------------------------------------------|
| `url`     | `String` |              | URL of the request (not necessary if `path` is provided  |
| `path`    | `String` |              | Path of the request (not necessary if `url` is provided) |
| `method`  | `String` | **required** | HTTP method of the request received                      |
| `headers` | `Object` | **required** | Headers of the message received                          |

##### Return
`Object` with two properties: `isValid` (Boolean) and `actorUri` (String)
