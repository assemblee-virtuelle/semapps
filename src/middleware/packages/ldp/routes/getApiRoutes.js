const {
  parseBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  addContainerUriMiddleware
} = require('./middlewares');

function getApiRoutes({ containerUri, services }) {
  const commonRouteConfig = {
    path: new URL(containerUri).pathname,
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: {
      json: false,
      urlencoded: false
    }
  };

  const middlewares = [
    parseBody,
    negotiateContentType,
    negotiateAccept,
    parseJson,
    addContainerUriMiddleware(containerUri)
  ];

  return [
    {
      authorization: false,
      authentication: true,
      aliases: {
        'GET /': [...middlewares, services.list],
        'GET /:id': [...middlewares, services.get]
      },
      ...commonRouteConfig
    },
    {
      authorization: true,
      authentication: false,
      aliases: {
        'POST /': [...middlewares, services.post],
        'PATCH /:id': [...middlewares, services.patch],
        'DELETE /:id': [...middlewares, services.delete]
      },
      ...commonRouteConfig
    }
  ];
}

module.exports = getApiRoutes;
