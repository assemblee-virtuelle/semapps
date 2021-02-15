const { ACTOR_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');

module.exports = [
  {
    path: '/organizations',
    acceptedTypes: ['pair:Organization', ACTOR_TYPES.ORGANIZATION],
    dereference: ['sec:publicKey', 'pair:hasLocation/pair:hasPostalAddress']
  },
  {
    path: '/projects',
    acceptedTypes: ['pair:Project', ACTOR_TYPES.GROUP],
    dereference: ['sec:publicKey']
  },
  {
    path: '/events',
    acceptedTypes: ['pair:Event', OBJECT_TYPES.EVENT]
  },
  {
    path: '/users',
    acceptedTypes: ['pair:Person', ACTOR_TYPES.PERSON],
    dereference: ['sec:publicKey']
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
