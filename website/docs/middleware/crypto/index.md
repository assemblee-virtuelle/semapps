---
title: Crypto
---

This package contains key management and signature services.

## Features

- Store different key types in a the `/key` and `/public-key` container.
- Sign HTTP requests with HTTP signatures, required for ActivityPub requests.
- Sign and validate JSON-LD objects with [data integrity proofs](https://www.w3.org/TR/vc-data-integrity/) (see [Verifiable Credentials Service](./verifiable-credentials)).
- Issue und verify [Verifiable Credentials](https://www.w3.org/TR/vc-overview/) as well as capabilities.

## Dependencies

- [WebIdService](../webid.md)
- [LdpService](../ldp/)
- [Ontologies](../ontologies)

## Services

- [KeysService](./keys)
- [Verifiable Credentials Service](./verifiable-credentials)
- [SignatureService](./signature)
- [ProxyService](./proxy)
- [MigrationService](./migration)
- [KeypairService](./keypair) (deprecated)

## Install

```bash
$ yarn add @semapps/crypto
```
