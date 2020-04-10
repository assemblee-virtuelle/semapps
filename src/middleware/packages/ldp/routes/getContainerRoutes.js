const {
  parseBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  addContainerUriMiddleware
} = require('./middlewares');

function getContainerRoutes(containerUri, serviceName) {
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

  // If no serviceName is specified, map routes to the LDP container/resource service
  const actions = serviceName
    ? {
        list: serviceName + '.list',
        get: serviceName + '.get',
        post: serviceName + '.post',
        patch: serviceName + '.patch',
        delete: serviceName + '.delete'
      }
    : {
        list: 'ldp.container.api_get',
        get: 'ldp.resource.api_get',
        post: 'ldp.resource.api_post',
        patch: 'ldp.resource.api_patch',
        delete: 'ldp.resource.api_delete'
      };

  return [
    {
      authorization: false,
      authentication: true,
      aliases: {
        'GET /': [...middlewares, actions.list],
        'GET /:id': [...middlewares, actions.get]
      },
      ...commonRouteConfig
    },
    {
      authorization: true,
      authentication: false,
      aliases: {
        'POST /': [...middlewares, actions.post],
        'PATCH /:id': [...middlewares, actions.patch],
        'DELETE /:id': [...middlewares, actions.delete]
      },
      ...commonRouteConfig
    }
  ];
}

module.exports = getContainerRoutes;
