const ApiGateway = require('moleculer-web');

const ApiService = {
  mixins: [ApiGateway],
  settings: {
    server: true,
    assets: {
      folder: './public',
      options: {} // `server-static` module options
    },
    routes: [
      {
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        aliases: {
          'POST /': 'form.process',
          'GET /': 'form.display',
          'POST /users/:username/inbox': 'activitypub.inbox.post',
          'GET /mailer/:frequency': 'mailer.processQueue',
          // TODO remove as we don't need to make these URLs public
          'GET /users/:id': 'activitypub.actor.get',
          'GET /activities/:id': 'activitypub.activity.get',
          'GET /users/:username/inbox': 'activitypub.inbox.list',
          'GET /users/:username/outbox': 'activitypub.outbox.list',
          'GET /users/:username/followers': 'activitypub.follow.listFollowers',
          'GET /users/:username/following': 'activitypub.follow.listFollowing'
        }
      }
    ]
  }
};

module.exports = ApiService;
