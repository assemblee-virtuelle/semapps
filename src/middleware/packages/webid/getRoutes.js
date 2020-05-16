const {
  parseBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  addContainerUriMiddleware
} = require('@semapps/middlwares');

function getRoutes() {
  const commonRouteConfig = {
    bodyParsers: {
      json: true
    }
  };

  const middlewares = [negotiateAccept];

  return [
    {
      authorization: false,
      authentication: true,
      aliases: {
        'GET users/:userId': [...middlewares, 'webid.view'],
        'GET usersss': [...middlewares, 'webid.list']
      },
      ...commonRouteConfig
    },
    // Secured routes
    {
      authorization: true,
      authentication: false,
      aliases: {
        'GET me': [...middlewares, 'webid.view'],
        'PATCH me': [...middlewares, 'webid.edit']
      },
      ...commonRouteConfig
    }
  ];
}

module.exports = getRoutes;
