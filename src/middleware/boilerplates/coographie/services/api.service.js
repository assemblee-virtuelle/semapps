const ApiGatewayService = require('moleculer-web');
const { OidcConnector } = require('@semapps/connector');
const CONFIG = require('../config');
const path = require('path');

module.exports = {
  mixins: [ApiGatewayService],
  settings: {
    server: true,
    routes: [
      {
        path: '/context.json',
        use: [
          ApiGatewayService.serveStatic('./public/context.json', {
            setHeaders: res => {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/ld+json; charset=utf-8');
            }
          })
        ]
      }
    ],
    cors: {
      origin: '*',
      methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      exposedHeaders: '*'
    }
  },
  dependencies: ['ldp', 'sparqlEndpoint', 'webid'],
  async started() {
    this.connector = new OidcConnector({
      issuer: CONFIG.OIDC_ISSUER,
      clientId: CONFIG.OIDC_CLIENT_ID,
      clientSecret: CONFIG.OIDC_CLIENT_SECRET,
      redirectUri: CONFIG.HOME_URL + 'auth',
      privateKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key'),
      publicKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key.pub'),
      selectProfileData: authData => ({
        email: authData.email,
        name: authData.given_name,
        familyName: authData.family_name
      }),
      findOrCreateProfile: async profileData => {
        return await this.broker.call('webid.create', profileData);
      }
    });

    await this.connector.initialize();

    [
      this.connector.getRoute(),
      ...(await this.broker.call('ldp.getApiRoutes')),
      ...(await this.broker.call('webid.getApiRoutes')),
      ...(await this.broker.call('sparqlEndpoint.getApiRoutes'))
    ].forEach(route => this.addRoute(route));
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
