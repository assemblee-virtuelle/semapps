---
title: JsonLdParserService
---

This service allows you to do operations (compact, frame...) on [JSON-LD](https://json-ld.org/) files. It heavily relies
on the [jsonld.js](https://github.com/digitalbazaar/jsonld.js) NPM package. Its particularity is that it keeps in cache
the context files, to avoid refetching them at every operation.

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
