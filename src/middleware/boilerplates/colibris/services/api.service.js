const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { Routes: LdpRoutes } = require('@semapps/ldp');
const { Routes: SparqlEndpointRoutes } = require('@semapps/sparql-endpoint');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { Routes: WebhooksRoutes } = require('@semapps/webhooks');
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
    routes: [
      ...LdpRoutes,
      ...SparqlEndpointRoutes,
      ...ActivityPubRoutes,
      ...WebhooksRoutes,
      {
        authorization: false,
        authentication: true,
        bodyParsers: { json: true },
        aliases: {
          'GET themes/:id': 'themes.get'
        }
      }
    ],
    defaultLdpAccept: 'text/turtle'
  },
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
        const actor = await this.broker.call('activitypub.actor.get', {
          id: profileData.slug
        });
        if (actor) {
          return actor;
        } else {
          return await this.broker.call('activitypub.actor.create', {
            '@type': 'Person',
            ...profileData
          });
        }
      }
    });

    await this.connector.initialize();
    this.addRoute(this.connector.getRoute());
  },
  methods: {
    authenticate(ctx, route, req, res) {
      return this.connector.authenticate(ctx, route, req, res);
    },
    authorize(ctx, route, req, res) {
      return this.connector.authorize(ctx, route, req, res);
    }
  }
};
