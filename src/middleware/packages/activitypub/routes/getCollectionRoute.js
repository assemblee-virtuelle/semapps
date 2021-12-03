const { parseHeader, parseJson } = require('@semapps/middlewares');

const addCollectionUriMiddleware = collectionUri => (req, res, next) => {
  // TODO find a tool to parse this automatically
  if (collectionUri.includes('/:username')) {
    collectionUri = collectionUri.replace(':username', req.$params.username);
    delete req.$params.username;
  }
  if (collectionUri.includes('/:objectId')) {
    collectionUri = collectionUri.replace(':objectId', req.$params.objectId);
    delete req.$params.objectId;
  }
  next();
};

const getCollectionRoute = (collectionUri, controlledActions) => {
  const collectionPath = new URL(collectionUri).pathname;

  // Use custom middlewares to handle uncommon JSON content types (application/activity+json, application/ld+json)
  const middlewares = [parseHeader, parseJson];

  let aliases = {
    'GET /': [
      ...middlewares,
      addCollectionUriMiddleware(collectionUri),
      controlledActions.get || 'activitypub.collection.get'
    ]
  };
  if (collection.controlledActions.post) {
    aliases['POST /'] = [...middlewares, addCollectionUriMiddleware(collectionUri), controlledActions.post];
  }

  return [
    {
      path: collectionPath,
      authorization: false,
      authentication: true,
      bodyParsers: false,
      aliases
    }
  ];
};

module.exports = getCollectionRoute;
