const {
  parseHeader,
  negotiateContentType,
  negotiateAccept,
  parseSparql,
  parseJson,
  parseFile,
} = require('@semapps/middlewares');

function getRoutes() {
  const commonRouteConfig = {
    path: '/sparql',
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: {
      json: false,
      urlencoded: false
    }
  };

  const middlewares = [parseSparql, negotiateAccept];

  return [
    {
      authorization: false,
      authentication: true,
      mergeParams: true,
      aliases: {
        'GET /': [...middlewares, 'sparqlEndpoint.query'],
        'POST /': [...middlewares, 'sparqlEndpoint.query']
      },
      ...commonRouteConfig
    }
  ];
}

module.exports = getRoutes;
