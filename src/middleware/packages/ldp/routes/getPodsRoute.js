const {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  saveDatasetMeta,
} = require('@semapps/middlewares');

const transformUsernameToSlugParts = (req, res, next) => {
  req.$params.slugParts = [req.$params.username];
  next();
};

function getPodsRoute() {
  const middlewares = [
    parseHeader,
    negotiateContentType,
    negotiateAccept,
    parseSparql,
    parseJson,
    parseTurtle,
    parseFile,
    transformUsernameToSlugParts,
    saveDatasetMeta,
  ];

  return {
    name: 'pods',
    path: '/:username',
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: false,
    authorization: false,
    authentication: true,
    aliases: {
      'GET /': [...middlewares, 'ldp.api.get'],
      'HEAD /': [transformUsernameToSlugParts, 'ldp.api.head'],
    },
  };
}

module.exports = getPodsRoute;
