const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { Routes: LdpRoutes } = require('@semapps/ldp');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { CasConnector, OidcConnector } = require('@semapps/connector');

const CONFIG = require('./config');

function configureExpress(broker) {
  const app = express();
  app.use(
    session({
      secret: 's€m@pps',
      maxAge: null
    })
  );

  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());

  const connector =
    CONFIG.CONNECT_TYPE === 'OIDC'
      ? new OidcConnector({
          issuer: CONFIG.OIDC_ISSUER,
          clientId: CONFIG.OIDC_CLIENT_ID,
          clientSecret: CONFIG.OIDC_CLIENT_SECRET,
          publicKey: CONFIG.OIDC_PUBLIC_KEY,
          redirectUri: CONFIG.HOME_URL + 'auth'
        })
      : new CasConnector({
          casUrl: CONFIG.CAS_URL,
          privateKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key'),
          publicKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key.pub'),
          webIdGenerator: async userData => {
            return await broker.call('webid.create', userData);
          }
        });

  connector.configurePassport(passport).then(() => {
    app.use('/auth', ...connector.getLoginMiddlewares());
  });

  const apiGateway = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      middleware: true,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      },
      routes: [LdpRoutes.unsecuredRoutes, ActivityPubRoutes],
      defaultLdpAccept: 'text/turtle'
    },
    methods: {
      authenticate: connector.authenticate,
      authorize: connector.authorize
    }
  });

  // Use ApiGateway as middleware
  app.use(apiGateway.express());

  return app;
}

module.exports = configureExpress;
