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
      'GET activities': 'activitypub.activity.find',
      'GET activities/:id': 'activitypub.activity.get',
      'GET actors/:id': 'activitypub.actor.get',
      'POST actors': 'activitypub.actor.create',
      'GET actors/:username/outbox': 'activitypub.outbox.list',
      'GET actors/:username/inbox': 'activitypub.inbox.list',
      'GET actors/:username/followers': 'activitypub.follow.listFollowers',
      'GET actors/:username/following': 'activitypub.follow.listFollowing',
      'POST objects': 'activitypub.object.create',
      'GET objects': 'activitypub.object.find',
      'GET objects/:id': 'activitypub.object.get',
      'PATCH objects/:id': 'activitypub.object.update',
      'DELETE objects/:id': 'activitypub.object.delete'
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
