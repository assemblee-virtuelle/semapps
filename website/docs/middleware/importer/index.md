---
title: Importer
---

This package allows you to import JSON data from URLs or local files, and to synchronize them over time.

## Features

- Import JSON data from URLs or local files
- Synchronize data regularly using a simple cron-job configuration
- Automatically send `Create`, `Update` and `Delete` activities from a given ActivityPub actor

## Dependencies

- [TripleStoreService](../triplestore.md)
- [ActivityPubService](../activitypub/index.md)

## Install

```bash
$ yarn add @semapps/importer
```

## Usage

### Pre-configured importers

We provide a number of pre-configured importers, some of which work "out of the box" with very little configurations.

- [Drupal](drupal.md)
- [GoGoCarto](gogocarto.md)
- [PrestaShop](prestashop.md)
- [Mobilizon](mobilizon.md)
- [YesWiki](yeswiki.md)

> If you create a custom importer for a well-known software, feel free to open a PR.


### Queue service

If you wish to keep an eye on the `synchronize` action, you should add [moleculer-bull](https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-bull) QueueMixin.

```js
const QueueMixin = require('moleculer-bull');

module.exports = {
  name: 'my-importer',
  mixins: [DrupalImporterMixin, QueueMixin(CONFIG.QUEUE_SERVICE_URL)],
  ...
}
```

## Settings

> If you use a pre-configured importer, you probably won't have to bother about most settings in the `source` property.

```js
const { ImporterMixin } = require('@semapps/importer');

module.exports = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      apiUrl: null, // Base URL of the API. Will be used to find existing data on synchronizations
      getAllFull: null, // API endpoint to get all data in a complete form, or path to a local file
      getAllCompact: null, // API endpoint to get all data in a compact form (id + updated date)
      getOneFull: null, // Function which takes the data of an item and return its source URL of the source URI
      headers: {},  // Headers to pass to all fetch requests
      basicAuth: {
        user: '',
        password: ''
      },
      fetchOptions: {}, // Additional options to pass to all fetch requests
      fieldsMapping: {
        slug: null, // Property used for the slug, or a function which receives data as a parameter and returns the slug
        created: null, // Property used for the creation date, or a function which receives data as a parameter and returns the slug
        updated: null, // Property used for the modified date, or a function which receives data as a parameter and returns the slug
      },
    },
    dest: {
      containerUri: null, // Container where the data will be posted (must be created already)
      predicatesToKeep: [], // Don't remove these predicates when updating data
    },
    activitypub: {
      actorUri: null, // ActivityPub actor who will post activities on synchronization (leave null to disable)
      activities: ['Create', 'Update', 'Delete'] // The activities you want to be posted by the actor
    },
    cronJob: {
      time: null, // For example '0 0 4 * * *' for every night at 4am 
      timeZone: 'Europe/Paris'
    }
  }
};
```


## Actions

### `freshImport`

Delete all imported data and re-import them from the source.

### `synchronize`

Fetch the data from the source, compare them with the existing data and create/update/delete what is necessary.

If the `activitypub.actorUri` setting is defined, it will post `Create`, `Update` and `Delete` activities.

If the `cronJob.time` setting is defined, this action will be called automatically.

### `deleteImported`

Delete all imported data. Called at the start of the `freshImport` action.


## Methods

### `transform`

Called for each item. Receives the raw (non-semantic) data as an object and must return another object with semantic data (including the type).

### `list`

> If you use a pre-configured importer, you don't need to worry about this.

Receives an URL (for remote endpoints) or a path (for local files) and must return the data as an array of items.

By default, it calls the `fetch` method (see below), but you may want to overwrite it depending on the shape of the API data.

### `getOne`

> If you use a pre-configured importer, you don't need to worry about this.

Receives the URL of a remote resource and must return the data.

By default, it calls the `fetch` method (see below), but you may want to overwrite it depending on the shape of the API data.

### `fetch`

> If you use a pre-configured importer, you don't need to worry about this.

This method accepts a single argument which can be either:
- An URL (for remote endpoints)
- A path (for local files)
- An object with an `url` property and other arguments understood by [fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)

If the argument is an URL, the remote endpoint is fetched (using the `source.headers` and `source.fetchOptions` settings) and the JSON-parsed result is returned.

If the argument is a path, the local file is read and the JSON-parsed result is returned.
