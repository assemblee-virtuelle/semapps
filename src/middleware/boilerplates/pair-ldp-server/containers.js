const { ACTOR_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');

module.exports = [
  {
    path: '/organizations',
    acceptedTypes: ['pair:Organization', ACTOR_TYPES.ORGANIZATION],
    queryDepth: 1
  },
  {
    path: '/projects',
    acceptedTypes: ['pair:Project', ACTOR_TYPES.GROUP],
    queryDepth: 1
  },
  {
    path: '/events',
    acceptedTypes: ['pair:Event', OBJECT_TYPES.EVENT]
  },
  {
    path: '/users',
    acceptedTypes: ['pair:Person', ACTOR_TYPES.PERSON],
    queryDepth: 1
  },
  {
    path: '/themes',
    acceptedTypes: 'pair:Theme'
  },
  {
    path: '/skills',
    acceptedTypes: 'pair:Skill'
  },
  {
    path: '/documents',
    acceptedTypes: 'pair:Document'
  },
  {
    path: '/folders',
    acceptedTypes: 'pair:Folder'
  },
  {
    path: '/notes',
    acceptedTypes: [OBJECT_TYPES.NOTE]
  },
  {
    path: '/files'
  }
];
