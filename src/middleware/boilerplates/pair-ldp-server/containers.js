const { ACTOR_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const CONFIG = require('./config');

module.exports = [
  {
    path: '/organizations',
    acceptedTypes: ['pair:Organization', ACTOR_TYPES.ORGANIZATION],
    dereference: ['sec:publicKey', 'pair:hasLocation/pair:hasPostalAddress','pair:organizationOfMembership'],
    disassembly: [{ path: 'pair:organizationOfMembership', container: CONFIG.HOME_URL + 'membershipAssociations' }]
  },
  {
    path: '/membershipAssociations',
    acceptedTypes: ['pair:MembershipAssociation']
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
    dereference: ['sec:publicKey', 'pair:hasLocation/pair:hasPostalAddress']
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
    path: '/membershipRole',
    acceptedTypes: 'pair:MembershipRole'
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
