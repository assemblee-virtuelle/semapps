---
title: ControlledResourceMixin
---

This mixin is very similar to [ControlledContainerMixin](./controlled-container.md) except that it is for a single resource. This resource will be created on start, or when the storage is created in the case of Pod provider config. The content of the resource can be defined with the `initialValue` setting. The `get`, `patch` and `put` actions can be called without a `resourceUri`.

## Usage

```js
const { ControlledResourceMixin } = require('@semapps/ldp');

module.exports = {
  name: 'address-book',
  mixins: [ControlledResourceMixin],
  settings: {
    initialValue: {
      '@type': 'vcard:AddressBook',
      'vcard:title': 'My address book'
    },
    permissions: {},
    readOnly: false
  }
};
```

## Settings

All settings relative to this mixin should be set in a `imageProcessor` key.

| Property       | Type      | Default | Description                                                                    |
| -------------- | --------- | ------- | ------------------------------------------------------------------------------ |
| `path`         | `String`  |         | If not specified, or if the `allowSlugs` setting is false, a UUID will be used |
| `initialValue` | `Object`  | {}      | Value for the resources to be created                                          |
| `permissions`  | `Object`  | {}      | Permissions to be applied                                                      |
| `readOnly`     | `Boolean` | false   | If true, it will not be possible to call the PUT/PATCH method on this resource |

## Actions

The following service actions are available:

### `create`

Automatically called on start, or when the storage is created in the case of Pod provider config

##### Parameters

| Property | Type  | Default | Description                                             |
| -------- | ----- | ------- | ------------------------------------------------------- |
| `webId`  | `URI` |         | User doing the action (required in Pod provider config) |

### `getUri`

Return the URI of the single resource

##### Parameters

| Property | Type  | Default | Description                                             |
| -------- | ----- | ------- | ------------------------------------------------------- |
| `webId`  | `URI` |         | User doing the action (required in Pod provider config) |

##### Return values

The URI of the single resource

### `waitForCreation`

Wait for the resource to be created, by checking if it exists every second for 30s.

##### Parameters

| Property | Type  | Default | Description                                             |
| -------- | ----- | ------- | ------------------------------------------------------- |
| `webId`  | `URI` |         | User doing the action (required in Pod provider config) |

##### Return values

The URI of the single resource
