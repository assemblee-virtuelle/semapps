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
  // TODO handle activities through the LDP resource service
  // {
  //   path: '/activities',
  //   acceptedTypes: Object.values(ACTIVITY_TYPES)
  // },
];
