---
title: HumHub
---

This mixin allows you to import elements from [HumHub](https://humhub.com).


## Usage

```js
const { HumHubImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [HumHubImporterMixin],
  settings: {
    source: {
      humhub: {
        baseUrl: null, // Base URL of the HumHub instance
        jwtToken: null, // JWT token to access the API
        type: null // 'user', 'space', 'calendar', 'post'
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
