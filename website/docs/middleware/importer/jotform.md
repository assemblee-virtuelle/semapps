---
title: Jotform
---

This mixin allows you to import data from [Jotform](https://jotform.com).


## Usage

```js
const { JotformImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [JotformImporterMixin],
  settings: {
    source: {
      jotform: {
        apiKey: null, // Jotform API key (see https://eu.jotform.com/myaccount/api)
        type: 'submissions' // Currently, only form submissions can be imported
      },
      // ... see ImporterMixin settings for other source config available
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
