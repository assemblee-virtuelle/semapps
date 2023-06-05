---
title: AggregatorService
---

Automatically aggregate the public data of other SemApps instances (including Pods), and keep them updated.
When a remote resource is created, it is automatically cached in the local container which accepts the same type.
When a remote resource is update or deleted, the local cache is automatically updated.


## Dependencies

- [RelayService](../activitypub/relay.md)


## Sub-services

- [SynchronizerService](synchronizer.md)


## Usage

```js
const { AggregatorService } = require('@semapps/sync');

module.exports = {
  mixins: [AggregatorService],
  settings: {
    acceptFollowOffers: true,
    mirrorGraph: true
  }
};
```


## Settings

| Property             | Type      | Default | Description                                                                                               |
|----------------------|-----------|---------|-----------------------------------------------------------------------------------------------------------|
| `acceptFollowOffers` | `Boolean` | true    | If true, the Relay actor will automatically follow actors which send `Offer > Follow` requests            |            
| `mirrorGraph`        | `Boolean` | true    | Store the remote resources in the mirror graph (recommended if WebACL are activated on the default graph) |            
