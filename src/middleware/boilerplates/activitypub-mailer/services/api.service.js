const urlJoin = require('url-join');
const ApiGateway = require('moleculer-web');
const { getContainerRoutes } = require('@semapps/ldp');
const CONFIG = require('../config');

const ApiService = {
  mixins: [ApiGateway],
  settings: {
    port: CONFIG.PORT,
    cors: {
      origin: '*',
      exposedHeaders: '*'
    },
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
          'GET /mailer/:frequency': 'mailer.processNotifications'
        }
      }
    ]
  },
  dependencies: ['activitypub'],
  async started() {
    [
      ...(await this.broker.call('activitypub.getApiRoutes')),
      ...getContainerRoutes(urlJoin(CONFIG.HOME_URL, 'themes'), 'themes')
    ].forEach(route => this.addRoute(route));
  }
};

module.exports = ApiService;
