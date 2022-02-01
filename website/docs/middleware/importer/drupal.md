---
title: Drupal
---

This mixin allows you to import JSON data from [Drupal](https://www.drupal.org/drupal-7.0) websites. Currently, only the version 7 is supported.


## Usage

### Setup your API endpoints

First install the [Views Datasource](https://www.drupal.org/project/views_datasource) module and activate the `views_json` module.

For each resource, you will need to configure two API endpoints:
- A compact API endpoint with only the UUID and the last modification date
- A full API endpoint with all the information you want to import

The compact API endpoint help to increase the performances since the importer is able to quickly identify the nodes that have been created, deleted or updated. The full API endpoint allow to fetch only a selected node.

#### Compact API endpoint

- Create a new View
    - Under "Display", select the type of content you wish to import
    - In the Page configuration, select "JSON data document"
    - Remove the pagination
    - Fill out the other necessary fields, including the path (for example `/api/articles_compact`)
- Add the following fields:
    - `uuid` with the UUID of the resource
    - `updated` with the last modification date of the resource (choose a format which can be understood by a machine, like `Y-m-d H:i:s`)

#### Full API endpoint

- Create a new View
  - Under "Display", select the type of content you wish to import
  - In the Page configuration, select "JSON data document"
  - Remove the pagination
  - Fill out the other necessary fields, including the path (for example `/api/articles`)
- Add the following fields:
  - `uuid` with the UUID of the resource
  - `updated` with the last modification date of the resource (choose a format which can be understood by a machine, like `Y-m-d H:i:s`)
  - Any other field you want to import 
- In the Advanced section, add a Contextual Filter of type "UUID". This will allow the importer to fetch only one node with a path like `/api/articles/d29d2a19-13b9-4e57-9047-0d1ad8b944fb`


### Create your service 

```js
const DrupalImporterMixin = require('./mixins/drupal7');

module.exports = {
  name: 'my-importer',
  mixins: [DrupalImporterMixin],
  settings: {
    source: {
      apiUrl: 'https://mydomain.com/api/articles',
      getAllCompact: 'https://mydomain.com/api/articles_compact',
      getOneFull: data => 'https://mydomain.com/api/articles/' + data.uuid,
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
    async transform(data) {
      return({
        ...data
      });
    }
  }
};
```
