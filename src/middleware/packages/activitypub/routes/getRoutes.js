const urlJoin = require('url-join');
const { parseHeader, parseJson, addContainerUriMiddleware} = require('@semapps/middlewares');

const addCollectionUri = (baseUri, collectionKey) => (req, res, next) => {
  if (baseUri.includes('/:username')) {
    req.$params.collectionUri = urlJoin(baseUri.replace(':username', req.$params.username), collectionKey);
    delete req.$params.username; // TODO check this isn't breaking anything
  } else {
    req.$params.collectionUri = urlJoin(baseUri, collectionKey);
  }
  next();
};

const getRoutes = baseUri => {
  const basePath = new URL(baseUri).pathname;

  // Use custom middlewares to handle uncommon JSON content types (application/activity+json, application/ld+json)
  const middlewares = [parseHeader, parseJson];

  return [
    // Unsecured routes
    {
      path: basePath,
      authorization: false,
      authentication: true,
      bodyParsers: false,
      aliases: {
        'POST /inbox': [...middlewares, addCollectionUri(baseUri, 'inbox'), 'activitypub.inbox.post'],
        'GET /outbox': [...middlewares, addCollectionUri(baseUri, 'outbox'), 'activitypub.outbox.list'],
        'GET /inbox': [...middlewares, addCollectionUri(baseUri, 'inbox'), 'activitypub.inbox.list'],
        'GET /followers': [...middlewares, addCollectionUri(baseUri, 'followers'), 'activitypub.follow.listFollowers'],
        'GET /following': [...middlewares, addCollectionUri(baseUri, 'following'), 'activitypub.follow.listFollowing']
      }
    },
    // Secured routes
    {
      path: basePath,
      authorization: true,
      authentication: false,
      bodyParsers: false,
      aliases: {
        'POST /outbox': [...middlewares, addCollectionUri(baseUri, 'outbox'), 'activitypub.outbox.post'],
        'GET /activities/:id': [...middlewares, addContainerUriMiddleware(urlJoin(baseUri, 'activities')), 'activitypub.activity.get']
      }
    }
  ];
};

module.exports = getRoutes;
