---
title: DereferenceMixin
---

## Usage

```javascript
module.exports = {
  name: 'resources',
  mixins: [ControlledContainerMixin, DereferenceMixin],
  settings: {
    path: '/resources',
    dereferencePlan: [
      {
        property: 'publicKey'
      },
      {
        property: 'schema:member',
        nested: [{ property: 'schema:affiliation' }]
      }
    ]
  }
};
```

## Settings

##### `dereferencePlan`

An object or array of objects that define how to dereference properties. Each object can have the following properties:

- `property` (required): The property to dereference.
- `nested` (optional): An array of objects that define how to dereference nested properties.

## Actions

This mixin automatically configures CRUD actions (see below). You can call them directly, or overwrite them.

- The `post` and `list` actions redirect to the [LdpContainerService](container) unless they are set. The `list` action is redirected to the [LdpContainerService `get`](container#get) action. When called directly, it will automatically guess the `containerUri` param if it is not set.

- The `get`, `create`, `patch`, `put` and `delete` actions redirect to the [LdpResourceService](resource) unless they are set.

You can also use Moleculer [action hooks](https://moleculer.services/docs/0.14/actions.html#Action-hooks) if you want to do something before or after each action call.
