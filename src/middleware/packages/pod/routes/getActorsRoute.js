const {
  parseHeader,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  saveDatasetMeta
} = require('@semapps/middlewares');

function getActorsRoute() {
  const middlewares = [
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseJson,
    parseTurtle,
    saveDatasetMeta
  ];

  return {
    name: 'actors',
    path: '/',
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: false,
    authorization: false,
    authentication: false,
    aliases: {
      'GET /:username': [...middlewares, 'pod.getActor'],
    }
  };
}

module.exports = getActorsRoute;
