const { parseHeader, parseJson, saveDatasetMeta } = require('@semapps/middlewares');

const addCollectionUriMiddleware = collectionUri => (req, res, next) => {
  let fullCollectionUri = collectionUri;
  // TODO find a tool to parse this automatically
  if (collectionUri.includes('/:username')) {
    fullCollectionUri = fullCollectionUri.replace(':username', req.$params.username);
    delete req.$params.username;
  }
  if (collectionUri.includes('/:objectId')) {
    fullCollectionUri = fullCollectionUri.replace(':objectId', req.$params.objectId);
    delete req.$params.objectId;
  }
  req.$params.collectionUri = fullCollectionUri;
  next();
};

const getCollectionRoute = (collectionUri, controlledActions) => {
  const collectionPath = new URL(collectionUri).pathname;

  // Use custom middlewares to handle uncommon JSON content types (application/activity+json, application/ld+json)
  const middlewares = [parseHeader, parseJson, saveDatasetMeta];

  let aliases = {
    'GET /': [
      ...middlewares,
      addCollectionUriMiddleware(collectionUri),
      (controlledActions && controlledActions.get) || 'activitypub.collection.get'
    ]
  };
  if (controlledActions && controlledActions.post) {
    aliases['POST /'] = [...middlewares, addCollectionUriMiddleware(collectionUri), controlledActions.post];
  }

  return {
    name: 'collection' + collectionPath.replace(new RegExp('/', 'g'), '-'),
    path: collectionPath,
    authorization: false,
    authentication: true,
    bodyParsers: false,
    aliases
  };
};

module.exports = getCollectionRoute;
