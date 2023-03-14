const { negotiateAccept, parseSparql, saveDatasetMeta } = require('@semapps/middlewares');

function getRoute(path) {
  const middlewares = [parseSparql, negotiateAccept, saveDatasetMeta];
  return {
    path,
    name: 'sparql-endpoint',
    authorization: false,
    authentication: true,
    mergeParams: true,
    aliases: {
      'GET /': [...middlewares, 'sparqlEndpoint.query'],
      'POST /': [...middlewares, 'sparqlEndpoint.query']
    },
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: {
      json: false,
      urlencoded: false
    },
    onError(req, res, err) {
      let { type, code, message, data, name } = err;
      res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ type, code, message, data, name }));
    }
  };
}

module.exports = getRoute;
