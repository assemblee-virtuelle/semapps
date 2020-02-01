const routeConfig = {
  path: '/activitypub',
  // When using multiple routes we must set the body parser for each route.
  bodyParsers: { json: true }
};

module.exports = [
  // Unsecured routes
  {
    authorization: false,
    authentication: true,
    aliases: {
      'GET actor/:username/outbox': 'activitypub.outbox.list',
      'GET actor/:username/inbox': 'activitypub.inbox.list',
      'GET actor/:username/followers': 'activitypub.follow.listFollowers',
      'GET actor/:username/following': 'activitypub.follow.listFollowing'
    },
    ...routeConfig
  },
  // Secured routes
  {
    authorization: true,
    authentication: false,
    aliases: {
      'POST actor/:username/outbox': 'activitypub.outbox.post'
    },
    ...routeConfig
  }
];
