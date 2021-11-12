const {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseFile,
  addContainerUriMiddleware
} = require('@semapps/middlewares');
const {getContainerFromUri} = require("../utils");

function getResourceRoute(resourceUri) {
  const resourcePath = new URL(resourceUri).pathname;
  const containerUri = getContainerFromUri(resourceUri);

  const middlewares = [
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseSparql,
    parseJson,
    parseFile,
    addContainerUriMiddleware(containerUri)
  ];

  return {
    path: resourcePath,
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: false,
    authorization: false,
    authentication: true,
    aliases: {
      'GET /:id': [...middlewares, 'ldp.resource.api_get'],
      'PUT /:id': [...middlewares, 'ldp.resource.api_put'],
      'PATCH /:id': [...middlewares, 'ldp.resource.api_patch'],
      'DELETE /:id': [...middlewares, 'ldp.resource.api_delete'],
      'HEAD /:id': [addContainerUriMiddleware(containerUri), 'ldp.resource.api_head']
    }
  };
}

module.exports = getResourceRoute;
