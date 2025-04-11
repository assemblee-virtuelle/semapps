---
title: OrphanFilesDeletionMixin
---

Deletes files from database and from disk when they are not used anymore.
By default, check is done when the service is launched, at every night. Cronjob can be disabled.

## Usage

```js
const { ControlledContainerMixin, OrphanFilesDeletionMixin } = require('@semapps/ldp');

module.exports = {
  name: 'file',
  mixins: [ControlledContainerMixin, OrphanFilesDeletionMixin],
  settings: {
    path: '/files',
    acceptedTypes: ['semapps:File'],
    orphanFilesDeletion: {
      baseUrl: '<middlewareBaseUrl>',
      cronJob: {
        // Optional, can be set to false
        time: '0 0 4 * * *', // Every night at 4am
        timeZone: 'Europe/Paris'
      }
    },
    activateTombstones: false
  }
};
```

### Settings

All settings relative to this mixin should be set in a `orphanFilesDeletion` key.

| Property  | Type     | Default                                             | Description                                                                          |
| --------- | -------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `baseUrl` | `String` | -                                                   | Middleware base url                                                                  |
| `cronJob` | `Object` | { time: "0 0 4 \* \* \*", timeZone: "Europe/Paris"} | Optional cronJob settings { time, timeZone }. Can be set to false to disable cronjob |
