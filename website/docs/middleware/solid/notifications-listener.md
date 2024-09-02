---
title: NotificationsListenerService
---

This service make it easy to listen to resources (LDP resource, LDP container or ActivityStreams collection) using the [Solid Notifications Protocol](https://solid.github.io/notifications/protocol). It uses the [webhook channel](https://solid.github.io/notifications/webhook-channel-2023).

## Usage

```js
const { NotificationsListenerService } = require('@semapps/solid');

module.exports = {
  mixins: [NotificationsListenerService],
  adapter: new TripleStoreAdapter({ type: 'WebhookChannelListener', dataset: 'settings' }),
  settings: {
    baseUrl: 'http://localhost:3000/'
  }
};
```

## Service settings

| Property  | Type     | Default      | Description            |
| --------- | -------- | ------------ | ---------------------- |
| `baseUrl` | `String` | **required** | Base URL of the server |

## Actions

The following service actions are available:

### `register`

Register a new webhook channel. Whenever the resource is updated, it will call the provided action with the notification.

##### Parameters

| Property      | Type     | Default      | Description                                           |
| ------------- | -------- | ------------ | ----------------------------------------------------- |
| `resourceUri` | `URI`    | **required** | The resource you want to listen to                    |
| `actionName`  | `String` | **required** | The action to call when the resource is being updated |
