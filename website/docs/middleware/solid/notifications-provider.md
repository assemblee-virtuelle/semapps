---
title: NotificationsProviderService
---

This service implements the [Solid Notifications Protocol](https://solid.github.io/notifications/protocol). It allows clients to listen to any resource on a Pod, with a [webhook](https://solid.github.io/notifications/webhook-channel-2023) or [websocket](https://solid.github.io/notifications/websocket-channel-2023) channel.

We support the same [notification format](https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/notifications/#notification-format) as the Community Solid Server. Additionally, we allow clients to listen to ActivityStreams collections.

## Usage

```js
const { NotificationsProviderService } = require('@semapps/solid');

module.exports = {
  mixins: [NotificationsProviderService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    queueServiceUrl: 'http://localhost:6379/0',
    channels: {
      webhook: true, // Default value
      websocket: true // Default value
    }
  }
};
```

## Service settings

| Property             | Type       | Default      | Description                                      |
| -------------------- | ---------- | ------------ | ------------------------------------------------ |
| `baseUrl`            | `String`   | **required** | Base URL of the server                           |
| `queueServiceUrl`    | `String`   | **required** | Redis connection string used to queue jobs       |
| `channels.webhook`   | `Boolean`  | true         | If true, allow clients to listen with webhooks   |
| `channels.websocket` | `Boolean ` | true         | If true, allow clients to listen with websockets |
