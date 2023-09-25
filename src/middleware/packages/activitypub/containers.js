const { ACTOR_TYPES, OBJECT_TYPES } = require('./constants');

module.exports = [
  {
    path: '/actors',
    acceptedTypes: Object.values(ACTOR_TYPES)
  },
  {
    path: '/objects',
    acceptedTypes: Object.values(OBJECT_TYPES)
  }
];
