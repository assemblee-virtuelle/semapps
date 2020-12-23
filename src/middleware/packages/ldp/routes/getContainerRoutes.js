const {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseFile,
  addContainerUriMiddleware
} = require('@semapps/middlewares');

function getContainerRoutes(containerUri, serviceName, allowAnonymousEdit, allowAnonymousDelete) {
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
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseSparql,
    parseJson,
    parseFile,
    addContainerUriMiddleware(containerUri)
  ];

  // If no serviceName is specified, map routes to the LDP container/resource service
  const actions = serviceName
    ? {
        list: serviceName + '.find',
        get: serviceName + '.get',
        post: serviceName + '.create',
        patch: serviceName + '.update',
        put: serviceName + '.put',
        delete: serviceName + '.remove'
      }
    : {
        list: 'ldp.container.api_get',
        get: 'ldp.resource.api_get',
        post: 'ldp.resource.api_post',
        patch: 'ldp.resource.api_patch',
        put: 'ldp.resource.api_put',
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
      authorization: !allowAnonymousEdit,
      authentication: allowAnonymousEdit,
      aliases: {
        'POST /': [...middlewares, actions.post],
        'PUT /:id': [...middlewares, actions.put],
        'PATCH /:id': [...middlewares, actions.patch]
      },
      ...commonRouteConfig
    },
    {
      authorization: !allowAnonymousDelete,
      authentication: allowAnonymousDelete,
      aliases: {
        'DELETE /:id': [...middlewares, actions.delete]
      },
      ...commonRouteConfig
    }
  ];
}

module.exports = getContainerRoutes;
