const path = require('path');
const urlJoin = require('url-join');
const ApiGatewayService = require('moleculer-web');

const { getContainerRoutes } = require('@semapps/ldp');
const { CasConnector } = require('@semapps/connector');

const CONFIG = require('../config');

module.exports = {
  name: 'api',
  mixins: [ApiGatewayService],
  settings: {
    server: true,
    cors: {
      origin: '*',
      exposedHeaders: '*'
    },
    assets: {
      folder: './public',
      // `server-static` module options
      options: {
        setHeaders: (res, path, stat) => {
          // TODO check that path ends with json
          res.setHeader('Content-Type', 'application/ld+json; charset=utf-8');
        }
      }
    }
  },
  dependencies: ['ldp', 'activitypub', 'webhooks', 'push', 'sparqlEndpoint'],
  async started() {
    this.connector = new CasConnector({
      casUrl: CONFIG.CAS_URL,
      privateKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key'),
      publicKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key.pub'),
      selectProfileData: authData => ({
        slug: authData.displayName,
        preferredUsername: authData.displayName,
        name: `${authData.field_first_name[0]} ${authData.field_last_name[0]}`
      }),
      findOrCreateProfile: async profileData => {
        let actor = await this.broker.call('activitypub.actor.get', {
          id: profileData.slug
        });
        if (!actor) {
          actor = await this.broker.call('activitypub.actor.create', {
            '@type': 'Person',
            ...profileData
          });
        }
        return actor.id;
      }
    });

    await this.connector.initialize();

    [
      this.connector.getRoute(),
      ...(await this.broker.call('ldp.getApiRoutes')),
      ...(await this.broker.call('activitypub.getApiRoutes')),
      ...(await this.broker.call('webhooks.getApiRoutes')),
      ...(await this.broker.call('push.getApiRoutes')),
      ...(await this.broker.call('sparqlEndpoint.getApiRoutes')),
      ...getContainerRoutes(urlJoin(CONFIG.HOME_URL, 'themes'), 'themes'),
      ...getContainerRoutes(urlJoin(CONFIG.HOME_URL, 'status'), 'status')
    ].forEach(route => this.addRoute(route));
  }
  // methods: {
  //   authenticate(ctx, route, req, res) {
  //     return this.connector.authenticate(ctx, route, req, res);
  //   },
  //   authorize(ctx, route, req, res) {
  //     return this.connector.authorize(ctx, route, req, res);
  //   }
  // }
};
