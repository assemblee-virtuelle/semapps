---
title: Sync
---

Tools to synchronize data between servers.

## Middlewares

- [ObjectsWatcherMiddleware](objects-watcher.md)

## Services

- [AggregatorService](aggregator.md)
- [MirrorService](mirror.md)
- [SynchronizerService](synchronizer.md)

## Install

```bash
$ yarn add @semapps/sync
```

## Use cases

### 1. I want to synchronize all public data from another server

The other server will need to install the [WatcherMiddleware](./objects-watcher.md), which itself require the [RelayService](../activitypub/relay.md).

Your server should use the [MirrorService](./mirror.md) and indicate the URL of the other server in the `servers` settings. This service requires the [RelayService](../activitypub/relay.md) as well.

At first launch, all the public data of the other server will be downloaded (via the LDP protocol) and inserted into a separate graph named `http://semapps.org/mirror`.

Then the `relay` actor of your server will follow the `relay` actor of the remote server you are mirroring.

Everytime some data changes occur on the remote server, your server will receive ActivityPub activities and will update its local mirror of the data accordingly.

The `http://semapps.org/mirror` graph is not directly editable through LDP, but can be fetched with the `ldp.resource.get` action or via the SPARQL endpoint.


### 2. I want to aggregate the public data of Pods

The Pod provider will need to install the [WatcherMiddleware](./objects-watcher.md).

Your server should use the [AggregatorService](./aggregator.md). This service requires the [RelayService](../activitypub/relay.md).

If Pods want their public data to be aggregated in your server, they should send an `Offer > Follow` activity to its `relay` actor.

The `relay` actor will automatically accept these requests, and will thus send a `Follow` activity to the Pod.

Whenever a public data is created, updated or deleted, the `relay` actor will be informed and its local cache will be updated.

Remote resources will be attached to a local container which accepts the same type of resources.

> At the moment, there is no mechanism to download the existant public data when a `Offer > Follow` activity is received.


### 3. I want to synchronize data which have been shared specifically with some users

The Pod provider will need to install the [WatcherMiddleware](./objects-watcher.md).

When a user is being given `acl:Read` rights on a resource, an activity of type `Announce > Create` is automatically sent to them.

When this shared resource is updated or deleted, an activity of type `Announce > Update` or `Announce > Delete` is sent to all users who have `acl:Read` rights.

The recipients will synchronize the data received thanks to the `SynchronizerService`.
