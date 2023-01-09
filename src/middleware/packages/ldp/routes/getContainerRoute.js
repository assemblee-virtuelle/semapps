const {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  addContainerUriMiddleware
} = require('@semapps/middlewares');

function getContainerRoute(containerUri, readOnly = false) {
  const containerPath = new URL(containerUri).pathname;

  const middlewares = [
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseSparql,
    parseJson,
    parseTurtle,
    parseFile,
    addContainerUriMiddleware(containerUri)
  ];

  // Container aliases
  let aliases = {
    'GET /': [...middlewares, 'ldp.container.api_get'],
    'HEAD /': [addContainerUriMiddleware(containerUri), 'ldp.container.api_head']
  };

  if (!readOnly) {
    aliases = {
      ...aliases,
      'POST /': [...middlewares, 'ldp.container.api_post'],
      'PATCH /': [...middlewares, 'ldp.container.api_patch']
    };
  }

  // If this is not the root container, add resource aliases
  if (containerPath !== '/') {
    aliases = {
      ...aliases,
      'GET /:id': [...middlewares, 'ldp.resource.api_get'],
      'HEAD /:id': [addContainerUriMiddleware(containerUri), 'ldp.resource.api_head']
    };

    if (!readOnly) {
      aliases = {
        ...aliases,
        'PUT /:id': [...middlewares, 'ldp.resource.api_put'],
        'PATCH /:id': [...middlewares, 'ldp.resource.api_patch'],
        'DELETE /:id': [...middlewares, 'ldp.resource.api_delete']
      };
    }
  }

  return {
    name: 'container' + containerPath.replaceAll('/', '-'),
    path: containerPath,
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: false,
    authorization: false,
    authentication: true,
    aliases
  };
}

module.exports = getContainerRoute;
