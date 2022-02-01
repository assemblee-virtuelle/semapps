---
title: GoGoCarto
---

This mixin allows you to import elements from [GoGoCarto](https://gogocarto.fr).


## Usage

```js
const { GoGoCartoImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [GoGoCartoImporterMixin],
  settings: {
    source: {
      gogocarto: {
        baseUrl: null, // Base URL of the GoGoCarto instance
        type: 'elements' // Currently, only elements can be imported
      },
      // ... see ImporterService settings for other source config available
    },
    dest: {
      containerUri: null, // Container where the data will be posted (must be created already)
      predicatesToKeep: [], // Don't remove these predicates when updating data
    },
    activitypub: {
      actorUri: null, // ActivityPub actor who will post activities on synchronization (leave null to disable this)
      activities: ['Create', 'Update', 'Delete'] // The activities you want to be posted by the actor
    },
    cronJob: {
      time: null, // '0 0 4 * * *' for every night at 4am 
      timeZone: 'Europe/Paris'
    }
  },
  methods: {
    transform(data) {
      return({
        ...data
      });
    }
  }
};
```
