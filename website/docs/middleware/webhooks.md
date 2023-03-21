---
title: Webhooks
---

This service allows to create incoming [webhooks](https://en.wikipedia.org/wiki/Webhook), in order to allow users to perform some actions directly, bypassing the endpoints authorizations.

## Features

- Generate webhooks for any user through [Moleculer REPL](https://moleculer.services/docs/0.14/moleculer-repl.html)
- Allow users to create their own webhooks with a secured endpoint
- Handle different kind of actions, depending on your needs

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [LdpService](ldp)

## Install

```bash
$ yarn add @semapps/webhooks
```

## Usage

```js
const { WebhooksService } = require('@semapps/webhooks');

module.exports = {
  mixins: [WebhooksService],
  settings: {
    containerUri: "http://localhost:3000/webhooks/",
    allowedActions: ['myAction'],
    
  },
  actions: {
    async myAction(ctx) {
      const { user, data } = ctx.params;
      // Handle stuff here...
    }
  }
}
```

## Settings

| Property         | Type                | Default                                     | Description                                                 |
|------------------|---------------------|---------------------------------------------|-------------------------------------------------------------|
| `containerUri`   | `String`            | **required**                                | Container where the webhooks will be stored.                |
| `allowedActions` | `Array`             | **required**                                | Name of the webhook actions which can be used               |
| `context`        | `Array` or `Object` | { "@vocab": "http://semapps.org/ns/core#" } | JSON-LD context used when returning the webhook information |


## Use cases

### Generating new webhooks

You generate a webhook by providing a user and an action. The action must be in the list of `allowedActions`, in the settings.

#### Through the command line

Start Moleculer in REPL mode and call the `generate` action like this:

```bash
mol$ call webhooks.generate --userId myUser --action myAction
```

#### Through a secured endpoint

`POST` to the `/webhooks` endpoint as a logged-in user, providing the action that will be handled by this endpoint as JSON.

```
POST /webhooks HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer XXX

{
  "action": "myAction",
}
```

### Posting to a webhook

When you generate a webhook, you will receive an URI in response. You can then post JSON data to this webhook. It will be handled by the action(s) you defined.


### Queuing incoming POSTs

If you wish, you can use the [Bull](https://github.com/OptimalBits/bull) task manager to queue incoming POSTs and make sure no data is lost.

All you need to do is add [Moleculer's official Bull service](https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-bull) as a mixin:

```js
const QueueService = require('moleculer-bull');
const { WebhooksService } = require('@semapps/webhooks');

module.exports = {
  mixins: [WebhooksService, QueueService('redis://localhost:6379/0')],
  ...
};
```

Please look at the Bull service's official documentation for more information.
