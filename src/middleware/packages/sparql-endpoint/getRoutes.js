const { negotiateAccept, parseSparql } = require('@semapps/middlewares');

const addDatasetMiddleware = dataset => (req, res, next) => {
  // If dataset is not set, we will use the default dataset
  if( dataset ) req.$meta.dataset = dataset;
  next();
};

const commonRouteConfig = {
  // Disable the body parsers so that we can parse the body ourselves
  // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
  bodyParsers: {
    json: false,
    urlencoded: false
  },
  onError(req, res, err) {
    let {type, code, message, data, name} = err;
    res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({type, code, message, data, name}));
  }
};

function getRoutes(datasetsMapping) {
  return Object.keys(datasetsMapping).map(path => {
    const middlewares = [parseSparql, negotiateAccept, addDatasetMiddleware(datasetsMapping[path])];
    return {
      path,
      authorization: false,
      authentication: true,
      mergeParams: true,
      aliases: {
        'GET /': [...middlewares, 'sparqlEndpoint.query'],
        'POST /': [...middlewares, 'sparqlEndpoint.query']
      },
      ...commonRouteConfig
    };
  });
}

module.exports = getRoutes;
