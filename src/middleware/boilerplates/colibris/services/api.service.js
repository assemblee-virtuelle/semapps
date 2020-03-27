const passport = require('passport');
const session = require('express-session');
const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { Routes: LdpRoutes } = require('@semapps/ldp');
const { Routes: SparqlEndpointRoutes } = require('@semapps/sparql-endpoint');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { Routes: WebhooksRoutes } = require('@semapps/webhooks');
const { CasConnector } = require('@semapps/connector');

const CONFIG = require('../config');
let connector;

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
    connector = new CasConnector({
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
        if( actor ) {
          return actor;
        } else {
          return await this.broker.call('activitypub.actor.create', {
            '@type': 'Person',
            ...profileData
          });
        }
      }
    });

    await connector.configurePassport(passport);

    this.addRoute({
      use: [
        session({
          secret: 's€m@pps',
          maxAge: null
        }),
        passport.initialize(),
        passport.session()
      ],
      aliases: {
        'GET auth/logout'(req, res) {
          connector.logout()(req, res);
        },
        'GET auth'(req, res) {
          connector.login()(req, res);
        }
      }
    });
  },
  methods: {
    authenticate(ctx, route, req, res) {
      return connector.authenticate(ctx, route, req, res);
    },
    authorize(ctx, route, req, res) {
      return connector.authorize(ctx, route, req, res);
    }
  }
};
