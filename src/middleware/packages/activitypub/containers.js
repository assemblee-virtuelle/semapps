const { ACTOR_TYPES, OBJECT_TYPES } = require('./constants');

module.exports = [
  {
    path: '/as/actor',
    acceptedTypes: Object.values(ACTOR_TYPES)
  },
  {
    path: '/as/object',
    acceptedTypes: Object.values(OBJECT_TYPES)
  }
];
