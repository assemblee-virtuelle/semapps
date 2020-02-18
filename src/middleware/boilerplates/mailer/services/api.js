const ApiGateway = require('moleculer-web');

const ApiService = {
  mixins: [ApiGateway],
  settings: {
    server: false,
    routes: [
      {
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        aliases: {
          'POST /': 'form.process',
          'GET /': 'form.display',
          'GET /users/:id': 'activitypub.actor.get'
        }
      }
    ]
  }
};

module.exports = ApiService;
