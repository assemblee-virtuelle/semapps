---
title: DocumentTaggerMixin
---

Tag new and updated resources with the following information: creation date, last modification date, creator's webId.

By default, the [Dublin Core's ontology](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/), is used but this can be changed with the `documentPredicates` setting (see below).

## Usage

```js
const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');

module.exports = {
  mixins: [LdpService, DocumentTaggerMixin],
  settings: {
    // Set this if you want to change the default ontology
    documentPredicates: {
      created: 'http://purl.org/dc/terms/created',
      updated: 'http://purl.org/dc/terms/modified',
      creator: 'http://purl.org/dc/terms/creator'
    }
  }
};
```
