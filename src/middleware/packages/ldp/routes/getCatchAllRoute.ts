const path = require('path');
const {
  parseUrl,
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  saveDatasetMeta
} = require('@semapps/middlewares');

function getCatchAllRoute(basePath, podProvider) {
  const middlewares = [
    parseUrl,
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseSparql,
    parseJson,
    parseTurtle,
    parseFile,
    saveDatasetMeta
  ];

  return {
    name: 'ldp',
    path: path.join(basePath, podProvider ? '/:username([^/.][^/]+)/:slugParts*' : '/:slugParts([^/_][^/]+)*'),
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: false,
    authorization: false,
    authentication: true,
    authorizeWithCapability: true,
    aliases: {
      'GET /': [...middlewares, 'ldp.api.get'],
      'HEAD /': ['ldp.api.head'],
      'POST /': [...middlewares, 'ldp.api.post'],
      'PUT /': [...middlewares, 'ldp.api.put'],
      'PATCH /': [...middlewares, 'ldp.api.patch'],
      'DELETE /': [...middlewares, 'ldp.api.delete']
    },
    // Handle this route after other routes. Requires a modification of the ApiGateway.
    // See https://github.com/moleculerjs/moleculer-web/issues/335
    catchAll: true
  };
}

module.exports = getCatchAllRoute;
