---
title: Discourse
---

This mixin allows you to import data from [Discourse forums](https://discourse.org).


## Usage

```js
const { DiscourseImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [DiscourseImporterMixin],
  settings: {
    source: {
      discourse: {
        baseUrl: null, // Base URL of the Discourse instance
        type: 'topics' // Currently, only topics can be imported
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
