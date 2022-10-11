---
title: ControlledContainerMixin
---

This mixin allows you to have more control about the way resources and containers are managed. When a container is setup
using this mixin, all API calls will redirect to the service. The service can also be called directly by other services.

> Warning: If you create a container this way, you should not add it to the `containers` settings of the LDP service.

## Usage

```js
const { ControlledContainerMixin } = require('@semapps/ldp');

module.exports = {
  name: 'users',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/users',
    acceptedTypes: ['foaf:Person'],
    // Other container options
  },
  actions: {
    ...
  }
}
```

## Settings

All [container options](index#container-options) are accepted.


## Actions

This mixin automatically configure CRUD actions (see below). You can call them directly, or overwrite them.

- The `post` and `list` actions redirect to the [LdpContainerService](container) unless they are set. When called directly, it will automatically guess the `containerUri` param if it is not set.

- The `get`, `create`, `patch`, `put` and `delete` actions redirect to the [LdpResourceService](resource) unless they are set.

You can also use Moleculer [action hooks](https://moleculer.services/docs/0.14/actions.html#Action-hooks) if you want to do something before or after each action call.
