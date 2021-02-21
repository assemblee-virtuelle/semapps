const ApiGatewayService = require('moleculer-web');
//const { OidcConnector } = require('@semapps/connector');
const { MIME_TYPES } = require('@semapps/mime-types');
const CONFIG = require('../config');
const path = require('path');
const urlJoin = require('url-join');

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
  dependencies: ['activitypub', 'webid'],
  /*async started() {
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
        let webId = await this.broker.call('webid.findByEmail', {
          email: profileData.email
        });

        if (!webId) {
          webId = await this.broker.call('webid.create', profileData);

          // Adds PAIR data
          await this.broker.call('ldp.resource.patch', {
            resource: {
              '@context': urlJoin(CONFIG.HOME_URL, 'context.json'),
              '@id': webId,
              '@type': ['pair:Person', 'foaf:Person'],
              'pair:firstName': profileData.name,
              'pair:lastName': profileData.familyName,
              'pair:e-mail': profileData.email
            },
            contentType: MIME_TYPES.JSON
          });
        }

        return webId;
      }
    });

    await this.connector.initialize();

    [
      this.connector.getRoute(),
      ...(await this.broker.call('activitypub.getApiRoutes'))
    ].forEach(route => this.addRoute(route));
  },
  methods: {
    authenticate(ctx, route, req, res) {
      return this.connector.authenticate(ctx, route, req, res);
    },
    authorize(ctx, route, req, res) {
      return this.connector.authorize(ctx, route, req, res);
    }
  }*/
};
