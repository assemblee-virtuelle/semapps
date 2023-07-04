---
title: SynchronizerService
---

Listen to activities sent to the local `relay` actor (or to the Pod owner, in a Pod provider) and keep the local cached
data in sync with the remote data.

:::caution
This service is automatically initialized by the [MirrorService](mirror.md) and the [AggregatorService](aggregator.md)
:::


## Dependencies

- [RelayService](../activitypub/relay.md) (if not a Pod provider)


## Usage

```js
const { SynchronizerService } = require('@semapps/sync');

module.exports = {
  mixins: [SynchronizerService],
  settings: {
    podProvider: false,
    mirrorGraph: true,
    synchronizeContainers: true,
    attachToLocalContainers: false
  },
};
```


## Settings

| Property                  | Type      | Default | Description                                                             |
|---------------------------|-----------|---------|-------------------------------------------------------------------------|
| `podProvider`             | `Boolean` | false   | Set to true if your instance is a Pods provider                         |            
| `mirrorGraph`             | `Boolean` | true    | Store all remote data in the mirror named graph                         |
| `synchronizeContainers`   | `Boolean` | true    | Synchronize also the remote containers                                  |
| `attachToLocalContainers` | `Boolean` | false   | Attach remote resources to local containers (if the same type is found) |


