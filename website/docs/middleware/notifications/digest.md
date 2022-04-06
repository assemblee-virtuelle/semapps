---
title: DigestService
---

This service takes the ActivityPub activities in the inbox of subscribers, turns them into notification using the [ActivityMappingService](../activitypub/activity-mapping.md) and send a digest email to the subscribers.

## Sub-services

- DigestSubscriptionService

## Usage

### 1. Create subscriptions

First you need to create subscriptions using the `digest.subscription` sub-service.

This sub-service use the [TripleStoreAdapter](../triplestore.md) so you can use methods like `create`, `update`, `remove`, etc, of Moleculer's [Database Adapters](https://moleculer.services/docs/0.14/moleculer-db.html).

The following properties are available:

| Property    | Type       | Default      | Description                                                                                                 |
|-------------|------------|--------------|-------------------------------------------------------------------------------------------------------------|
| `webId`     | `[String]` | **required** | URL of actor who is subscribed                                                                              |
| `frequency` | `[String]` | **required** | Must match one of the `DigestService` `frequency` settings (see below)                                      |
| `email`     | `[String]` |              | Email to send the digest to. If not provided, will use the user account's email                             |
| `locale`    | `[String]` |              | Locale to translate the notifications and the template. If not provided, will use the user account's locale |

Here's an example of a call to create a subscription:

```js
this.broker.call('digest.subscription.create', {
  webId: 'http://localhost:3000/users/alice',
  email: 'alice@mydomain.com',
  frequency: 'daily'
});
```

You may add other properties, which can be available in the email template (through a `subscription` object) or in the `filterNotification` method (see below).


### 2. Add mappings for the activities

If you want an activity to appear in the digest, it must be mapped using the [ActivityMappingService](../activitypub/activity-mapping.md)

If you use the default template provided, the following properties should be mapped:

- `category`
- `title`
- `description`
- `image`
- `actionName` 
- `actionLink`

Here's an example:

```js
const { ActivityMappingService } = require('@semapps/activitypub');

module.exports = {
  mixins: [ActivityMappingService],
  settings: {
    mappers: [
      {
        match: {
          type: 'Announce',
          object: {
            type: 'Create',
            object: {
              type: 'Event'
            }
          }
        },
        mapping: {
          category: 'New Events',
          title: '{{activity.object.object.name}}',
          description: '{{activity.object.object.description}}',
          image: '{{activity.object.object.image}}',
          actionName: 'View',
          actionLink: '{{activity.object.object.url}}'
        }
      }
    ]
  }
};
```

You may map other properties, which will be available in a custom template or passed to the `filterNotification` method (see below).


### 3. Setup the `DigestService`

```js
const { DigestService } = require('@semapps/notifications');

module.exports = {
  mixins: [DigestService],
  settings: {
    frequencies: {
      daily: '0 0 17 * * *', // Everyday at 5pm
    },
    timeZone: 'Europe/Paris',
    // The following settings are from the moleculer-mail mixin used to send emails
    // See https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-mail
    from: `"My service" <myservice@mydomain.com>`,
    transport: {},
    // Directory with the template. It looks for a template named 'digest'
    templateFolder: path.join(__dirname, '../templates'),
    // Global data to be used in the template
    data: {}
  },
  methods: {
    // Optional method called for each notification
    // Return true if you want the notification to be included in the digest
    async filterNotification(notification, subscription) {
      return true;
    }
  }
};
```
