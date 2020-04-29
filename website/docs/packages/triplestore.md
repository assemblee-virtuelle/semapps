---
title: TripleStore
---

This service allows you to create a TripleStore service wich offer basic interface to interact with Jenna triplestore.

## Features



## Dependencies


## Sub-services


## Install
```bash
$ npm install @semapps/triplestore --save
```

## Usage
```js
const { TripleStore } = require('@semapps/triplestore');

module.exports = {
  mixins: [TripleStore],
  settings: {
    usersContainer: 'http://localhost:3000/users/'
  }
};
```

### Creating actors on WebID creations

This is done automatically when a `webid.created` event is detected.


## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| | | |


## Actions
