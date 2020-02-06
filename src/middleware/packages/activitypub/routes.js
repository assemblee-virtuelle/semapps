const routeConfig = {
  // When using multiple routes we must set the body parser for each route.
  bodyParsers: { json: true }
};

module.exports = [
  // Unsecured routes
  {
    authorization: false,
    authentication: true,
    aliases: {
      'POST actors': 'activitypub.actor.create',
      'GET actors': 'activitypub.actor.find',
      'GET actors/:id': 'activitypub.actor.get',
      'GET activities': 'activitypub.activity.find',
      'GET activities/:id': 'activitypub.activity.get',
      'GET objects': 'activitypub.object.find',
      'GET objects/:id': 'activitypub.object.get',
      'GET users/:username/outbox': 'activitypub.outbox.list',
      'GET users/:username/inbox': 'activitypub.inbox.list',
      'GET users/:username/followers': 'activitypub.follow.listFollowers',
      'GET users/:username/following': 'activitypub.follow.listFollowing'
    },
    ...routeConfig
  },
  // Secured routes
  {
    authorization: true,
    authentication: false,
    aliases: {
      'POST users/:username/outbox': 'activitypub.outbox.post'
    },
    ...routeConfig
  }
];
