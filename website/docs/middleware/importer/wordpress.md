---
title: Wordpress
---

This mixin allows you to import posts from [Wordpress](https://wordpress.com) websites.

## Usage

```js
const { WordpressImporterMixin } = require('@semapps/importer');

module.exports = {
  name: 'my-importer',
  mixins: [WordpressImporterMixin],
  settings: {
    source: {
      wordpress: {
        baseUrl: null, // Base URL of the Wordpress instance
        type: 'posts', // Only posts are supported for now
        appPassword: null // If the API is protected with application passwords, enter one here
      }
    },
    dest: {
      containerUri: null, // Container where the data will be posted (must be created already)
      filesContainerUri: null, // Container where the media will be uploaded (see retrieveMedia below)
      predicatesToKeep: [] // Don't remove these predicates when updating data
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
      return {
        ...data
      };
    }
  }
};
```

## Methods

For methods available on all importers, see [here](index.md#methods).

### `retrieveMedia`

Take the ID of a media, fetch it, upload it to the container defined in the `dest.filesContainerUri` setting.

Return the URL of the newly-created file.
