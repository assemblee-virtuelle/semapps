---
title: RelayService
---

An instance-level ActivityPub actor. Used by the [InferenceService](../inference.md) and the [SynchronizerService](../sync/synchronizer.md).


## Usage

```js
const { RelayService } = require('@semapps/activitypub');

module.exports = {
  mixins: [RelayService],
  settings: {
    actor: {
      username: 'relay',
      name: 'Relay actor for instance'
    }
  }
};
```

You must also make sure that your server has a container that accepts `Application` type.
This service will create an ActivityPub actor there, with the name `relay`.
You could put the actor in the `/users` container, or in a dedicated `/bots` container.

```js
const containers = [{
  path: '/users',
  acceptedTypes: ['pair:Person', 'Application'], // The Application type is important
  blankNodes: ['sec:publicKey'],
  excludeFromMirror: true
}];
```
You also most probably want to use the option `excludeFromMirror: true`. It will hide prevent this container from being [mirrored](../sync/mirror.md).


## Actions

The following service actions are available:

### `getActor`

Get the Relay ActivityPub actor

##### Return
The full data of the Relay actor.

