---
title: ActivityMappingService
---

Transform ActivityPub activities in other kind of objects, depending on the matching pattern

## Usage

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
          category: {
            en: 'New Events',
            fr: 'Nouveaux événements'
          },
          title: '{{activity.object.object.name}}',
          description: '{{activity.object.object.description}}',
          image: '{{activity.object.object.image}}',
          actionName: {
            en: 'View',
            fr: 'Voir'
          },
          actionLink: '{{activity.object.object.url}}'
        },
        priority: 1 // Default. If higher, the matching pattern will be applied before the mappers with lower priority
      },
      {
        match: (activity) => {
          if (activity.someProperty < 10) {
            return true;
          }
          return false;
        },
        mapping: {
          ...
        },
        priority: 2
      }
    ],
    handlebars: {
      helpers: {
        // Custom Handlebars helpers. See https://handlebarsjs.com/guide/#custom-helpers
        slice: (start, text) => text.slice(start)
      }
    },
    matchAnnouncedActivities: false // Set to true if you want announcted activities to be treated as the activity itself
  }
};
```

### Mapping

Each property is rendered using [Handlebars](https://handlebarsjs.com) template engine.

The templates receive the following parameters:

| Property         | Type       | Description                                                                 |
| ---------------- | ---------- | --------------------------------------------------------------------------- |
| `activity`       | `[Object]` | Activity to be mapped. It is dereferenced according to the `match` pattern. |
| `emitter`        | `[Object]` | Data of the actor who sent the activity                                     |
| `emitterProfile` | `[Object]` | Profile of the actor who sent the activity (if it exists)                   |

Any other parameter provided to the `map` action will be passed to the template.

You may localize the template by providing an object with the locales as keys (see above).

## Actions

The following service actions are available:

### `addMapper`

Add a new mapper. This action is called on start if the `mappers` settings is set.

##### Parameters

| Property   | Type                 | Default      | Description                                                                                                                                      |
| ---------- | -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `match`    | `Object \| Function` | **required** | Pattern that is checked against the activity. May be a function that receives the `activity` as parameter and returns `true`, if a match occurs. |
| `mapping`  | `Object`             | **required** | Desired mapping of the new object (see above)                                                                                                    |
| `priority` | `Integer`            | 1            | Priority given to this mapper over other mappers                                                                                                 |

### `map`

Map an activity using the provided mappers.

##### Parameters

| Property   | Type     | Default      | Description                                         |
| ---------- | -------- | ------------ | --------------------------------------------------- |
| `activity` | `Object` | **required** | The activity to be mapped                           |
| `locale`   | `String` |              | The locale to be used, if localization is activated |

Any other parameter will be passed to the template (see above).

##### Return

The mapped object if there was a match, otherwise nothing.
