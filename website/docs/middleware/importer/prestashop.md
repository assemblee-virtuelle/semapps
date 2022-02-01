---
title: PrestaShop
---

This mixin allows you to import items from [PrestaShop](https://prestashop.com) API.


## Usage

```js
const { PrestaShopImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [PrestaShopImporterMixin],
  settings: {
    source: {
      prestashop: {
        baseUrl: null, // Base URL of the PrestaShop instance
        type: null, // Tested only with "products"
        wsKey: null, // A WebService key you need to generate from PrestaShop admin interface
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
