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


## Generate a JWT token

The HumHub Rest API doesn't automatically generate a JWT token. Follow these steps to generate one:

- In the HumHub REST API configuration:
  - Enable access to a user of your choice
  - Note the JWT key (this is not the JWT token !)
- Edit the account of the user you have chosen
  - Note the UID of the user in the URL
- Go to https://jwt.io
  - At the top of the form, select "HS512" as the algorithm
  - In the "Payload" section, enter a JSON with the UID of the user: `{ "uid": 227 }`
  - In the "Verify signature" section, replace "your-512-bit-secret" with the JWT key you previously copied
  - Your JWT token is now on the left part of form ("Encoded")
