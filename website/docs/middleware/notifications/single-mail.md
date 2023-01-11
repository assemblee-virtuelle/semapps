---
title: Single Mail
---

This service listen for ActivityPub activities in all users' inboxes and turns them into email notification using the [ActivityMappingService](../activitypub/activity-mapping.md).

## Usage

### 1. Add mappings for the activities

If you want an activity to be sent as an email notification, it must be mapped using the [ActivityMappingService](../activitypub/activity-mapping.md)

If you use the default template provided, the following properties should be mapped:

- `title`
- `description`
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
          title: '{{activity.object.object.name}}',
          description: '{{activity.object.object.description}}',
          actionName: 'View',
          actionLink: '/Event/{{activity.object.object.url}}'
        }
      }
    ]
  }
};
```

You may map other properties, which will be available in a custom template or passed to the `filterNotification` method (see below).


### 2. Setup the `SingleMailNotificationsService`

```js
const { SingleMailNotificationsService } = require('@semapps/notifications');
const QueueMixin = require('moleculer-bull');

module.exports = {
  mixins: [SingleMailNotificationsService, QueueMixin('redis://localhost:6379/0')],
  settings: {
    defaultLocale: 'en',
    defaultFrontUrl: 'https://mydomain.com', // Base URL for the action links
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
    // Return true if you want the notification to be sent by email
    async filterNotification(notification) {
      return true;
    },
    // Method called to format the actionLink prop of each notification
    // Overwrite it if you have custom needs
    async formatLink(link, recipientUri) {
      if (link && !link.startsWith('http')) {
        return urlJoin(this.settings.defaultFrontUrl, link);
      } else {
        return link;
      }
    },
  }
};
```

> If you want some notifications to be sent immediately in single mails, and others in a [digest](./digest.md), you should add a new property to the mappings (for example: `immediate: true/false`) and use the `filterNotification` method in both services to differentiate the notifications.
