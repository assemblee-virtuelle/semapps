---
title: JSON-LD
---

This service allows you to do operations (compact, frame...) on [JSON-LD](https://json-ld.org/) files. It heavily relies
on the [jsonld.js](https://github.com/digitalbazaar/jsonld.js) NPM package. Its particularity is that it keeps in cache
the context files, to avoid refetching them at every operation. It also allows to create a local context file.

## Dependencies
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)

## Install

```bash
$ yarn add @semapps/jsonld
```

## Usage

```js
const path = require('path');
const { JsonLdService } = require('@semapps/jsonld');

module.exports = {
  mixins: [JsonLdService],
  settings: {
    baseUri: 'http://localhost:3000',
    localContextFiles: [
      {
        path: 'context.json',
        file: path.resolve(__dirname, './config/context.json')
      }
    ],
    remoteContextFiles: [
      {
        uri: 'https://www.w3.org/ns/activitystreams',
        file: path.resolve(__dirname, './config/context-as.json')
      }
    ]
  }
};
```

## Service settings

| Property             | Type     | Default      | Description                                                                          |
|----------------------|----------|--------------|--------------------------------------------------------------------------------------|
| `baseUri`            | `String` | **required** | Base URL of the LDP server                                                           |
| `localContextFiles`  | `Array`  |              | Local context files to create on the given path and put in cache (see example above) |
| `removeContextFiles` | `Array`  |              | Remove context files to put in cache (see example above)                             |


## Actions

All the methods of the [jsonld.js](https://github.com/digitalbazaar/jsonld.js) NPM package are available as actions:

- `compact`
- `expand`
- `flatten`
- `frame`
- `normalize`
- `fromRDF`
- `toRDF`

See [the examples](https://github.com/digitalbazaar/jsonld.js#examples) to see how to use them.

### `toQuads`

Same as `toRDF` but returns quads formatted according to the [RDF.JS data model](https://github.com/rdfjs/data-model-spec)
