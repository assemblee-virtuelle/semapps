const path = require('path');
const ApiGatewayService = require('moleculer-web');

const { Routes: SparqlEndpointRoutes } = require('@semapps/sparql-endpoint');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { Routes: WebIdRoutes } = require('@semapps/webid');
const { CasConnector, OidcConnector } = require('@semapps/connector');

const CONFIG = require('../config');

module.exports = {
  mixins: [ApiGatewayService],
  settings: {
    cors: {
      origin: '*',
      exposedHeaders: '*'
    },
    routes: [...SparqlEndpointRoutes, ...WebIdRoutes, ...ActivityPubRoutes]
  },
  dependencies: ['ldp', 'activitypub.actor', 'activitypub.object'],
  async started() {
    let routes = [];

    const findOrCreateProfile = async profileData => {
      return await this.broker.call('webid.create', profileData);
    };

    this.connector =
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
            privateKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key'),
            publicKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key.pub'),
            selectProfileData: authData => ({
              nick: authData.displayName,
              email: authData.mail[0],
              name: authData.field_first_name[0],
              familyName: authData.field_last_name[0]
            }),
            findOrCreateProfile
          });

    await this.connector.initialize();

    routes.push(this.connector.getRoute());
    routes.push(...(await this.broker.call('ldp.getApiRoutes')));
    routes.push(...(await this.broker.call('activitypub.activity.getApiRoutes')));
    routes.push(...(await this.broker.call('activitypub.actor.getApiRoutes')));
    routes.push(...(await this.broker.call('activitypub.object.getApiRoutes')));

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
