---
title: ObjectsWatcherMiddleware
---

Watch for changes (create / update / delete) in the LDP server and send corresponding ActivityPub activities.
If private data becomes public, it sends a `Create` activity.
If public data becomes private, it sends a `Delete` activity.

## Features

- Watch for changes to the LDP servers (create, patch, put, delete...)
- Generate corresponding ActivityPub activities (Create, Update, Delete)
- Send them through the instance (Relay) actor or, in POD provider config, through the Pod actor.
- Send them to:
  - All actors that have read permissions on the resource
  - Followers and [as:Public](https://www.w3.org/TR/activitypub/#public-addressing), if the resource has public read rights

## Usage

```js
const { ObjectsWatcherMiddleware } = require('@semapps/sync');
module.exports = {
  middlewares: [
    CacherMiddleware({ ... }),
    WebAclMiddleware({ baseUrl: 'http://localhost:3000', podProvider: false }),
    ObjectsWatcherMiddleware({ baseUrl: 'http://localhost:3000', podProvider: false, }) // This middleware should come after the WebAclMiddleware
  ],
  ...
};
```

### Excluding containers

If you don't want a container with public data to be mirrored, you can add the `excludeFromMirror: true` option.

This choice will appear on the [VoID endpoint](../void.md), so that mirrors ignore them.

## Settings

| Property      | Type      | Default      | Description                                      |
| ------------- | --------- | ------------ | ------------------------------------------------ |
| `baseUrl`     | `String`  | **Required** | The base URL of your instance                    |
| `podProvider` | `Boolean` | false        | If your instance is a Pods provider, set to true |
