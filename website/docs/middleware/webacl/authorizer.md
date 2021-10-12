---
title: AuthorizerBot
---

Automatically give permissions to users, based on the record being created or updated.

## Usage

```js
const { AuthorizerBot } = require('@semapps/webacl');

module.exports = {
  mixins: [AuthorizerBot],
  settings: {
    rules: [
      {
        // If the resource match...
        match: { type: 'pair:Event' },
        // ... give these permissions...
        rights: {
          read: true,
          append: true,
          write: true,
          control: true
        },
        // ... to these users ...
        users: record => record['pair:involvedIn']
      },
      {
        // Use a function to match resources
        match: record => record['pair:hasStatus'] === 'http://localhost:3000/status/special',
        rights: {
          read: true,
          write: true
        },
        // Use a string for the users
        users: 'http://localhost:3000/users/special-user'
      }
    ]
  }
};
```
