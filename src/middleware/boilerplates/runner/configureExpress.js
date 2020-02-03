const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { Routes: LdpRoutes } = require('@semapps/ldp');
const { Routes: SparqlEndpointRoutes } = require('@semapps/sparql-endpoint');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { Routes: WebIdRoutes } = require('@semapps/webid');
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

  const findOrCreateProfile = async profileData => {
    return await broker.call('webid.create', profileData);
  };

  const connector =
    CONFIG.CONNECT_TYPE === 'OIDC'
      ? new OidcConnector({
          issuer: CONFIG.OIDC_ISSUER,
          clientId: CONFIG.OIDC_CLIENT_ID,
          clientSecret: CONFIG.OIDC_CLIENT_SECRET,
          publicKey: CONFIG.OIDC_PUBLIC_KEY,
          redirectUri: CONFIG.HOME_URL + 'auth',
          selectProfileData: authData => ({
            email: authData.email,
            name: authData.given_name,
            familyName: authData.family_name
          }),
          findOrCreateProfile
        })
      : new CasConnector({
          casUrl: CONFIG.CAS_URL,
          privateKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key'),
          publicKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key.pub'),
          selectProfileData: authData => ({
            nick: authData.displayName,
            email: authData.mail[0],
            name: authData.field_first_name[0],
            familyName: authData.field_last_name[0]
          }),
          findOrCreateProfile
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
      routes: [...LdpRoutes, ...SparqlEndpointRoutes, ...WebIdRoutes, ...ActivityPubRoutes],
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
