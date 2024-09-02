---
title: PodService
---

This service allows you to create a Pod and link it to a WebId.

## Usage

The `create` action (see below) should be called before the WebID creation, since the WebID will need to be stored in the Pod.

```js
  this.broker.createService({
    mixins: [WebIdService],
    settings: { ... },
    hooks: {
      before: {
        async createWebId(ctx) {
          const { nick } = ctx.params;
          await ctx.call('pod.create', { username: nick });
        }
      }
    }
  });
```

After the account creation, the `pim:storage` property will be added to the WebID, and the WebID will be given full rights to the whole of the Pod.

## Actions

The following service actions are available:

### `create`

Create a dataset and the root LDP container

##### Parameters

| Property   | Type     | Default      | Description                        |
| ---------- | -------- | ------------ | ---------------------------------- |
| `username` | `String` | **required** | Username used for the dataset name |

##### Return

The URL of the newly-created Pod (eg. http://localhost:3000/alice/data)

### `getUrl`

Get the URL of the Pod attached with the provided WebID

##### Parameters

| Property | Type     | Default      | Description                  |
| -------- | -------- | ------------ | ---------------------------- |
| `webId`  | `String` | **required** | WebID the Pod is attached to |

##### Return

The URL of the Pod (eg. http://localhost:3000/alice/data)
