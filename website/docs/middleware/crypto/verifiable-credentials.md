---
title: Verifiable Credentials
---

Verifiable Credentials Services.

All signatures use the EdDSA RDFC 2022 Data Integrity Cryptosuite.

## Features

- Issue and verify Verifiable Credentials (VCs).
- Create and verify Verifiable Presentations (VPs).
- Support for capability-based authorization using VCs.
- Data integrity proofs for signing and verifying objects.
- Challenge service for creating and validating challenges.

## Dependencies

- [Ontologies](../ontologies)

## Settings

| Property      | Type      | Default | Description                                                    |
| ------------- | --------- | ------- | -------------------------------------------------------------- |
| `podProvider` | `boolean` | `false` | If the service is operating in a pod provider environment.     |
| `enableAPI`   | `boolean` | `true`  | Enable the [VC API (v0.3)](https://w3c-ccg.github.io/vc-api/). |

## Signing objects with [Data Integrity Proofs](https://www.w3.org/TR/vc-data-integrity/)

You can sign RDF data with [data integrity proofs](https://www.w3.org/TR/vc-data-integrity/).

There are two actions available:

### `crypto.vc.data-integrity.signObject`

Sign an object using a data integrity proof.

##### Parameters

| Property               | Type     | Default                  | Description                                                                                                                                                                                                              |
| ---------------------- | -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `object`               | `object` | **required**             | The JSON-LD object to sign.                                                                                                                                                                                              |
| `options.proofPurpose` | `string` | `assertionMethod`        | The [purpose](https://www.w3.org/TR/vc-data-integrity/#dfn-proofpurpose) term of the proof as a string. This defines the intent of the proof, such as `assertionMethod` for asserting the validity of the signed object. |
| `purpose`              | `object` | `undefined`              | A custom proof purpose object. If not provided, the default `AssertionProofPurpose` is used.                                                                                                                             |
| `webId`                | `string` | `ctx.meta.webId`         | The WebID of the signer.                                                                                                                                                                                                 |
| `keyObject`            | `object` | `undefined`              | The key object to use for signing.                                                                                                                                                                                       |
| `keyId`                | `string` | The actor's default key. | The key ID to use for signing.                                                                                                                                                                                           |

##### Return

`object` - The signed object. The signature is contained in the `proof` entry of the object.

### `crypto.vc.data-integrity.verifyObject`

Verify an object signed with a data integrity proof.

##### Parameters

| Property               | Type     | Default           | Description                                                                                                                                                                                                              |
| ---------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `object`               | `object` | **required**      | The JSON-LD object to verify.                                                                                                                                                                                            |
| `options.proofPurpose` | `string` | `assertionMethod` | The [purpose](https://www.w3.org/TR/vc-data-integrity/#dfn-proofpurpose) term of the proof as a string. This defines the intent of the proof, such as `assertionMethod` for asserting the validity of the signed object. |
| `purpose`              | `object` | `undefined`       | A custom proof purpose object. If not provided, the default `AssertionProofPurpose` is used.                                                                                                                             |

##### Return

`object` - The verification result. If verification succeeds, it will return `{ verified: true }`. If it fails, it will return `{ verified: false, error: <error> }`.

## Issuing and Verifying Verifiable Credentials

### `crypto.vc.issuer.createVC`

Create a Verifiable Credential.

##### Parameters

| Property               | Type      | Default           | Description                                      |
| ---------------------- | --------- | ----------------- | ------------------------------------------------ |
| `credential`           | `object`  | **required**      | The credential object to be issued.              |
| `options.proofPurpose` | `string`  | `assertionMethod` | The proof purpose term of the credential.        |
| `webId`                | `string`  | `ctx.meta.webId`  | The WebID of the issuer.                         |
| `noAnonRead`           | `boolean` | `false`           | Prevent anonymous read access to the credential. |
| `keyObject`            | `object`  | `undefined`       | The key object to use for signing.               |
| `keyId`                | `string`  | `undefined`       | The key ID to use for signing.                   |

##### Return

`object` - The signed Verifiable Credential.

### `crypto.vc.verifier.verifyVC`

Verify a Verifiable Credential.

##### Parameters

| Property               | Type     | Default           | Description                               |
| ---------------------- | -------- | ----------------- | ----------------------------------------- |
| `verifiableCredential` | `object` | **required**      | The Verifiable Credential to verify.      |
| `options.proofPurpose` | `string` | `assertionMethod` | The proof purpose term of the credential. |

##### Return

`object` - The verification result. If verification succeeds, it will return `{ verified: true }`. If it fails, it will return `{ verified: false, error: <error> }`.

### `crypto.vc.holder.createPresentation`

Create a Verifiable Presentation.

##### Parameters

| Property               | Type      | Default           | Description                                         |
| ---------------------- | --------- | ----------------- | --------------------------------------------------- |
| `presentation`         | `object`  | **required**      | The presentation object to be created.              |
| `options.challenge`    | `string`  | **required**      | The challenge to include in the presentation proof. |
| `options.domain`       | `string`  | `undefined`       | The domain to include in the presentation proof.    |
| `options.proofPurpose` | `string`  | `assertionMethod` | The proof purpose term of the presentation.         |
| `options.persist`      | `boolean` | `false`           | Whether to persist the presentation as a resource.  |
| `keyObject`            | `object`  | `undefined`       | The key object to use for signing.                  |
| `keyId`                | `string`  | `undefined`       | The key ID to use for signing.                      |
| `noAnonRead`           | `boolean` | `false`           | Prevent anonymous read access to the presentation.  |
| `webId`                | `string`  | `ctx.meta.webId`  | The WebID of the holder creating the presentation.  |

##### Return

`object` - The signed Verifiable Presentation.

### `crypto.vc.verifier.verifyPresentation`

Verify a Verifiable Presentation.

##### Parameters

| Property                 | Type      | Default           | Description                                                          |
| ------------------------ | --------- | ----------------- | -------------------------------------------------------------------- |
| `verifiablePresentation` | `object`  | **required**      | The Verifiable Presentation to verify.                               |
| `options.challenge`      | `string`  | `undefined`       | The challenge to use for verification.                               |
| `options.domain`         | `string`  | `undefined`       | The domain to use for verification.                                  |
| `options.proofPurpose`   | `string`  | `assertionMethod` | The proof purpose term of the presentation.                          |
| `options.unsigned`       | `boolean` | `false`           | Whether the presentation is unsigned (useful for open capabilities). |

##### Return

`object` - The verification result. If verification succeeds, it will return `{ verified: true }`. If it fails, it will return `{ verified: false, error: <error> }`.

## Issuing and Verifying Capabilities

Capabilities authorizations issued from someone else that authorize the holder to perform certain actions.

In SemApps, you can enable routes to authorize with a capability Verifiable Presentation of someone. See the example below.

How do capability chains work?

How do you issue a capability to a subject? By setting the credentialSubject.id to that actor.

### Creating a capability presentation

For creating a capability presentation, use `crypto.vc.holder.createPresentation`. In the presentation's `verifiableCredential` property, set all verifiable credentials of the capability chain, if more than one is used.

### Capability Issuance and Chains

To issue a capability to someone, the VC issuer sets the `credentialSubject.id` to the id of the actor that is being authorized. For chains, the `credentialSubject.id` of the previous capability VC is the issuer of the following.

TODO: By default the max chain length is 2 -- should we increase this or let it be defined by the issuer of the first VC?

#### Example

...

### `crypto.vc.verifier.verifyCapabilityPresentation`

#### Verification Steps and What is Not Checked

The verification of capabilities is performed using proof purpose classes, as implemented in [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures) and the [vc package](https://github.com/digitalbazaar/vc). These classes ensure that the cryptographic proofs and delegation chains are valid.

**What is Checked:**

- **Challenge Validation**: Ensures that the challenge in the presentation matches the expected value.
- **Verification Method**: Confirms that the verification method used to sign the presentation is correct.
- **Controller Validation**: Verifies that the key of the controller (signer) is present in the controller document (e.g., WebID).
- **Capability Chain Validation**:
  - Ensures that the `credentialSubject.id` of each VC matches the `issuer` of the next VC in the chain.
  - Validates that the subject of the last VC in the chain matches the invoker (signer) of the presentation.
  - Allows for open capabilities (i.e., VCs without a `credentialSubject.id`) if there is only one VC in the chain.
- **Field Consistency**: Checks that the `credentialSubject` content of each VC in the chain matches, allowing for decreasing root fields in later VCs.
- **Issuance and Proof Dates**: Ensures that all credentials have either an `issuanceDate` or `proof.created` field.
- **Holder Validation**: Confirms that the `holder` in the presentation matches the controller, if specified.
- **Chain Length**: Ensures that the number of VCs in the chain does not exceed the maximum allowed (`maxChainLength`).

**What is Not Checked:**

- **Business Logic**: The verification process does not validate the correctness of the `credentialSubject` content. For example, it does not ensure that a statement like "A is allowed to read B" is actually made by "B" and not by "C".
  Any additional rules or logic specific to the application must be implemented separately.

#### Parameters

| Property                 | Type     | Default      | Description                                                |
| ------------------------ | -------- | ------------ | ---------------------------------------------------------- |
| `verifiablePresentation` | `object` | **required** | The Verifiable Presentation to verify.                     |
| `options.maxChainLength` | `number` | `2`          | The maximum number of VCs allowed in the capability chain. |
| `options.challenge`      | `string` | `undefined`  | The challenge to use for verification.                     |
| `options.domain`         | `string` | `undefined`  | The domain to use for verification.                        |

##### Return

`object` - The verification result. If verification succeeds, it will return `{ verified: true }`. If it fails, it will return `{ verified: false, error: <error> }`.

### Capability Issuance and Chains

To issue a capability to someone, the VC issuer sets the `credentialSubject.id` to the ID of the actor being authorized. For chains, the `credentialSubject.id` of the previous capability VC must match the `issuer` of the next VC in the chain.

#### Example: Issuing and Verifying a Capability Chain

_Some fields are omitted._

1. **Issuing the First Capability**:
   This capability will allow holders to see the issuer's profile and send `Note` activities (assuming the user puts restrictions on that for strangers).

   ```json
   {
     "@context": [
       "https://www.w3.org/ns/credentials/v2",
       {
         "as": "https://www.w3.org/ns/activitystreams#",
         "apods": "http://activitypods.org/ns/core#",
         "acl": "http://www.w3.org/ns/auth/acl#"
       }
     ],
     "id": "https://example.com/actor/issuer/credentials/111",
     "type": ["VerifiableCredential"],
     "issuer": "https://example.com/actor/issuer",
     "credentialSubject": {
       "id": "https://example.com/actor/holder",
       "hasAuthorization": {
         "type": "acl:Authorization",
         "acl:mode": "acl:Read",
         "acl:accessTo": [
           "https://example.com/actor/issuer/profile-resource",
           "https://example.com/actor/issuer/profile-picture"
         ]
       },
       "apods:hasActivityGrant": {
         "type": "Create",
         "as:object": { "type": "Note" },
         "as:to": "https://example.com/actor/issuer"
       }
     },
     "issuanceDate": "2023-10-01T00:00:00Z"
   }
   ```

2. **Delegating the Capability**:
   The holder of the first VC creates a second VC and passes the second VC on.

   ```json
   {
     "id": "https://example.com/actor/holder/credentials/222",
     "type": ["VerifiableCredential"],
     "issuer": "https://example.com/actor/holder",
     "credentialSubject": {
       "id": "https://example.com/actor/delegate",
       "apods:hasAuthorization": {...},
       "apods:hasActivityGrant": {...}
     },
     "issuanceDate": "2023-10-02T00:00:00Z"
   }
   ```

3. **Creating a Capability Presentation**:
   The holder of the second VC creates a Verifiable Presentation containing both VCs. Before that, it needs to have obtained a challenge from the challenge endpoint of the original issuer (see below).

   ```json
   {
     "type": ["VerifiablePresentation"],
     "verifiableCredential": [
       { ...firstCapabilityVC },
       { ...secondCapabilityVC }
     ],
     "proof": {
       "type": "DataIntegrityProof",
       "cryptosuite": "eddsa-rdfc-2022",
       "created": "2023-10-03T00:00:00Z",
       "verificationMethod": "https://example.com/actor/delegate#key-1",
       "proofPurpose": "assertionMethod",
       "challenge": "random-challenge-string",
       "proofValue": "...",
     }
   }
   ```

4. **Verifying the Capability Presentation**:
   Use the `crypto.vc.verifier.verifyCapabilityPresentation` action to verify the presentation:

   ```javascript
   const result = await ctx.call('crypto.vc.verifier.verifyCapabilityPresentation', {
     verifiablePresentation: presentation,
     options: {
       maxChainLength: 2,
       challenge: 'random-challenge-string'
     }
   });

   if (result.verified) {
     console.log('Capability presentation is valid.');
   } else {
     console.error('Verification failed:', result.error);
   }
   ```

This process ensures that the delegation chain is valid and that the actor presenting the capability is authorized to perform the specified action.

### Setting up Capability-Enabled Routes

To enable capability-based authorization for a route, set the `opts.authorizeWithCapability` option to `true` in the route configuration. This will ensure that the `authorize` action checks for valid capability presentations. You can specify the maximum allowed chain length with `opts.maxChainLength`. The default is `2`.

When a capability is successfully verified, as described above, the capability presentation is attached to `ctx.meta.authorization.capabilityPresentation` and can be used by the registered actions to check the validity of the business logic.

#### Example

```javascript
ctx.call('api.addRoute', {
  path: '/your/route',
  name: 'your-unique-route-name',
  aliases: {
    'GET /': 'your.action.here'
  },
  authorization: true,
  authentication: false,
  opts: {
    authorizeWithCapability: true,
    maxChainLength: 2
  }
});
```

## Challenge Service

The Challenge Service is used to create and validate challenges. Challenges are used to prevent replay attacks by ensuring that each request is unique.

### `crypto.vc.presentation.challenge.create`

Create a new challenge.

##### Parameters

| Property | Type     | Default | Description                  |
| -------- | -------- | ------- | ---------------------------- |
| `length` | `number` | `32`    | The length of the challenge. |

##### Return

`string` - The created challenge.

### `crypto.vc.presentation.challenge.validate`

Validate a challenge.

##### Parameters

| Property    | Type     | Default      | Description                |
| ----------- | -------- | ------------ | -------------------------- |
| `challenge` | `string` | **required** | The challenge to validate. |

##### Return

`object` - The validation result.

## VC API

The VC API implements parts of the [VC API spec](https://w3c-ccg.github.io/vc-api/) v0.3.

All requests support the same allowed parameters as the actions above.

### Endpoints

- `POST /credentials/verify`: Verify a Verifiable Credential.
- `POST /credentials/issue`: Issue a Verifiable Credential.
- `GET /credentials/:id`: Get a credential by id. Unless requested upon issuance, credentials do not have read restrictions since they are unguessable.
- `POST /presentations`: Create a Verifiable Presentation.
- `GET /presentations/:id`: Get a presentation by id. Unless requested upon issuance, presentations do not have read restrictions since they are unguessable.
- `POST /presentations/verify`: Verify a Verifiable Presentation.
- `POST /presentations/verify-capability`: Verify a capability presentation.
- `POST /challenges`: Create a new challenge.
- `POST /data-integrity/verify`: Verify an object using data integrity proofs.
- `POST /data-integrity/sign`: Sign an object using data integrity proofs.
