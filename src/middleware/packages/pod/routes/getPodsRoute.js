const {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  saveDatasetMeta
} = require('@semapps/middlewares');

const transformRouteParamsToSlugParts = (req, res, next) => {
  req.$params.slugParts = [];
  if (req.$params.username) {
    req.$params.slugParts.push(req.$params.username);
    delete req.$params.username; // TODO ensure this doesn't break the saveDatasetMeta
  }
  if (req.$params.collection) {
    req.$params.slugParts.push(req.$params.collection);
    delete req.$params.collection;
  }
  next();
};

function getPodsRoute() {
  const middlewares = [
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseSparql,
    parseJson,
    parseTurtle,
    parseFile,
    saveDatasetMeta,
    transformRouteParamsToSlugParts
  ];

  return {
    name: 'pods',
    path: '/:username([^/.][^/]+)',
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: false,
    authorization: false,
    authentication: true,
    aliases: {
      'GET /': [...middlewares, 'ldp.api.get'],
      'HEAD /': [transformRouteParamsToSlugParts, 'ldp.api.head'],
      'GET /:collection': [...middlewares, 'ldp.api.get'],
      'POST /:collection': [...middlewares, 'ldp.api.post']
    },
    // Handle this route after other routes. Requires a modification of the ApiGateway.
    // See https://github.com/moleculerjs/moleculer-web/issues/335
    catchAll: true
  };
}

module.exports = getPodsRoute;
