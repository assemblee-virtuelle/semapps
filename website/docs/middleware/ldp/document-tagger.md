---
title: DocumentTaggerMixin
---

Tag new and updated resources with the following information: creation date, last modification date, creator's webId.

By default, the [Dublin Core's ontology](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/), is used but this can be changed with the `documentPredicates` setting (see below).

:::caution
If you use Dublin Core's ontology, you need to add it to the [LdpService's ontologies setting](./index#settings). You must also add it to the default JSON-LD context. In both cases, you must use the `db` prefix.
:::

## Usage

```js
const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');

module.exports = {
  mixins: [LdpService, DocumentTaggerMixin],
  settings: {
    // Set this if you want to change the default ontology
    documentPredicates: {
      created: 'dc:created',
      updated: 'dc:modified',
      creator: 'dc:creator'
    }
  }
};
```
