---
title: Nodeinfo
---

This service implements the [Nodeinfo](https://nodeinfo.diaspora.software) 2.1 protocol, which allows remote services to discover informations about a local node.

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)

## Install

```bash
$ yarn add @semapps/nodeinfo
```

## Usage

```js
const { NodeinfoService } = require('@semapps/nodeinfo');

module.exports = {
  mixins: [NodeinfoService],
  settings: {
    baseUrl: 'https://mydomain.com',
    software: {
      name: 'mysoft',
      version: '1.0.0',
      repository: 'https://github.com/mysoft/mysoft,
      homepage: 'https://mysoft.com'
    },
    protocols: ['activitypub'],
    services: {
      inbound: [],
      outbound: []
    },
    openRegistrations: true,
    metadata: {
      // Any custom metadata
    }
  },
  actions: {
    async getUsersCount(ctx) {
      return {
        total: 0,
        activeHalfYear: 0,
        activeMonth: 0
      };
    }
  }
};
```

### Discovering a node

To find the nodeinfo schema, a simple GET is enough:

```
GET /.well-known/nodeinfo HTTP/1.1
Host: localhost:3000
Accept: application/json
```

If a nodeinfo schema exists, it will return a JSON like this:

```json
{
  "links": [
    {
      "rel": "http://nodeinfo.diaspora.software/ns/schema/2.1",
      "href": "http://localhost:3000/nodeinfo/2.1"
    }
  ]
}
```

You can then fetch the returned URL to find the nodeinfo schema.

> We provide a [`useNodeinfo`](../frontend/activitypub-components.md#usenodeinfo) hook to easily fetch the schema of any server.

## Settings

| Property  | Type     | Default | Description                                                            |
| --------- | -------- | ------- | ---------------------------------------------------------------------- |
| `baseUrl` | `String` |         | Base URL of the server. Used to find the domain name if it is not set. |

See https://nodeinfo.diaspora.software/schema.html for the other settings.

## Actions

### `getUsersCount`

Return the users count (total, activeHalfYear, activeMonth).

##### Return value

`Object` formatted like in the example above.

### `addLink`

Add a link to the `/.well-known/nodeinfo` URL (in addition to `http://nodeinfo.diaspora.software/ns/schema/2.1`).

##### Parameters

| Property | Type     | Default      | Description                                            |
| -------- | -------- | ------------ | ------------------------------------------------------ |
| `rel`    | `String` | **required** | Description of the link, usually in the form of an URI |
| `href`   | `String` | **required** | Link itself                                            |
