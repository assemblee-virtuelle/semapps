const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { CasConnector, OidcConnector } = require('@semapps/connector');

const CONFIG = require('../config');

module.exports = {
  mixins: [ApiGatewayService],
  settings: {
    cors: {
      origin: '*',
      methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      exposedHeaders: '*'
    },
    routes: []
  },
  dependencies: ['ldp', 'activitypub', 'webid', 'sparqlEndpoint'],
  async started() {
    const findOrCreateProfile = async profileData => {
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
    };

    const privateKeyPath = path.resolve(__dirname, '../jwt/jwtRS256.key');
    const publicKeyPath = path.resolve(__dirname, '../jwt/jwtRS256.key.pub');

    this.connector =
      CONFIG.CONNECT_TYPE === 'OIDC'
        ? new OidcConnector({
          issuer: CONFIG.OIDC_ISSUER,
          clientId: CONFIG.OIDC_CLIENT_ID,
          clientSecret: CONFIG.OIDC_CLIENT_SECRET,
          redirectUri: CONFIG.HOME_URL + 'auth',
          privateKeyPath,
          publicKeyPath,
          selectProfileData: authData => ({
            email: authData.email,
            name: authData.given_name,
            familyName: authData.family_name
          }),
          findOrCreateProfile
        })
        : new CasConnector({
          casUrl: CONFIG.CAS_URL,
          privateKeyPath,
          publicKeyPath,
          selectProfileData: authData => ({
            nick: authData.displayName,
            email: authData.mail[0],
            name: authData.field_first_name[0],
            familyName: authData.field_last_name[0]
          }),
          findOrCreateProfile
        });

    await this.connector.initialize();

    const routes = [
      this.connector.getRoute(),
      ...(await this.broker.call('ldp.getApiRoutes')),
      ...(await this.broker.call('webid.getApiRoutes')),
      ...(await this.broker.call('sparqlEndpoint.getApiRoutes')),
      ...(await this.broker.call('activitypub.getApiRoutes'))
    ];
    routes.forEach(route => this.addRoute(route));
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
