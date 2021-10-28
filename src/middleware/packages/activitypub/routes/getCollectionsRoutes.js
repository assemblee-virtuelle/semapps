const { addContainerUriMiddleware, parseHeader, parseJson } = require("@semapps/middlewares");

const getCollectionsRoutes = (containerUri) => {
  const containerPath = new URL(containerUri).pathname;

  // Use custom middlewares to handle uncommon JSON content types (application/activity+json, application/ld+json)
  const middlewares = [parseHeader, parseJson, addContainerUriMiddleware(containerUri)];

  return [
    // Unsecured routes
    {
      path: containerPath,
      authorization: false,
      authentication: true,
      bodyParsers: false,
      aliases: {
        'POST /inbox': [...middlewares, 'activitypub.inbox.post'],
        'GET /outbox': [...middlewares, 'activitypub.outbox.list'],
        'GET /inbox': [...middlewares, 'activitypub.inbox.list'],
        'GET /followers': [...middlewares, 'activitypub.follow.listFollowers'],
        'GET /following': [...middlewares, 'activitypub.follow.listFollowing']
      }
    },
    // Secured routes
    {
      path: containerPath,
      authorization: true,
      authentication: false,
      bodyParsers: false,
      aliases: {
        'POST /outbox': [...middlewares, 'activitypub.outbox.post'],
      }
    }
  ];
};

module.exports = getCollectionsRoutes;
