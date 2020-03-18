const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { Routes: LdpRoutes } = require('@semapps/ldp');
const { Routes: SparqlEndpointRoutes } = require('@semapps/sparql-endpoint');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { Routes: WebhooksRoutes } = require('@semapps/webhooks');
const { CasConnector } = require('@semapps/connector');

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

  const connector = new CasConnector({
    casUrl: CONFIG.CAS_URL,
    privateKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key'),
    publicKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key.pub'),
    selectProfileData: authData => ({
      nick: authData.displayName,
      email: authData.mail[0],
      name: authData.field_first_name[0],
      familyName: authData.field_last_name[0]
    }),
    findOrCreateProfile: profileData => {
      return broker.call('activitypub.actor.create', profileData);
    }
  });

  connector.configurePassport(passport).then(() => {
    app.get('/auth/logout', connector.logout());
    app.get('/auth', connector.login());
  });

  const apiGateway = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      server: false,
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
    methods: {
      authenticate(ctx, route, req, res) {
        return connector.authenticate(ctx, route, req, res);
      },
      authorize(ctx, route, req, res) {
        return connector.authorize(ctx, route, req, res);
      }
    }
  });

  // Use ApiGateway as middleware
  app.use(apiGateway.express());

  return app;
}

module.exports = configureExpress;
