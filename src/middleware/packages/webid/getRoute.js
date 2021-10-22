const { negotiateAccept } = require('@semapps/middlewares');

function getRoute() {
  return {
    authorization: true,
    authentication: false,
    aliases: {
      'GET me': [negotiateAccept, 'webid.view'],
      'PATCH me': [negotiateAccept, 'webid.edit']
    },
    bodyParsers: {
      json: true
    }
  };
}

module.exports = getRoute;
