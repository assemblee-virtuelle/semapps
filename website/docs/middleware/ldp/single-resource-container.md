---
title: SingleResourceContainerMixin
---

This mixin is very similar to [ControlledContainerMixin](./controlled-container.md) except that the container will contain a single resource. This resource will be created on start, or when the storage is created in the case of Pod provider config. The content of the resource can be defined with the `initialValue` setting. The `get`, `patch` and `put` actions can be called without a `resourceUri`.

## Usage

```js
const { SingleResourceContainerMixin } = require('@semapps/ldp');

module.exports = {
  name: 'bot',
  mixins: [SingleResourceContainerMixin],
  settings: {
    acceptedTypes: ['Application'],
    initialValue: {
      name: 'Super bot'
    }
    // Other container options...
  }
};
```

## Settings

All [container options](index.md#container-options) are accepted.

These container options are overridden with the following values:

- `readOnly`: true
- `excludeFromMirror`: true
- `activateTombstones`: false

## Actions

he following service actions are available:

### `initializeResource`

Automatically called on start, or when the storage is created in the case of Pod provider config

##### Parameters

| Property | Type  | Default | Description                                             |
| -------- | ----- | ------- | ------------------------------------------------------- |
| `webId`  | `URI` |         | User doing the action (required in Pod provider config) |

### `getResourceUri`

Return the URI of the single resource

##### Parameters

| Property | Type  | Default | Description                                             |
| -------- | ----- | ------- | ------------------------------------------------------- |
| `webId`  | `URI` |         | User doing the action (required in Pod provider config) |

##### Return values

The URI of the single resource

### `waitForResourceCreation`

Wait for the resource to be created, by checking if it exists every second for 30s.

##### Parameters

| Property | Type  | Default | Description                                             |
| -------- | ----- | ------- | ------------------------------------------------------- |
| `webId`  | `URI` |         | User doing the action (required in Pod provider config) |

##### Return values

The URI of the single resource
