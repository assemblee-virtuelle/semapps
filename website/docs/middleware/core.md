---
title: Core
---

This service allows you to easily configure standard SemApps services. It is offered as a convenience, but you can still create them individually.

## Sub-services

- [ActivityPubService](activitypub/index.md)
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- JsonLdService
- [LdpService](ldp/index.md)
- [MirrorService](mirror.md)
- [SignatureService](signature.md)
- SparqlEndpointService
- [TripleStoreService](triplestore/index.md)
- [VoidService](void.md)
- [WebAclService](webacl/index.md)
- [WebfingerService](webfinger.md)

## Install

```bash
$ yarn add @semapps/core
```

## Usage

```js
const path = require('path');
const { CoreService } = require('@semapps/core');

module.exports = {
  mixins: [CoreService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    baseDir: path.resolve(__dirname, '..'),
    triplestore: {
      url: 'http://localhost:3030/',
      user: 'admin',
      password: 'admin',
      mainDataset: 'localData',
    },
    containers: [], // See the LdpService docs for the expected format
    // Optional. If not set, default values will be used
    jsonContext: null,
    ontologies: null,
  }
};
```

Additionally, you can pass custom configurations to the sub-services by using their name as a key (`activitypub`, `ldp`, etc.). 
If you do not wish not to instantiate a particular service, you can pass `false`.
