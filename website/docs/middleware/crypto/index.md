---
title: Crypto
---

This package contains key management and signature services.

## Features

- Store different key types in a the `/key` and `/public-key` container.
- Sign HTTP requests with HTTP signatures.

## Dependencies

- [WebIdService](../webid.md)
- [LdpService](../ldp/)
- [Ontologies](../ontologies)

## Services

- [KeysService](./keys)
- [SignatureService](./signature)
- [ProxyService](./proxy)
- [MigrationService](./migration)
- [KeypairService](./keypair) (deprecated)

## Install

```bash
$ yarn add @semapps/crypto
```
