---
title: JSON-LD
---

This service allows you to manage [JSON-LD](https://json-ld.org/) formatted data.

## Features

- Manipulate JSON-LD data (frame, compact, expand...)
- Manipulate JSON-LD contexts (parse, validate...)
- Automaticaly generate a local JSON-LD context

## Dependencies

- [OntologiesService](../ontologies)
- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html) (if a local context file is defined)

## Sub-services

- [JsonLdParserService](parser.md)
- [JsonLdContextService](context.md)
- JsonLdDocumentLoaderService
- JsonLdApiService

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
    localContextPath: '/.well-known/context.jsonld',
    cachedContextFiles: [
      {
        uri: 'https://www.w3.org/ns/activitystreams',
        file: path.resolve(__dirname, './config/context-as.json')
      }
    ]
  }
};
```

## Service settings

| Property             | Type       | Default                       | Description                                                                                                    |
| -------------------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `baseUri`            | `String`   | **required**                  | Base URL of the server.                                                                                        |
| `localContextPath`   | `String`   | "/.well-known/context.jsonld" | Path of the automatically generated local JSON-LD context file                                                 |
| `cacheFor`           | `number`   | 21600 (6 hours)               | `Cache-Control: public, max-age=<cacheFor>` header for api responses in seconds. Set to `null`, to deactivate. |
| `cachedContextFiles` | `[Object]` |                               | Context files to put in cache on start (see example above)                                                     |
