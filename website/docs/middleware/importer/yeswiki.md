---
title: YesWiki
---

This mixin allows you to import JSON data from [YesWiki](https://yeswiki.net), and more specifically from [Bazar forms](https://yeswiki.net/?DocumentationBazaR).


## Usage

```js
const { YesWikiImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [YesWikiImporterMixin],
  settings: {
    source: {
      yeswiki: {
        baseUrl: null, // Base URL of the YesWiki instance
        formId: null // ID of the Bazar form you wish to import
      },
      // If you protected the API, fill the user and password below
      basicAuth: {
        user: null,
        password: null
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

