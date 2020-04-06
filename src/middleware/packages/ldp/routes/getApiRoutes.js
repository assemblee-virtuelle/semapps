const parseHeaders = require('./parseHeaders');

function getApiRoutes({ containerUri, services }) {
  const addContainerUriMiddleware = (req, res, next) => {
    req.$params.containerUri = containerUri;
    next();
  };

  const commonRouteConfig = {
    path: new URL(containerUri).pathname,
    // When using multiple routes we must set the body parser for each route.
    bodyParsers: {
      json: false,
      urlencoded: false
    },
    onBeforeCall: (ctx, route, req, res) => {
      return parseHeaders(ctx, route, req, res);
    }
  };

  return [
    {
      authorization: false,
      authentication: true,
      aliases: {
        'GET /': [addContainerUriMiddleware, services.list],
        'GET /:id': [addContainerUriMiddleware, services.get]
      },
      ...commonRouteConfig
    },
    {
      authorization: true,
      authentication: false,
      aliases: {
        'POST /': [addContainerUriMiddleware, services.post],
        'PATCH /:id': [addContainerUriMiddleware, services.patch],
        'DELETE /:id': [addContainerUriMiddleware, services.delete]
      },
      ...commonRouteConfig
    }
  ];
}

module.exports = getApiRoutes;
