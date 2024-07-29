---
title: Core
---

This service allows you to easily configure standard SemApps services. It is offered as a convenience, but you can still create them individually.

## Sub-services

- [ActivityPubService](activitypub)
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [JsonLdService](jsonld)
- [LdpService](ldp)
- [SignatureService](crypto/signature)
- [KeysService](crypto/keys)
- [SparqlEndpointService](sparql-endpoint)
- [TripleStoreService](triplestore)
- [VoidService](void.md)
- [WebAclService](webacl)
- [WebfingerService](webfinger)

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
      mainDataset: 'localData'
    },
    containers: [], // See the LdpService docs for the expected format
    ontologies: [] // If you use custom ontologies, you can add it here
  }
};
```

Additionally, you can pass custom configurations to the sub-services by using their name as a key (`activitypub`, `ldp`, etc.).
If you do not wish not to instantiate a particular service, you can pass `false`.

### Setup the WebAclMiddleware

Unless you disable the WebAclService, you will need to setup the WebAclMiddleware in your `moleculer.config.js` file.

Please see the [WebAclService](./webacl) documentation for more information.
