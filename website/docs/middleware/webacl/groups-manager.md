---
title: GroupsManagerBot
---

Automatically add users to WebACL-compatible groups depending on matching rules.

This bot will listen to users creation/update/removal and add them to the given groups depending on matching rules.

:::warning
Currently this does not work with PATCH operations since the whole record is needed.
:::

## Usage

```js
const { GroupsManagerBot } = require('@semapps/webacl');

module.exports = {
  mixins: [GroupsManagerBot],
  settings: {
    usersContainer: 'http://localhost:3000/users',
    rules: [
      {
        // Use an object to match users
        // If several properties are passed, users will need to match all of them
        match: { status: 'http://localhost:3000/status/admin' },
        groupSlug: 'superadmins'
      },
      {
        // Use a function to match users
        match: userData => userData.email.endsWith('gmail.com'),
        groupSlug: 'gmailusers'
      }
    ]
  }
};
```
