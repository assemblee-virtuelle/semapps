---
title: Crypto Package
---

This package contains key management and signature services.

## Features

- Store different key types in a the `/key` and `/public-key` container.
- Sign HTTP requests with HTTP signatures.

## Dependencies

- [WebIdService](../webid.md)
- [LdpService](../ldp/)
- [Ontologies](../ontologies)

## Sub-services

- [SignatureService](./signature)
- [KeysService](./key-service)
- [MigrationService](./migration-service)

## Install

```bash
$ yarn add @semapps/crypto
```
